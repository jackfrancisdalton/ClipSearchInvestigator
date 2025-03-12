import { ActionResultResponse, isAppConfiguredResponse, SetAPIKeyRequest } from "./types/ApiResponseTypes";
import { VideoTranscriptResult,  } from "./types/video";

const API_BASE = '/api/'

type SearchVideosParams = {
    searchQuery: string;
    searchTerms: string[];
    order?: string;
    publishedBefore?: string;
    publishedAfter?: string;
    channelName?: string;
    numVideos?: number;
};

export const searchVideos = async ({
    searchQuery, 
    searchTerms: terms, 
    order = "relevance", 
    publishedBefore, 
    publishedAfter,
    channelName, 
    numVideos: maxResults = 10
}: SearchVideosParams): Promise<VideoTranscriptResult[]> => {

    const params = new URLSearchParams();

    params.append("query", searchQuery);
    terms.forEach((term) => params.append("terms", term));
    params.append("order", order);
    params.append("maxResults", maxResults.toString());

    if (publishedBefore) params.append("publishedBefore", publishedBefore);
    if (publishedAfter) params.append("publishedAfter", publishedAfter);
    if (channelName) params.append("channelName", channelName);

    const response = await fetch(`${API_BASE}searchtrans?${params.toString()}`);

    if (!response.ok) {
        throw new Error("Error fetching videos");
    }

    const results: any = await response.json();

    if (results.error) {
        throw new Error(results.error);
    }

    const transformedResults = results.results.map((result: VideoTranscriptResult) => ({
        videoTitle: result.videoTitle,
        description: result.description,
        channelTitle: result.channelTitle,
        publishedAt: result.publishedAt,
        thumbnailUrl: result.thumbnailUrl,
        matches: result.matches.map((match: any) => ({
            text: match.text,
            startTime: new Date(match.startTime * 1000).toISOString().substr(11, 8),
            link: match.link,
        })),
    }));

    return transformedResults;
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