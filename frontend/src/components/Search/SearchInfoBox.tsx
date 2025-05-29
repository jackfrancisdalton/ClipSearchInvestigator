import React from "react";

const SearchInfoBox: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center flex-1 p-4 bg-background-dark">
            <h1 className="mb-4 text-xl font-bold text-center text-primary-medium">How CSI Works</h1>
            <div className="w-full max-w-md p-6 space-y-6 rounded-lg shadow-lg bg-background-medium">
                <div>
                    <h2 className="text-lg font-semibold text-primary-medium">1. Video Search</h2>
                    <p className="text-white">
                        To tell CSI which videos you want to scan, first enter a search query and number of results you'd like to scan.
                    </p>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-primary-medium">2. Transcript search</h2>
                    <p className="text-white">
                        Enter the terms or phrases you want to find in the video's we found in the previous step.
                    </p>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-primary-medium">3. Results</h2>
                    <p className="text-white">
                        We'll provide a breakdown of all the transcript matches in the videos with timestamped links to the video segment you want.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SearchInfoBox;