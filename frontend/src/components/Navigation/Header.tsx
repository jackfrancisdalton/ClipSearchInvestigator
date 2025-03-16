import { Link, useLocation } from "react-router-dom";
import NavigationTab from "./NavigationTab";

const Header = () => {
  const location = useLocation();
  const activeTab = location.pathname; // Simple active check

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