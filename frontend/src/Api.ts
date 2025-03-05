import { AppConfigResponse, SetAPIKeyRequest } from "./types/ApiResponseTypes";
import { VideoTranscriptResult,  } from "./types/video";

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
    params.append("max_results", maxResults.toString());

    if (publishedBefore) params.append("published_before", publishedBefore);
    if (publishedAfter) params.append("published_after", publishedAfter);
    if (channelName) params.append("channel_name", channelName);

    const response = await fetch(`/api/searchtrans?${params.toString()}`);

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


export const isApiKeySet = async (): Promise<AppConfigResponse> => {
    const response = await fetch('/api/is_api_key_set', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to check if API key is set');
    }

    return await response.json();
}

export const setAndStoreApiKey = async ({ apiKey }: SetAPIKeyRequest) => {
    const response = await fetch('/api/store_api_key', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ google_api_key: apiKey }),
    });

    if (!response.ok) {
        throw new Error('Failed to store API key');
    }

    return await response.json();
}