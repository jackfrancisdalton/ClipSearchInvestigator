import React, { useEffect, useState } from 'react';
import { deleteAllApiKeys, getAllKeys } from "../../api";
import { AllApiKeys, ApiKey } from '../../types';

const ApiKeyManager = () => {
    const [apiKeys, setApiKeys] = useState<AllApiKeys>({ apiKeys: [] });

    const deleteApiKeys = async () => {
        await deleteAllApiKeys();
        fetchAllKeys();
    }
    
    const fetchAllKeys = async () => {
        const result = await getAllKeys();
        console.log(result.apiKeys);
        setApiKeys(result);
    }

    const handleToggle = async (keyId: number) => {
        // await toggleApiKeyStatus(keyId);
        fetchAllKeys();
    }

    useEffect(() => {
        fetchAllKeys();
    }, []);

    return (
        <div className="p-4 rounded bg-background-600">
            <table className="border bg-background-500 border-primary-700">
                <thead>
                    <tr>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">API Key</th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">Action</th>
                    </tr>
                </thead>
                <tbody className="bg-gray-700 divide-y divide-gray-600">
                    {apiKeys.apiKeys.map((key: ApiKey) => (
                        <tr key={key.id}>
                            <td className="px-6 py-4 text-sm font-medium text-gray-200 whitespace-nowrap">{key.apiKey}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <button 
                                    className={`px-2 py-1 text-sm font-medium rounded ${
                                        key.isActive ? 'bg-red-500 text-white-50' : 'bg-green-500 text-white-50'
                                    }`}
                                    onClick={() => handleToggle(key.id)}
                                >
                                    {key.isActive ? 'Deactivate' : 'Activate'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-4">
                <button 
                    className="px-4 py-2 font-medium bg-red-600 rounded text-white-50"
                    onClick={deleteApiKeys}
                >
                    Delete All Keys
                </button>
            </div>
        </div>
    );
}

export default ApiKeyManager;