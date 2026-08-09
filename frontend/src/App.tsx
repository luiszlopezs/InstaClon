import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import Register from './pages/Register';

function App() {
  // Simple auth check - in production you'd use a context/store
  const isAuthenticated = localStorage.getItem('username') !== null;

  return (
    <BrowserRouter>
      {isAuthenticated && <Navbar />}
      <div className={isAuthenticated ? "main-content app-container" : ""}>
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
          <Route path="/" element={isAuthenticated ? <Feed /> : <Navigate to="/login" />} />
          <Route path="/profile/:username" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
