import { useContext, useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AppConfigProvider, AppConfigContext } from '../../src/contexts/AppConfigContext';
import { fetchAppConfigState } from '../../src/api/index.js';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

vi.mock('../../src/api/index.js');

describe('AppConfigProvider', () => {
  const mockedFetchAppConfigState = vi.mocked(fetchAppConfigState);

  const TestComponent = () => {
    const { isConfigured, refreshConfig } = useContext(AppConfigContext);
    const location = useLocation();

    return (
      <div>
        <div>isConfigured: {isConfigured ? 'true' : 'false'}</div>
        <div>location: {location.pathname}</div>
        <button onClick={refreshConfig}>Refresh</button>
      </div>
    );
  };

  // Wrapper Component to simulate navigating to a new URL
  const TestSimulateNavigation = () => {
    const navigate = useNavigate();
  
    useEffect(() => {
      navigate('/second');
    }, []);
  
    return <TestComponent />;
  };

  const renderWithProvider = (initialPath = '/') => {
    return render(
      <MemoryRouter initialEntries={[initialPath]}>
        <AppConfigProvider>
          <Routes>
            <Route path="*" element={<TestComponent />} />
          </Routes>
        </AppConfigProvider>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch app config and set isConfigured to true when apiKey is set', async () => {
    // ARRANGE
    mockedFetchAppConfigState.mockResolvedValue({ isApiKeySet: true });

    // ACT
    renderWithProvider();

    // ASSERT
    await waitFor(() => {
      expect(screen.getByText('isConfigured: true')).toBeInTheDocument();
    });
  });

  it('should fetch app config and set isConfigured to false when apiKey is not set', async () => {
    // ARRANGE
    mockedFetchAppConfigState.mockResolvedValue({ isApiKeySet: false });

    // ACT
    renderWithProvider();

    // ASSERT
    await waitFor(() => {
      expect(screen.getByText('isConfigured: false')).toBeInTheDocument();
    });
  });

  it('should call fetchAppConfigState when location changes', async () => {
    // ARRANGE
    mockedFetchAppConfigState.mockResolvedValue({ isApiKeySet: false });

    // ACT: using simulated navigation
    render(
      <MemoryRouter initialEntries={['/second']}>
        <AppConfigProvider>
          <Routes>
            <Route path="*" element={<TestSimulateNavigation />} />
          </Routes>
        </AppConfigProvider>
      </MemoryRouter>
    );

    // ASSERT
    await waitFor(() => {
      expect(mockedFetchAppConfigState).toHaveBeenCalledTimes(2);
    });
  });

  it('should expose refreshConfig function and allow manual recheck', async () => {
    mockedFetchAppConfigState.mockResolvedValue({ isApiKeySet: true });
    renderWithProvider();

    const button = screen.getByRole('button', { name: /refresh/i });

    await waitFor(() => {
      expect(screen.getByText('isConfigured: true')).toBeInTheDocument();
    });

    mockedFetchAppConfigState.mockResolvedValue({ isApiKeySet: false });

    await userEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('isConfigured: false')).toBeInTheDocument();
    });
  });
});
