import './App.css';
import './index.css'

import { StrictMode, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RootLayout } from './components/index.js';
import { OptionsPage, SearchPage, SetUpPage } from './pages/index.js';
import { redirectBasedOnAppConfigState } from './loaders/index.js';
import ErrorBoundary from './pages/ErrorBoundary.js';

const routerConfig = [
  { 
    path: '/', 
    element: <RootLayout />, 
    errorElement: <ErrorBoundary />,
    loader: redirectBasedOnAppConfigState, children: 
    [
      { index: true, element: <SearchPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'options', element: <OptionsPage /> },
      { path: 'setup', element: <SetUpPage /> }
    ]}
];

function App() {
  const router = createBrowserRouter(routerConfig);
 
  // TODO: replace fallback component 
  return (
    <StrictMode>
      <Suspense fallback={<div>Loading app...</div>}>
        <RouterProvider router={router} />
      </Suspense>
    </StrictMode>
  );
}

export default App;