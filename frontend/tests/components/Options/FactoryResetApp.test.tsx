import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FactoryResetApp from '../../../src/components/Options/FactoryResetApp';

describe('FactoryResetApp', () => {
  const mockOnDeleteAll = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the Factory Reset button', () => {
    render(
      <FactoryResetApp onDeleteAll={mockOnDeleteAll} errorMessage="" />
    );

    const button = screen.getByTestId('factory-reset-app_button');
    expect(button).toBeInTheDocument();
  });

  it('calls onDeleteAll when the button is clicked', () => {
    render(
      <FactoryResetApp onDeleteAll={mockOnDeleteAll} errorMessage="" />
    );

    const button = screen.getByTestId('factory-reset-app_button');
    fireEvent.click(button);

    expect(mockOnDeleteAll).toHaveBeenCalledTimes(1);
  });

  it('renders the error message when provided', () => {
    const error = 'Something went wrong while deleting all API keys';

    render(
      <FactoryResetApp onDeleteAll={mockOnDeleteAll} errorMessage={error} />
    );

    const errorMsg = screen.getByTestId('factory-reset-app_error');
    expect(errorMsg).toBeInTheDocument();
    expect(errorMsg).toHaveTextContent(error);
  });

  it('does not render error message when errorMessage is empty', () => {
    render(
      <FactoryResetApp onDeleteAll={mockOnDeleteAll} errorMessage="" />
    );

    expect(screen.queryByTestId('factory-reset-app_error')).not.toBeInTheDocument();
  });
});
