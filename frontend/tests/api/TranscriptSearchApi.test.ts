import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { searchForTermsInTranscripts } from '../../src/api/TranscriptSearchApi';
import { apiRequest } from '../../src/api/ApiUtilities';
import { TranscriptSearchResult } from '../../src/types/index.js';

vi.mock('../../src/api/ApiUtilities');

describe('searchForTermsInTranscripts', () => {
    const mockedApiRequest = vi.mocked(apiRequest);
    const baseUrl = '/api/search-transcripts';

    const mockResponse: TranscriptSearchResult[] = [
        {
            videoTitle: "Test Video",
            description: "This is a description",
            channelTitle: "Test Channel",
            publishedAt: "2023-01-01T00:00:00Z",
            thumbnailUrl: "https://example.com/thumbnail.jpg",
            matches: [
                {
                    text: "Matching text segment",
                    startTime: 42,
                    link: "https://youtube.com/watch?v=abc123&t=42s"
                }
            ]
        }
    ];

    beforeEach(() => {
        mockedApiRequest.mockReset();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should call apiRequest with all parameters correctly encoded', async () => {
        // ARRANGE
        mockedApiRequest.mockResolvedValue(mockResponse);
        const params = {
            videoSearchQuery: 'test query',
            matchTerms: [{ value: 'term1' }, { value: 'term2' }],
            sortOrder: 'date',
            publishedBefore: '2023-01-01',
            publishedAfter: '2022-01-01',
            channelName: 'testChannel',
            maxResults: 5
        };

        // ACT
        const result = await searchForTermsInTranscripts(params);

        // ASSERT
        const expectedUrl =
        `${baseUrl}?videoSearchQuery=test+query&` +
        `matchTerms=term1&matchTerms=term2&` +
        `sortOrder=date&maxResults=5&` +
        `publishedBefore=2023-01-01&publishedAfter=2022-01-01&channelName=testChannel`;
        
        expect(mockedApiRequest).toHaveBeenCalledWith(expectedUrl, { method: 'GET' });
        expect(result).toEqual(mockResponse);
    });

    it('should apply default values for optional parameters', async () => {
        // ARRANGE
        mockedApiRequest.mockResolvedValue(mockResponse);
        const params = {
            videoSearchQuery: 'test query',
            matchTerms: [{ value: 'term1' }]
        };

        // ACT
        const result = await searchForTermsInTranscripts(params);

        // ASSERT
        const expectedUrl =
        `${baseUrl}?videoSearchQuery=test+query&` +
        `matchTerms=term1&sortOrder=relevance&maxResults=10`;

        expect(mockedApiRequest).toHaveBeenCalledWith(expectedUrl, { method: 'GET' });
        expect(result).toEqual(mockResponse);
    });

    it('should exclude matchTerms from query if array is empty', async () => {
        // ARRANGE
        mockedApiRequest.mockResolvedValue(mockResponse);
        const params = {
            videoSearchQuery: 'test query',
            matchTerms: []
        };

        // ACT
        const result = await searchForTermsInTranscripts(params);

        // ASSERT
        const expectedUrl =
            `${baseUrl}?videoSearchQuery=test+query&` +
            `sortOrder=relevance&maxResults=10`;

        expect(mockedApiRequest).toHaveBeenCalledWith(expectedUrl, { method: 'GET' });
        expect(result).toEqual(mockResponse);
    });
});
