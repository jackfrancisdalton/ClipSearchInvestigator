// src/components/MasonryGrid.jsx
import React from "react";

interface Item {
  id: number;
  title: string;
  description: string;
}

interface MasonryGridProps {
  items: Item[];
}

const MasonryGrid: React.FC<MasonryGridProps> = ({ items }) => {
  return (
    <div className="gap-4 columns-1 sm:columns-2 md:columns-3 lg:columns-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="p-4 mb-4 bg-white rounded-md shadow break-inside-avoid"
        >
          <h4 className="mb-2 font-semibold">{item.title}</h4>
          <p className="text-sm text-gray-700">{item.description}</p>
        </div>
      ))}
    </div>
  );
};

export default MasonryGrid;