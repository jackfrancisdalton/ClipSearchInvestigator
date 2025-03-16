import { useState } from "react";
import { VideoSearchSortOrder, VideoSearchState } from "../../types";

interface VideoSearchFormProps {
  videoSearchState: VideoSearchState;
  setVideoSearchState: (state: Partial<VideoSearchState>) => void;
  disableForm: boolean;
}

function VideoSearchSubForm({ videoSearchState, setVideoSearchState, disableForm }: VideoSearchFormProps) {
  const [showMore, setShowMore] = useState(false);

  return (
    <div>
      <div className="items-center justify-start inline-block p-2 bg-primary-600">
        <h3 className="text-white-50">Videos to search</h3>
      </div>
      <div className="w-auto h-0.5 bg-primary-600"></div>
        <div className="p-3 bg-background-500">
        {/* Search Query */}
        <div className="mb-6">
          <label className="block mb-2 font-medium text-l text-white-100">Search for videos you want to scan</label>
          <input
            type="text"
            className="w-full p-3 border rounded-lg bg-white-700 text-white-100 border-primary-800 focus:ring-2 focus:ring-primary-500 focus:outline-none"
            placeholder="Enter your search query"
            value={videoSearchState.videoSearchQuery}
            onChange={(e) => setVideoSearchState({ videoSearchQuery: e.target.value })}
          />
        </div>

        {/* Slider for Number of Videos */}
        <div className="mb-6">
          <label className="block mb-2 font-medium text-l text-white-100">
            Number of Search Results to Scan: {videoSearchState.maxResults}
          </label>
          <input
            type="range"
            min="1"
            max="50"
            value={videoSearchState.maxResults}
            onChange={(e) => setVideoSearchState({ maxResults: Number(e.target.value) })}
            className="w-full bg-primary-100 accent-primary-500"
          />
        </div>

        {/* Show More Toggle */}
        <div mb-4>
          <button
            type="button"
            className="text-primary-500"
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? "Show Less" : "Show More"}
          </button>
        </div>

        {showMore && (
          <>
            {/* Channel Name Input */}
            <div className="mb-6">
              <label className="block mb-2 font-medium text-l text-white-100">Channel Name</label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg bg-white-700 text-white-100 border-primary-800 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                placeholder="Enter the channel ID"
                value={videoSearchState.channelName || ''}
                onChange={(e) => setVideoSearchState({ channelName: e.target.value })}
              />
            </div>

            {/* Search Result Sort Dropdown */}
            <div className="mb-6">
              <label className="block mb-2 font-medium text-l text-white-100">Sort By</label>
              <select
                value={videoSearchState.sortOrder}
                onChange={(e) =>
                  setVideoSearchState({ sortOrder: e.target.value as VideoSearchSortOrder })
                }
                className="w-full p-3 border rounded-lg text-white-100 bg-white-700 border-primary-800 focus:ring-2 focus:ring-primary-500 focus:outline-none"
              >
                {Object.values(VideoSearchSortOrder).map((order) => (
                  <option key={order} value={order}>
                    {order}
                  </option>
                ))}
              </select>
            </div>

            {/* Published After Date Picker */}
            <div className="mb-6">
              <label className="block mb-2 font-medium text-l text-white-100">Published After</label>
              <input
                type="date"
                className="w-full p-3 border rounded-lg bg-white-700 text-white-100 border-primary-800 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                value={videoSearchState.publishedAfter}
                onChange={(e) => setVideoSearchState({ publishedAfter: e.target.value })}
              />
            </div>

            {/* Published Before Date Picker */}
            <div className="mb-6">
              <label className="block mb-2 font-medium text-l text-white-100">Published Before</label>
              <input
                type="date"
                className="w-full p-3 border rounded-lg bg-white-700 text-white-100 border-primary-800 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                value={videoSearchState.publishedBefore}
                onChange={(e) => setVideoSearchState({ publishedBefore: e.target.value })}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default VideoSearchSubForm;