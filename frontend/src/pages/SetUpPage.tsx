import { useState } from 'react';

function SetUpPage() {
  const [apiKey, setApiKey] = useState('');
  // const navigate = useNavigate();

  const handleSubmit = () => {
    // Process the API key (e.g., call setAndStoreApiKey)
    // Then navigate to the main content
    // navigate('/home');
  };

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen bg-background-700 text-white">
      <h1 className="text-2xl mb-4">Please Enter Your API Key</h1>
      <input
        type="text"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="Enter API Key"
        className="p-2 text-black"
      />
      <button className="mt-4 p-2 bg-blue-500" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}

export default SetUpPage;