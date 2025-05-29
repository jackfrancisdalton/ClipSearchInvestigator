import { describe, it, expect, vi, Mock } from 'vitest';
import { searchForTermsInTranscripts } from '../../src/api/TranscriptSearchApi';
import { apiRequest } from '../../src/api/ApiUtilities';

vi.mock('../../src/api/ApiUtilities');

describe('searchForTermsInTranscripts', () => {
    it('should call apiRequest with correct parameters', async () => {
        const mockResponse = [{ id: '1', transcript: 'test transcript' }];
        (apiRequest as Mock).mockResolvedValue(mockResponse);

        const params = {
            videoSearchQuery: 'test query',
            matchTerms: [{ value: 'term1' }, { value: 'term2' }],
            sortOrder: 'date',
            publishedBefore: '2023-01-01',
            publishedAfter: '2022-01-01',
            channelName: 'testChannel',
            maxResults: 5
        };

        const result = await searchForTermsInTranscripts(params);

        // TODO: double check that the "test+" is correct, as it might be %20 instead
        expect(apiRequest).toHaveBeenCalledWith(
            '/api/search-transcripts?videoSearchQuery=test+query&matchTerms=term1&matchTerms=term2&sortOrder=date&maxResults=5&publishedBefore=2023-01-01&publishedAfter=2022-01-01&channelName=testChannel',
            { method: 'GET' }
        );
        expect(result).toEqual(mockResponse);
    });

    it('should use default values for optional parameters', async () => {
        const mockResponse = [{ id: '1', transcript: 'test transcript' }];
        (apiRequest as Mock).mockResolvedValue(mockResponse);

        const params = {
            videoSearchQuery: 'test query',
            matchTerms: [{ value: 'term1' }]
        };

        const result = await searchForTermsInTranscripts(params);

        expect(apiRequest).toHaveBeenCalledWith(
            '/api/search-transcripts?videoSearchQuery=test+query&matchTerms=term1&sortOrder=relevance&maxResults=10',
            { method: 'GET' }
        );
        expect(result).toEqual(mockResponse);
    });

    it('should handle empty matchTerms array', async () => {
        const mockResponse = [{ id: '1', transcript: 'test transcript' }];
        (apiRequest as Mock).mockResolvedValue(mockResponse);

        const params = {
            videoSearchQuery: 'test query',
            matchTerms: []
        };

        const result = await searchForTermsInTranscripts(params);

        expect(apiRequest).toHaveBeenCalledWith(
            '/api/search-transcripts?videoSearchQuery=test+query&sortOrder=relevance&maxResults=10',
            { method: 'GET' }
        );
        expect(result).toEqual(mockResponse);
    });

    it('should handle missing optional parameters', async () => {
        const mockResponse = [{ id: '1', transcript: 'test transcript' }];
        (apiRequest as Mock).mockResolvedValue(mockResponse);

        const params = {
            videoSearchQuery: 'test query',
            matchTerms: [{ value: 'term1' }]
        };

        const result = await searchForTermsInTranscripts(params);

        expect(apiRequest).toHaveBeenCalledWith(
            '/api/search-transcripts?videoSearchQuery=test+query&matchTerms=term1&sortOrder=relevance&maxResults=10',
            { method: 'GET' }
        );
        expect(result).toEqual(mockResponse);
    });
});