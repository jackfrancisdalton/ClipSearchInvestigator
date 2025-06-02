import { render, screen, fireEvent } from '@testing-library/react';
import { TranscriptSearchResult } from '../../../src/types';
import SearchResult from '../../../src/components/Search/SearchResult';

describe('SearchResult', () => {
    const mockResult: TranscriptSearchResult = {
        videoTitle: 'Amazing React Tutorial',
        channelTitle: 'Jack\'s Academy',
        description: 'An incredible react tutorial that does not exist',
        publishedAt: '2024-06-01T12:30:00Z',
        thumbnailUrl: 'https://example.com/thumb.jpg',
        matches: [
            {
                text: 'Learn how to use useEffect properly.',
                link: 'https://example.com/video?t=30',
                startTime: 30,
            },
            {
                text: 'Understanding component lifecycle.',
                link: 'https://example.com/video?t=60',
                startTime: 60,
            },
        ],
    };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders video metadata correctly', () => {
    render(<SearchResult result={mockResult} />);

    expect(screen.getByText(mockResult.videoTitle)).toBeInTheDocument();
    expect(screen.getByTestId('search-result_channel-title')).toHaveTextContent(mockResult.channelTitle);
    expect(screen.getByTestId('search-result_published-at')).toHaveTextContent('01/06/24');
    expect(screen.getByTestId('search-result_published-at')).toHaveTextContent('12:30');
  });

  it('renders thumbnail with correct src and alt', () => {
    render(<SearchResult result={mockResult} />);
    const thumbnail = screen.getByTestId('search-result_thumbnail');

    expect(thumbnail).toBeInTheDocument();
    expect(thumbnail).toHaveAttribute('src', mockResult.thumbnailUrl);
    expect(thumbnail).toHaveAttribute('alt', 'thumbnail');
  });

  it('renders all quotes with correct text and timestamps', () => {
    render(<SearchResult result={mockResult} />);

    mockResult.matches.forEach((quote, idx) => {
      const quoteEl = screen.getByTestId(`search-result_quote-${idx}`);
      const expectedTime = new Date(quote.startTime * 1000).toISOString().slice(11, 19);

      expect(quoteEl).toBeInTheDocument();
      expect(quoteEl).toHaveTextContent(`"${quote.text}" - ${expectedTime}`);
    });
  });

  it('opens correct link in new tab when quote is clicked', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    render(<SearchResult result={mockResult} />);

    const firstQuote = screen.getByTestId('search-result_quote-0');
    fireEvent.click(firstQuote);

    expect(openSpy).toHaveBeenCalledTimes(1);
    expect(openSpy).toHaveBeenCalledWith(mockResult.matches[0].link, '_blank');
  });
});
