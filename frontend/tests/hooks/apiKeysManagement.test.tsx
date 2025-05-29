import React from 'react';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { render, waitFor, act } from '@testing-library/react';
import { useApiKeysManagement } from '../../src/hooks/useApiKeysManagement.js';
import { 
  getAllKeys, 
  activateApiKey, 
  deleteApiKey, 
  saveApiKey, 
  deleteAllApiKeys 
} from '../../src/api/index.js';

vi.mock('../../src/api/index.js');

describe('useApiKeysManagagment', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch all keys on mount', async () => {
    const mockKeys = [{ id: 1, apiKey: 'key1' }];
    (getAllKeys as Mock).mockResolvedValue(mockKeys);

    let hookResult: ReturnType<typeof useApiKeysManagement>;

    const HookTestComponent: React.FC = () => {
      hookResult = useApiKeysManagement();
      return null;
    };

    render(<HookTestComponent />);

    await waitFor(() => {
      // Wait until apiKeys have been updated
      expect(hookResult!.apiKeys).toEqual(mockKeys);
    });

    expect(hookResult!.errors.fetch).toBe('');
  });

  it('should handle fetch all keys error', async () => {
    const errorMessage = 'Failed to fetch keys';
    (getAllKeys as Mock).mockRejectedValue(new Error(errorMessage));

    let hookResult: ReturnType<typeof useApiKeysManagement>;
    const HookTestComponent: React.FC = () => {
      hookResult = useApiKeysManagement();
      return null;
    };

    render(<HookTestComponent />);

    await waitFor(() => {
      expect(hookResult!.errors.fetch).toBe(errorMessage);
    });

    expect(hookResult!.apiKeys).toEqual([]);
  });

  it('should activate a key', async () => {
    const keyId = 1;
    (activateApiKey as Mock).mockResolvedValue(undefined);
    (getAllKeys as Mock).mockResolvedValue([]);

    let hookResult: ReturnType<typeof useApiKeysManagement>;
    const HookTestComponent: React.FC = () => {
      hookResult = useApiKeysManagement();
      return null;
    };

    render(<HookTestComponent />);
    await waitFor(() => expect(hookResult).toBeDefined());

    await act(async () => {
      await hookResult!.activateKey(keyId);
    });

    expect(activateApiKey).toHaveBeenCalledWith(keyId);
    expect(hookResult!.errors.row[keyId]).toBe('');
  });

  it('should handle activate key error', async () => {
    const keyId = 1;
    const errorMessage = 'Failed to activate key';
    (activateApiKey as Mock).mockRejectedValue(new Error(errorMessage));
    (getAllKeys as Mock).mockResolvedValue([]);

    let hookResult: ReturnType<typeof useApiKeysManagement>;
    const HookTestComponent: React.FC = () => {
      hookResult = useApiKeysManagement();
      return null;
    };

    render(<HookTestComponent />);
    await waitFor(() => expect(hookResult).toBeDefined());

    await act(async () => {
      await hookResult!.activateKey(keyId);
    });

    expect(hookResult!.errors.row[keyId]).toBe(errorMessage);
  });

  it('should delete a key', async () => {
    const keyId = 1;
    (deleteApiKey as Mock).mockResolvedValue(undefined);
    (getAllKeys as Mock).mockResolvedValue([]);

    let hookResult: ReturnType<typeof useApiKeysManagement>;
    const HookTestComponent: React.FC = () => {
      hookResult = useApiKeysManagement();
      return null;
    };

    render(<HookTestComponent />);
    await waitFor(() => expect(hookResult).toBeDefined());

    await act(async () => {
      await hookResult!.deleteKey(keyId);
    });

    expect(deleteApiKey).toHaveBeenCalledWith(keyId);
    expect(hookResult!.errors.row[keyId]).toBe('');
  });

  it('should handle delete key error', async () => {
    const keyId = 1;
    const errorMessage = 'Failed to delete key';
    (deleteApiKey as Mock).mockRejectedValue(new Error(errorMessage));
    (getAllKeys as Mock).mockResolvedValue([]);

    let hookResult: ReturnType<typeof useApiKeysManagement>;
    const HookTestComponent: React.FC = () => {
      hookResult = useApiKeysManagement();
      return null;
    };

    render(<HookTestComponent />);
    await waitFor(() => expect(hookResult).toBeDefined());

    await act(async () => {
      await hookResult!.deleteKey(keyId);
    });

    expect(hookResult!.errors.row[keyId]).toBe(errorMessage);
  });

  it('should save a new key', async () => {
    const apiKey = 'newKey';
    (saveApiKey as Mock).mockResolvedValue(undefined);
    (getAllKeys as Mock).mockResolvedValue([]);

    let hookResult: ReturnType<typeof useApiKeysManagement>;
    const HookTestComponent: React.FC = () => {
      hookResult = useApiKeysManagement();
      return null;
    };

    render(<HookTestComponent />);
    await waitFor(() => expect(hookResult).toBeDefined());

    await act(async () => {
      await hookResult!.saveKey(apiKey);
    });

    expect(saveApiKey).toHaveBeenCalledWith({ apiKey });
    expect(hookResult!.errors.newApiKey).toBe('');
  });

  it('should handle save new key error', async () => {
    const apiKey = 'newKey';
    const errorMessage = 'Failed to save key';
    (saveApiKey as Mock).mockRejectedValue(new Error(errorMessage));
    (getAllKeys as Mock).mockResolvedValue([]);

    let hookResult: ReturnType<typeof useApiKeysManagement>;
    const HookTestComponent: React.FC = () => {
      hookResult = useApiKeysManagement();
      return null;
    };

    render(<HookTestComponent />);
    await waitFor(() => expect(hookResult).toBeDefined());

    await act(async () => {
      await hookResult!.saveKey(apiKey);
    });

    expect(hookResult!.errors.newApiKey).toBe(errorMessage);
  });

  it('should delete all keys', async () => {
    (deleteAllApiKeys as Mock).mockResolvedValue(undefined);
    (getAllKeys as Mock).mockResolvedValue([]);

    let hookResult: ReturnType<typeof useApiKeysManagement>;
    const HookTestComponent: React.FC = () => {
      hookResult = useApiKeysManagement();
      return null;
    };

    render(<HookTestComponent />);
    await waitFor(() => expect(hookResult).toBeDefined());

    await act(async () => {
      await hookResult!.deleteAllKeys();
    });

    expect(deleteAllApiKeys).toHaveBeenCalled();
    expect(hookResult!.errors.deleteAll).toBe('');
  });

  it('should handle delete all keys error', async () => {
    const errorMessage = 'Failed to delete all keys';
    (deleteAllApiKeys as Mock).mockRejectedValue(new Error(errorMessage));
    (getAllKeys as Mock).mockResolvedValue([]);

    let hookResult: ReturnType<typeof useApiKeysManagement>;
    const HookTestComponent: React.FC = () => {
      hookResult = useApiKeysManagement();
      return null;
    };

    render(<HookTestComponent />);
    await waitFor(() => expect(hookResult).toBeDefined());

    await act(async () => {
      await hookResult!.deleteAllKeys();
    });

    expect(hookResult!.errors.deleteAll).toBe(errorMessage);
  });
});
