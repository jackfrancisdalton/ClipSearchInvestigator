import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SearchErrorMessage } from '../../../src/components';

describe('SearchErrorMessage', () => {
  it('renders the error message with correct text', () => {
    const errorText = 'Something went wrong during the search.';

    render(<SearchErrorMessage errorMessage={errorText} />);

    const errorMessageElement = screen.getByTestId('search-error_message');
    expect(errorMessageElement).toBeInTheDocument();
    expect(errorMessageElement).toHaveTextContent(errorText);
  });
});
