import React from 'react';
import { ApiKey } from '../../types/index.js';

interface ApiKeyTableProps {
  apiKeys: ApiKey[];
  errors: { [id: number]: string };
  onActivate: (id: number) => void;
  onDelete: (id: number) => void;
}

const ApiKeyManagementTable: React.FC<ApiKeyTableProps> = ({ apiKeys, errors, onActivate, onDelete }) => {
  return (
    <table className="w-full border bg-background-light border-primary-dark">
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
        {apiKeys.map((apiKeyRecord, idx) => (
          <tr key={apiKeyRecord.id}>
            <td 
              className="px-6 py-4 text-sm font-medium text-gray-200 whitespace-nowrap"
              data-testid={`api-key-management-table_api-key-${idx}`}
            >
              {apiKeyRecord.apiKey}
            </td>
            <td 
              className="px-6 py-4 whitespace-nowrap"
              data-testid={`api-key-management-table_status-${idx}`}
            >
              {apiKeyRecord.isActive ? (
                <span className="px-2 py-1 text-sm font-medium bg-gray-500 rounded">
                  Is Active
                </span>
              ) : (
                <button
                  className="px-2 py-1 text-sm font-medium text-white bg-green-500 rounded"
                  onClick={() => onActivate(apiKeyRecord.id)}
                >
                  Activate
                </button>
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <button
                className="px-2 py-1 text-sm font-medium text-white bg-red-500 rounded"
                onClick={() => onDelete(apiKeyRecord.id)}
                disabled={apiKeys.length === 1 && !apiKeyRecord.isActive}
                title={apiKeys.length === 1 && !apiKeyRecord.isActive ? "You must have at least one API key, add a new one if you wish to delete this one" : ""}
                data-testid={`api-key-management-table_delete-button-${idx}`}
              >
                Delete
              </button>
              {errors[apiKeyRecord.id] && (
                <div 
                  className="mt-1 text-xs text-red-500"
                >
                  {errors[apiKeyRecord.id]}
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ApiKeyManagementTable;
