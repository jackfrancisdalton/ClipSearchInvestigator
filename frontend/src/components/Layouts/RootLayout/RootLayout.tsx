import { Outlet } from "react-router-dom";

function RootLayout() {
    return (
      <div>
        {/* Shared layout components (header, navigation, etc.) can go here */}
        <Outlet />
      </div>
    );
}

export default RootLayout;