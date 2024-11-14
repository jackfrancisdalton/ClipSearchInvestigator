// // src/api.js
export const searchVideos = async (query: string, terms: string, maxResults: number = 10) => {

    const termsParam = terms.split(',').map(term => term.trim()).join(',');
    const response = await fetch(`/api/searchtrans?query=${query}&terms=${termsParam}&max_results=${maxResults}`);
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

