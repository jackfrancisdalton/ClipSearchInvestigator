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
    <div className="overflow-hidden border rounded-md border-primary-medium">
      <div className="items-center justify-start p-2 bg-background-medium">
        <h3 className="font-bold text-center text-white">Video Search</h3>
      </div>
      <div className="w-auto h-0.5 bg-primary-medium"></div>
      <div className="p-3 bg-background-light">

        {/* Search Query */}
        <div className="mb-6">
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
          />
          {errors.videoSearchQuery && (
            <p className="mt-1 text-sm text-red-500">
              {errors.videoSearchQuery.message}
            </p>
          )}
        </div>

        {/* Slider for Number of Videos */}
        <div className="mb-6">
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
          />
        </div>

        {/* Show More Toggle */}
        <div className="mb-4">
          <button
            type="button"
            className="text-primary-light"
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? "Show Less" : "Show More"}
          </button>
        </div>

        {showMore && (
          <>
            {/* Channel Name Input */}
            <div className="mb-6">
              <label className="block mb-2 font-medium text-l text-white-medium">
                Channel Name
              </label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg bg-white-dark text-white-medium border-primary-darker focus:ring-2 focus:ring-primary-light focus:outline-none"
                placeholder="Enter the channel ID"
                {...register("channelName")}
                disabled={disableForm}
              />
            </div>

            {/* Search Result Sort Dropdown */}
            <div className="mb-6">
              <label className="block mb-2 font-medium text-l text-white-medium">
                Sort By
              </label>
              <select
                {...register("sortOrder")}
                className="w-full p-3 border rounded-lg text-white-medium bg-white-dark border-primary-darker focus:ring-2 focus:ring-primary-light focus:outline-none"
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
              <label className="block mb-2 font-medium text-l text-white-medium">
                Published After
              </label>
              <input
                type="date"
                className="w-full p-3 border rounded-lg bg-white-dark text-white-medium border-primary-darker focus:ring-2 focus:ring-primary-light focus:outline-none"
                {...register("publishedAfter")}
                disabled={disableForm}
              />
            </div>

            {/* Published Before Date Picker */}
            <div className="mb-6">
              <label className="block mb-2 font-medium text-l text-white-medium">
                Published Before
              </label>
              <input
                type="date"
                className="w-full p-3 border rounded-lg bg-white-dark text-white-medium border-primary-darker focus:ring-2 focus:ring-primary-light focus:outline-none"
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
