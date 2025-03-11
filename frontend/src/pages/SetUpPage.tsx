import { useState } from 'react';
import { setAndStoreApiKey } from '../Api';

function SetUpPage() {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await setAndStoreApiKey({ apiKey });
      // TODO: show success then after timeout go to home page
    } catch (err) {
      setErrorMessage("error message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form 
      className="flex flex-col items-center justify-center w-full min-h-screen p-4 text-white bg-background-700"
      onSubmit={handleSubmit}
    >
      <h1 className="mb-4 text-3xl">To get started, enter your YouTube API key here</h1>
      <input
        type="text"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="Enter API Key"
        className="w-full max-w-md p-2 text-black"
      />
      {/* TODO: add loading conditions */}
      {/* TODO: add error message */}
      <button className="w-full max-w-md p-2 mt-4 bg-blue-500" onClick={handleSubmit}>
        Submit
      </button>
      <div className="w-full max-w-md p-4 mt-4 text-sm bg-gray-800">
        <p>You can find your YouTube API key in the Google Developer Console.</p>
        <p>
          Follow this <a href="https://developers.google.com/youtube/registering_an_application" className="text-blue-400">guide</a> to get your API key.
        </p>
        <p>Note: There are limits on the number of requests you can make with the API key. Please refer to the <a href="https://developers.google.com/youtube/v3/getting-started#quota" className="text-blue-400">quota limits</a> for more information.</p>
      </div>
    </form>
  );
}

export default SetUpPage;