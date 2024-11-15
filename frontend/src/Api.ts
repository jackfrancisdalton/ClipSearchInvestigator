// // src/api.js
export const searchVideos = async (
    query: string, 
    terms: string, 
    order: string = "relevance", 
    published_before: string,
    published_after: string,
    maxResults: number = 10
) => {
    const params = new URLSearchParams();

    params.append("query", query);
    params.append("terms", terms.split(',').map(term => term.trim()).join(','));
    params.append("order", order);
    params.append("max_results", maxResults.toString());

    if (published_before) 
        params.append("published_before", published_before);
    if (published_after) 
        params.append("published_after", published_after);

    const response = await fetch(`/api/searchtrans?${params.toString()}`);
    if (!response.ok) {
        throw new Error("Error fetching videos");
    }
    return response.json();
};

// export const searchTranscripts = async (videos, searchTerms) => {
//     const response = await fetch(`/api/transcripts`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ videos, search_terms: searchTerms }),
//     });
//     if (!response.ok) {
//         throw new Error("Error searching transcripts");
//     }
//     return response.json();
// };

