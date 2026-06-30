import "./Filter.css";

const CATEGORIES = ["electronics", "clothing", "books", "home", "sports"];

export default function Filter({ filters, onChange }) {
  const handleChange = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <aside className="filter-panel card">
      <h2 className="filter-heading">Filters</h2>

      <div className="filter-section">
        <label className="filter-label">Category</label>
        <select
          value={filters.category}
          onChange={(e) => handleChange("category", e.target.value)}
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-section">
        <label className="filter-label">Price range</label>
        <div className="price-inputs">
          <input
            type="number"
            placeholder="Min $"
            value={filters.minPrice}
            onChange={(e) => handleChange("minPrice", e.target.value)}
          />
          <span>—</span>
          <input
            type="number"
            placeholder="Max $"
            value={filters.maxPrice}
            onChange={(e) => handleChange("maxPrice", e.target.value)}
          />
        </div>
      </div>

      <div className="filter-section">
        <label className="filter-label">Sort by</label>
        <select
          value={filters.sort}
          onChange={(e) => handleChange("sort", e.target.value)}
        >
          <option value="">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      <button
        className="btn btn-outline"
        onClick={() => onChange({ category: "", minPrice: "", maxPrice: "", sort: "" })}
      >
        Clear filters
      </button>
    </aside>
  );
}
