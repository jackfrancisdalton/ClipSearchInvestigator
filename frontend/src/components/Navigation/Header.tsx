import React from "react";
// import NavTabs from "./NavTabs";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const activeTab = location.pathname; // Simple active check

  return (
    <header className="flex items-center justify-between px-4 py-2 text-white bg-gray-800">
      {/* <NavTabs activeTab={activeTab} /> */}
      <div className="text-lg font-bold">
        <Link to="/">LOGO</Link>
      </div>
    </header>
  );
};

export default Header;