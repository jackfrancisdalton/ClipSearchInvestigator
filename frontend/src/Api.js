// src/api.js
export const searchVideos = async (query, maxResults = 10) => {
    const response = await fetch(`/api/search?query=${query}&maxResults=${maxResults}`);
    if (!response.ok) {
        throw new Error("Error fetching videos");
    }
    return response.json();
};

export const searchTranscripts = async (videos, searchTerms) => {
    const response = await fetch(`/api/transcripts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ videos, search_terms: searchTerms }),
    });
    if (!response.ok) {
        throw new Error("Error searching transcripts");
    }
    return response.json();
};