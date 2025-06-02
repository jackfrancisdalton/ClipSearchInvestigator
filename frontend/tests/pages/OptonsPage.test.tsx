import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import OptionsPage from '../../src/pages/OptionsPage';
import { useApiKeysManagement } from '../../src/hooks/useApiKeysManagement';

const mockApiKeyTable = vi.fn();
const mockAddNewApiKey = vi.fn();
const mockFactoryResetApp = vi.fn();

vi.mock('../../src/hooks/useApiKeysManagement', () => ({
  useApiKeysManagement: vi.fn(),
}));

vi.mock('../../src/components/Options/ApiKeyManagementTable', () => ({
  __esModule: true,
  default: (props: any) => {
    mockApiKeyTable(props);
    return <div data-testid="api-key-table" />;
  },
}));

vi.mock('../../src/components/Options/AddNewApiKey', () => ({
  __esModule: true,
  default: (props: any) => {
    mockAddNewApiKey(props);
    return <div data-testid="add-new-api-key" />;
  },
}));

vi.mock('../../src/components/Options/FactoryResetApp', () => ({
  __esModule: true,
  default: (props: any) => {
    mockFactoryResetApp(props);
    return <div data-testid="factory-reset-app" />;
  },
}));

const mockedUseApiKeysManagement = useApiKeysManagement as unknown as ReturnType<typeof vi.fn>;

describe('OptionsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('binds hook output correctly to child components', () => {
    // ARRANGE
    const handlers = {
      activateKey: vi.fn(),
      deleteKey: vi.fn(),
      saveKey: vi.fn(),
      deleteAllKeys: vi.fn(),
    };

    mockedUseApiKeysManagement.mockReturnValue({
      apiKeys: [{ id: 'abc' }],
      errors: {
        fetch: null,
        row: 'Row error',
        newApiKey: 'New key error',
        deleteAll: 'Delete all error',
      },
      ...handlers,
    });

    // ACT
    render(<OptionsPage />);

    // ASSERT
    expect(screen.getByTestId('api-key-table')).toBeInTheDocument();
    expect(screen.getByTestId('add-new-api-key')).toBeInTheDocument();
    expect(screen.getByTestId('factory-reset-app')).toBeInTheDocument();

    expect(mockApiKeyTable).toHaveBeenCalledWith(
      expect.objectContaining({
        apiKeys: [{ id: 'abc' }],
        errors: 'Row error',
        onActivate: handlers.activateKey,
        onDelete: handlers.deleteKey,
      })
    );

    expect(mockAddNewApiKey).toHaveBeenCalledWith(
      expect.objectContaining({
        onSave: handlers.saveKey,
        errorMessage: 'New key error',
      })
    );

    expect(mockFactoryResetApp).toHaveBeenCalledWith(
      expect.objectContaining({
        onDeleteAll: handlers.deleteAllKeys,
        errorMessage: 'Delete all error',
      })
    );
  });

  it('conditionally renders fetch error when present', () => {
    // ARRANGE
    mockedUseApiKeysManagement.mockReturnValue({
      apiKeys: [],
      errors: {
        fetch: 'Cannot load keys',
        row: null,
        newApiKey: null,
        deleteAll: null,
      },
      activateKey: vi.fn(),
      deleteKey: vi.fn(),
      saveKey: vi.fn(),
      deleteAllKeys: vi.fn(),
    });

    // ACT
    render(<OptionsPage />);

    // ASSERT
    expect(screen.getByTestId('fetch-error')).toHaveTextContent('Cannot load keys');
  });

  it('does not render fetch error when not present', () => {
    // ARRANGE
    mockedUseApiKeysManagement.mockReturnValue({
      apiKeys: [],
      errors: {
        fetch: null,
        row: null,
        newApiKey: null,
        deleteAll: null,
      },
      activateKey: vi.fn(),
      deleteKey: vi.fn(),
      saveKey: vi.fn(),
      deleteAllKeys: vi.fn(),
    });

    // ACT
    render(<OptionsPage />);

    // ASSERT
    expect(screen.queryByTestId('fetch-error')).not.toBeInTheDocument();
  });
});
