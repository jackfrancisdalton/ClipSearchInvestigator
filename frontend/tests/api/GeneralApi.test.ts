import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchAppConfigState } from '../../src/api/GeneralApi';
import { AppConfigurationResponse } from '../../src/types/index.js';

describe('fetchAppConfigState', () => {

    // ------------------------------
    // Setup and Teardown
    // ------------------------------

    const mockUrl = '/api/general/app_config_state';
    const mockHeaders = { 'Content-Type': 'application/json' };

    let originalFetch: typeof global.fetch;

    beforeEach(() => {
        originalFetch = global.fetch;
    });

    afterEach(() => {
        global.fetch = originalFetch;
        vi.restoreAllMocks();
    });


    // ------------------------------
    // Tests
    // ------------------------------

    it('should fetch app configuration state successfully', async () => {
        // ARRANGE
        const mockResponse: AppConfigurationResponse = { isApiKeySet: true };

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue(mockResponse),
        }) as any;

        // ACT
        const result = await fetchAppConfigState();

        // ASSERT
        expect(result).toEqual(mockResponse);
        expect(global.fetch).toHaveBeenCalledWith(mockUrl, {
            method: 'GET',
            headers: mockHeaders,
        });
    });

    it('should throw an error if response.ok is false', async () => {
        // ARRANGE
        global.fetch = vi.fn().mockResolvedValue({
            ok: false,
            json: vi.fn(),
        }) as any;

        // ACT & ASSERT
        await expect(fetchAppConfigState()).rejects.toThrow(
            'Failed to fetch App configuration state, check the API is running'
        );
        expect(global.fetch).toHaveBeenCalledWith(mockUrl, {
            method: 'GET',
            headers: mockHeaders,
        });
    });

    it('should throw an error if response.json throws unexpectedly', async () => {
        // ARRANGE
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
        }) as any;

        // ACT & ASSERT
        await expect(fetchAppConfigState()).rejects.toThrow('Invalid JSON');
        expect(global.fetch).toHaveBeenCalledWith(mockUrl, {
            method: 'GET',
            headers: mockHeaders,
        });
    });
});
