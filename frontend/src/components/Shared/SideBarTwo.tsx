// src/components/SearchSidebar.jsx
import React from "react";

interface SideBarProps {
  children: React.ReactNode;
}

const SearchSidebar: React.FC<SideBarProps>  = ({ children }) => {
  return (
    <div className="p-4">
      <div className="space-y-3">
        { children }
      </div>
    </div>
  );
};

export default SearchSidebar;