import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AppConfigContext } from "../../contexts";

const navigationTabs = [
  { label: "SEARCH", route: "/search", aliasRoute: "/" },
  { label: "OPTIONS", route: "/options", aliasRoute: null},
];

const Header: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { isConfigured } = useContext(AppConfigContext);

  const renderNavigationTabs = (): JSX.Element | null => {
    if (!isConfigured) {
      return null;
    }

    return (
      <>
        {navigationTabs.map(({ label, route, aliasRoute }, index) => (
          <div key={route} className="flex items-center">
            <div className="h-full w-[1px] bg-primary-dark mx-1"></div>
            <Link
              to={route}
              className={`px-3 py-1 text-white border-none hover:bg-primary-dark rounded-sm transition-colors duration-300 ${
              (currentPath === route || currentPath === aliasRoute) ? "bg-primary-medium" : ""
              }`}
              data-testid={`navigation-tab-${index}`}
            >
              {label}
            </Link>
            {index === navigationTabs.length - 1 && (
              <div className="h-full w-[1px] bg-primary-dark mx-1"></div>
            )}
          </div>
        ))}
      </>
    );
  };

  const renderLogo = () => {
    return (
      <svg viewBox="0 0 220 100" xmlns="http://www.w3.org/2000/svg" className="h-[60px] w-auto">
        <style>
          {`
            .play { fill: rgb(29, 201, 167); }
            .lens-outline { stroke: white; stroke-width: 5; fill: none; }
            .text { font-family: Arial, sans-serif; font-weight: bold; fill: white; font-size: 58px; dominant-baseline: middle; }
          `}
        </style>
        <g transform="translate(10, 10)">
          <circle cx="40" cy="42" r="26" className="lens-outline" />
          <polygon className="play" points="34,30 54,42 34,56"></polygon>
        </g>
        <text x="90" y="56" className="text">CSI</text>
      </svg>
    );
  };

  return (
    <header className="flex items-center p-2 text-white bg-background-light">
      <Link to="/">{renderLogo()}</Link>
      <nav className="flex">{renderNavigationTabs()}</nav>
    </header>
  );
};

export default Header;
