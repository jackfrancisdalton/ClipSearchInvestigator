import React from "react";

interface MasonryGridLayoutProps {
  children: React.ReactNode;
}

const MasonryGridLayout: React.FC<MasonryGridLayoutProps> = ({ children }) => {
  return (
    <div 
      className="gap-4 columns-1 sm:columns-1 md:columns-1 lg:columns-1 xl:columns-2 2xl:columns-3"
      data-testid="masonary-grid-layout_parent" 
    >
      {React.Children.map(children, child => (
        <div
         className="mb-4 break-inside-avoid"
         data-testid="child" 
        >
          { child }
        </div>
      ))}
    </div>
  );
};

export default MasonryGridLayout;