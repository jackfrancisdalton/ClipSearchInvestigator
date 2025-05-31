import { useState, useEffect, useCallback } from 'react';
import {
  getAllKeys,
  activateApiKey,
  deleteApiKey,
  saveApiKey,
  deleteAllApiKeys,
} from '../api/index.js';
import { ApiKey } from '../types/index.js';

interface ApiKeyErrors {
  fetch: string;
  newApiKey: string;
  deleteAll: string;
  row: Record<number, string>;
}

interface UseApiKeysManagementReturn {
  apiKeys: ApiKey[];
  errors: ApiKeyErrors;
  activateKey: (keyId: number) => Promise<void>;
  deleteKey:   (keyId: number) => Promise<void>;
  saveKey:    (apiKey: string) => Promise<void>;
  deleteAllKeys:            () => Promise<void>;
}

export const useApiKeysManagement = (): UseApiKeysManagementReturn => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [errors, setErrors] = useState<ApiKeyErrors>({
    fetch: '',
    newApiKey: '',
    deleteAll: '',
    row: {},
  });

  const fetchAllKeys = useCallback(async (signal?: AbortSignal) => {
    try {
      const result = await getAllKeys({ signal });
      setApiKeys(result);
      setErrors(prev => ({ ...prev, fetch: '' }));
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrors(prev => ({ ...prev, fetch: error.message }));
      }
    }
  }, []);

  // Each of the functions below handles their API call, updates the row error
  // if needed, and then refreshes the list of keys via fetchAllKeys.
  const activateKey = async (keyId: number) => {
    try {
      await activateApiKey(keyId);
      setErrors(prev => ({
        ...prev,
        row: { ...prev.row, [keyId]: '' },
      }));
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrors(prev => ({
          ...prev,
          row: { ...prev.row, [keyId]: error.message },
        }));
      }
    }
    await fetchAllKeys();
  };

  const deleteKey = async (keyId: number) => {
    try {
      await deleteApiKey(keyId);
      setErrors(prev => ({
        ...prev,
        row: { ...prev.row, [keyId]: '' },
      }));
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrors(prev => ({
          ...prev,
          row: { ...prev.row, [keyId]: error.message },
        }));
      }
    }
    await fetchAllKeys();
  };

  const saveKey = async (apiKey: string) => {
    try {
      await saveApiKey({ apiKey });
      setErrors(prev => ({
        ...prev,
        newApiKey: '',
      }));
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrors(prev => ({
          ...prev,
          newApiKey: error.message,
        }));
      }
    }
    await fetchAllKeys();
  };

  const deleteAllKeys = async () => {
    try {
      await deleteAllApiKeys();
      setErrors(prev => ({
        ...prev,
        deleteAll: '',
      }));
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrors(prev => ({
          ...prev,
          deleteAll: error.message,
        }));
      }
    }
    await fetchAllKeys();
  };

  useEffect(() => {
    const abortController = new AbortController();
    fetchAllKeys(abortController.signal);

    return () => {
      abortController.abort();
    };
  }, [fetchAllKeys]);

  return { apiKeys, errors, activateKey, deleteKey, saveKey, deleteAllKeys };
};
