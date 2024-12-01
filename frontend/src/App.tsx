import { useState } from 'react';
import './App.css';
import { searchVideos } from './Api';
import LoadingSpinner from './components/LoadingSpinner';
import SearchResult from './components/SearchResult';
import SearchBox from './components/SearchBox';
import { SearchState, VideoTranscriptResult } from './types/video';
import ResultsPlaceHolder from './components/ResultsPlaceHolder';
import ErrorMessage from './components/ErrorMessage';

function App() {

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<VideoTranscriptResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchState, setSearchState] = useState<SearchState>({
    searchQuery: '',
    numVideos: 10,
    searchTerms: [''],
    order: 'relevance',
    publishedAfter: '',
    publishedBefore: '',
    channelId: '',
  });

  const fetchVideoResults = async () => {
    const { searchQuery, searchTerms, order, publishedBefore, publishedAfter, numVideos, channelId } = searchState;
    
    if (!searchQuery || searchTerms.length === 0) {
      alert('Please fill out both the search query and search terms.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const result = await searchVideos({
        query: searchQuery,
        terms: searchTerms,
        order,
        publishedBefore,
        publishedAfter,
        maxResults: numVideos,
        channelId: channelId
      });

      setResults(result);

    } catch (error: Error | any) {
      setError(error.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-700 text-white flex">
      <div className="w-1/5 bg-background-700 p-6 fixed h-full border-r-4 border-r-primary-600 shadow-lg">
        <SearchBox
          loading={loading}
          searchState={searchState}
          setSearchState={(state) => setSearchState((prev) => ({ ...prev, ...state }))}
          fetchVideoResults={fetchVideoResults}
        />
      </div>

      <div className="ml-[20%] w-[80%] p-6 overflow-auto">
        {!loading && !error && results.length === 0 && (
          <ResultsPlaceHolder />
        )}

        {!!error && (
          <ErrorMessage errorMessage={error}></ErrorMessage>
        )}

        {loading && <LoadingSpinner />}

        {!loading && results.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {results.map((result, index) => (
              <SearchResult key={index} result={result} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;