import { useState } from 'react';
import './App.css';
import { searchVideos } from './Api';
import LoadingSpinner from './components/LoadingSpinner';
import SearchResult from './components/SearchResult';
import SearchBox from './components/SearchBox';
import { VideoTranscriptResult } from './types/video';
import SelectedTermsBar from './components/SelectedTermsBar';

function App() {
  const [query, setQuery] = useState('');
  const [terms, setTerms] = useState<string[]>(['']);
  const [maxResults, setMaxResults] = useState(10);
  const [order, setOrder] = useState('relevance');
  const [publishedAfter, setPublishedAfter] = useState('');
  const [publishedBefore, setPublishedBefore] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<VideoTranscriptResult[]> ([]);

  const fetchVideoResults = async () => {
    if (!query || terms.length === 0) {
      alert('Please fill out both the search query and search terms.');
      return;
    }

    setLoading(true);

    try {
      const result = await searchVideos({
        query, 
        terms, 
        order, 
        publishedBefore,
        publishedAfter,
        maxResults
      });

      setResults(result);
    } catch (error) {
      console.error('Error fetching video results:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-700 text-white flex">
      <div className="w-1/5 bg-background-700 p-6 fixed h-full border-r-4 border-r-primary-600 shadow-lg">
        <SearchBox
          loading={loading}
          searchQuery={query}
          setSearchQuery={setQuery}
          numVideos={maxResults}
          setNumVideos={setMaxResults}
          searchTerms={terms}
          setSearchTerms={setTerms}
          fetchVideoResults={fetchVideoResults}
          order={order}
          setOrder={setOrder}
          publishedAfter={publishedAfter}
          setPublishedAfter={setPublishedAfter}
          publishedBefore={publishedBefore}
          setPublishedBefore={setPublishedBefore}
        />
      </div>

      <div className="ml-[20%] w-[80%] p-8 overflow-auto">
        {!loading && <SelectedTermsBar terms={terms} onTermClick={() => { console.log("hello")} }></SelectedTermsBar>}
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