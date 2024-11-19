const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // Declare cors only once
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "wings_cafe",
    port: '3306'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database.');
});

// Middleware to log requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// User Registration
// User Registration
app.post('/users', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    try {
        await db.promise().query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
        res.status(201).json({ username });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Error registering user' });
    }
});

// Route to update stock
app.post('/stock', (req, res) => {
    const { productId, quantity, type } = req.body;
    const quantityChange = type === 'add' ? quantity : -quantity;

    db.query(
        'UPDATE products SET quantity = GREATEST(0, quantity + ?) WHERE id = ?',
        [quantityChange, productId],
        (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Error updating stock' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Product not found' });
            }
            res.json({ success: true });
        }
    );
});

// Route to handle product sales
app.post('/sell', (req, res) => {
    const { productId, quantity } = req.body;

    db.query(
        'UPDATE products SET quantity = GREATEST(0, quantity - ?) WHERE id = ?',
        [quantity, productId],
        (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Error processing sale' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Product not found' });
            }
            res.json({ success: true });
        }
    );
});



// User Login
// User Login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await db.promise().query('SELECT * FROM users WHERE username = ?', [username]);
        const user = rows[0];

        if (!user) {
            console.log('No user found with username:', username);
            return res.status(404).json({ error: 'User not found' });
        }

        console.log('Stored password:', user.password);

        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        res.status(200).json({ username: user.username });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Error logging in' });
    }
});



// Get all users
app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Error fetching users' });
        }
        res.json(results);
    });
});

// Update a user
// Update a user
app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    try {
        await db.promise().query('UPDATE users SET username = ?, password = ? WHERE id = ?', [username, password, id]);
        res.json({ id, username });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Error updating user' });
    }
});


// Delete a user
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM users WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Error deleting user' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(204).send(); // No content to return
    });
});

// Route to get all products
app.get('/products', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Error fetching products' });
        }
        res.json(results);
    });
});

// Route to add a new product
app.post('/products', (req, res) => {
    const { name, description, category, price, quantity } = req.body;
    
    console.log('Product data received:', { name, description, category, price, quantity });

    if (!name || !description || !category || price == null || quantity == null) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    db.query(
        'INSERT INTO products (name, description, category, price, quantity) VALUES (?, ?, ?, ?, ?)',
        [name, description, category, price, quantity],
        (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Error adding product' });
            }
            res.status(201).json({ id: results.insertId, name, description, category, price, quantity });
        }
    );
});

// Route to update a product by ID
app.put('/products/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, category, price, quantity } = req.body;
    db.query('UPDATE products SET name = ?, description = ?, category = ?, price = ?, quantity = ? WHERE id = ?',
             [name, description, category, price, quantity, id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Error updating product' });
        }
        res.json({ id, name, description, category, price, quantity });
    });
});

// Route to delete a product by ID
app.delete('/products/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM products WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Error deleting product' });
        }
        res.status(204).send();
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});