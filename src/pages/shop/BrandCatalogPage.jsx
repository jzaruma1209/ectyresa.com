import { useState, useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { BRAND_SECTIONS } from '../../data/brandsMockData';
import TireCard from '../../components/products/TireCard';
import './BrandCatalogPage.css';

const BrandCatalogPage = () => {
  const { brandId } = useParams();

  // Buscar la marca en los datos mockeados
  const sectionData = BRAND_SECTIONS.find(
    (sec) => sec.brand.name.toLowerCase() === brandId.toLowerCase()
  );

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

  // Filtrado reactivo de productos
  const filteredProducts = useMemo(() => {
    if (!sectionData) return [];
    
    return sectionData.products.filter(product => {
      // Precio Max
      if (filters.precioMax && parseFloat(product.price) > parseFloat(filters.precioMax)) {
        return false;
      }
      
      // Parsear medida "205/55R16" o similar -> ancho, alto, aro
      // Este regex básico asume formato NNN/NN(R/D)NN 
      const measureRegex = /(\d+)\/(\d+)[A-Za-z]+(\d+\.?\d*)/;
      const match = product.measure.match(measureRegex);
      
      let pAncho = "", pAlto = "", pAro = "";
      
      if (match) {
        pAncho = match[1];
        pAlto = match[2];
        pAro = match[3];
      } else {
        // Fallback básico para formatos no estándar buscando strings
        pAncho = product.measure;
        pAlto = product.measure;
        pAro = product.measure;
      }

      // Filtro Ancho
      if (filters.ancho && !pAncho.includes(filters.ancho)) {
        return false;
      }
      
      // Filtro Alto
      if (filters.alto && !pAlto.includes(filters.alto)) {
        return false;
      }
      
      // Filtro Aro
      if (filters.aro && !pAro.includes(filters.aro)) {
        return false;
      }

      return true;
    });
  }, [sectionData, filters]);

  // Si no se encuentra la marca, redirigir al inicio o a 404
  if (!sectionData) {
    return <Navigate to="/not-found" />;
  }

  const { brand } = sectionData;

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
              <TireCard
                key={product.id}
                product={{
                  ...product,
                  id: product.id,
                  name: product.title,
                  price: product.price,
                  image: product.image
                }}
                brandLogoSrc={brand.logo}
                sashSrc={null}
                pvp={product.originalPrice || undefined}
              />
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
