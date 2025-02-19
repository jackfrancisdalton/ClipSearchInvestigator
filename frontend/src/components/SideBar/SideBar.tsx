import React, { useState } from 'react';

interface SideBarProps {
  children: React.ReactNode;
}

const SideBar: React.FC<SideBarProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Toggle button (only visible on mobile) */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 md:hidden p-2 bg-primary-600 text-white rounded"
      >
        {isOpen ? 'Close' : 'Menu'}
      </button>

      {/* Sidebar container */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-background-700 shadow-lg z-50 transform transition-transform duration-300 
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <div className="p-4">
          {/* Optional close button inside sidebar for mobile */}
          <div className="md:hidden mb-4">
            <button onClick={toggleSidebar} className="text-white">
              Close
            </button>
          </div>
          {children}
        </div>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 
          ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'} md:hidden`}
        onClick={toggleSidebar}
      />
    </>
  );
};

export default SideBar;