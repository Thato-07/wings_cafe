import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = ({ onLogout }) => {
    return (
        <nav className="navbar">
            <ul>
                <li><Link to="/product-management">Product Management</Link></li>
                <li><Link to="/stock-management">Stock Management</Link></li>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/user-management">User Management</Link></li>
                <li><button onClick={onLogout}>Logout</button></li>
            </ul>
        </nav>
    );
};

export default Navigation;