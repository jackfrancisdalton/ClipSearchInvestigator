// src/components/SearchPage.jsx
import { useReducer } from "react";
import SearchSidebarTwo from "../components/Layouts/SideBar";
import MasonryGridTwo from "../components/Layouts/MasonryGridLayout";
import SideBarTwoMobile from "../components/Layouts/SideBarMobile";
import { SearchResult } from "../components";
import { TranscriptFilterState, VideoSearchState, VideoTranscriptResult } from "../types";
import { searchForTermsInTranscripts } from "../api";
import { SearchPageActionTypes, SearchPageAction } from "../actions/SearchPageActions";
import SearchForm from "../components/Search/SearchForm";


interface SearchPageState {
  isMobileSidebarOpen: boolean;
  results: VideoTranscriptResult[];
  loading: boolean;
  error: string | null;
  videoSearchState: VideoSearchState;
  transcriptFilterState: TranscriptFilterState;
}

const initialState: SearchPageState = {
  isMobileSidebarOpen: false,
  results: [],
  loading: false,
  error: null,
  videoSearchState: {
    videoSearchQuery: "",
    maxResults: 10,
    sortOrder: "relevance", // TODO: add specific enum for sort types
    publishedAfter: "",
    publishedBefore: "",
    channelName: "",
  },
  transcriptFilterState: {
    matchTerms: [""],
  },
};

function reducer(state: SearchPageState, action: SearchPageAction) {
  switch (action.type) {
    case SearchPageActionTypes.TOGGLE_SIDEBAR:
      return { ...state, isMobileSidebarOpen: !state.isMobileSidebarOpen };
    case SearchPageActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    case SearchPageActionTypes.SET_ERROR:
      return { ...state, error: action.payload };
    case SearchPageActionTypes.SET_RESULTS:
      return { ...state, results: action.payload };
    case SearchPageActionTypes.UPDATE_VIDEO_SEARCH_STATE:
      return {
        ...state,
        videoSearchState: { ...state.videoSearchState, ...action.payload },
      };
    case SearchPageActionTypes.UPDATE_TRANSCRIPT_FILTER_STATE:
      return {
        ...state,
        transcriptFilterState: { ...state.transcriptFilterState, ...action.payload },
      };
    default:
      return state;
  }
}

const SearchPage = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    isMobileSidebarOpen,
    results,
    loading,
    error,
    videoSearchState,
    transcriptFilterState,
  } = state;

  const fetchVideoResults = async () => {
    const { videoSearchQuery, sortOrder, publishedBefore, publishedAfter, maxResults, channelName } = videoSearchState;
    const { matchTerms } = transcriptFilterState;


    if (!videoSearchQuery || matchTerms.length === 0) {
      alert('Please fill out both the search query and search terms.');
      return;
    }

    dispatch({ type: SearchPageActionTypes.SET_ERROR, payload: null });
    dispatch({ type: SearchPageActionTypes.SET_LOADING, payload: true });

    try {
      const result = await searchForTermsInTranscripts({
        videoSearchQuery,
        matchTerms,
        sortOrder,
        publishedBefore,
        publishedAfter,
        maxResults,
        channelName
      });
      
      dispatch({ type: SearchPageActionTypes.SET_RESULTS, payload: result });
    } catch (error: Error | any) {
      dispatch({ type: SearchPageActionTypes.SET_ERROR, payload: error.message });
      dispatch({ type: SearchPageActionTypes.SET_RESULTS, payload: [] });
    } finally {
      dispatch({ type: SearchPageActionTypes.SET_LOADING, payload: false });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchVideoResults();
  };

  return (
    <div className="flex flex-col h-full overflow-hidden md:flex-row">
      <div className="hidden overflow-auto border-r-4 border-background-500 w-84 md:block bg-background-700">
        <SearchSidebarTwo>
          <SearchForm
              handleSubmit={handleSubmit}
              videoSearchState={videoSearchState}
              transcriptFilterState={transcriptFilterState}
              loading={loading}
              updateVideoSearchState={(stateUpdate) =>
                dispatch({ type: SearchPageActionTypes.UPDATE_VIDEO_SEARCH_STATE, payload: stateUpdate })
              }
              updateTranscriptFilterState={(stateUpdate) =>
                dispatch({ type: SearchPageActionTypes.UPDATE_TRANSCRIPT_FILTER_STATE, payload: stateUpdate })
              }
            />
        </SearchSidebarTwo>
      </div>
      

      {/* Main Results Area */}
      <div className="flex-1 p-4 overflow-auto bg-background-700">
        <MasonryGridTwo>
          {results.map((result, index) => (
            <SearchResult key={index} result={result} />
          ))}
        </MasonryGridTwo>
      </div>


      {/* Mobile: Sliding sidebar from bottom */}
      <SideBarTwoMobile
        isOpen={isMobileSidebarOpen}
        toggleSidebar={() => dispatch({ type: SearchPageActionTypes.TOGGLE_SIDEBAR })}
      >
        <div className="bg-background-700">
          <SearchSidebarTwo>
            <SearchForm
              handleSubmit={handleSubmit}
              videoSearchState={videoSearchState}
              transcriptFilterState={transcriptFilterState}
              loading={loading}
              updateVideoSearchState={(stateUpdate) =>
                dispatch({ type: SearchPageActionTypes.UPDATE_VIDEO_SEARCH_STATE, payload: stateUpdate })
              }
              updateTranscriptFilterState={(stateUpdate) =>
                dispatch({ type: SearchPageActionTypes.UPDATE_TRANSCRIPT_FILTER_STATE, payload: stateUpdate })
              }
            />
          </SearchSidebarTwo>
        </div>
      </SideBarTwoMobile>

      {/* Mobile: Toggle Button */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden">
        <button
          onClick={() => dispatch({ type: SearchPageActionTypes.TOGGLE_SIDEBAR })}  
          className="w-full p-3 text-center text-white bg-blue-600"
        >
          {isMobileSidebarOpen ? "Hide Filters" : "Show Filters"}
        </button>
      </div>
    </div>
  );
};

export default SearchPage;
