import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Simple base64 decoding if jwt-decode is not installed, but let's try manual decoding for safety if we don't have it
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserEmail(payload.email || payload.userId || 'Operator');
      } catch (e) {
        console.error('Error decoding token:', e);
        setUserEmail('Operator');
      }
    }
  }, []);

  return (
    <div className="container">
      <h1 className="page-title">Command Center</h1>
      
      <div className="card mb-8">
        <h2 style={{ marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '1.2rem', fontWeight: '500' }}>
          Welcome back,
        </h2>
        <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent-color)', letterSpacing: '1px' }}>
          {userEmail}
        </div>
        <p className="mt-4" style={{ color: 'var(--text-secondary)' }}>
          System status: <span style={{ color: '#22c55e' }}>Online</span> | Encryption: <span style={{ color: '#22c55e' }}>Active</span>
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <h3 className="mb-4">Transfer Funds</h3>
          <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>Initiate a secure transaction to another operator.</p>
          <Link to="/send-money">
            <button>INITIALIZE TRANSFER</button>
          </Link>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <h3 className="mb-4">Transaction Logs</h3>
          <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>Review history of all incoming and outgoing funds.</p>
          <Link to="/transactions">
            <button className="outline">VIEW LOGS</button>
          </Link>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <h3 className="mb-4">Security</h3>
          <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>Configure your 4-digit MPIN for transaction authorization.</p>
          <Link to="/set-mpin">
            <button className="outline">SET MPIN</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
