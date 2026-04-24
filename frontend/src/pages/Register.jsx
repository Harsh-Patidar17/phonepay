import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/auth/register', { name, email, phone, password });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '10vh' }}>
      <div className="card">
        <h2 className="text-center mb-8">Establish Identity</h2>
        
        {error && (
          <div style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="name">Alias (Name)</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Bruce Wayne"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Operator ID (Email)</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="bruce@wayne.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Comms Channel (Phone)</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="9876543210"
            />
          </div>
          <div className="form-group mb-8">
            <label htmlFor="password">Passcode</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          <button type="submit" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Registering...' : 'REQUEST ACCESS'}
          </button>
        </form>
        
        <p className="text-center mt-4" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Already cleared? <Link to="/login">Login Here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
