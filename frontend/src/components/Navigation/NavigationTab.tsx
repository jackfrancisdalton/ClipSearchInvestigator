// src/components/NavTabs.jsx
import React from "react";
import { Link } from "react-router-dom";

const tabs = [
  { name: "Search", path: "/search" },
  { name: "Options", path: "/options" },
];

interface NavTabsProps {
  activeTab: string;
}

const NavTabs: React.FC<NavTabsProps> = ({ activeTab }) => {
  return (
    <nav className="flex">
      {tabs.map((tab) => (
        <Link
          key={tab.path}
          to={tab.path}
          className={`px-3 py-3 text-white-50 hover:bg-primary-700 ${
            activeTab === tab.path ? "bg-primary-600" : ""
          }`}
        >
          {tab.name}
        </Link>
      ))}
    </nav>
  );
};

export default NavTabs;