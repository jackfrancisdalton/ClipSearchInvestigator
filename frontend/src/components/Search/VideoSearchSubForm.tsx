import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { SearchFormData } from "./SearchForm.js";
import { VideoSearchSortOrder } from "../../types/index.js";

interface VideoSearchSubFormProps {
  disableForm: boolean;
}

const VideoSearchSubForm: React.FC<VideoSearchSubFormProps> = ({ disableForm }) => {
  const { register, formState: { errors }, watch } = useFormContext<SearchFormData>();
  const [showMore, setShowMore] = useState(false);

  return (
    <div
      className="overflow-hidden border rounded-md border-primary-medium"
      data-testid="video-search-subform"
    >
      <div
        className="items-center justify-start p-2 bg-background-medium"
        data-testid="video-search-header"
      >
        <h3 className="font-bold text-center text-white">Video Search</h3>
      </div>
      <div className="w-auto h-0.5 bg-primary-medium"></div>
      <div className="p-3 bg-background-light" data-testid="video-search-body">

        {/* Search Query */}
        <div className="mb-6" data-testid="video-search-query">
          <label className="block mb-2 font-medium text-l text-white-medium">
            Search for videos you want to scan
          </label>
          <input
            type="text"
            className={`w-full p-3 border rounded-lg bg-white-dark text-white-medium focus:ring-2 focus:ring-primary-light focus:outline-none ${
              errors.videoSearchQuery ? "border-red-500" : "border-primary-darker"
            }`}
            placeholder="Enter your search query"
            {...register("videoSearchQuery")}
            disabled={disableForm}
            data-testid="video-search-query-input"
          />
          {errors.videoSearchQuery && (
            <p className="mt-1 text-sm text-red-500" data-testid="video-search-query-error">
              {errors.videoSearchQuery.message}
            </p>
          )}
        </div>

        {/* Slider for Number of Videos */}
        <div className="mb-6" data-testid="video-search-max-results">
          <label className="block mb-2 font-medium text-l text-white-medium">
            Number of Results to Scan: {watch("maxResults")}
          </label>
          <input
            type="range"
            min="1"
            max="50"
            {...register("maxResults", { valueAsNumber: true })}
            className="w-full bg-primary-100 accent-primary-light"
            disabled={disableForm}
            data-testid="video-search-max-results-slider"
          />
        </div>

        {/* Show More Toggle */}
        <div className="mb-4" data-testid="video-search-show-more">
          <button
            type="button"
            className="text-primary-light"
            onClick={() => setShowMore(!showMore)}
            data-testid="video-search-show-more-button"
          >
            {showMore ? "Show Less" : "Show More"}
          </button>
        </div>

        {showMore && (
          <>
            {/* Channel Name Input */}
            <div className="mb-6" data-testid="video-search-channel-name">
              <label className="block mb-2 font-medium text-l text-white-medium">
                Channel Name
              </label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg bg-white-dark text-white-medium border-primary-darker focus:ring-2 focus:ring-primary-light focus:outline-none"
                placeholder="Enter the channel ID"
                {...register("channelName")}
                disabled={disableForm}
                data-testid="video-search-channel-name-input"
              />
            </div>

            {/* Search Result Sort Dropdown */}
            <div className="mb-6" data-testid="video-search-sort-order">
              <label className="block mb-2 font-medium text-l text-white-medium">
                Sort By
              </label>
              <select
                {...register("sortOrder")}
                className="w-full p-3 border rounded-lg text-white-medium bg-white-dark border-primary-darker focus:ring-2 focus:ring-primary-light focus:outline-none"
                disabled={disableForm}
                data-testid="video-search-sort-order-select"
              >
                {Object.values(VideoSearchSortOrder).map((order) => (
                  <option key={order} value={order} data-testid={`video-search-sort-order-option-${order}`}>
                    {order}
                  </option>
                ))}
              </select>
            </div>

            {/* Published After Date Picker */}
            <div className="mb-6" data-testid="video-search-published-after">
              <label className="block mb-2 font-medium text-l text-white-medium">
                Published After
              </label>
              <input
                type="date"
                className="w-full p-3 border rounded-lg bg-white-dark text-white-medium border-primary-darker focus:ring-2 focus:ring-primary-light focus:outline-none"
                {...register("publishedAfter")}
                disabled={disableForm}
                data-testid="video-search-published-after-input"
              />
            </div>

            {/* Published Before Date Picker */}
            <div className="mb-6" data-testid="video-search-published-before">
              <label className="block mb-2 font-medium text-l text-white-medium">
                Published Before
              </label>
              <input
                type="date"
                className="w-full p-3 border rounded-lg bg-white-dark text-white-medium border-primary-darker focus:ring-2 focus:ring-primary-light focus:outline-none"
                {...register("publishedBefore")}
                disabled={disableForm}
                data-testid="video-search-published-before-input"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoSearchSubForm;
