import { describe, it, expect, vi } from 'vitest';
import { apiRequest } from '../../src/api/ApiUtilities';

describe('apiRequest', () => {
    const mockUrl = 'https://api.example.com/data';
    const mockOptions: RequestInit = { method: 'GET' };

    it('should return data when the response is successful', async () => {
        const mockData = { key: 'value' };
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue(mockData),
        });

        const result = await apiRequest<typeof mockData>(mockUrl, mockOptions);
        expect(result).toEqual(mockData);
    });

    it('should throw an error when the response is not ok', async () => {
        const mockErrorData = { detail: 'Error message' };
        global.fetch = vi.fn().mockResolvedValue({
            ok: false,
            json: vi.fn().mockResolvedValue(mockErrorData),
        });

        await expect(apiRequest(mockUrl, mockOptions)).rejects.toThrow('Error message');
    });

    it('should throw an error with default message when the response is not ok and no detail is provided', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: false,
            json: vi.fn().mockResolvedValue({}),
        });

        await expect(apiRequest(mockUrl, mockOptions)).rejects.toThrow('Unknown API error');
    });

    it('should throw a network error when fetch fails', async () => {
        global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

        await expect(apiRequest(mockUrl, mockOptions)).rejects.toThrow('Network error');
    });
});