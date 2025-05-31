import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { render, waitFor, act } from '@testing-library/react';
import { useApiKeysManagement, UseApiKeysManagementReturn } from '../../src/hooks/useApiKeysManagement.js';
import {
  getAllKeys,
  activateApiKey,
  deleteApiKey,
  saveApiKey,
  deleteAllApiKeys,
} from '../../src/api/index.js';

vi.mock('../../src/api/index.js');

// TODO: further clean up required with typing
const createTestHook = (): () => UseApiKeysManagementReturn => {
  let hookResult: UseApiKeysManagementReturn;

  const HookComponent = () => {
    hookResult = useApiKeysManagement();
    return null;
  };

  render(<HookComponent />);
  return () => hookResult;
};

describe('useApiKeysManagement', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches all API keys on mount', async () => {
    const mockKeys = [{ id: 1, apiKey: 'key1' }];
    (getAllKeys as Mock).mockResolvedValue(mockKeys);

    const getHook = createTestHook();

    await waitFor(() => {
      expect(getHook().apiKeys).toEqual(mockKeys);
      expect(getHook().errors.fetch).toBe('');
    });
  });

  it('sets fetch error if getAllKeys fails', async () => {
    (getAllKeys as Mock).mockRejectedValue(new Error('Fetch failed'));
    const getHook = createTestHook();

    await waitFor(() => {
      expect(getHook().errors.fetch).toBe('Fetch failed');
    });
  });

  it.each([
    ['activateKey', activateApiKey, 'row'],
    ['deleteKey', deleteApiKey, 'row'],
    ['saveKey', saveApiKey, 'newApiKey'],
    ['deleteAllKeys', deleteAllApiKeys, 'deleteAll'],
  ])('calls %s and updates errors correctly on success', async (method, apiMethod, errorKey) => {
    (apiMethod as Mock).mockResolvedValue(undefined);
    (getAllKeys as Mock).mockResolvedValue([]);

    const getHook = createTestHook();
    await waitFor(() => expect(getHook()).toBeDefined());

    await act(async () => {
      if (method === 'saveKey') {
        await getHook()[method]('myKey');
      } else if (method === 'deleteAllKeys') {
        await getHook()[method]();
      } else {
        await getHook()[method](1);
      }
    });

    expect(apiMethod).toHaveBeenCalled();
    if (errorKey === 'row') {
      expect(getHook().errors.row[1]).toBe('');
    } else {
      expect(getHook().errors[errorKey]).toBe('');
    }
  });

  it.each([
    ['activateKey', activateApiKey, 'row', 'fail activate'],
    ['deleteKey', deleteApiKey, 'row', 'fail delete'],
    ['saveKey', saveApiKey, 'newApiKey', 'fail save'],
    ['deleteAllKeys', deleteAllApiKeys, 'deleteAll', 'fail deleteAll'],
  ])('sets error if %s fails', async (method, apiMethod, errorKey, errorMsg) => {
    (apiMethod as Mock).mockRejectedValue(new Error(errorMsg));
    (getAllKeys as Mock).mockResolvedValue([]);

    const getHook = createTestHook();
    await waitFor(() => expect(getHook()).toBeDefined());

    await act(async () => {
      if (method === 'saveKey') {
        await getHook()[method]('myKey');
      } else if (method === 'deleteAllKeys') {
        await getHook()[method]();
      } else {
        await getHook()[method](1);
      }
    });

    if (errorKey === 'row') {
      expect(getHook().errors.row[1]).toBe(errorMsg);
    } else {
      expect(getHook().errors[errorKey]).toBe(errorMsg);
    }
  });
});
