import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { saveApiKey } from '../api/index.js';

function SetUpPage() {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      await saveApiKey({ apiKey });
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 4000); // Navigate to the home page after 2 seconds
    } catch (err: Error | any) {
      setErrorMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit}>
      <h1 className="mb-6 text-2xl font-bold text-center text-primary-light">Welcome to Youtube search, please complete your set up</h1>
      <label htmlFor="apiKey" className="block mb-2 text-sm font-medium text-white-medium">YouTube API Key</label>
      <input
        id="apiKey"
        type="password"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="API Key"
        className="w-full p-2 mb-4 text-black rounded outline-none"
        aria-label="Paste your API Key here"
        disabled={loading}
      />
      {errorMessage && (
        <div className="w-full p-2 mb-4 bg-red-500 rounded text-white-medium">
          {errorMessage}
        </div>
      )}
      <button 
        type="submit"
        className="w-full p-2 mb-4 text-white rounded bg-primary-light hover:bg-primary-medium"
        aria-label="Complete Set Up"
        disabled={loading}
      >
        Complete Set Up
      </button>
      <div className="text-sm text-gray-400">
        <p>
          You can find your YouTube API key in the Google Developer Console. Follow this <a href="https://developers.google.com/youtube/registering_an_application" className="text-primary-light">guide</a> to get your API key.
        </p>
        <br />
        <p>Note: There are limits on the number of requests you can make with the API key. Please refer to the <a href="https://developers.google.com/youtube/v3/getting-started#quota" className="text-primary-light">quota limits</a> for more information.</p>
      </div>
    </form>
  );


  const renderSuccess = () => (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center">
      <div className="w-16 h-16 mb-4 text-green-500 animate-bounce">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>
      <p className="text-white-medium">Perfect, you're all set up, navigating to the app now...</p>
      </div>
    </div>
  );

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-background-dark">
      <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-md">
        <SwitchTransition>
          <CSSTransition key={success ? 'success' : 'form'} timeout={200} classNames="fade">
            <>{success ? renderSuccess() : renderForm()}</>
          </CSSTransition>
        </SwitchTransition>
      </div>
    </div>
  );
}

export default SetUpPage;