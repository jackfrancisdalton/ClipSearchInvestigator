import { useState } from 'react';
import { searchVideos, setAndStoreApiKey } from '../Api';
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

  const postAPIKey = async ({ apiKey}: { apiKey: string }) => {
    try {
      const result = await setAndStoreApiKey({ apiKey })
      console.log('result:', result)
    }
    catch (error: Error | any) {
      console.log("Error:", error)
    }
    finally {
      console.log('FINALLY')
    }
  } 

  return (
    <div className="min-h-screen bg-background-700 text-white flex">

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

        {/* // TODO create layout component that these can be a child of in order to make dynamic sizing work
        {!loading && results.length > 0 && (
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {results.map((result, index) => (
              <SearchResult key={index} result={result} />
            ))}
          </div>
        )} */}

        {!loading && results.length > 0 && (
          <MasonryGrid columns={3}>
            {results.map((result, index) => (
              <SearchResult key={index} result={result} />
            ))}
          </MasonryGrid>
        )}


        {/* <button
          className="p-5 bg-background-500"
          onClick={() => postAPIKey({ apiKey: "hello" })}
        >TEST BUTTON</button> */}
      </div>
    </div>
  );
}

export default SearchPage;