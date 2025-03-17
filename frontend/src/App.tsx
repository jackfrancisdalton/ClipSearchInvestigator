import './App.css';

import { StrictMode, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RootLayout } from './components';
import { OptionsPage, SearchPage, SetUpPage } from './pages';
import { redirectBasedOnAppConfigState } from './loaders';

const routerConfig = [
  { path: '/', element: <RootLayout />, loader: redirectBasedOnAppConfigState, children: [
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
      <Suspense fallback={<div>Loading route...</div>}>
        <RouterProvider router={router} />
      </Suspense>
    </StrictMode>
  );
}

export default App;