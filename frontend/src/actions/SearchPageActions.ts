import { TranscriptFilterState, TranscriptSearchResult, VideoSearchState } from "../types";

// actionTypes.ts
export enum SearchPageActionTypes {
    TOGGLE_SIDEBAR = "TOGGLE_SIDEBAR",
    SET_LOADING = "SET_LOADING",
    SET_HAS_SEARCHED = "SET_HAS_SEARCHED",
    SET_ERROR = "SET_ERROR",
    SET_RESULTS = "SET_RESULTS",
    UPDATE_VIDEO_SEARCH_STATE = "UPDATE_VIDEO_SEARCH_STATE",
    UPDATE_TRANSCRIPT_FILTER_STATE = "UPDATE_TRANSCRIPT_FILTER_STATE",
}


// Define the union type for all actions
export type SearchPageAction =
  | { type: SearchPageActionTypes.TOGGLE_SIDEBAR }
  | { type: SearchPageActionTypes.SET_LOADING; payload: boolean }
  | { type: SearchPageActionTypes.SET_HAS_SEARCHED; }
  | { type: SearchPageActionTypes.SET_ERROR; payload: string | null }
  | { type: SearchPageActionTypes.SET_RESULTS; payload: TranscriptSearchResult[] }
  | { type: SearchPageActionTypes.UPDATE_VIDEO_SEARCH_STATE; payload: Partial<VideoSearchState> }
  | { type: SearchPageActionTypes.UPDATE_TRANSCRIPT_FILTER_STATE; payload: Partial<TranscriptFilterState> };
