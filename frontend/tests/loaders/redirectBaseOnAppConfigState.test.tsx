import { describe, it, expect, vi, beforeEach } from 'vitest';
import { redirectBasedOnAppConfigState } from '../../src/loaders/redirectBasedOnAppConfigState';
import { fetchAppConfigState } from '../../src/api/index.js';
import { redirect } from 'react-router-dom';

vi.mock('../../src/api/index.js');
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal<typeof import('react-router-dom')>();
    return {
        ...actual,
        redirect: vi.fn()
    };
});

describe('redirectBasedOnAppConfigState', () => {
    const mockedFetchAppConfigState = vi.mocked(fetchAppConfigState);
    const mockedRedirect = vi.mocked(redirect);

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should redirect to /setup if API key is not set and current path is not /setup', async () => {
        // ARRANGE 
        mockedFetchAppConfigState.mockResolvedValue({ isApiKeySet: false });
        const request = new Request('https://localhost/some-other-page');
        const params = {};

        // ACT
        await redirectBasedOnAppConfigState({ request, params });

        // ASSERT
        expect(mockedRedirect).toHaveBeenCalledWith('/setup');
    });

    it('should redirect to /search if API key is set and current path is /setup', async () => {
        // ARRANGE
        mockedFetchAppConfigState.mockResolvedValue({ isApiKeySet: true });
        const request = new Request('https://localhost/setup');
        const params = {};

        // ACT
        await redirectBasedOnAppConfigState({ request, params });

        // ASSERT
        expect(mockedRedirect).toHaveBeenCalledWith('/search');
    });

    it('should return null if API key is set and path is not /setup', async () => {
        // ARRANGE
        mockedFetchAppConfigState.mockResolvedValue({ isApiKeySet: true });
        const request = new Request('https://localhost/search');
        const params = {};

        // ACT
        const result = await redirectBasedOnAppConfigState({ request, params });

        // ASSERT
        expect(result).toBeNull();
        expect(mockedRedirect).not.toHaveBeenCalled();
    });

    it('should return null if API key is not set and already on /setup', async () => {
        // ARRANGE
        mockedFetchAppConfigState.mockResolvedValue({ isApiKeySet: false });
        const request = new Request('https://localhost/setup');
        const params = {};

        // ACT
        const result = await redirectBasedOnAppConfigState({ request, params });

        // ASSERT
        expect(result).toBeNull();
        expect(mockedRedirect).not.toHaveBeenCalled();
    });
});
