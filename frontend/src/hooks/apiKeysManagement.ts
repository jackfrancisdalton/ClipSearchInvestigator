import { useState, useEffect, useCallback } from 'react';
import { getAllKeys, activateApiKey, deleteApiKey, saveApiKey, deleteAllApiKeys } from '../api';
import { AllApiKeys } from '../types';

export const useApiKeysManagagment = () => {
  const [apiKeys, setApiKeys] = useState<AllApiKeys>({ apiKeys: [] });
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
      setErrors(prev => ({ ...prev, fetch: "Error fetching keys: " + error.message }));
    }
  }, []);

  const activateKey = async (keyId: number) => {
    try {
      await activateApiKey(keyId);
      setErrors(prev => ({ ...prev, row: { ...prev.row, [keyId]: "" } }));
    } catch (error: any) {
      setErrors(prev => ({ ...prev, row: { ...prev.row, [keyId]: "Failed to activate API key: " + error.message } }));
    }
    fetchAllKeys();
  };

  const deleteKey = async (keyId: number) => {
    try {
      await deleteApiKey(keyId);
      setErrors(prev => ({ ...prev, row: { ...prev.row, [keyId]: "" } }));
    } catch (error: any) {
      setErrors(prev => ({ ...prev, row: { ...prev.row, [keyId]: "Failed to delete API key: " + error.message } }));
    }
    fetchAllKeys();
  };

  const saveKey = async (apiKey: string) => {
    try {
      await saveApiKey({ apiKey });
      setErrors(prev => ({ ...prev, newApiKey: "" }));
    } catch (error: any) {
      setErrors(prev => ({ ...prev, newApiKey: "Failed to save new API key: " + error.message }));
    }
    fetchAllKeys();
  };

  const deleteAllKeys = async () => {
    try {
      await deleteAllApiKeys();
      setErrors(prev => ({ ...prev, deleteAll: "" }));
    } catch (error: any) {
      setErrors(prev => ({ ...prev, deleteAll: "Failed to delete all API keys: " + error.message }));
    }
    fetchAllKeys();
  };

  useEffect(() => {
    fetchAllKeys();
  }, [fetchAllKeys]);

  return { apiKeys, errors, activateKey, deleteKey, saveKey, deleteAllKeys };
};
