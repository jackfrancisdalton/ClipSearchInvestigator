import { Outlet } from "react-router-dom";
import Header from "../../Navigation/Header";

const RootLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;