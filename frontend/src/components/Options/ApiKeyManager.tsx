import { useEffect, useState } from 'react';
import { 
  activateApiKey,  
  deleteAllApiKeys, 
  deleteApiKey, 
  getAllKeys, 
  saveApiKey 
} from "../../api";
import { AllApiKeys, ApiKey } from '../../types';

const ApiKeyManager = () => {
  const [apiKeys, setApiKeys] = useState<AllApiKeys>({ apiKeys: [] });
  const [newApiKey, setNewApiKey] = useState<string>("");
  
  // error messages for row-specific actions keyed by api key id
  const [rowErrors, setRowErrors] = useState<{ [id: number]: string }>({});
  // error for saving new key
  const [errorNewApiKey, setErrorNewApiKey] = useState<string>("");
  // error for deleting all keys
  const [errorDeleteAll, setErrorDeleteAll] = useState<string>("");
  // error for fetching keys
  const [errorFetch, setErrorFetch] = useState<string>("");

  const fetchAllKeys = async () => {
    try {
      const result = await getAllKeys();
      setApiKeys(result);
      setErrorFetch("");
    } catch (error: any) {
      console.error("Error fetching keys", error);
      setErrorFetch("Error fetching keys: " + error.message);
    }
  };

  const activateKey = async (keyId: number) => {
    try {
      await activateApiKey(keyId);
      // clear any previous error for this row
      setRowErrors(prev => ({ ...prev, [keyId]: "" }));
    } catch (error: any) {
      console.error("Error activating key", error);
      setRowErrors(prev => ({ ...prev, [keyId]: "Failed to activate API key: " + error.message }));
    }
    fetchAllKeys();
  };

  const deleteKey = async (keyId: number) => {
    try {
      await deleteApiKey(keyId);
      setRowErrors(prev => ({ ...prev, [keyId]: "" }));
    } catch (error: any) {
      console.error("Error deleting key", error);
      setRowErrors(prev => ({ ...prev, [keyId]: "Failed to delete API key: " + error.message }));
    }
    fetchAllKeys();
  };

  const saveNewApiKey = async () => {
    try {
      await saveApiKey({ apiKey: newApiKey });
      setErrorNewApiKey("");
    } catch (error: any) {
      console.error("Error saving new API key", error);
      setErrorNewApiKey("Failed to save new API key: " + error.message);
    }
    fetchAllKeys();
  };

  const deleteApiKeys = async () => {
    try {
      await deleteAllApiKeys();
      setErrorDeleteAll("");
    } catch (error: any) {
      console.error("Error deleting all API keys", error);
      setErrorDeleteAll("Failed to delete all API keys: " + error.message);
    }
    fetchAllKeys();
  };

  useEffect(() => {
    fetchAllKeys();
  }, []);

  return (
    <div className="p-4 rounded bg-background-600">
      <h3>Manage Existing Keys</h3>
      <h4>
        Inspect your existing YoutubeApi keys. Only one key can be active at a time.
      </h4>
      {errorFetch && (
        <div className="mb-2 text-sm text-red-500">{errorFetch}</div>
      )}
      <table className="w-full border bg-background-500 border-primary-700">
        <thead>
          <tr>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">
              API Key
            </th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">
              Status
            </th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">
              Delete
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-700 divide-y divide-gray-600">
          {apiKeys.apiKeys.map((key: ApiKey) => (
            <tr key={key.id}>
              <td className="px-6 py-4 text-sm font-medium text-gray-200 whitespace-nowrap">
                {key.apiKey}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {key.isActive ? (
                  <span className="px-2 py-1 text-sm font-medium bg-gray-500 rounded">
                    is active
                  </span>
                ) : (
                  <button
                    className="px-2 py-1 text-sm font-medium bg-green-500 rounded text-white-50"
                    onClick={() => activateKey(key.id)}
                  >
                    Activate
                  </button>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  className="px-2 py-1 text-sm font-medium bg-red-500 rounded text-white-50"
                  onClick={() => deleteKey(key.id)}
                  disabled={apiKeys.apiKeys.length === 1 && !key.isActive}
                >
                  Delete
                </button>
                {rowErrors[key.id] && (
                  <div className="mt-1 text-xs text-red-500">
                    {rowErrors[key.id]}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4">
        <h3>Add a new API Key</h3>
        <h4>Add a new API key you'd like to use</h4>
        <input
          type="text"
          value={newApiKey}
          onChange={(e) => setNewApiKey(e.target.value)}
          className="px-4 py-2 mr-2 text-sm bg-gray-800 border border-gray-600 rounded text-white-50"
          placeholder="Enter new API key"
        />
        <button
          className="px-4 py-2 font-medium bg-blue-600 rounded text-white-50"
          onClick={saveNewApiKey}
        >
          Add API Key
        </button>
        {errorNewApiKey && (
          <div className="mt-1 text-sm text-red-500">{errorNewApiKey}</div>
        )}
      </div>

      <div className="mt-4">
        <h3>Delete all API Keys</h3>
        <h4>
          Delete every API key (this will result in you going back to the setup page).
        </h4>
        <button
          className="px-4 py-2 font-medium bg-red-600 rounded text-white-50"
          onClick={deleteApiKeys}
        >
          Factory Reset App
        </button>
        {errorDeleteAll && (
          <div className="mt-1 text-sm text-red-500">{errorDeleteAll}</div>
        )}
      </div>
    </div>
  );
};

export default ApiKeyManager;
