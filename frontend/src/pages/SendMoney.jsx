import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const SendMoney = () => {
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [mpin, setMpin] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSend = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    setLoading(true);

    try {
      await api.post('/transactions/send', { phone, mpin, amount: Number(amount) });
      setStatus({ type: 'success', message: 'Transaction successful.' });
      setTimeout(() => navigate('/transactions'), 2000);
    } catch (err) {
      setStatus({ 
        type: 'error', 
        message: err.response?.data?.message || 'Transaction failed. Please verify recipient.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <h1 className="page-title">Initiate Transfer</h1>
      
      <div className="card">
        {status.message && (
          <div style={{ 
            padding: '1rem', 
            marginBottom: '1.5rem', 
            borderRadius: '4px',
            backgroundColor: status.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: status.type === 'success' ? '#22c55e' : '#ef4444',
            border: `1px solid ${status.type === 'success' ? '#22c55e' : '#ef4444'}`
          }}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSend}>
          <div className="form-group">
            <label htmlFor="phone">Recipient Phone Number</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="Enter recipient phone"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="mpin">Secure MPIN</label>
            <input
              type="password"
              id="mpin"
              value={mpin}
              onChange={(e) => setMpin(e.target.value)}
              required
              maxLength="4"
              placeholder="••••"
            />
          </div>
          
          <div className="form-group mb-8">
            <label htmlFor="amount">Amount (INR)</label>
            <div style={{ position: 'relative' }}>
              <span style={{ 
                position: 'absolute', 
                left: '1rem', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: 'var(--text-secondary)'
              }}>₹</span>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="1"
                placeholder="0.00"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" style={{ flex: 1 }} disabled={loading}>
              {loading ? 'PROCESSING...' : 'AUTHORIZE TRANSFER'}
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

export default SendMoney;
