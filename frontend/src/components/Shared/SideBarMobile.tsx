import React from "react";
import SideBarTwo from "./SideBar";


interface MobileSideBarProps {
  children: React.ReactNode;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const MobileSideBar: React.FC<MobileSideBarProps> = ({ children, isOpen, toggleSidebar }) => {
  return (
    <div
      className={`fixed inset-x-0 bottom-0 bg-white border-t border-gray-200 transition-transform duration-300 md:hidden ${
        isOpen ? "translate-y-0 h-1/2" : "translate-y-full h-0"
      }`}
      style={{ maxHeight: "70%" }}
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

export default MobileSideBar;