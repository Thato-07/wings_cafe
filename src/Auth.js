import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Auth = ({ setLoggedInUser, users, setUsers }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate(); // Use the navigate hook

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLogin) {
            const user = users.find(user => user.username === username);
            if (user && user.password === password) {
                alert('Login successful!');
                setLoggedInUser(user); // Set the logged-in user object
                navigate('/product-management'); // Redirect to Product Management page
            } else {
                alert('Invalid username or password.');
            }
        } else {
            if (users.find(user => user.username === username)) {
                alert('Username already taken. Please choose a different one.');
            } else {
                setUsers([...users, { username, password }]);
                alert('Sign-up successful! You can now log in.');
                setUsername('');
                setPassword('');
            }
        }
    };

    return (
        <div className="container">
            <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
            <form onSubmit={handleSubmit} className="form">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="input"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="input"
                />
                <button type="submit" className="button">
                    {isLogin ? 'Login' : 'Sign Up'}
                </button>
            </form>
            <button
                onClick={() => setIsLogin(!isLogin)}
                className="switchButton"
            >
                Switch to {isLogin ? 'Sign Up' : 'Login'}
            </button>
        </div>
    );
};

export default Auth;