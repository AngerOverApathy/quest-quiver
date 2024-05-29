import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthPage from './pages/AuthPage/AuthPage'; 
import Logout from './components/Logout/Logout'; 
import Navbar from './components/Navbar/Navbar';
import HomePage from './pages/HomePage/HomePage';
import { AuthProvider } from './contexts/AuthContext';
import './App.css'; 

function App() {
  return (
    // Wrap the entire application with AuthProvider to make authentication state available globally
    <AuthProvider>
      <Router>
        <Navbar />  
        <Routes>
          <Route path="/" element={<AuthPage />} /> {/* Route for the landing page, which includes login and register functionality */}
          <Route path="/home" element={<HomePage />} /> 
          <Route path="/login" element={<AuthPage />} /> 
          <Route path="/logout" element={<Logout />} /> 
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
