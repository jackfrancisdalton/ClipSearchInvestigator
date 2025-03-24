import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import NavigationTab from "./NavigationTab.js";
import { AppConfigContext } from "../../contexts/AppConfigContext.js";

const Header = () => {
  const location = useLocation();
  const activeTab = location.pathname;
  const { isConfigured } = useContext(AppConfigContext);


  // If we are on the setup page or if the API key is not set, render only the logo.
  if (isConfigured === false) {
    return (
      <header className="flex items-center justify-between text-white bg-background-500">
        <div className="text-lg font-bold">
          <Link to="/">LOGO</Link>
        </div>
      </header>
    );
  }

  // Otherwise, show the full header with navigation tabs.
  return (
    <header className="flex items-center justify-between text-white bg-background-500">
      <NavigationTab activeTab={activeTab} />
      <div className="text-lg font-bold">
        <Link to="/">LOGO</Link>
      </div>
    </header>
  );
};

export default Header;