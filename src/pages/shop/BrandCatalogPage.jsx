import { useState, useMemo, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import TireCard from '../../components/products/TireCard';
import nivelesService from '../../services/niveles.service';
import productsService from '../../services/products.service';
import './BrandCatalogPage.css';

const BrandCatalogPage = () => {
  const { brandId } = useParams();

  const [marca, setMarca] = useState(null);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [noEncontrada, setNoEncontrada] = useState(false);

  // Buscar la marca real por nombre (slug de la URL) y traer sus productos
  useEffect(() => {
    let cancelado = false;
    setCargando(true);
    setNoEncontrada(false);

    (async () => {
      try {
        const marcas = await nivelesService.listarMarcas();
        const encontrada = (marcas || []).find(
          (m) => m.nombre.toLowerCase() === brandId.toLowerCase()
        );
        if (!encontrada) {
          if (!cancelado) setNoEncontrada(true);
          return;
        }
        if (cancelado) return;
        setMarca(encontrada);
        const productosMarca = await productsService.getAllProducts({ idMarca: encontrada.idMarca });
        if (!cancelado) setProductos(productosMarca);
      } catch {
        if (!cancelado) setNoEncontrada(true);
      } finally {
        if (!cancelado) setCargando(false);
      }
    })();

    return () => {
      cancelado = true;
    };
  }, [brandId]);

  // Estados de los filtros
  const [filters, setFilters] = useState({
    precioMax: '',
    ancho: '',
    alto: '',
    aro: ''
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Filtrado reactivo de productos (usa los campos numéricos ya mapeados por la API)
  const filteredProducts = useMemo(() => {
    return productos.filter((product) => {
      if (filters.precioMax && (product.finalPrice ?? 0) > parseFloat(filters.precioMax)) {
        return false;
      }
      if (filters.ancho && !String(product.width ?? '').includes(filters.ancho)) {
        return false;
      }
      if (filters.alto && !String(product.height ?? '').includes(filters.alto)) {
        return false;
      }
      if (filters.aro && !String(product.rim ?? '').includes(filters.aro)) {
        return false;
      }
      return true;
    });
  }, [productos, filters]);

  if (cargando) {
    return <div className="brand-catalog-page">Cargando...</div>;
  }

  // Si no se encuentra la marca, redirigir a 404
  if (noEncontrada || !marca) {
    return <Navigate to="/not-found" />;
  }

  const brand = { name: marca.nombre, tagline: marca.paisOrigen ? `Origen: ${marca.paisOrigen}` : '', logo: marca.logoUrl };

  return (
    <div className="brand-catalog-page">
      <div className="brand-catalog-header">
        <img 
          src={brand.logo} 
          alt={brand.name} 
          className="brand-catalog-logo" 
        />
        <div>
          <h1 className="brand-catalog-title">{brand.name}</h1>
          <p className="brand-catalog-tagline">{brand.tagline}</p>
        </div>
      </div>

      <div className="brand-catalog-content">
        {/* SIDEBAR FILTERS */}
        <aside className="brand-catalog-sidebar">
          <h3>Filtrar {brand.name}</h3>
          
          <div className="filter-group">
            <label htmlFor="precioMax">Precio Máximo ($)</label>
            <input 
              type="number" 
              id="precioMax" 
              name="precioMax" 
              value={filters.precioMax} 
              onChange={handleFilterChange}
              placeholder="Ej. 150"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="ancho">Ancho</label>
            <input 
              type="text" 
              id="ancho" 
              name="ancho" 
              value={filters.ancho} 
              onChange={handleFilterChange}
              placeholder="Ej. 205"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="alto">Alto</label>
            <input 
              type="text" 
              id="alto" 
              name="alto" 
              value={filters.alto} 
              onChange={handleFilterChange}
              placeholder="Ej. 55"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="aro">Aro (Rin)</label>
            <input 
              type="text" 
              id="aro" 
              name="aro" 
              value={filters.aro} 
              onChange={handleFilterChange}
              placeholder="Ej. 16"
            />
          </div>
        </aside>

        {/* PRODUCT GRID */}
        <div className="brand-catalog-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <TireCard key={product.id} product={product} brandLogoSrc={brand.logo} />
            ))
          ) : (
            <div className="no-results">
              <p>No se encontraron llantas con esos filtros.</p>
              <button 
                onClick={() => setFilters({precioMax: '', ancho: '', alto: '', aro: ''})}
                style={{
                  marginTop: '10px', 
                  padding: '8px 16px', 
                  background: '#e60000', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandCatalogPage;
