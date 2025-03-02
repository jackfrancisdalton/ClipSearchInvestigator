import { SearchState } from "../../../types/video";

interface SearchBoxProps {
  searchState: SearchState;
  setSearchState: (state: Partial<SearchState>) => void;
  fetchVideoResults: () => void;
  loading: boolean;
}

function SearchBox({
  searchState,
  setSearchState,
  fetchVideoResults,
  loading,
}: SearchBoxProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchVideoResults();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-2 rounded-lg">
      {/* Search Query */}
      <div className="mb-6">
        <label className="block mb-2 text-l text-white-100 font-medium">Search for videos you want to scan</label>
        <input
          type="text"
          className="w-full p-3 bg-white-700 text-white-100 rounded-lg border border-primary-800 focus:ring-2 focus:ring-primary-500 focus:outline-none"
          placeholder="Enter your search query"
          value={searchState.searchQuery}
          onChange={(e) => setSearchState({ searchQuery: e.target.value })}
        />
      </div>

      {/* Slider for Number of Videos */}
      <div className="mb-6">
        <label className="block mb-2 text-l font-medium text-white-100">
          Number of Search Results to Scan: {searchState.numVideos}
        </label>
        <input
          type="range"
          min="1"
          max="50"
          value={searchState.numVideos}
          onChange={(e) => setSearchState({ numVideos: Number(e.target.value) })}
          className="w-full bg-primary-100 accent-primary-500"
        />
      </div>

      {/* Dynamic List of Input Boxes for Search Terms */}
      <div className="mb-6">
        <label className="block mb-2 text-l text-white-100 font-medium">Transcript Term you want to find</label>
        {searchState.searchTerms.map((term, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              className="w-full text-white-100 p-3 bg-white-700 rounded-lg border border-primary-800 focus:ring-2 focus:ring-primary-500 focus:outline-none"
              value={term}
              onChange={(e) => {
                const newTerms = [...searchState.searchTerms];
                newTerms[index] = e.target.value;
                setSearchState({ searchTerms: newTerms });
              }}
            />
            <button
              type="button"
              className="ml-2 p-3 bg-red-600 text-white-100 rounded-lg"
              onClick={() => {
                const newTerms = searchState.searchTerms.filter((_, i) => i !== index);
                setSearchState({ searchTerms: newTerms });
              }}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="mt-2 p-2 bg-primary-600 text-white rounded-lg"
          onClick={() => setSearchState({ searchTerms: [...searchState.searchTerms, ''] })}
        >
          Add Term
        </button>
      </div>

      {/* Channel Name Input */}
      <div className="mb-6">
        <label className="block mb-2 text-l text-white-100 font-medium">Channel Name</label>
        <input
          type="text"
          className="w-full p-3 bg-white-700 text-white-100 rounded-lg border border-primary-800 focus:ring-2 focus:ring-primary-500 focus:outline-none"
          placeholder="Enter the channel ID"
          value={searchState.channelName || ''}
          onChange={(e) => setSearchState({ channelName: e.target.value })}
        />
      </div>

      {/* Sort Option Dropdown */}
      <div className="mb-6">
        <label className="block mb-2 text-l text-white-100 font-medium">Sort By</label>
        <select
          value={searchState.order}
          onChange={(e) => setSearchState({ order: e.target.value })}
          className="w-full p-3 text-white-100 bg-white-700 text-white-100 rounded-lg border border-primary-800 focus:ring-2 focus:ring-primary-500 focus:outline-none"
        >
          <option value="date">Date</option>
          <option value="rating">Rating</option>
          <option value="relevance">Relevance</option>
          <option value="title">Title</option>
          <option value="videoCount">Video Count</option>
          <option value="viewCount">View Count</option>
        </select>
      </div>

      {/* Published After Date Picker */}
      <div className="mb-6">
        <label className="block mb-2 text-l text-white-100 font-medium">Published After</label>
        <input
          type="date"
          className="w-full p-3 bg-white-700 text-white-100 rounded-lg border border-primary-800 focus:ring-2 focus:ring-primary-500 focus:outline-none"
          value={searchState.publishedAfter}
          onChange={(e) => setSearchState({ publishedAfter: e.target.value })}
        />
      </div>

      {/* Published Before Date Picker */}
      <div className="mb-6">
        <label className="block mb-2 text-l text-white-100 font-medium">Published Before</label>
        <input
          type="date"
          className="w-full p-3 bg-white-700 text-white-100 rounded-lg border border-primary-800 focus:ring-2 focus:ring-primary-500 focus:outline-none"
          value={searchState.publishedBefore}
          onChange={(e) => setSearchState({ publishedBefore: e.target.value })}
        />
      </div>

      {/* Search Button */}
      <div className="text-center">
        <button
          type="submit"
          disabled={loading} // Disable button during loading
          className={`px-6 py-3 ${
            loading
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-primary-600 hover:bg-primary-300'
          } text-white font-semibold rounded-lg shadow-md w-full focus:outline-none focus:ring-2 focus:ring-primary-500`}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </form>
  );
}

export default SearchBox;