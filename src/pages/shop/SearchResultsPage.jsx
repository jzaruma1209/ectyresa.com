import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import ProductGrid from "../../components/products/ProductGrid";
import SearchFilters from "../../components/products/SearchFilters";
import "../../components/products/SearchFilters.css";
import { SkeletonGrid } from "../../components/shared/SkeletonCard";
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

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const { loading, buscarGeneral } = useProducts();
  const [resultados, setResultados] = useState([]);
  const [recomendaciones, setRecomendaciones] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  useEffect(() => {
    let isMounted = true;
    
    const fetchResults = async () => {
      if (!query) {
        setResultados([]);
        setRecomendaciones([]);
        setHasSearched(true);
        return;
      }

      setHasSearched(false);
      const data = await buscarGeneral(query);
      
      if (isMounted) {
        setResultados(data?.resultados || []);
        setRecomendaciones(data?.recomendaciones || []);
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

  return (
    <div className="search-results-page">
      <div className="search-results-header">
        <h1>Búsqueda: <span>{query ? `"${query}"` : "Todos los productos"}</span></h1>
      </div>

      {loading && !hasSearched ? (
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
                  <span className="no-results-icon">🔍</span>
                  <p><strong>No hay en existencia</strong> un producto que coincida exactamente con "{query}".</p>
                  <p className="no-results-sub">Pero no te preocupes, revisa nuestras recomendaciones a continuación.</p>
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

          {recomendaciones.length > 0 && (
            <div className="search-section recommendations-section">
              <div className="recommendations-header">
                <h2>Sugerencias y Recomendaciones</h2>
                <p>Productos con el mismo aro, en oferta o relacionados a tu búsqueda</p>
              </div>
              <ProductGrid products={recomendaciones} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResultsPage;
