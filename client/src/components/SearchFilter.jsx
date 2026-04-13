import React, { useState, useEffect } from 'react';

const SearchFilter = ({ onFilterChange }) => {
  const [search, setSearch] = useState('');
  const [maxPrice, setMaxPrice] = useState(100);
  const [sortBy, setSortBy] = useState('recommended');

  useEffect(() => {
    onFilterChange({ search, maxPrice, sortBy });
  }, [search, maxPrice, sortBy]);

  return (
    <div className="card mb-6 animate-fade">
      <div className="grid md-grid-cols-3 gap-6 items-end">
        <div>
          <label className="input-label">Search Slots</label>
          <input
            type="text"
            className="input-field"
            placeholder="Search by name, address, amenities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div>
          <label className="input-label flex justify-between">
            <span>Max Price (/hr)</span>
            <span className="text-primary">₹{maxPrice}</span>
          </label>
          <input
            type="range"
            min="20"
            max="200"
            step="10"
            className="w-full mt-2"
            value={maxPrice}
            onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
          />
        </div>
        <div>
          <label className="input-label">Sort By</label>
          <select
            className="input-field"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="recommended">Recommended Picks</option>
            <option value="distance">Nearest First 📍</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="availability">Most Available</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
