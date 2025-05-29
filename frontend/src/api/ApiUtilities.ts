// In an effort to standardize API calls, we have this utility function to handle common cases needed in most requests such as: 
// - error handling 
// - response parsing.
export const apiRequest = async <T>(url: string, options: RequestInit): Promise<T> => {
    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Unknown API error");
        }

        return await response.json();
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Network error");
    }
};