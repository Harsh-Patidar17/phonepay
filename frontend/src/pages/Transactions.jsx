import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    // Get current user id from token to determine transaction direction
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserId(payload.id || payload.userId || '');
      } catch (e) {
        console.error('Error decoding token', e);
      }
    }

    const fetchTransactions = async () => {
      try {
        const response = await api.get('/transactions/history');
        setTransactions(response.data.transactions || response.data || []);
      } catch (err) {
        setError('Failed to fetch transaction logs.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '20vh' }}>
        <h2 style={{ color: 'var(--accent-color)', letterSpacing: '2px' }}>ACCESSING SECURE LOGS...</h2>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="page-title">Transaction Logs</h1>

      {error && (
        <div style={{ color: '#ef4444', marginBottom: '2rem', padding: '1rem', border: '1px solid #ef4444', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      {transactions.length === 0 ? (
        <div className="card text-center" style={{ color: 'var(--text-secondary)' }}>
          No transaction history found in the system.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {transactions.map((tx) => {
            // Determine if the transaction was sent or received by the current user
            // Assuming transaction object has senderId/receiverId or similar
            const isSender = tx.sender?._id === userId || tx.sender === userId || tx.senderId === userId;
            const type = isSender ? 'DEBIT' : 'CREDIT';
            const sign = isSender ? '-' : '+';
            const color = isSender ? '#ef4444' : '#22c55e'; // Red for sent, Green for received
            const party = isSender 
              ? `Payment to: ${tx.receiver?.name || tx.receiver?.email || 'Unknown'}` 
              : `Received from: ${tx.sender?.name || tx.sender?.email || 'Unknown'}`;

            return (
              <div key={tx._id || tx.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '4px', 
                      backgroundColor: isSender ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                      color: color,
                      fontWeight: 'bold',
                      letterSpacing: '1px'
                    }}>
                      {type}
                    </span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                      {new Date(tx.createdAt || tx.date).toLocaleString()}
                    </span>
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '500' }}>
                    {party}
                  </div>
                  {tx.status && (
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                      Status: {tx.status}
                    </div>
                  )}
                </div>
                
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: color }}>
                  {sign}₹{tx.amount?.toFixed(2) || '0.00'}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Transactions;
