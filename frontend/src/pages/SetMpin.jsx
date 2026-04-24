import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const SetMpin = () => {
  const [mpin, setMpin] = useState('');
  const [confirmMpin, setConfirmMpin] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSetMpin = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    if (mpin.length !== 4) {
      return setStatus({ type: 'error', message: 'MPIN must be exactly 4 digits.' });
    }
    if (mpin !== confirmMpin) {
      return setStatus({ type: 'error', message: 'MPINs do not match.' });
    }

    setLoading(true);

    try {
      await api.post('/auth/set-mpin', { mpin });
      setStatus({ type: 'success', message: 'MPIN configured successfully.' });
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setStatus({ 
        type: 'error', 
        message: err.response?.data?.message || 'Failed to set MPIN. Try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '400px' }}>
      <h1 className="page-title">Security Settings</h1>
      
      <div className="card">
        <h2 className="text-center mb-4">Configure MPIN</h2>
        <p className="mb-8 text-center" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Set a 4-digit MPIN to authorize your transfers.
        </p>

        {status.message && (
          <div style={{ 
            padding: '1rem', 
            marginBottom: '1.5rem', 
            borderRadius: '4px',
            backgroundColor: status.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: status.type === 'success' ? '#22c55e' : '#ef4444',
            border: `1px solid ${status.type === 'success' ? '#22c55e' : '#ef4444'}`,
            textAlign: 'center',
            fontSize: '0.875rem'
          }}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSetMpin}>
          <div className="form-group">
            <label htmlFor="mpin">New MPIN</label>
            <input
              type="password"
              id="mpin"
              value={mpin}
              onChange={(e) => setMpin(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
              required
              maxLength="4"
              placeholder="••••"
              style={{ textAlign: 'center', letterSpacing: '0.5rem', fontSize: '1.2rem' }}
            />
          </div>
          
          <div className="form-group mb-8">
            <label htmlFor="confirmMpin">Confirm MPIN</label>
            <input
              type="password"
              id="confirmMpin"
              value={confirmMpin}
              onChange={(e) => setConfirmMpin(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
              required
              maxLength="4"
              placeholder="••••"
              style={{ textAlign: 'center', letterSpacing: '0.5rem', fontSize: '1.2rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
            <button type="submit" disabled={loading}>
              {loading ? 'PROCESSING...' : 'SET MPIN'}
            </button>
            <button 
              type="button" 
              className="outline" 
              onClick={() => navigate('/dashboard')}
              disabled={loading}
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetMpin;
