import React from 'react';

interface MasonryGridProps {
  children: React.ReactNode;
  columns: number;
  gap?: string;
}

const MasonryGrid: React.FC<MasonryGridProps> = ({ children, columns, gap = '1rem' }) => {
  return (
    <div style={{ columnCount: columns, columnGap: gap }}>
      {React.Children.map(children, child => (
      // wrap each child so it won't break between columns
        <div className="break-inside-avoid mb-4">
          {child}
        </div>
      ))}
    </div>
  );
};

export default MasonryGrid;