import { FormErrors, TranscriptFilterState, VideoSearchState } from "../../types";
import TranscriptFilterForm from "./TranscriptFilterForm";
import VideoSearchSubForm from "./VideoSearchSubForm";

interface SearchFormProps {
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    videoSearchState: VideoSearchState; // Assuming VideoSearchState is defined in the project
    transcriptFilterState: TranscriptFilterState; // Assuming TranscriptFilterState is defined in the project
    loading: boolean;
    updateVideoSearchState: (state: Partial<VideoSearchState>) => void;
    updateTranscriptFilterState: (state: Partial<TranscriptFilterState>) => void;
    formErrors: FormErrors;
}

const SearchForm: React.FC<SearchFormProps> = ({ 
  handleSubmit, 
  videoSearchState, 
  transcriptFilterState, 
  loading, 
  updateVideoSearchState, 
  updateTranscriptFilterState,
  formErrors
}) => {
    return (
      <div className="p-4 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <VideoSearchSubForm
            videoSearchState={videoSearchState}
            setVideoSearchState={updateVideoSearchState}
            disableForm={loading}
            formErrors={formErrors.videoSearch}
          />
          <TranscriptFilterForm
            transcriptFilterState={transcriptFilterState}
            setTranscriptFilterState={updateTranscriptFilterState}
            disableForm={loading}
            formErrors={formErrors.transcriptFilter}
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
      </div>
    );
  };
  
  export default SearchForm;