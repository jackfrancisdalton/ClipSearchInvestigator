import React, { useState } from 'react';
import './App.css';
import { searchVideos } from './Api';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTerms, setSearchTerms] = useState('');
  const [numVideos, setNumVideos] = useState(10);
  const [loading, setLoading] = useState(false); // State for loading spinner
  const [results, setResults] = useState<
    { videoTitle: string; quotes: { text: string; timestamp: string, link: string }[] }[]
  >([]);

  const fetchVideoResults = async () => {
    if (!searchQuery || !searchTerms) {
      alert('Please fill out both the search query and search terms.');
      return;
    }

    setLoading(true); // Start loading

    try {
      const result = await searchVideos(searchQuery, searchTerms, numVideos);

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
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* Title */}
      <header className="text-center mb-8">
        <h1 className="text-5xl font-bold">Youtube Giga Search</h1>
      </header>

      {/* Search Section */}
      <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        {/* Search Query */}
        <div className="mb-4">
          <label className="block mb-2 text-xl font-medium">Search Query</label>
          <input
            type="text"
            className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter your search query"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Slider for Number of Videos */}
        <div className="mb-4">
          <label className="block mb-2 text-xl font-medium">
            Number of Videos to Scan: {numVideos}
          </label>
          <input
            type="range"
            min="1"
            max="50"
            value={numVideos}
            onChange={(e) => setNumVideos(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Search Terms */}
        <div className="mb-4">
          <label className="block mb-2 text-xl font-medium">
            Search Terms in Videos
          </label>
          <input
            type="text"
            className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter the terms to find in videos"
            value={searchTerms}
            onChange={(e) => setSearchTerms(e.target.value)}
          />
        </div>

        {/* Search Button */}
        <div className="text-center">
          <button
            onClick={fetchVideoResults}
            disabled={loading} // Disable button during loading
            className={`px-6 py-3 ${
              loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            } text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Results Section */}
      <div className="mt-8">
        <h2 className="text-3xl font-bold mb-4">Results</h2>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center items-center">
            <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          </div>
        )}

        {/* Results */}
        {!loading && results.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {results.map((result, index) => (
              <div
                key={index}
                className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <h3 className="text-2xl font-semibold mb-4">
                  {result.videoTitle}
                </h3>
                <ul className="space-y-2">
                  {result.quotes.map((quote, idx) => (
                    <li
                      key={idx}
                      className="text-sm bg-gray-700 p-2 rounded-lg border border-gray-600 cursor-pointer"
                      onClick={() => window.open(quote.link, '_blank')}
                    >
                      <strong>"{quote.text}"</strong> - {quote.timestamp}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;