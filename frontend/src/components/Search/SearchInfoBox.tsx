const SearchInfoBox = () => {
    return (
        <div className="flex items-center justify-center flex-1 p-4 bg-background-700">
            <div className="w-full max-w-md p-6 space-y-6 bg-white rounded-lg shadow-lg bg-background-600">
                <div>
                    <h2 className="text-lg font-semibold text-primary-600">1. Video Search</h2>
                    <p className="text-white-50">
                    Define the videos you'd like to search through. All this requires is a search like you'd do on YouTube. You can detail how many videos you want to search through as well as details like release date and channel.
                    </p>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-primary-600">2. Transcript search</h2>
                    <p className="text-white-50">
                    You can define the term or terms you'd like to find in the video results you just searched for.
                    </p>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-primary-600">3. Results</h2>
                    <p className="text-white-50">
                    We'll provide a breakdown of all the transcript matches in the videos you search for with timestamps that also link to the video timestamp in question.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SearchInfoBox;