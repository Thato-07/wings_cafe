import React, { useState } from 'react';

const ProductManagement = ({ products, setProducts }) => {
    const [product, setProduct] = useState({ id: Date.now(), name: '', description: '', category: '', price: '', quantity: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState(null);

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            const updatedProducts = products.map((prod, index) => (index === editIndex ? product : prod));
            setProducts(updatedProducts);
            setIsEditing(false);
            setEditIndex(null);
        } else {
            setProducts([...products, { ...product, id: Date.now() }]); // Add unique ID
        }
        setProduct({ id: Date.now(), name: '', description: '', category: '', price: '', quantity: '' }); // Reset form
    };

    const handleDelete = (index) => {
        const newProducts = products.filter((_, i) => i !== index);
        setProducts(newProducts);
    };

    const handleEdit = (index) => {
        setProduct(products[index]);
        setIsEditing(true);
        setEditIndex(index);
    };

    const handleSell = (index) => {
        const updatedProducts = products.map((prod, i) => {
            if (i === index && prod.quantity > 0) {
                return { ...prod, quantity: prod.quantity - 1 }; 
            }
            return prod;
        });
        setProducts(updatedProducts);
    };

    return (
        <div>
            <h2>Product Management</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" value={product.name} placeholder="Product Name" onChange={handleChange} required />
                <input type="text" name="description" value={product.description} placeholder="Description" onChange={handleChange} required />
                <input type="text" name="category" value={product.category} placeholder="Category" onChange={handleChange} required />
                <input type="number" name="price" value={product.price} placeholder="Price (M)" onChange={handleChange} required />
                <input type="number" name="quantity" value={product.quantity} placeholder="Quantity" onChange={handleChange} required />
                <button type="submit">{isEditing ? 'Update Product' : 'Add Product'}</button>
            </form>
           
            <h3>Product Table</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid red', padding: '8px', textAlign: 'left' }}>Product Name</th>
                        <th style={{ border: '1px solid red', padding: '8px', textAlign: 'left' }}>Category</th>
                        <th style={{ border: '1px solid red', padding: '8px', textAlign: 'left' }}>Price</th>
                        <th style={{ border: '1px solid red', padding: '8px', textAlign: 'left' }}>Quantity</th>
                        <th style={{ border: '1px solid red', padding: '8px', textAlign: 'left' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((prod, index) => (
                        <tr key={prod.id}>
                            <td style={{ border: '1px solid red', padding: '8px' }}>{prod.name}</td>
                            <td style={{ border: '1px solid red', padding: '8px' }}>{prod.category}</td>
                            <td style={{ border: '1px solid red', padding: '8px' }}>M{prod.price}</td>
                            <td style={{ border: '1px solid red', padding: '8px' }}>{prod.quantity}</td>
                            <td style={{ border: '1px solid red', padding: '8px' }}>
                                <button onClick={() => handleEdit(index)}>Edit</button>
                                <button onClick={() => handleDelete(index)}>Delete</button>
                                <button onClick={() => handleSell(index)} disabled={prod.quantity <= 0}>Sell</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductManagement;