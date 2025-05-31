import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiRequest } from '../../src/api/ApiUtilities';

describe('ApiUtilities', () => {

    // ------------------------------
    // Setup and Teardown
    // ------------------------------

    const mockUrl = 'https://api.example.com/data';
    const mockOptions: RequestInit = { method: 'GET' };

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

    it('should return data when the response is successful', async () => {
        // ARRANGE
        const mockData = { key: 'value' };
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue(mockData),
        }) as any;

        // ACT
        const result = await apiRequest<typeof mockData>(mockUrl, mockOptions);

        // ASSERT
        expect(result).toEqual(mockData);
    });

    it.each([
        [{ detail: 'Specific error' }, 'Specific error'],
        [{}, 'Unknown API error'],
    ])
    ('should throw an error with appropriate message when response is not ok (response: %j)',
        async (mockErrorData, expectedMessage) => {
            // ARRANGE
            global.fetch = vi.fn().mockResolvedValue({
                ok: false,
                json: vi.fn().mockResolvedValue(mockErrorData),
            }) as any;

            // ACT & ASSERT
            await expect(apiRequest(mockUrl, mockOptions)).rejects.toThrow(expectedMessage);
        }
    );

    it('should throw a network error when fetch fails with an Error', async () => {
        // ARRANGE
        global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

        // ACT & ASSERT
        await expect(apiRequest(mockUrl, mockOptions)).rejects.toThrow('Network error');
    });

    it('should throw a network error when fetch fails with non-Error type', async () => {
        // ARRANGE
        global.fetch = vi.fn().mockRejectedValue('something unexpected');

        // ACT & ASSERT
        await expect(apiRequest(mockUrl, mockOptions)).rejects.toThrow('Network error');
    });

    it('should throw an error when response.json() throws on success response', async () => {
        // ARRANGE
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: vi.fn().mockRejectedValue(new Error('Bad JSON')),
        }) as any;

        // ACT & ASSERT
        await expect(apiRequest(mockUrl, mockOptions)).rejects.toThrow('Bad JSON');
    });

    it('should throw an error when response.json() throws on error response', async () => {
        // ARRANGE
        global.fetch = vi.fn().mockResolvedValue({
            ok: false,
            json: vi.fn().mockRejectedValue(new Error('Broken error JSON')),
        }) as any;

        // ACT & ASSERT
        await expect(apiRequest(mockUrl, mockOptions)).rejects.toThrow('Broken error JSON');
    });
});
