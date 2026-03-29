import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, LayoutDashboard, LogIn, UserPlus } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar fade-in">
      <Link to="/" style={{ textDecoration: 'none' }}>
        <div className="nav-brand">TaskFlow</div>
      </Link>
      
      <div className="nav-links">
        {user ? (
          <>
            <span className="user-greeting" style={{ color: 'var(--text-secondary)', marginRight: '1rem' }}>
              Hi, {user.name}
            </span>
            <Link to="/dashboard" className="btn btn-primary">
              <LayoutDashboard size={18} /> <span className="btn-text">Dashboard</span>
            </Link>
            <button onClick={handleLogout} className="btn btn-danger">
              <LogOut size={18} /> <span className="btn-text">Logout</span>
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn" style={{ color: 'var(--text-primary)', background: 'transparent' }}>
              <LogIn size={18} /> <span className="btn-text">Login</span>
            </Link>
            <Link to="/register" className="btn btn-primary">
              <UserPlus size={18} /> <span className="btn-text">Register</span>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
