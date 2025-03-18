export interface Video {
    id: string;
    title: string;
    description: string;
    publishedAt: string;
    // TODO add video thumbnail URL
}

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