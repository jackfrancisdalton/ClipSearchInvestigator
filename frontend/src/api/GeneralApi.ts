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
        throw new Error('Failed to fetch App configuration state, check the API is running');
    }

    return await response.json();
}