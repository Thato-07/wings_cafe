import React from 'react';

const Dashboard = ({ products = [] }) => { 
    const totalProducts = products.length;
    const totalQuantity = products.reduce((sum, product) => sum + Number(product.quantity || 0), 0); 

    return (
        <div>
        
            <h1>Dashboard</h1>
            <h3>Stock Overview</h3>
            <p>Total Products: {totalProducts}</p>
            <p>Total Quantity: {totalQuantity}</p>
        
        </div>
    );
};

export default Dashboard;