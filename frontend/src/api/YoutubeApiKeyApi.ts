import { ApiActionResultResponse, ApiKey, AppConfigurationResponse, SetApiKeyRequest } from "../types";

const API_BASE = '/api/youtube-api-keys'

export const isAppConfigured = async (): Promise<AppConfigurationResponse> => {
    // TODO: move this out of the api keys file as well as in python backend and into it's own folders
    const response = await fetch(
        `${API_BASE}/configured`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json'},
        }
    );

    if (!response.ok) {
        throw new Error('Failed to check if API key is set');
    }

    return await response.json();
}

export const saveApiKey = async (body: SetApiKeyRequest): Promise<ApiActionResultResponse> => {
    const response = await fetch(
        `${API_BASE}`, {
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

export const getAllKeys = async (): Promise<ApiKey[]> => {
    const response = await fetch(
        `${API_BASE}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        }
    );

    if (!response.ok) {
        throw new Error('Failed to get all keys');
    }

    return response.json();
}

export const deleteApiKey = async (keyId: number): Promise<ApiActionResultResponse> => {
    const response = await fetch(
        `${API_BASE}/${keyId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        }
    );

    if (!response.ok) {
        throw new Error('Failed to delete API key');
    }

    return response.json();
}

export const deleteAllApiKeys = async (): Promise<ApiActionResultResponse> => {
    const response = await fetch(
        `${API_BASE}/delete_all_api_keys`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        }
    );

    if (!response.ok) {
        throw new Error('Failed to delete all API keys');
    }

    return response.json();
}

export const activateApiKey = async (keyId: number): Promise<ApiActionResultResponse> => {
    const response = await fetch(
        `${API_BASE}/${keyId}/activate`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
        }
    );

    if (!response.ok) {
        throw new Error('Failed to activate API key');
    }

    return response.json();
}
