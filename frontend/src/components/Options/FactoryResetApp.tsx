import React from 'react';

interface DeleteApiKeysButtonProps {
  onDeleteAll: () => Promise<void>;
  errorMessage: string;
}

const FactoryResetApp: React.FC<DeleteApiKeysButtonProps> = ({ onDeleteAll, errorMessage }) => {
  return (
    <div className="mt-4">
      <h3>Delete all API Keys</h3>
      <h4>
        Delete every API key (this will result in you going back to the setup page).
      </h4>
      <button
        className="px-4 py-2 font-medium bg-red-600 rounded text-white-50"
        onClick={onDeleteAll}
      >
        Factory Reset App
      </button>
      {errorMessage && <div className="mt-1 text-sm text-red-500">{errorMessage}</div>}
    </div>
  );
};

export default FactoryResetApp;
