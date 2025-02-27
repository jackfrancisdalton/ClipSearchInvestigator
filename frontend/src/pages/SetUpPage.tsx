import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

function SetUpPage() {
  const [apiKey, setApiKey] = useState('');
  const [showPage, setShowPage] = useState(false);
  // const navigate = useNavigate();

  useEffect(() => {
    setShowPage(true);
  }, []);

  const handleSubmit = () => {
    // Process the API key (e.g., call setAndStoreApiKey)
    // Then navigate to the main content
    // navigate('/home');
  };

  return (
    <CSSTransition in={showPage} timeout={300} classNames="fade" unmountOnExit>
      <div className="w-full flex flex-col items-center justify-center min-h-screen bg-background-700 text-white p-4">
        <h1 className="text-3xl mb-4">To get started, enter your YouTube API key here</h1>
        <input
          type="text"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter API Key"
          className="p-2 text-black w-full max-w-md"
        />
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
      </div>
    </CSSTransition>
  );
}

export default SetUpPage;