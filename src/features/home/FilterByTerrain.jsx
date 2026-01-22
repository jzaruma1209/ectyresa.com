import { useDispatch, useSelector } from 'react-redux';
import { setTerrainFilter } from '../../store/slices/filters.slice';
import './styles/FilterByTerrain.css';

const FilterByTerrain = () => {
  const dispatch = useDispatch();
  const selectedTerrain = useSelector((state) => state.filters.terrain);

  const terrains = [
    { value: 'asfalto', label: 'Asfalto' },
    { value: 'todo-terreno', label: 'Todo Terreno' },
    { value: 'carga', label: 'Carga' },
  ];

  const handleTerrainChange = (terrain) => {
    if (selectedTerrain === terrain) {
      dispatch(setTerrainFilter(null));
    } else {
      dispatch(setTerrainFilter(terrain));
    }
  };

  return (
    <div className="filter-by-terrain">
      <h3>Terreno</h3>
      <div className="terrain-buttons">
        {terrains.map((terrain) => (
          <button
            key={terrain.value}
            className={`terrain-btn ${
              selectedTerrain === terrain.value ? 'active' : ''
            }`}
            onClick={() => handleTerrainChange(terrain.value)}
          >
            {terrain.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterByTerrain;

