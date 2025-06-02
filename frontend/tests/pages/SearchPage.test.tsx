import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchPage from '../../src/pages/SearchPage';
import { searchForTermsInTranscripts } from '../../src/api';

const mockSearchForm = vi.fn();
const mockMobileMenu = vi.fn();
const mockSearchResult = vi.fn();
const mockSearchInfo = vi.fn();

vi.mock('../../src/api', () => ({
  searchForTermsInTranscripts: vi.fn(),
}));

vi.mock('../../src/components/index.js', async () => {
  const actual = await vi.importActual('../../src/components/index.js');
  return {
    ...actual,
    SearchForm: (props: any) => {
      mockSearchForm(props);
      return (
        <div
          data-testid={props['data-testid'] || 'search-form'}
          onClick={() => props.onSubmit({ query: 'test' })}
        />
      );
    },
    SearchInfoBox: (props: any) => {
      mockSearchInfo();
      return <div data-testid={props['data-testid'] || 'search-info'} />;
    },
    LoadingSpinner: (props: any) => <div data-testid={props['data-testid'] || 'loading-spinner'} />,
    SearchResult: (props: any) => {
      mockSearchResult(props);
      return <div data-testid={props['data-testid'] || 'search-result'}>{props.result.title}</div>;
    },
    MasonryGridLayout: (props: any) => <div data-testid="grid-layout">{props.children}</div>,
    MobilePopOutMenu: (props: any) => {
      mockMobileMenu(props);
      if (!props.isOpen) {
        return <div data-testid={props['data-testid'] || 'mobile-menu'} />;
      }
      return (
        <div data-testid={props['data-testid'] || 'mobile-menu'}>
          {props.children}
        </div>
      );
    },
    SearchErrorMessage: (props: any) => (
      <div data-testid={props['data-testid'] || 'error-message'}>{props.errorMessage}</div>
    ),
  };
});

describe('SearchPage (unit)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders initial UI state before any search', () => {
    // ACT
    render(<SearchPage />);

    // ASSERT
    expect(screen.getByTestId('search-form')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
    expect(screen.getByTestId('toggle-filters-button')).toBeInTheDocument();

    expect(screen.getByTestId('search-info')).toBeInTheDocument();
    expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
    expect(screen.queryAllByTestId('search-result')).toHaveLength(0);
  });

  it('shows loading spinner during search', async () => {
    // ARRANGE
    (searchForTermsInTranscripts as any).mockImplementation(() =>
      new Promise((resolve) => setTimeout(() => resolve([]), 50))
    );

    render(<SearchPage />);

    // ACT & ASSERT
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('search-form'));
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
  });

  it('displays results after a successful search', async () => {
    // ARRANGE
    const results = [{ title: 'Result A' }, { title: 'Result B' }];
    (searchForTermsInTranscripts as any).mockResolvedValueOnce(results);

    // ACT
    render(<SearchPage />);
    fireEvent.click(screen.getByTestId('search-form'));

    // ASSERT
    const rendered = await screen.findAllByTestId('search-result');
    expect(rendered).toHaveLength(2);
    expect(rendered[0]).toHaveTextContent('Result A');
    expect(rendered[1]).toHaveTextContent('Result B');
  });

  it('displays error message if search fails', async () => {
    // ARRANGE
    (searchForTermsInTranscripts as any).mockRejectedValueOnce(new Error('Boom'));

    // ACT
    render(<SearchPage />);
    fireEvent.click(screen.getByTestId('search-form'));

    // ASSERT
    const errorMessage = await screen.getByTestId('error-message');
    expect(errorMessage).toHaveTextContent('Boom');
    expect(screen.queryAllByTestId('search-result')).toHaveLength(0);
  });

  it('toggles mobile sidebar on button click', () => {
    render(<SearchPage />);
    const button = screen.getByTestId('toggle-filters-button');
  
    // Initially closed
    expect(button).toHaveTextContent('Show Filters');
    expect(screen.queryByTestId('mobile-search-form')).not.toBeInTheDocument();
  
    // Open it
    fireEvent.click(button);
    expect(button).toHaveTextContent('Hide Filters');
    expect(screen.getByTestId('mobile-search-form')).toBeInTheDocument();
  
    // Close it again
    fireEvent.click(button);
    expect(button).toHaveTextContent('Show Filters');
    expect(screen.queryByTestId('mobile-search-form')).not.toBeInTheDocument();
  });
});
