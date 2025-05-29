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