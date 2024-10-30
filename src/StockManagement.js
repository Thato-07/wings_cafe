import React, { useState } from 'react';

const StockManagement = ({ products = [], setProducts }) => {
    const [transaction, setTransaction] = useState({
        productId: '',
        quantity: '',
        type: 'add',
    });

    const [transactionHistory, setTransactionHistory] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTransaction({ ...transaction, [name]: value });
    };

    const handleStockChangeSubmit = (e) => {
        e.preventDefault();
        const { productId, quantity, type } = transaction;
        const quantityNum = parseInt(quantity, 10);

        if (isNaN(quantityNum) || quantityNum <= 0) {
            alert('Please enter a valid quantity.');
            return;
        }

        const product = products.find((p) => p.id === parseInt(productId, 10));
        if (!product) {
            alert('Selected product does not exist.');
            return;
        }

        setProducts((prevProducts) => {
            return prevProducts.map((prod) => {
                if (prod.id === parseInt(productId, 10)) {
                    const updatedQuantity = type === 'add'
                        ? prod.quantity + quantityNum
                        : Math.max(0, prod.quantity - quantityNum);

                    return { ...prod, quantity: updatedQuantity };
                }
                return prod;
            });
        });

        const transactionRecord = {
            date: new Date().toLocaleString(),
            type,
            quantity: quantityNum,
            productName: product.name,
        };
        setTransactionHistory((prevHistory) => [...prevHistory, transactionRecord]);

        alert(`Transaction successful: ${type === 'add' ? 'Added' : 'Deducted'} ${quantityNum} from ${product.name}`);
        setTransaction({ productId: '', quantity: '', type: 'add' });
    };

    return (
        <div>
            <h2>Stock Management</h2>
            {products.length > 0 ? (
                <>
                    <h3>Current Stock Levels</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Current Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.name}</td>
                                    <td>{product.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            ) : (
                <p>No Stock</p>
            )}

            <h3>Up date changes</h3>
            <form onSubmit={handleStockChangeSubmit}>
                <select name="productId" value={transaction.productId} onChange={handleChange} required>
                    <option value="">Select Product</option>
                    {products.map((product) => (
                        <option key={product.id} value={product.id}>
                            {product.name}
                        </option>
                    ))}
                </select>
                <input
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                    value={transaction.quantity}
                    onChange={handleChange}
                    required
                />
                <select name="type" value={transaction.type} onChange={handleChange}>
                    <option value="add">Top-Up Stock</option>
                    <option value="deduct">Low-Down Stock</option>
                </select>
                <button type="submit">Stock Rearrangements</button>
            </form>

            <h3>Stock Manipulation</h3>
            {transactionHistory.length > 0 ? (
                <ul>
                    {transactionHistory.map((transaction, index) => (
                        <li key={index}>
                            {transaction.date}: {transaction.type} {transaction.quantity} of {transaction.productName}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Make Transactions</p>
            )}
        </div>
    );
};

export default StockManagement;