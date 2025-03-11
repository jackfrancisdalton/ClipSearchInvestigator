import { useState } from 'react';
import { searchVideos } from '../Api';
import { SearchState, VideoTranscriptResult } from '../types/video';
import { ErrorMessage, LoadingSpinner, ResultsPlaceHolder, SearchBox, SearchResult, SideBar } from '../components';
import MasonryGrid from '../components/Layouts/MasonryGrid/MasonryGrid';

function SearchPage() {
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
    channelName: '',
  });

  const fetchVideoResults = async () => {
    const { searchQuery, searchTerms, order, publishedBefore, publishedAfter, numVideos, channelName } = searchState;

    if (!searchQuery || searchTerms.length === 0) {
      alert('Please fill out both the search query and search terms.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const result = await searchVideos({
        searchQuery,
        searchTerms,
        order,
        publishedBefore,
        publishedAfter,
        numVideos,
        channelName
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
    <div className="flex min-h-screen text-white bg-background-700">

      <SideBar>
        <SearchBox
          loading={loading}
          searchState={searchState}
          setSearchState={(state) => setSearchState((prev) => ({ ...prev, ...state }))}
          fetchVideoResults={fetchVideoResults}
        />
      </SideBar>

      <div className="ml-[20%] w-[80%] p-6 overflow-auto">
        {!loading && !error && results.length === 0 && (
          <ResultsPlaceHolder />
        )}

        {!!error && (
          <ErrorMessage errorMessage={error}></ErrorMessage>
        )}

        {loading && <LoadingSpinner />}

        {!loading && results.length > 0 && (
          <MasonryGrid columns={3}>
            {results.map((result, index) => (
              <SearchResult key={index} result={result} />
            ))}
          </MasonryGrid>
        )}
      </div>
    </div>
  );
}

export default SearchPage;