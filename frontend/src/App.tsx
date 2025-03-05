import SetUpPage from './pages/SetUpPage';
import SearchPage from './pages/SearchPage';

import './App.css';

import { StrictMode, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { isAppConfigured } from './loaders';
import RootLayout from './components/Layouts/RootLayout/RootLayout';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      children: [
        {
          index: true,
          loader: isAppConfigured,
          element: <SearchPage />
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