export type Video = {
    id: string;
    title: string;
    description: string;
    publishedAt: string;
};
  
export type Match = { 
    text: string; 
    startTime: string, 
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
    searchQuery: string;
    numVideos: number;
    searchTerms: string[];
    order: string;
    publishedAfter: string;
    publishedBefore: string;
}