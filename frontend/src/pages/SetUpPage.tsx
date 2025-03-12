import { useState } from 'react';
import { saveApiKey } from '../Api';

function SetUpPage() {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setErrorMessage(`Error: message}`);

    try {
      await saveApiKey({ apiKey });
      setErrorMessage(null);
    } catch (err: Error | any) {
      setErrorMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => (
    <form 
      className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-md"
      onSubmit={handleSubmit}
    >
      <h1 className="mb-6 text-2xl font-bold text-center text-primary-500">Welcome to Youtube search, please complete your set up</h1>
      <label htmlFor="apiKey" className="block mb-2 text-sm font-medium text-white-100">YouTube API Key</label>
      <input
        id="apiKey"
        type="password"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="API Key"
        className="w-full p-2 mb-4 text-black rounded outline-none"
        aria-label="Paste your API Key here"
      />
      {errorMessage && (
        <div className="w-full p-2 mb-4 bg-red-500 rounded text-white-100">
          {errorMessage}
        </div>
      )}
      <button 
        type="submit"
        className="w-full p-2 mb-4 text-white rounded bg-primary-500 hover:bg-primary-600"
        aria-label="Complete Set Up"
      >
        Complete Set Up
      </button>
      <div className="text-sm text-gray-400">
        <p>
          You can find your YouTube API key in the Google Developer Console. Follow this <a href="https://developers.google.com/youtube/registering_an_application" className="text-primary-400">guide</a> to get your API key.
        </p>
        <br />
        <p>Note: There are limits on the number of requests you can make with the API key. Please refer to the <a href="https://developers.google.com/youtube/v3/getting-started#quota" className="text-primary-400">quota limits</a> for more information.</p>
      </div>
    </form>
  );

  const renderLoading = () => (
    <div className="flex items-center justify-center min-h-screen p-4 bg-background-700">
      <div className="w-16 h-16 border-4 border-t-4 border-gray-200 rounded-full border-t-primary-500 animate-spin"></div>
    </div>
  );

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-background-700">
      {loading ? renderLoading() : renderForm()}
    </div>
  );
}

export default SetUpPage;