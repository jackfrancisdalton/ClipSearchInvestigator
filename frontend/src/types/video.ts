export type Video = {
    id: string;
    title: string;
    description: string;
    publishedAt: string;
};
  
export type Match = { 
    text: string; 
    startTime: number, 
    link: string 
  };
  
export type VideoTranscriptResult = { 
    videoTitle: string; 
    description: string;
    channelTitle: string;
    publishedAt: string;
    thumbnailUrl: string;
    matches: Match[] 
}

export interface SearchState {
    videoSearchQuery: string;
    maxResults: number;
    matchTerms: string[];
    sortOrder: string;
    publishedAfter: string;
    publishedBefore: string;
    channelName: string;
}
export enum VideoSearchSortOrder {
    Relevance = "relevance",
    Date = "date",
    ViewCount = "viewCount",
    Rating = "rating"
}

export interface VideoSearchState {
    videoSearchQuery: string;
    maxResults: number;
    sortOrder: VideoSearchSortOrder;
    publishedAfter: string;
    publishedBefore: string;
    channelName: string;
}

export interface TranscriptFilterState {
    matchTerms: string[];
}