import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Auth.css';

const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', {
        usernameOrEmail: usernameOrEmail,
        password: password
      });
      // Backend returns {success, message, user}
      if (response.data && response.data.user && response.data.user.username) {
        localStorage.setItem('username', response.data.user.username);
        localStorage.setItem('userId', response.data.user.id.toString());
        navigate('/');
        window.location.reload();
      } else {
        setError('Login failed, unexpected response');
      }
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="card auth-card">
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Log in to InstaClon</p>
        
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleLogin} className="auth-form">
          <input
            type="text"
            className="input-field"
            placeholder="Username or Email"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="input-field"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary auth-submit">Log In</button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register" className="auth-link">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
