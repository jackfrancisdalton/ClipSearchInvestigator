import { VideoTranscriptResult,  } from "./types/video";

type SearchVideosParams = {
    query: string;
    terms: string[];
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

    const params = new URLSearchParams();

    params.append("query", query);
    terms.forEach((term) => params.append("terms", term));
    params.append("order", order);
    params.append("max_results", maxResults.toString());

    if (publishedBefore) 
        params.append("published_before", publishedBefore);
    if (publishedAfter) 
        params.append("published_after", publishedAfter);

    // Fetch results
    const response = await fetch(`/api/searchtrans?${params.toString()}`);

    if (!response.ok) {
        throw new Error("Error fetching videos");
    }

    const results: any = await response.json();

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
