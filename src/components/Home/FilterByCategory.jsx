import { useDispatch, useSelector } from 'react-redux';
import { setCategoryFilter } from '../../store/slices/filters.slice';
import './styles/FilterByCategory.css';

const FilterByCategory = () => {
  const dispatch = useDispatch();
  const selectedCategory = useSelector((state) => state.filters.category);

  const categories = [
    { value: 'autos', label: 'Autos' },
    { value: 'motos', label: 'Motos' },
    { value: 'camiones', label: 'Camiones' },
  ];

  const handleCategoryChange = (category) => {
    if (selectedCategory === category) {
      dispatch(setCategoryFilter(null));
    } else {
      dispatch(setCategoryFilter(category));
    }
  };

  return (
    <div className="filter-by-category">
      <h3>Categorías</h3>
      <div className="category-buttons">
        {categories.map((category) => (
          <button
            key={category.value}
            className={`category-btn ${
              selectedCategory === category.value ? 'active' : ''
            }`}
            onClick={() => handleCategoryChange(category.value)}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterByCategory;

