// src/components/NavTabs.jsx
import React from "react";
import { Link } from "react-router-dom";

const tabs = [
  { name: "Options", path: "/options" },
  { name: "Search", path: "/search" },
];

interface NavTabsProps {
  activeTab: string;
}

const NavTabs: React.FC<NavTabsProps> = ({ activeTab }) => {
  return (
    <nav className="flex space-x-4">
      {tabs.map((tab) => (
        <Link
          key={tab.path}
          to={tab.path}
          className={`px-3 py-1 rounded-md hover:bg-gray-700 ${
            activeTab === tab.path ? "bg-gray-700" : ""
          }`}
        >
          {tab.name}
        </Link>
      ))}
    </nav>
  );
};

export default NavTabs;