import { useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
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
      className="w-full flex flex-col items-center justify-center min-h-screen bg-background-700 text-white p-4"
      onSubmit={handleSubmit}
    >
      <h1 className="text-3xl mb-4">To get started, enter your YouTube API key here</h1>
      <input
        type="text"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="Enter API Key"
        className="p-2 text-black w-full max-w-md"
      />
      {/* TODO: add loading conditions */}
      {/* TODO: add error message */}
      <button className="mt-4 p-2 bg-blue-500 w-full max-w-md" onClick={handleSubmit}>
        Submit
      </button>
      <div className="mt-4 p-4 bg-gray-800 w-full max-w-md text-sm">
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