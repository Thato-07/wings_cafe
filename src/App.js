import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Auth from './Auth';
import Dashboard from './Dashboard';
import ProductManagement from './ProductManagement';
import StockManagement from './StockManagement';
import UserManager from './UserManager';
import Navigation from './Navigation';
import PrivateRoute from './PrivateRoute';

const App = () => {
    const [users, setUsers] = useState([]); // State to manage users
    const [products, setProducts] = useState([]); // State to manage products
    const [loggedInUser, setLoggedInUser] = useState(null); // State to manage logged-in user

    const handleLogout = () => {
        setLoggedInUser(null); // Reset logged-in user state
        window.location.href = '/'; // Redirect to the login page
    };

    return (
        <div className="container">
             <h1>Wing Cafe Inventory System~~!!</h1>
            <Navigation onLogout={handleLogout} /> {/* Use handleLogout here */}
            <Routes>
                <Route 
                    path="/" 
                    element={<Auth setLoggedInUser={setLoggedInUser} users={users} setUsers={setUsers} />} 
                />
                <Route 
                    path="/dashboard" 
                    element={<PrivateRoute element={<Dashboard products={products} />} loggedInUser={loggedInUser} />} 
                />
                <Route 
                   path="/product-management" 
                   element={<PrivateRoute element={<ProductManagement products={products} setProducts={setProducts} />} loggedInUser={loggedInUser} />} 
               />
                <Route 
                    path="/stock-management" 
                    element={<PrivateRoute element={<StockManagement products={products} setProducts={setProducts} />} loggedInUser={loggedInUser} />} 
                />
                <Route 
                    path="/user-management" 
                    element={<PrivateRoute element={<UserManager users={users} setUsers={setUsers} />} loggedInUser={loggedInUser} />} 
                />
            </Routes>
        </div>
    );
};

export default App;