import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    saveApiKey,
    getAllKeys,
    deleteApiKey,
    deleteAllApiKeys,
    activateApiKey
} from '../../src/api/YoutubeApiKeyApi';
import { apiRequest } from '../../src/api/ApiUtilities';
import { ApiActionResultResponse, ApiKey, SetApiKeyRequest } from '../../src/types/index.js';

vi.mock('../../src/api/ApiUtilities');

describe('YoutubeApiKeyApi', () => {
    const mockedApiRequest = vi.mocked(apiRequest);
    const API_BASE = '/api/youtube-api-keys';
    const headers = { 'Content-Type': 'application/json' };

    beforeEach(() => {
        mockedApiRequest.mockReset();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('saveApiKey', () => {
        it('should call apiRequest with correct POST request and body', async () => {
            // ARRANGE
            const body: SetApiKeyRequest = { apiKey: 'test-key' };
            const response: ApiActionResultResponse = { success: true, message: 'Key saved' };
            mockedApiRequest.mockResolvedValue(response);

            // ACT
            const result = await saveApiKey(body);

            // ASSERT
            expect(mockedApiRequest).toHaveBeenCalledWith(`${API_BASE}`, {
                method: 'POST',
                headers,
                body: JSON.stringify(body),
            });
            expect(result).toEqual(response);
        });
    });

    describe('getAllKeys', () => {
        it('should call apiRequest with GET method and return keys', async () => {
            // ARRANGE
            const response: ApiKey[] = [
                { id: 1, apiKey: 'active-key', isActive: true },
                { id: 2, apiKey: 'not-active-key', isActive: false }

            ];
            mockedApiRequest.mockResolvedValue(response);

            // ACT
            const result = await getAllKeys();

            // ASSERT
            expect(mockedApiRequest).toHaveBeenCalledWith(`${API_BASE}`, {
                method: 'GET',
                headers,
            });
            expect(result).toEqual(response);
        });

        it('should include optional fetch options if provided', async () => {
            // ARRANGE
            const controller = new AbortController();
            const response: ApiKey[] = [{ id: 2, apiKey: 'another-key', isActive: false }];
            mockedApiRequest.mockResolvedValue(response);

            // ACT
            const result = await getAllKeys({ signal: controller.signal });

            // ASSERT
            expect(mockedApiRequest).toHaveBeenCalledWith(`${API_BASE}`, {
                method: 'GET',
                headers,
                signal: controller.signal,
            });
            expect(result).toEqual(response);
        });
    });

    describe('deleteApiKey', () => {
        it('should call apiRequest with DELETE method and key ID', async () => {
            // ARRANGE
            const keyId = 1;
            const response: ApiActionResultResponse = { success: true, message: 'Key deleted' };
            mockedApiRequest.mockResolvedValue(response);

            // ACT
            const result = await deleteApiKey(keyId);

            // ASSERT
            expect(mockedApiRequest).toHaveBeenCalledWith(`${API_BASE}/${keyId}`, {
                method: 'DELETE',
                headers,
            });
            expect(result).toEqual(response);
        });
    });

    describe('deleteAllApiKeys', () => {
        it('should call apiRequest with DELETE method to delete all keys', async () => {
            // ARRANGE
            const response: ApiActionResultResponse = { success: true, message: 'All keys deleted' };
            mockedApiRequest.mockResolvedValue(response);

            // ACT
            const result = await deleteAllApiKeys();

            // ASSERT
            expect(mockedApiRequest).toHaveBeenCalledWith(`${API_BASE}/delete_all_api_keys`, {
                method: 'DELETE',
                headers,
            });
            expect(result).toEqual(response);
        });
    });

    describe('activateApiKey', () => {
        it('should call apiRequest with PATCH method to activate a key', async () => {
            // ARRANGE
            const keyId = 1;
            const response: ApiActionResultResponse = { success: true, message: 'Key activated' };
            mockedApiRequest.mockResolvedValue(response);

            // ACT
            const result = await activateApiKey(keyId);

            // ASSERT
            expect(mockedApiRequest).toHaveBeenCalledWith(`${API_BASE}/${keyId}/activate`, {
                method: 'PATCH',
                headers,
            });
            expect(result).toEqual(response);
        });
    });
});
