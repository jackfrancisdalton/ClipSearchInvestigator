// src/components/SearchSidebar.jsx
import React from "react";

interface SideBarProps {
  children: React.ReactNode;
}

const SearchSidebar: React.FC<SideBarProps>  = ({ children }) => {
  return (
    <div className="p-4 bg-background-700">
      <h3 className="mb-4 text-xl font-semibold">Filters</h3>
      <div className="space-y-3">
        { children }
      </div>
    </div>
  );
};

export default SearchSidebar;