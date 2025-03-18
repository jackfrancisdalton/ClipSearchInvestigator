import React from "react";

interface MobilePopOutMenuProps {
  children: React.ReactNode;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const MobilePopOutMenu: React.FC<MobilePopOutMenuProps> = ({ children, isOpen, toggleSidebar }) => {
  return (
    <div
      className={`fixed inset-x-0 bottom-0 bg-background-700 border-t border-gray-200 transition-transform duration-300 md:hidden ${
      isOpen ? "translate-y-0 h-full" : "translate-y-full h-0"
      }`}
      style={{ maxHeight: "100%" }}
    >
      <div className="h-full overflow-auto bg-black">
        { children }
      </div>
      <button onClick={toggleSidebar} className="w-full p-2 text-white bg-blue-600">
        {isOpen ? "Close" : "Open"}
      </button>
    </div>
  );
};

export default MobilePopOutMenu;