import { describe, it, expect, vi, Mock } from 'vitest';
import { saveApiKey, getAllKeys, deleteApiKey, deleteAllApiKeys, activateApiKey } from '../../src/api/YoutubeApiKeyApi';
import { apiRequest } from '../../src/api/ApiUtilities';
import { ApiActionResultResponse, ApiKey, SetApiKeyRequest } from '../../src/types';

vi.mock('../../src/api/ApiUtilities');

describe('YoutubeApiKeyApi', () => {
    const mockApiRequest = apiRequest as Mock;

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('saveApiKey', () => {
        it('should call apiRequest with correct parameters', async () => {
            const body: SetApiKeyRequest = { apiKey: 'test-key' };
            const response: ApiActionResultResponse = { success: true, message: 'Key saved' };
            mockApiRequest.mockResolvedValue(response);

            const result = await saveApiKey(body);

            expect(mockApiRequest).toHaveBeenCalledWith('/api/youtube-api-keys', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            expect(result).toEqual(response);
        });
    });

    describe('getAllKeys', () => {
        it('should call apiRequest with correct parameters', async () => {
            const response: ApiKey[] = [{ id: 1, apiKey: 'test-key', active: true }];
            mockApiRequest.mockResolvedValue(response);

            const result = await getAllKeys();

            expect(mockApiRequest).toHaveBeenCalledWith('/api/youtube-api-keys', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            expect(result).toEqual(response);
        });
    });

    describe('deleteApiKey', () => {
        it('should call apiRequest with correct parameters', async () => {
            const keyId = 1;
            const response: ApiActionResultResponse = { success: true, message: 'Key deleted' };
            mockApiRequest.mockResolvedValue(response);

            const result = await deleteApiKey(keyId);

            expect(mockApiRequest).toHaveBeenCalledWith(`/api/youtube-api-keys/${keyId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
            expect(result).toEqual(response);
        });
    });

    describe('deleteAllApiKeys', () => {
        it('should call apiRequest with correct parameters', async () => {
            const response: ApiActionResultResponse = { success: true, message: 'All keys deleted' };
            mockApiRequest.mockResolvedValue(response);

            const result = await deleteAllApiKeys();

            expect(mockApiRequest).toHaveBeenCalledWith('/api/youtube-api-keys/delete_all_api_keys', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
            expect(result).toEqual(response);
        });
    });

    describe('activateApiKey', () => {
        it('should call apiRequest with correct parameters', async () => {
            const keyId = 1;
            const response: ApiActionResultResponse = { success: true, message: 'Key activated' };
            mockApiRequest.mockResolvedValue(response);

            const result = await activateApiKey(keyId);

            expect(mockApiRequest).toHaveBeenCalledWith(`/api/youtube-api-keys/${keyId}/activate`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
            });
            expect(result).toEqual(response);
        });
    });
});