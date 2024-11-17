import { APIQuote, Video, VideoTranscriptResult,  } from "./types/video";

type SearchVideosParams = {
    query: string;
    terms: string;
    order?: string;
    publishedBefore?: string;
    publishedAfter?: string;
    maxResults?: number;
};

export const searchVideos = async ({
    query, 
    terms, 
    order = "relevance", 
    publishedBefore, 
    publishedAfter, 
    maxResults = 10
}: SearchVideosParams): Promise<VideoTranscriptResult[]> => {

    // Add search terms
    const params = new URLSearchParams();
    params.append("query", query);
    params.append("terms", terms.split(',').map(term => term.trim()).join(','));
    params.append("order", order);
    params.append("max_results", maxResults.toString());

    // Add before/after limits if specified
    if (publishedBefore) 
        params.append("published_before", publishedBefore);
    if (publishedAfter) 
        params.append("published_after", publishedAfter);

    // Fetch results
    const response = await fetch(`/api/searchtrans?${params.toString()}`);

    if (!response.ok) {
        throw new Error("Error fetching videos");
    }

    const results: VideoTranscriptResult[] = await response.json();

    return results;
};
