import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setMeasureFilter } from '../../store/slices/filters.slice';
import './styles/SearchByMeasure.css';

const SearchByMeasure = () => {
  const dispatch = useDispatch();
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [rim, setRim] = useState('');

  // Opciones para los selectores
  const widths = Array.from({ length: 171 }, (_, i) => 155 + i); // 155-325
  const heights = Array.from({ length: 46 }, (_, i) => 30 + i); // 30-75
  const rims = Array.from({ length: 10 }, (_, i) => 13 + i); // 13-22

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setMeasureFilter({ width, height, rim }));
  };

  const handleClear = () => {
    setWidth('');
    setHeight('');
    setRim('');
    dispatch(setMeasureFilter({ width: null, height: null, rim: null }));
  };

  return (
    <div className="search-by-measure">
      <h3>Buscar por Medida</h3>
      <form onSubmit={handleSearch} className="measure-form">
        <div className="measure-input-group">
          <label htmlFor="width">Ancho</label>
          <select
            id="width"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
          >
            <option value="">Seleccionar ancho</option>
            {widths.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </div>
        <div className="measure-input-group">
          <label htmlFor="height">Alto</label>
          <select
            id="height"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          >
            <option value="">Seleccionar alto</option>
            {heights.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        </div>
        <div className="measure-input-group">
          <label htmlFor="rim">Rin</label>
          <select
            id="rim"
            value={rim}
            onChange={(e) => setRim(e.target.value)}
          >
            <option value="">Seleccionar rin</option>
            {rims.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div className="measure-actions">
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

export default SearchByMeasure;

