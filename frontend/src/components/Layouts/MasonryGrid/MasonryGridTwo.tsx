// src/components/MasonryGrid.jsx
import React from "react";

interface MasonryGridProps {
  children: React.ReactNode;
}

const MasonryGrid: React.FC<MasonryGridProps> = ({ children }) => {
  return (
    <div className="gap-4 columns-1 sm:columns-1 md:columns-1 lg:columns-1 xl:columns-2 2xl:columns-3">
      {React.Children.map(children, child => (
        <div className="mb-4 break-inside-avoid">
          { child }
        </div>
      ))}
    </div>
  );
};

export default MasonryGrid;