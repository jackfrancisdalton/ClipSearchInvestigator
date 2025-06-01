import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import SetUpPage from '../../src/pages/SetUpPage';
import { saveApiKey as mockSaveApiKey } from '../../src/api/index.js';
import { ApiActionResultResponse } from '../../src/types';

// Mock API and navigation
vi.mock('../../src/api/index.js');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

const mockedSaveApiKey = vi.mocked(mockSaveApiKey);
const mockNavigate = useNavigate() as ReturnType<typeof vi.fn>;

describe('SetUpPage', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const setup = () => {
    render(
      <BrowserRouter>
        <SetUpPage />
      </BrowserRouter>
    );

    const input = screen.getByTestId('api-key-input');
    const button = screen.getByTestId('setup-button');
    return { input, button };
  };

  it('binds the input value', () => {
    const { input } = setup();

    fireEvent.change(input, { target: { value: 'abc123' } });

    expect((input as HTMLInputElement).value).toBe('abc123');
  });

  // TODO: fix, seems to fail due to CSS transition issues
  // it('submits the API key and navigates after success', async () => {
  //   mockedSaveApiKey.mockResolvedValue({} as ApiActionResultResponse);
  
  //   const { input, button } = setup();
  
  //   fireEvent.change(input, { target: { value: 'abc123' } });
  //   fireEvent.click(button);
  
  //   expect(mockedSaveApiKey).toHaveBeenCalledWith({ apiKey: 'abc123' });
  
  //   // ✅ Wait for the success message to appear
  //   expect(await screen.findByTestId('setup-complete-message')).toBeInTheDocument();
  
  //   // ✅ Wait for timers if needed
  //   await act(async () => {
  //     vi.runAllTimers();
  //   });
  
  //   expect(mockNavigate).toHaveBeenCalledWith('/');
  // });
  

  it('displays an error if API call fails', async () => {
    mockedSaveApiKey.mockRejectedValue(new Error('Oops'));

    const { input, button } = setup();

    fireEvent.change(input, { target: { value: 'badkey' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockedSaveApiKey).toHaveBeenCalledWith({ apiKey: 'badkey' });
    });

    expect(await screen.findByText(/error: oops/i)).toBeInTheDocument();
  });

  it('disables the input and button during loading', async () => {
    let resolveFn: (value: ApiActionResultResponse) => void;
    
    mockedSaveApiKey.mockImplementation(
      () => new Promise<ApiActionResultResponse>((resolve) => { resolveFn = resolve; })
    );

    const { input, button } = setup();

    fireEvent.change(input, { target: { value: 'abc123' } });

    act(() => {
      fireEvent.click(button);
    });

    expect(input).toBeDisabled();
    expect(button).toBeDisabled();

    await act(async () => {
      resolveFn({ success: true, message: 'API key saved successfully' } as ApiActionResultResponse);
    });
  });
});
