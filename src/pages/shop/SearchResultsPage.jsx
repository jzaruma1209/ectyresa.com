import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import ProductGrid from "../../components/products/ProductGrid";
import SearchFilters from "../../components/products/SearchFilters";
import "../../components/products/SearchFilters.css";
import { SkeletonGrid } from "../../components/shared/SkeletonCard";
import productsService from "../../services/products.service";
import nivelesService from "../../services/niveles.service";
import { usePageMeta } from "../../hooks/usePageMeta";
import { buildWhatsAppUrl, trackWhatsAppClick } from "../../utils/whatsapp";
import "../styles/SearchResultsPage.css";

const DEFAULT_FILTERS = { brand: "all", category: "all", maxPrice: null };

const applyFilters = (products, filters) => {
  return products.filter((p) => {
    if (filters.brand !== "all" && p.brand !== filters.brand) return false;
    if (filters.category !== "all" && p.category !== filters.category) return false;
    if (filters.maxPrice !== null && (p.finalPrice ?? p.price ?? 0) > filters.maxPrice) return false;
    return true;
  });
};

// Quita productos repetidos (un producto puede venir en dos búsquedas de aro)
const sinRepetidos = (lista) => {
  const vistos = new Set();
  return lista.filter((p) => (vistos.has(p.id) ? false : vistos.add(p.id)));
};

/**
 * Alternativas cuando no hay coincidencia exacta:
 * 1. Productos del mismo aro y del siguiente aro creado en el admin (ej: 185/60R14 → aro 14 y 15).
 * 2. Si tampoco hay, todo el catálogo.
 */
const buscarAlternativas = async (medida) => {
  const aro = Number(medida?.rin);
  if (Number.isFinite(aro) && aro > 0) {
    const aros = await nivelesService.listarValoresMedida("aros").catch(() => []);
    const siguiente = aros.find((v) => v > aro) ?? aro + 1;
    const [mismoAro, aroSiguiente] = await Promise.all([
      productsService.searchByMeasure({ rin: aro }).catch(() => []),
      productsService.searchByMeasure({ rin: siguiente }).catch(() => []),
    ]);
    const porAro = sinRepetidos([...mismoAro, ...aroSiguiente]);
    if (porAro.length > 0) {
      return { productos: porAro, titulo: `Otras opciones en aro ${aro} y ${siguiente}` };
    }
  }
  const todos = await productsService.getAllProducts().catch(() => []);
  return { productos: todos, titulo: "Todos nuestros productos" };
};

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  // Los resultados de búsqueda no se indexan: Google debe llegar a las fichas de producto.
  usePageMeta({ title: query ? `Búsqueda: ${query}` : "Búsqueda", noindex: true });

  const { loading, buscarGeneral } = useProducts();
  const [resultados, setResultados] = useState([]);
  const [alternativas, setAlternativas] = useState({ productos: [], titulo: "" });
  const [hasSearched, setHasSearched] = useState(false);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  useEffect(() => {
    let isMounted = true;

    const fetchResults = async () => {
      if (!query) {
        setResultados([]);
        setAlternativas({ productos: [], titulo: "" });
        setHasSearched(true);
        return;
      }

      setHasSearched(false);
      const data = await buscarGeneral(query);
      const encontrados = data?.resultados || [];
      const extra = encontrados.length === 0 ? await buscarAlternativas(data?.parsedMedida) : { productos: [], titulo: "" };

      if (isMounted) {
        setResultados(encontrados);
        setAlternativas(extra);
        setHasSearched(true);
        setFilters(DEFAULT_FILTERS);
      }
    };

    fetchResults();

    return () => {
      isMounted = false;
    };
  }, [query, buscarGeneral]);

  const resultadosFiltrados = useMemo(
    () => applyFilters(resultados, filters),
    [resultados, filters]
  );

  const whatsappUrl = buildWhatsAppUrl(
    `Hola ECTYRE, busqué "${query}" en la página web y no lo encontré. ¿Me pueden cotizar?`
  );

  return (
    <div className="search-results-page">
      <div className="search-results-header">
        <h1>Búsqueda: <span>{query ? `"${query}"` : "Todos los productos"}</span></h1>
      </div>

      {(loading || !hasSearched) ? (
        <SkeletonGrid count={8} />
      ) : (
        <>
          <div className="search-section">
            <h2>Resultados Encontrados</h2>
            <div className="search-results-info">
              {resultados.length > 0 ? (
                <p>
                  Se encontraron {resultados.length} productos que coinciden con tu búsqueda
                  {resultadosFiltrados.length !== resultados.length &&
                    ` (${resultadosFiltrados.length} con los filtros aplicados)`}.
                </p>
              ) : (
                <div className="no-results-banner">
                  <p><strong>Producto no disponible por el momento</strong></p>
                  <p className="no-results-sub">
                    No tenemos "{query}" en existencia, pero podemos conseguirlo para ti.
                  </p>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackWhatsAppClick("busqueda_sin_resultados")}
                    className="no-results-whatsapp"
                  >
                    Cotiza por WhatsApp
                  </a>
                </div>
              )}
            </div>

            {resultados.length > 0 && (
              <div className="search-results-layout">
                <SearchFilters
                  products={resultados}
                  filters={filters}
                  onChange={setFilters}
                  onClear={() => setFilters(DEFAULT_FILTERS)}
                />
                {resultadosFiltrados.length > 0 ? (
                  <ProductGrid products={resultadosFiltrados} />
                ) : (
                  <p className="search-filters-empty">Ningún producto coincide con los filtros seleccionados.</p>
                )}
              </div>
            )}
          </div>

          {alternativas.productos.length > 0 && (
            <div className="search-section recommendations-section">
              <div className="recommendations-header">
                <h2>{alternativas.titulo}</h2>
              </div>
              <ProductGrid products={alternativas.productos} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResultsPage;
