import { useState, useEffect, useCallback } from 'react';
import { getAllKeys, activateApiKey, deleteApiKey, saveApiKey, deleteAllApiKeys } from '../api/index.js';
import { ApiKey } from '../types/index.js';

export const useApiKeysManagagment = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [errors, setErrors] = useState({
    fetch: '',
    newApiKey: '',
    deleteAll: '',
    row: {} as { [id: number]: string },
  });

  const fetchAllKeys = useCallback(async () => {
    try {
      const result = await getAllKeys();
      setApiKeys(result);
      setErrors(prev => ({ ...prev, fetch: '' }));
    } catch (error: any) {
      setErrors(prev => ({ ...prev, fetch: error.message }));
    }
  }, []);

  const activateKey = async (keyId: number) => {
    try {
      await activateApiKey(keyId);
      setErrors(prev => ({ ...prev, row: { ...prev.row, [keyId]: "" } }));
    } catch (error: any) {
      setErrors(prev => ({ ...prev, row: { ...prev.row, [keyId]: error.message } }));
    }
    fetchAllKeys();
  };

  const deleteKey = async (keyId: number) => {
    try {
      await deleteApiKey(keyId);
      setErrors(prev => ({ ...prev, row: { ...prev.row, [keyId]: "" } }));
    } catch (error: any) {
      setErrors(prev => ({ ...prev, row: { ...prev.row, [keyId]: error.message } }));
    }
    fetchAllKeys();
  };

  const saveKey = async (apiKey: string) => {
    try {
      await saveApiKey({ apiKey });
      setErrors(prev => ({ ...prev, newApiKey: "" }));
    } catch (error: any) {
      setErrors(prev => ({ ...prev, newApiKey: error.message }));
    }
    fetchAllKeys();
  };

  const deleteAllKeys = async () => {
    try {
      await deleteAllApiKeys();
      setErrors(prev => ({ ...prev, deleteAll: "" }));
    } catch (error: any) {
      setErrors(prev => ({ ...prev, deleteAll: error.message }));
    }
    fetchAllKeys();
  };

  useEffect(() => {
    fetchAllKeys();
  }, [fetchAllKeys]);

  return { apiKeys, errors, activateKey, deleteKey, saveKey, deleteAllKeys };
};
