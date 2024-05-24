import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthPage from './pages/authPage';
//import HomePage from './pages/HomePage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
      </Routes>
    </Router>
  );
}

export default App;
