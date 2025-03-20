import { AppConfigurationResponse } from "../types";

const API_BASE = '/api/general'

export const fetchAppConfigState = async (): Promise<AppConfigurationResponse> => {
    const response = await fetch(
        `${API_BASE}/app_config_state`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json'},
        }
    );

    if (!response.ok) {
        throw new Error('Failed to check if API key is set');
    }

    return await response.json();
}