import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchForm, SearchFormData } from '../../../src/components/Search/SearchForm';

vi.mock('../../../src/components/Search/VideoSearchSubForm', () => ({
  __esModule: true,
  default: ({ disableForm }: { disableForm: boolean }) => (
    <div data-testid="video-search-subform">VideoSearchSubForm (disabled: {String(disableForm)})</div>
  ),
}));

vi.mock('../../../src/components/Search/TranscriptFilterSubForm', () => ({
  __esModule: true,
  default: ({ disableForm }: { disableForm: boolean }) => (
    <div data-testid="transcript-filter-subform">TranscriptFilterSubForm (disabled: {String(disableForm)})</div>
  ),
}));

vi.mock('../../../src/components/Shared/BigButton', () => ({
  __esModule: true,
  default: ({ disabled, disabledText, enabledText }: any) => (
    <button data-testid="big-button" disabled={disabled}>
      {disabled ? disabledText : enabledText}
    </button>
  ),
}));

describe('SearchForm', () => {
  let onSubmit: (data: SearchFormData) => void;

  beforeEach(() => {
    onSubmit = vi.fn();
  });

  it('renders form and subcomponents', () => {
    render(<SearchForm onSubmit={onSubmit} loading={false} />);

    expect(screen.getByTestId('search-form')).toBeInTheDocument();
    expect(screen.getByTestId('video-search-subform')).toBeInTheDocument();
    expect(screen.getByTestId('transcript-filter-subform')).toBeInTheDocument();
    expect(screen.getByTestId('big-button')).toHaveTextContent('Search');
  });

  it('disables submit button when loading', () => {
    render(<SearchForm onSubmit={onSubmit} loading={true} />);
    expect(screen.getByTestId('big-button')).toBeDisabled();
    expect(screen.getByTestId('big-button')).toHaveTextContent('Searching...');
  });

  it('does not submit with invalid form', () => {
    render(<SearchForm onSubmit={onSubmit} loading={false} />);

    const form = screen.getByTestId('search-form');
    fireEvent.submit(form);

    expect(onSubmit).not.toHaveBeenCalled();
  });
});
