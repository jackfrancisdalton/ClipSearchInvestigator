// TODO: rename this file to transcript search
export interface TranscriptMatch {
    text: string;
    startTime: number;
    link: string;
}

export type TranscriptSearchResult = {
    videoTitle: string;
    description: string;
    channelTitle: string;
    publishedAt: string;
    thumbnailUrl: string;
    matches: TranscriptMatch[];
}