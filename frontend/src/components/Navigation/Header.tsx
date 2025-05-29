import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AppConfigContext } from "../../contexts/AppConfigContext";

const navigationTabs = [
  { label: "Search", route: "/search" },
  { label: "Options", route: "/options" },
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
        {navigationTabs.map(({ label, route }, index) => (
          <Link
            key={route}
            to={route}
            className={`px-3 py-3 text-white hover:bg-primary-dark ${
              currentPath === route ? "bg-primary-medium" : ""
            }`}
            data-testid={`navigation-tab-${index}`}
          >
            {label}
          </Link>
        ))}
      </>
    );
  };

  return (
    <header className="flex items-center justify-between text-white bg-background-light">
      <nav className="flex">{renderNavigationTabs()}</nav>
      <div className="text-lg font-bold">
        <Link to="/">LOGO</Link>
      </div>
    </header>
  );
};

export default Header;
