import React from 'react';

interface DeleteApiKeysButtonProps {
  onDeleteAll: () => Promise<void>;
  errorMessage: string;
}

const FactoryResetApp: React.FC<DeleteApiKeysButtonProps> = ({ onDeleteAll, errorMessage }) => {
  return (
    <div className="mt-4">

      <button
        className="px-4 py-2 font-medium text-white bg-red-600 rounded"
        onClick={onDeleteAll}
        data-testid="factory-reset-app_button"
      >
        Factory Reset App
      </button>

      {errorMessage && 
        <div 
          className="mt-1 text-sm text-red-500"
          data-testid="factory-reset-app_error"
        >
          {errorMessage}
        </div>
      }
    </div>
  );
};

export default FactoryResetApp;
