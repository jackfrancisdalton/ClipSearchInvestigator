import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../../src/pages/ErrorBoundary';
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useRouteError: vi.fn(),
    isRouteErrorResponse: vi.fn(),
  };
});

describe('ErrorBoundary', () => {
  const mockedUseRouteError = useRouteError as unknown as Mock;
  const mockedIsRouteErrorResponse = isRouteErrorResponse as unknown as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders default message for unknown errors', () => {
    mockedUseRouteError.mockReturnValue(null);

    render(<ErrorBoundary />);

    expect(screen.getByTestId("error-title").textContent).toBe("Something went wrong!");
    expect(screen.getByTestId("error-message").textContent).toBe("An unexpected error has occurred.");
  });

  it('renders message from thrown Error object', () => {
    const error = new Error('Test error message');
    mockedUseRouteError.mockReturnValue(error);

    render(<ErrorBoundary />);

    expect(screen.getByTestId("error-title").textContent).toBe("Something went wrong!");
    expect(screen.getByTestId("error-message").textContent).toBe("Test error message");
  });

  it('renders statusText from route error response', () => {
    mockedUseRouteError.mockReturnValue({
      status: 404,
      statusText: 'Not Found',
    });
    mockedIsRouteErrorResponse.mockReturnValue(true);

    render(<ErrorBoundary />);

    expect(screen.getByTestId("error-title").textContent).toBe("Something went wrong!");
    expect(screen.getByTestId("error-message").textContent).toBe("Not Found");
  });

  it('falls back to default message if route error has no statusText', () => {
    mockedUseRouteError.mockReturnValue({ status: 500 });
    mockedIsRouteErrorResponse.mockReturnValue(true);


    render(<ErrorBoundary />);

    expect(screen.getByTestId("error-title").textContent).toBe("Something went wrong!");
    expect(screen.getByTestId("error-message").textContent).toBe("An unexpected error has occurred.");
  });
});
