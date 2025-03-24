import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { SearchFormData } from "./SearchForm.js";
import { VideoSearchSortOrder } from "../../types/index.js";

interface VideoSearchSubFormProps {
  disableForm: boolean;
}

const VideoSearchSubForm: React.FC<VideoSearchSubFormProps> = ({ disableForm }) => {
  const { register, formState: { errors } } = useFormContext<SearchFormData>();
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="border border-primary-600">
      <div className="items-center justify-start p-2 bg-background-600">
        <h3 className="font-bold text-center text-white-50">Video Search</h3>
      </div>
      <div className="w-auto h-0.5 bg-primary-600"></div>
      <div className="p-3 bg-background-500">
        {/* Search Query */}
        <div className="mb-6">
          <label className="block mb-2 font-medium text-l text-white-100">
            Search for videos you want to scan
          </label>
          <input
            type="text"
            className={`w-full p-3 border rounded-lg bg-white-700 text-white-100 focus:ring-2 focus:ring-primary-500 focus:outline-none ${
              errors.videoSearchQuery ? "border-red-500" : "border-primary-800"
            }`}
            placeholder="Enter your search query"
            {...register("videoSearchQuery")}
            disabled={disableForm}
          />
          {errors.videoSearchQuery && (
            <p className="mt-1 text-sm text-red-500">
              {errors.videoSearchQuery.message}
            </p>
          )}
        </div>

        {/* Slider for Number of Videos */}
        <div className="mb-6">
          <label className="block mb-2 font-medium text-l text-white-100">
            Number of Search Results to Scan:
          </label>
          <input
            type="range"
            min="1"
            max="50"
            {...register("maxResults", { valueAsNumber: true })}
            className="w-full bg-primary-100 accent-primary-500"
            disabled={disableForm}
          />
        </div>

        {/* Show More Toggle */}
        <div className="mb-4">
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
              <label className="block mb-2 font-medium text-l text-white-100">
                Channel Name
              </label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg bg-white-700 text-white-100 border-primary-800 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                placeholder="Enter the channel ID"
                {...register("channelName")}
                disabled={disableForm}
              />
            </div>

            {/* Search Result Sort Dropdown */}
            <div className="mb-6">
              <label className="block mb-2 font-medium text-l text-white-100">
                Sort By
              </label>
              <select
                {...register("sortOrder")}
                className="w-full p-3 border rounded-lg text-white-100 bg-white-700 border-primary-800 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                disabled={disableForm}
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
              <label className="block mb-2 font-medium text-l text-white-100">
                Published After
              </label>
              <input
                type="date"
                className="w-full p-3 border rounded-lg bg-white-700 text-white-100 border-primary-800 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                {...register("publishedAfter")}
                disabled={disableForm}
              />
            </div>

            {/* Published Before Date Picker */}
            <div className="mb-6">
              <label className="block mb-2 font-medium text-l text-white-100">
                Published Before
              </label>
              <input
                type="date"
                className="w-full p-3 border rounded-lg bg-white-700 text-white-100 border-primary-800 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                {...register("publishedBefore")}
                disabled={disableForm}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoSearchSubForm;
