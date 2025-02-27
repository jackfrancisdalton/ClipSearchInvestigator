import { Routes, Route, BrowserRouter } from 'react-router-dom';
import SetUpPage from './pages/SetUpPage';
import SearchPage from './pages/SearchPage';

import './App.css';

function App() {
  // TODO: Configure when it should go to either of the pages
  // TODO: Configure a smooth transition

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SetUpPage />} />
        <Route path="/home" element={<SearchPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;