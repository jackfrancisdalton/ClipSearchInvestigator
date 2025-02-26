import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SetUpPage from './pages/SetUpPage';
import SearchPage from './pages/SearchPage';

function App() {
  // TODO: Configure when it should go to either of the pages
  // TODO: Configure a smooth transition

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SetUpPage />} />
        <Route path="/home" element={<SearchPage />} />
      </Routes>
    </Router>
  );
}

export default App;