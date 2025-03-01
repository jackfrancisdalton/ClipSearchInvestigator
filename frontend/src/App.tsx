import SetUpPage from './pages/SetUpPage';
import SearchPage from './pages/SearchPage';

import './App.css';
import { useEffect, useState } from 'react';
import { isApiKeySet } from './Api';

function App() {
  // TODO: Configure when it should go to either of the pages
  // TODO: Configure a smooth transition

  const [isSetupComplete, setIsSetupComplete] = useState<boolean | null>(null);

  useEffect(() => {
    // Fetch the setup status from the backend
    isApiKeySet()
      .then((response) => {
        console.log(response)
        return response.isSet
      })
      .then((data: boolean) => setIsSetupComplete(data))
      .catch(error => {
        console.error('Error fetching setup status:', error);
        // Optionally, handle errors (set a default value or show an error message)
        setIsSetupComplete(false);
      })
  }, []);

  if (isSetupComplete === null) {
    return <div>Loading...</div>;
  }

  // TODO:
  // - Wrap with <Suspense>
  // - Wrap with <ErrorBoundary>
  // - Wrap with <StrictMode>
  // - 

  // Render SearchPage if setup is complete (true) or SetupPage if not (false)
  return isSetupComplete ? <SearchPage /> : <SetUpPage />;

  // return (
  //   <BrowserRouter>
  //     <Routes>
  //       <Route path="/" element={<SetUpPage />} />
  //       <Route path="/home" element={<SearchPage />} />
  //     </Routes>
  //   </BrowserRouter>
  // );
}

export default App;