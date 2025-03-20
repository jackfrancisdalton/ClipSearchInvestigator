import React from 'react';

const SearchErrorMessage: React.FC<{errorMessage: string}> = ({ errorMessage }) => {
    return (
        <div className="flex items-center justify-center flex-1 p-4 bg-background-700">
            <div className="w-full max-w-md p-6 space-y-6 bg-white rounded-lg shadow-lg bg-background-600">
                <h1>Search Error</h1>
                <p>{errorMessage}</p>
            </div>
        </div>
    );
};

export default SearchErrorMessage;