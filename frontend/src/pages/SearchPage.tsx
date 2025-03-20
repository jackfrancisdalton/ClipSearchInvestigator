import React, { useState } from "react";
import { MasonryGridLayout, LoadingSpinner, ResultsPlaceHolder, MobilePopOutMenu, SearchResult, SearchFormData, SearchForm } from "../components";
import { searchForTermsInTranscripts } from "../api";
import { TranscriptSearchResult } from "../types"; // Import the correct type
import SearchErrorMessage from "../components/Search/SearchErrorMessage";

const SearchPage: React.FC = () => {
  const [results, setResults] = useState<TranscriptSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const onSubmit = async (data: SearchFormData) => {
    setHasSearched(true);
    setLoading(true);
    setError(null);

    try {
      const result = await searchForTermsInTranscripts(data);
      setResults(result);
    } catch (err: any) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
      setIsMobileSidebarOpen(false); // hide the mobile sidebar after action is complete
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden md:flex-row">
      {/* Desktop Sidebar */}
      <div className="hidden overflow-auto border-r-4 border-background-500 w-84 md:block bg-background-800">
        <SearchForm onSubmit={onSubmit} loading={loading} />
      </div>

      {/* Placeholder for first render */}
      {!hasSearched && !loading && <ResultsPlaceHolder />}

      {/* Loading Spinner */}
      {loading && (
        <div className="flex items-center justify-center flex-1 p-4 bg-background-700">
          <LoadingSpinner />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <SearchErrorMessage errorMessage={error}/>
      )}

      {/* Results */}
      {!loading && hasSearched && results.length > 0 && (
        <div className="flex-1 p-4 overflow-auto bg-background-800">
          <MasonryGridLayout>
            {results.map((result, index) => (
              <div key={index}>
                <SearchResult result={result} />
              </div>
            ))}
          </MasonryGridLayout>
        </div>
      )}

      {/* Mobile: Sliding sidebar */}
      <MobilePopOutMenu
        isOpen={isMobileSidebarOpen}
        toggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      >
        <SearchForm onSubmit={onSubmit} loading={loading} />
      </MobilePopOutMenu>

      {/* Mobile: Toggle Button */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden">
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="w-full p-3 text-center text-white shadow-lg bg-primary-600"
        >
          {isMobileSidebarOpen ? "Hide Filters" : "Show Filters"}
        </button>
      </div>
    </div>
  );
};

export default SearchPage;
