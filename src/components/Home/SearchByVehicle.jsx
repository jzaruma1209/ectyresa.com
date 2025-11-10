import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setVehicleFilter } from '../../store/slices/filters.slice';
import './styles/SearchByVehicle.css';

const SearchByVehicle = () => {
  const dispatch = useDispatch();
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');

  // Datos de ejemplo - estos deberían venir de una API
  const brands = ['Toyota', 'Honda', 'Nissan', 'Ford', 'Chevrolet', 'Volkswagen'];
  const models = {
    Toyota: ['Corolla', 'Camry', 'RAV4', 'Hilux'],
    Honda: ['Civic', 'Accord', 'CR-V', 'Pilot'],
    Nissan: ['Sentra', 'Altima', 'Rogue', 'Frontier'],
    Ford: ['Fiesta', 'Focus', 'Explorer', 'F-150'],
    Chevrolet: ['Spark', 'Cruze', 'Equinox', 'Silverado'],
    Volkswagen: ['Jetta', 'Passat', 'Tiguan', 'Amarok'],
  };
  const years = Array.from({ length: 25 }, (_, i) => 2000 + i); // 2000-2024

  const handleBrandChange = (e) => {
    const selectedBrand = e.target.value;
    setBrand(selectedBrand);
    setModel(''); // Reset model when brand changes
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setVehicleFilter({ brand, model, year }));
  };

  const handleClear = () => {
    setBrand('');
    setModel('');
    setYear('');
    dispatch(setVehicleFilter({ brand: null, model: null, year: null }));
  };

  return (
    <div className="search-by-vehicle">
      <h3>Buscar por Vehículo</h3>
      <form onSubmit={handleSearch} className="vehicle-form">
        <div className="vehicle-input-group">
          <label htmlFor="brand">Marca</label>
          <select
            id="brand"
            value={brand}
            onChange={handleBrandChange}
          >
            <option value="">Seleccionar marca</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
        <div className="vehicle-input-group">
          <label htmlFor="model">Modelo</label>
          <select
            id="model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            disabled={!brand}
          >
            <option value="">Seleccionar modelo</option>
            {brand && models[brand]?.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div className="vehicle-input-group">
          <label htmlFor="year">Año</label>
          <select
            id="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="">Seleccionar año</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <div className="vehicle-actions">
          <button type="submit" className="btn-primary">
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

