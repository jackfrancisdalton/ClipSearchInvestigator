// src/components/SearchPage.jsx
import { useState } from "react";
import SearchSidebarTwo from "../components/Shared/SideBarTwo";
import MasonryGridTwo from "../components/Layouts/MasonryGrid/MasonryGridTwo";
import SideBarTwoMobile from "../components/Shared/SideBarTwoMobile";

// Dummy results for the masonry grid
const dummyResults = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  title: `Result ${i + 1}`,
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
}));

const SearchPage = () => {
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden md:flex-row">
      {/* Desktop: Fixed left sidebar */}
      <div className="hidden w-64 overflow-auto border-r border-gray-200 md:block">
        <SearchSidebarTwo />
      </div>

      {/* Main Results Area */}
      <div className="flex-1 p-4 overflow-auto">
        <MasonryGridTwo items={dummyResults} />
      </div>

      {/* Mobile: Sliding sidebar from bottom */}
      <SideBarTwoMobile
        isOpen={isMobileSidebarOpen}
        toggleSidebar={toggleMobileSidebar}
      />

      {/* Mobile: Toggle Button */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden">
        <button
          onClick={toggleMobileSidebar}
          className="w-full p-3 text-center text-white bg-blue-600"
        >
          {isMobileSidebarOpen ? "Hide Filters" : "Show Filters"}
        </button>
      </div>
    </div>
  );
};

export default SearchPage;
