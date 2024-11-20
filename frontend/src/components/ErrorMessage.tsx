import React from 'react';

const ErrorMessage: React.FC<{ errorMessage: string }> = ({ errorMessage }) => {
    return (
        <div className="p-4">
            <h1 className="text-red-600">{errorMessage}</h1>
        </div>
    );
};

export default ErrorMessage;