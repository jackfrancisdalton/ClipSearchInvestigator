import React, { useState } from "react";
import { MasonryGridLayout, LoadingSpinner, MobilePopOutMenu, SearchResult, SearchFormData, SearchForm, SearchInfoBox, SearchErrorMessage } from "../components/index.js";
import { searchForTermsInTranscripts } from "../api/index.js";
import { TranscriptSearchResult } from "../types/index.js";

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
      // TODO fix converting search form to data type
      const result = await searchForTermsInTranscripts(data as any);
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
      <div className="hidden overflow-auto border-r-4 border-background-light w-84 md:block bg-background-darker">
        <SearchForm 
          onSubmit={onSubmit} 
          loading={loading} 
          data-testid="search-form"
        />
      </div>

      {/* Placeholder for first render */}
      {!hasSearched && !loading && <SearchInfoBox data-testid="search-info" />}

      {/* Loading Spinner */}
      {loading && (
        <div className="flex items-center justify-center flex-1 p-4 bg-background-dark">
          <LoadingSpinner  data-testid="loading-spinner" />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <SearchErrorMessage 
          errorMessage={error}
          data-testid="error-message"
        />
      )}

      {/* Results */}
      {!loading && hasSearched && results.length > 0 && (
        <div className="flex-1 p-4 overflow-auto bg-background-darker">
          <MasonryGridLayout>
            {results.map((result, index) => (
              <div key={index}>
                <SearchResult 
                  result={result} 
                  data-testid={`search-result`}
                />
              </div>
            ))}
          </MasonryGridLayout>
        </div>
      )}

      {/* Mobile: Sliding sidebar */}
      <MobilePopOutMenu
        isOpen={isMobileSidebarOpen}
        toggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        data-testid="mobile-menu"
      >
        <SearchForm 
          onSubmit={onSubmit} 
          loading={loading} 
          data-testid="mobile-search-form"
        />
      </MobilePopOutMenu>

      {/* Mobile: Toggle Button */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden">
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="w-full p-3 text-center text-white shadow-lg bg-primary-medium"
          data-testid="toggle-filters-button"
        >
          {isMobileSidebarOpen ? "Hide Filters" : "Show Filters"}
        </button>
      </div>
    </div>
  );
};

export default SearchPage;
