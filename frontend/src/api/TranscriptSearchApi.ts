import { TranscriptSearchResult } from "../types";
import { apiRequest } from "./ApiUtilities";

type TranscriptSearchApiParams = {
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
}: TranscriptSearchApiParams): Promise<TranscriptSearchResult[]> => {

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

    return apiRequest(
        `/api/search-transcripts?${params.toString()}`, 
        { method: 'GET' }
    );
};