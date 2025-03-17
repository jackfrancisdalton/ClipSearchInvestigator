import { Outlet } from "react-router-dom";
import Header from "../Navigation/Header";
import { AppConfigProvider } from "../../contexts/AppConfigContext";

const RootLayout = () => {
  return (
    <AppConfigProvider>
      <div className="flex flex-col h-screen">
        <Header />
        <main className="flex-1 min-w-full overflow-hidden bg-background-700">
          <Outlet />
        </main>
      </div>
    </AppConfigProvider>
  );
};

export default RootLayout;