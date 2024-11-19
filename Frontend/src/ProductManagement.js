import React, { useEffect, useState } from 'react';

const ProductManagement = ({ setProducts }) => {
    const [product, setProduct] = useState({ name: '', description: '', category: '', price: '', quantity: '' });
    const [products, setProductsLocal] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/products');
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                setProductsLocal(data);
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, [setProducts]);

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const headers = {
                'Content-Type': 'application/json'
            };

            if (isEditing) {
                // PUT request to update a product
                const response = await fetch(`http://localhost:5000/products/${product.id}`, {
                    method: 'PUT',
                    headers,
                    body: JSON.stringify(product)
                });

                if (!response.ok) {
                    throw new Error('Failed to update product');
                }
                setIsEditing(false);
            } else {
                // POST request to add a new product
                const response = await fetch('http://localhost:5000/products', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(product)
                });

                if (!response.ok) {
                    throw new Error('Failed to submit product');
                }

                const data = await response.json();
                setProductsLocal(prevProducts => [...prevProducts, data]);
                setProducts(prevProducts => [...prevProducts, data]);
            }

            // Reset the product form
            setProduct({ name: '', description: '', category: '', price: '', quantity: '' });
        } catch (error) {
            console.error('Error submitting product:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/products/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Failed to delete product');
            }
            const newProducts = products.filter(prod => prod.id !== id);
            setProductsLocal(newProducts);
            setProducts(newProducts);
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handleEdit = (prod) => {
        setProduct(prod);
        setIsEditing(true);
    };

    return (
        <div>
            <h2>Product Management</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    value={product.name}
                    placeholder="Product Name"
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="description"
                    value={product.description}
                    placeholder="Description"
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="category"
                    value={product.category}
                    placeholder="Category"
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="price"
                    value={product.price}
                    placeholder="Price (M)"
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="quantity"
                    value={product.quantity}
                    placeholder="Quantity"
                    onChange={handleChange}
                    required
                />
                <button type="submit">{isEditing ? 'Update Product' : 'Add Product'}</button>
            </form>

            <h3>Product Table</h3>
            <table>
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((prod) => (
                        <tr key={prod.id}>
                            <td>{prod.name}</td>
                            <td>{prod.category}</td>
                            <td>M{prod.price}</td>
                            <td>{prod.quantity}</td>
                            <td>
                                <button onClick={() => handleEdit(prod)}>Edit</button>
                                <button onClick={() => handleDelete(prod.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductManagement;