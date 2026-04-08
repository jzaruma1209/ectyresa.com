// Fase 3 — SearchByVehicle conectado al backend
// Carga marcas y modelos reales desde /vehiculos/marcas/completo

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchMarcas,
  resetModelos,
} from '../../store/slices/vehiculos.slice';
import { useProducts } from '../../hooks/useProducts';
import '../../features/home/styles/SearchByVehicle.css';

// Rango de años estático (igual que antes, el backend no lo provee)
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1999 }, (_, i) => currentYear - i);

const SearchByVehicle = () => {
  const dispatch = useDispatch();

  // Estado del slice de vehículos
  const { marcas, loading, error } = useSelector((state) => state.vehiculos);

  // Hook de productos para ejecutar la búsqueda
  const { searchByVehicle } = useProducts();

  // Estado local de los selectores
  const [selectedMarcaId, setSelectedMarcaId] = useState('');
  const [selectedMarcaNombre, setSelectedMarcaNombre] = useState('');
  const [selectedModelo, setSelectedModelo] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  // Cargar marcas al montar el componente (solo si no están ya en el store)
  useEffect(() => {
    if (marcas.length === 0) {
      dispatch(fetchMarcas());
    }
  }, [dispatch, marcas.length]);

  // Modelos de la marca seleccionada (vienen anidados en la respuesta de marcas/completo)
  const modelosDisponibles = selectedMarcaId
    ? (marcas.find((m) => String(m.idMarca) === String(selectedMarcaId))?.modelos || [])
    : [];

  // Handler de cambio de marca: resetea modelo al cambiar
  const handleMarcaChange = (e) => {
    const idMarca = e.target.value;
    const marcaObj = marcas.find((m) => String(m.idMarca) === String(idMarca));
    setSelectedMarcaId(idMarca);
    setSelectedMarcaNombre(marcaObj ? marcaObj.nombre : '');
    setSelectedModelo('');
    dispatch(resetModelos());
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!selectedMarcaNombre || !selectedModelo || !selectedYear) return;
    searchByVehicle(selectedMarcaNombre, selectedModelo, selectedYear);
  };

  const handleClear = () => {
    setSelectedMarcaId('');
    setSelectedMarcaNombre('');
    setSelectedModelo('');
    setSelectedYear('');
    dispatch(resetModelos());
  };

  return (
    <div className="search-by-vehicle">
      <h3>Buscar por Vehículo</h3>

      {error && (
        <p className="vehicle-error">⚠️ {error}</p>
      )}

      <form onSubmit={handleSearch} className="vehicle-form">
        {/* Marca */}
        <div className="vehicle-input-group">
          <label htmlFor="brand">Marca</label>
          <select
            id="brand"
            value={selectedMarcaId}
            onChange={handleMarcaChange}
            disabled={loading}
          >
            <option value="">
              {loading ? 'Cargando marcas...' : 'Seleccionar marca'}
            </option>
            {marcas.map((m) => (
              <option key={m.idMarca} value={m.idMarca}>
                {m.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Modelo */}
        <div className="vehicle-input-group">
          <label htmlFor="model">Modelo</label>
          <select
            id="model"
            value={selectedModelo}
            onChange={(e) => setSelectedModelo(e.target.value)}
            disabled={!selectedMarcaId || loading}
          >
            <option value="">
              {!selectedMarcaId ? 'Selecciona una marca primero' : 'Seleccionar modelo'}
            </option>
            {modelosDisponibles.map((mo) => (
              <option key={mo.idModelo ?? mo.nombre} value={mo.nombre}>
                {mo.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Año — sigue siendo estático (Regla 3.5) */}
        <div className="vehicle-input-group">
          <label htmlFor="year">Año</label>
          <select
            id="year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">Seleccionar año</option>
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div className="vehicle-actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={!selectedMarcaNombre || !selectedModelo || !selectedYear || loading}
          >
            Buscar
          </button>
          <button type="button" onClick={handleClear} className="btn-secondary">
            Limpiar
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchByVehicle;
