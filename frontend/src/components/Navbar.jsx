import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
            PHONE<span className="text-accent">PAY</span>
          </Link>
        {token && (
          <div className="navbar-links">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/send-money">Send Money</Link>
            <Link to="/transactions">Transactions</Link>
            <button className="outline logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
