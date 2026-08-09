import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Auth.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', {
        username,
        email,
        password,
        fullName
      });
      // Redirect to login after successful registration
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="card auth-card">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join InstaClon today</p>
        
        <div className="auth-notice">
          <span className="auth-notice-icon">⚡</span>
          <div>
            <strong>Nota de servidor:</strong> Al usar recursos gratuitos de hosting (Render), la respuesta o creación de cuenta puede tardar unos 30-50 segundos mientras el servidor despierta. ¡Gracias por la paciencia!
          </div>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleRegister} className="auth-form">
          <input
            type="text"
            className="input-field"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <input
            type="text"
            className="input-field"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            className="input-field"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <button type="submit" className="btn btn-primary auth-submit">Sign Up</button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
