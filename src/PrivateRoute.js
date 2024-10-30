import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, loggedInUser }) => {
    return loggedInUser ? element : <Navigate to="/" />;
};

export default PrivateRoute;