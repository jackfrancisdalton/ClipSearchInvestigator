import { ActionResultResponse, isAppConfiguredResponse, SetAPIKeyRequest } from "../types";

const API_BASE = '/api/'

export const isAppConfigured = async (): Promise<isAppConfiguredResponse> => {
    const response = await fetch(
        `${API_BASE}is_app_configured`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json'},
        }
    );

    if (!response.ok) {
        throw new Error('Failed to check if API key is set');
    }

    return await response.json();
}

export const saveApiKey = async (body: SetAPIKeyRequest): Promise<ActionResultResponse> => {
    const response = await fetch(
        `${API_BASE}store_api_key`, {
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

export const deleteAllApiKeys = async (): Promise<ActionResultResponse> => {
    const response = await fetch(
        `${API_BASE}delete_all_api_keys`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        }
    );

    if (!response.ok) {
        throw new Error('Failed to delete all API keys');
    }

    return response.json();
}