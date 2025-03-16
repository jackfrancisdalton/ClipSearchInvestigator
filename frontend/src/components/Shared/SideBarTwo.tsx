// src/components/SearchSidebar.jsx
import React from "react";

const SearchSidebar = () => {
  return (
    <div className="p-4">
      <h3 className="mb-4 text-xl font-semibold">Filters</h3>
      <div className="space-y-3">
        <div>
          <label className="block mb-1 text-sm font-medium">
            Search Term
          </label>
          <input
            type="text"
            placeholder="Type to search..."
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Category</label>
          <select className="w-full p-2 border rounded-md">
            <option>All</option>
            <option>Category 1</option>
            <option>Category 2</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchSidebar;