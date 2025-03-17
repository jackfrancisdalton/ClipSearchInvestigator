import { ApiErrorResponse, VideoTranscriptResult } from "../types";

// TODO: move to shared value
const API_BASE = '/api/'

type TranscriptSearchParams = {
    videoSearchQuery: string;
    matchTerms: { value: string }[];
    sortOrder?: string;
    publishedBefore?: string;
    publishedAfter?: string;
    channelName?: string;
    maxResults?: number;
};

export const searchForTermsInTranscripts = async ({
    videoSearchQuery, 
    matchTerms, 
    sortOrder = "relevance", 
    publishedBefore, 
    publishedAfter,
    channelName, 
    maxResults = 10
}: TranscriptSearchParams): Promise<VideoTranscriptResult[]> => {

    const params = new URLSearchParams();

    params.append("videoSearchQuery", videoSearchQuery);
    matchTerms.forEach((termObj) => params.append("matchTerms", termObj.value));
    params.append("sortOrder", sortOrder);
    params.append("maxResults", maxResults.toString());

    if (publishedBefore) 
        params.append("publishedBefore", publishedBefore);
    if (publishedAfter) 
        params.append("publishedAfter", publishedAfter);
    if (channelName) 
        params.append("channelName", channelName);


    const response = await fetch(`${API_BASE}search-transcripts?${params.toString()}`);

    if (!response.ok) {
        const errorData: ApiErrorResponse = await response.json();
        throw new Error(errorData.detail);
    }

    const results: any = await response.json()
    return results.results;
};