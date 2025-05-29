import React from "react";

const LoadingSpinner: React.FC = () => {

    return (
        <div className="flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-dashed rounded-full border-primary-light animate-spin"></div>
        </div>
    );
}

export default LoadingSpinner;
