import React from 'react';

const SearchErrorMessage: React.FC<{errorMessage: string}> = ({ errorMessage }) => {
    return (
        <div className="flex items-center justify-center flex-1 p-4 bg-background-dark">
            <div className="w-full max-w-md p-6 space-y-2 rounded-lg shadow-lg bg-background-medium">
                <h1 className="font-bold text-red-500">Bad Luck</h1>
                <p 
                    className="text-white"
                    data-testid="search-error-message"
                >
                    {errorMessage}
                </p>
            </div>
        </div>
    );
};

export default SearchErrorMessage;