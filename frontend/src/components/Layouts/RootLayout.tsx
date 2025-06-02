import { Outlet } from "react-router-dom";
import Header from "../Navigation/Header.js";
import { AppConfigProvider } from "../../contexts/index.js";

const RootLayout: React.FC = () => {
  return (
    <AppConfigProvider>
      <div 
        className="flex flex-col h-screen" 
        data-testid="root-layout_container"
      >
        <Header />
        <main 
          className="flex-1 min-w-full overflow-hidden bg-background-dark" 
          data-testid="root-layout_main"
        >
          <Outlet />
        </main>
      </div>
    </AppConfigProvider>
  );
};

export default RootLayout;