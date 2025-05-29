import { describe, it, expect, vi } from 'vitest';
import { fetchAppConfigState } from '../../src/api/GeneralApi';
import { AppConfigurationResponse } from '../../src/types/index.js';

describe('fetchAppConfigState', () => {
    it('should fetch app configuration state successfully', async () => {
        const mockResponse: AppConfigurationResponse = { isApiKeySet: true };
        global.fetch = vi.fn(() => Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockResponse),
        })
        ) as unknown as jest.Mock;

        const result = await fetchAppConfigState();
        expect(result).toEqual(mockResponse);
        expect(global.fetch).toHaveBeenCalledWith('/api/general/app_config_state', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
    });

    it('should throw an error if the fetch fails', async () => {
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: false,
            })
        ) as unknown as jest.Mock;

        await expect(fetchAppConfigState()).rejects.toThrow('Failed to fetch App configuration state, check the API is running');
        expect(global.fetch).toHaveBeenCalledWith('/api/general/app_config_state', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
    });
});