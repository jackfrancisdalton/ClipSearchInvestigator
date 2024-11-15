import React, { useState } from 'react';
import './App.css';
import { searchVideos } from './Api';
import LoadingSpinner from './components/LoadingSpinner';
import SearchResult from './components/SearchResult';
import SearchBox from './components/SearchBox';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTerms, setSearchTerms] = useState('');
  const [numVideos, setNumVideos] = useState(10);
  const [order, setOrder] = useState('relevance');
  const [publishedAfter, setPublishedAfter] = useState('');
  const [publishedBefore, setPublishedBefore] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ videoTitle: string; quotes: { text: string; timestamp: string, link: string }[] }[]> ([]);
  // >([
  //   { videoTitle: 'test video', quotes: [
  //     { text: 'asdasd', timestamp: '12:13', link: 'www.google.com' },
  //     { text: 'asdasd', timestamp: '12:13', link: 'www.google.com' },
  //     { text: 'asdasd', timestamp: '12:13', link: 'www.google.com' },
  //     { text: 'asdasd', timestamp: '12:13', link: 'www.google.com' },
  //     { text: 'asdasd', timestamp: '12:13', link: 'www.google.com' },
  //     { text: 'asdasd', timestamp: '12:13', link: 'www.google.com' },
  //     { text: 'asdasd', timestamp: '12:13', link: 'www.google.com' },
  //     { text: 'asdasd', timestamp: '12:13', link: 'www.google.com' },
  //   ] },
  //   { videoTitle: 'test video', quotes: [{ text: 'asdasd', timestamp: '12:13', link: 'www.google.com' }] },
  //   { videoTitle: 'test video', quotes: [{ text: 'asdasd', timestamp: '12:13', link: 'www.google.com' }] },
  //   { videoTitle: 'test video', quotes: [{ text: 'asdasd', timestamp: '12:13', link: 'www.google.com' }] },
  //   { videoTitle: 'test video', quotes: [{ text: 'asdasd', timestamp: '12:13', link: 'www.google.com' }] },
  //   { videoTitle: 'test video', quotes: [{ text: 'asdasd', timestamp: '12:13', link: 'www.google.com' }] },
  //   { videoTitle: 'test video', quotes: [{ text: 'asdasd', timestamp: '12:13', link: 'www.google.com' }] },
  //   { videoTitle: 'test video', quotes: [{ text: 'asdasd', timestamp: '12:13', link: 'www.google.com' }] },
  //   { videoTitle: 'test video', quotes: [{ text: 'asdasd', timestamp: '12:13', link: 'www.google.com' }] },
  //   { videoTitle: 'test video', quotes: [{ text: 'asdasd', timestamp: '12:13', link: 'www.google.com' }] },
  //   { videoTitle: 'test video', quotes: [{ text: 'asdasd', timestamp: '12:13', link: 'www.google.com' }] },
  //   { videoTitle: 'test video', quotes: [{ text: 'asdasd', timestamp: '12:13', link: 'www.google.com' }] },

  // ]);

  const fetchVideoResults = async () => {
    if (!searchQuery || !searchTerms) {
      alert('Please fill out both the search query and search terms.');
      return;
    }

    setLoading(true);

    try {
      const result = await searchVideos(
        searchQuery, 
        searchTerms, 
        order, 
        publishedBefore,
        publishedAfter,
        numVideos
      );

      const transformedResults = Object.entries(result).map(([videoTitle, quotes]: [string, any]) => ({
        videoTitle,
        quotes: quotes.map((quote: { text: string; start_time: number, link: string }) => ({
          text: quote.text,
          timestamp: new Date(quote.start_time * 1000).toISOString().substr(11, 8),
          link: quote.link,
        })),
      }));
      setResults(transformedResults);
    } catch (error) {
      console.error('Error fetching video results:', error);
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="min-h-screen bg-background-700 text-white flex">
      {/* Search Box - Fixed Left */}
      <div className="w-1/5 bg-background-700 p-6 fixed h-full border-r-4 border-r-primary-600 shadow-lg">
        <SearchBox
          loading={loading}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          numVideos={numVideos}
          setNumVideos={setNumVideos}
          searchTerms={searchTerms}
          setSearchTerms={setSearchTerms}
          fetchVideoResults={fetchVideoResults}
          order={order}
          setOrder={setOrder}
          publishedAfter={publishedAfter}
          setPublishedAfter={setPublishedAfter}
          publishedBefore={publishedBefore}
          setPublishedBefore={setPublishedBefore}
        />
      </div>

      {/* Results Section - Right */}
      <div className="ml-[20%] w-[80%] p-8 overflow-auto">
        {/* Loading Spinner */}
        {loading && <LoadingSpinner />}

        {/* Results */}
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