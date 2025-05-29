import React from "react";

const SearchInfoBox: React.FC = () => {
    return (
        <div className="flex items-center justify-center flex-1 p-4 bg-background-dark">
            <div className="w-full max-w-md p-6 space-y-6 rounded-lg shadow-lg bg-background-medium">
                <div>
                    <h2 className="text-lg font-semibold text-primary-medium">1. Video Search</h2>
                    <p className="text-white">
                        First define the Youtube search you'd like and the number of videos you'd like us to scan
                    </p>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-primary-medium">2. Transcript search</h2>
                    <p className="text-white">
                        For the videos found in the video search, you can in turn search term for specific terms in their transcripts
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