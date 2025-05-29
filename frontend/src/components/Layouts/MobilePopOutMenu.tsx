import React from "react";

interface MobilePopOutMenuProps {
  children: React.ReactNode;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const MobilePopOutMenu: React.FC<MobilePopOutMenuProps> = ({ children, isOpen, toggleSidebar }) => {
  return (
    <article
      className={`fixed inset-x-0 bottom-0 bg-background-dark border-t border-gray-200 transition-transform duration-300 md:hidden ${
      isOpen ? "translate-y-0 h-full" : "translate-y-full h-0"
      }`}
      style={{ maxHeight: "100%" }}
      data-testid="mobile-pop-out-menu_container"
    >
      <section 
        className="h-full overflow-auto bg-background-darker"
        data-testid="mobile-pop-out-menu_content"
      >
        { children }
      </section>
      <button 
        onClick={toggleSidebar} 
        className="w-full p-2 text-white bg-blue-600"
        data-testid="mobile-pop-out-menu_toggle-button"
      >
        {isOpen ? "Close" : "Open"}
      </button>
    </article>
  );
};

export default MobilePopOutMenu;