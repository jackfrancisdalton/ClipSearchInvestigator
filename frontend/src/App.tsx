import SetUpPage from './pages/SetUpPage';
import SearchPage from './pages/SearchPage';

import './App.css';
import { StrictMode, Suspense, useEffect, useState } from 'react';
import { isApiKeySet } from './Api';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { requireAuth } from './loaders';
import RootLayout from './components/Layouts/RootLayout/RootLayout';

function App() {
  // TODO: Configure when it should go to either of the pages
  // TODO: Configure a smooth transition

  const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      children: [
        {
          index: true,
          element: true ? <SearchPage /> : <SetUpPage />
        },
        {
          path: 'dashboard',
          loader: requireAuth,
          element: <SearchPage />
        },
        {
          path: 'setup',
          element: <SetUpPage />
        }
      ]
    }
  ]);

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
  // - set up so that search page is lazy loaded based on iff the API is actually returning a true value

  // Render SearchPage if setup is complete (true) or SetupPage if not (false)
  // const targetPage =  isSetupComplete ? <SearchPage /> : <SetUpPage />;


  return (
    <StrictMode>
      <Suspense fallback={<div>Loading route...</div>}>
        <RouterProvider router={router} />
      </Suspense>
    </StrictMode>
  );
  
  // return (
  //   <StrictMode>
  //     {targetPage}
  //   </StrictMode>
  // )
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