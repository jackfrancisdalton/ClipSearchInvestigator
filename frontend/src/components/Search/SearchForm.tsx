import { TranscriptFilterState, VideoSearchState } from "../../types";
import TranscriptFilterForm from "./TranscriptFilterForm";
import VideoSearchSubForm from "./VideoSearchSubForm";

interface SearchFormProps {
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    videoSearchState: VideoSearchState; // Assuming VideoSearchState is defined in the project
    transcriptFilterState: TranscriptFilterState; // Assuming TranscriptFilterState is defined in the project
    loading: boolean;
    updateVideoSearchState: (state: Partial<VideoSearchState>) => void;
    updateTranscriptFilterState: (state: Partial<TranscriptFilterState>) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ handleSubmit, videoSearchState, transcriptFilterState, loading, updateVideoSearchState, updateTranscriptFilterState }) => {
    return (
      <form onSubmit={handleSubmit}>
        <VideoSearchSubForm
          videoSearchState={videoSearchState}
          setVideoSearchState={updateVideoSearchState}
          disableForm={loading}
        />
        <TranscriptFilterForm
          transcriptFilterState={transcriptFilterState}
          setTranscriptFilterState={updateTranscriptFilterState}
          disableForm={loading}
        />
        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-3 ${
              loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-300'
            } text-white font-semibold rounded-lg shadow-md w-full focus:outline-none focus:ring-2 focus:ring-primary-500`}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>
    );
  };
  
  export default SearchForm;