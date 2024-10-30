import React, { useState } from 'react';

const UserManager = ({ users, setUsers }) => {
    const [user, setUser] = useState({ username: '', password: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState(null); // Initialize editIndex state

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditing) {
            // If editing, update the existing user
            const updatedUsers = users.map((usr, index) => (index === editIndex ? user : usr));
            setUsers(updatedUsers);
            setIsEditing(false);
            setEditIndex(null);
        } else {
            // If adding a new user
            setUsers([...users, user]);
        }
        setUser({ username: '', password: '' }); // Clear input fields
    };

    const handleDelete = (index) => {
        const newUsers = users.filter((_, i) => i !== index);
        setUsers(newUsers);
    };

    const handleEdit = (index) => {
        setUser(users[index]); // Correctly set user for editing
        setIsEditing(true);
        setEditIndex(index);
    };

    return (
        <div>
            <h2>User Management</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    name="username" 
                    value={user.username} 
                    placeholder="Username" 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    type="password" 
                    name="password" 
                    value={user.password} 
                    placeholder="Password" 
                    onChange={handleChange} 
                    required 
                />
                <button type="submit">{isEditing ? 'Update User' : 'Add User'}</button>
            </form>
            <h3>User List</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid gray', padding: '8px', textAlign: 'left' }}>Username</th>
                        <th style={{ border: '1px solid gray', padding: '8px', textAlign: 'left' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((usr, index) => (
                        <tr key={index}>
                            <td style={{ border: '1px solid gray', padding: '8px' }}>{usr.username}</td>
                            <td style={{ border: '1px solid gray', padding: '8px' }}>
                                <button onClick={() => handleEdit(index)}>Edit</button>     
                                <button onClick={() => handleDelete(index)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserManager;