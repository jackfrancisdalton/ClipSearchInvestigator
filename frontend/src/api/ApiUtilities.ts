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