import React from "react";
import { useRouteError, isRouteErrorResponse } from "react-router-dom";

const ErrorBoundary: React.FC = () => {
  const error = useRouteError();
  let errorMessage = "An unexpected error has occurred.";

  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText || errorMessage;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-background-dark">
      <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-md">
        <div className="p-4 text-center">
          <h1 
            className="text-2xl text-red-600"
            data-testid="error-title"
          >
              Something went wrong!
          </h1>
          <p 
            className="text-white"
            data-testid="error-message"
          >
            {errorMessage}
          </p>
        </div>
      </div>
    </div>

  );
};

export default ErrorBoundary;
