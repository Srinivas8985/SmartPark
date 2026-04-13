import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { theme } = useContext(ThemeContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar glass">
            <div className="container navbar-container">
                {/* Logo */}
                <Link to="/" className="navbar-logo">
                    <span className="navbar-logo-icon">🅿️</span>
                    <span className="navbar-logo-text">ParkSmart</span>
                </Link>

                {/* Right side navigation */}
                <div className="navbar-links">
                    <ThemeToggle />

                    {user ? (
                        <>
                            <Link to="/dashboard" className="btn btn-outline btn-sm">Dashboard</Link>
                            {user.role === 'OWNER' && (
                                <Link to="/add-parking" className="btn btn-primary btn-sm">Add Space</Link>
                            )}
                            <div className="navbar-user">
                                <Link to="/my-bookings" className="avatar">
                                    {user.name?.charAt(0) || 'U'}
                                </Link>
                                <button onClick={handleLogout} className="text-danger font-semibold text-sm">
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="font-semibold text-sm">Log in</Link>
                            <Link to="/login" className="btn btn-primary btn-sm">Get Started</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
