import { ApiActionResultResponse, ApiKey, SetApiKeyRequest } from "../types/index.js";
import { apiRequest } from "./ApiUtilities.js";

const API_BASE = '/api/youtube-api-keys'

export const saveApiKey = async (body: SetApiKeyRequest): Promise<ApiActionResultResponse> => {
    return apiRequest<ApiActionResultResponse>(
        `${API_BASE}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        }
    );
}

export const getAllKeys = async (options?: { signal?: AbortSignal }): Promise<ApiKey[]> => {
    return apiRequest<ApiKey[]>(
        `${API_BASE}`,
        {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            ...options, 
        }
    );
};

export const deleteApiKey = async (keyId: number): Promise<ApiActionResultResponse> => {
    return apiRequest<ApiActionResultResponse>(
        `${API_BASE}/${keyId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        }
    );
}

export const deleteAllApiKeys = async (): Promise<ApiActionResultResponse> => {
    return apiRequest<ApiActionResultResponse>(
        `${API_BASE}/delete_all_api_keys`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        }
    );
}

export const activateApiKey = async (keyId: number): Promise<ApiActionResultResponse> => {
    return apiRequest<ApiActionResultResponse>(
        `${API_BASE}/${keyId}/activate`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
        }
    );
}