import { ActionResultResponse, ApiErrorResponse, isAppConfiguredResponse, SetAPIKeyRequest, VideoTranscriptResult } from "./types";

const API_BASE = '/api/'

type TranscriptSearchParams = {
    videoSearchQuery: string;
    matchTerms: string[];
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
    matchTerms.forEach((term) => params.append("matchTerms", term));
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


export const isApiKeySet = async (): Promise<isAppConfiguredResponse> => {
    const response = await fetch(
        `${API_BASE}is_app_configured`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json'},
        }
    );

    if (!response.ok) {
        throw new Error('Failed to check if API key is set');
    }

    return await response.json();
}

export const saveApiKey = async (body: SetAPIKeyRequest): Promise<ActionResultResponse> => {
    const response = await fetch(
        `${API_BASE}store_api_key`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        }
    );

    if (!response.ok) {
        throw new Error('Failed to store API key');
    }

    return await response.json();
}

export const deleteAllApiKeys = async (): Promise<ActionResultResponse> => {
    const response = await fetch(
        `${API_BASE}delete_all_api_keys`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        }
    );

    if (!response.ok) {
        throw new Error('Failed to delete all API keys');
    }

    return response.json();
}