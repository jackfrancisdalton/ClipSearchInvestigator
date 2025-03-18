import React from 'react';
import { ApiKey } from '../../types';

interface ApiKeyTableProps {
  apiKeys: ApiKey[];
  errors: { [id: number]: string };
  onActivate: (id: number) => void;
  onDelete: (id: number) => void;
}

const ApiKeyManagementTable: React.FC<ApiKeyTableProps> = ({ apiKeys, errors, onActivate, onDelete }) => {
  return (
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
        {apiKeys.map(key => (
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
                  onClick={() => onActivate(key.id)}
                >
                  Activate
                </button>
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <button
                className="px-2 py-1 text-sm font-medium bg-red-500 rounded text-white-50"
                onClick={() => onDelete(key.id)}
                disabled={apiKeys.length === 1 && !key.isActive}
              >
                Delete
              </button>
              {errors[key.id] && (
                <div className="mt-1 text-xs text-red-500">{errors[key.id]}</div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ApiKeyManagementTable;
