const MainSearchBox = () => {
  return (
    <div className="main-search-box">
      <h2 className="search-box-title">Search The Ultimate Tire & Wheel Source</h2>

      <button className="search-option-btn primary">🚗 Shop by Vehicle</button>

      <button className="search-option-btn primary">📏 Search By Size</button>

      <div className="browse-category">
        <h3>Browse By Category</h3>
        <div className="category-grid">
          <div className="category-item">
            <div className="category-icon">⭕</div>
            <span>Tires</span>
          </div>
          <div className="category-item">
            <div className="category-icon">⚙️</div>
            <span>Wheels</span>
          </div>
          <div className="category-item">
            <div className="category-icon">📦</div>
            <span>Packages</span>
          </div>
          <div className="category-item">
            <div className="category-icon">🔧</div>
            <span>Accessories</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainSearchBox;
