import './App.css';

import { StrictMode, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RootLayout } from './components';
import { OptionsPage, SearchPage, SetUpPage } from './pages';
import { redirectBasedOnAppConfigState } from './loaders';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      loader: redirectBasedOnAppConfigState,
      children: [
        {
          index: true,
          element: <SearchPage />
        },
        {
          path: 'search',
          element: <SearchPage />
        },
        {
          path: 'options',
          element: <OptionsPage />
        },
        {
          path: 'setup',
          element: <SetUpPage />
        }
      ]
    }
  ]);

  // TODO:
  // - Wrap with <ErrorBoundary>
  // - set up so that search page is lazy loaded based on iff the API is actually returning a true value
  // - replace suspense with an actual component for loading
  // TODO: Configure a smooth transition and proper loading rooute

  return (
    <StrictMode>
      <Suspense fallback={<div>Loading route...</div>}>
        <RouterProvider router={router} />
      </Suspense>
    </StrictMode>
  );
}

export default App;