const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

// Connect to PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
});

// Automatically create table if it doesn't exist
const initDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                user_id SERIAL PRIMARY KEY,
                first_name VARCHAR(50) NOT NULL,
                last_name VARCHAR(50) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                phone_number VARCHAR(20),
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Database table initialized successfully.");
    } catch (err) {
        console.error("Error initializing database table:", err.message);
    }
};
initDB();

// DATABASE CONNECTION TEST ENDPOINT
app.get('/api/healthcheck', async (req, res) => {
    try {
        // Run a simple query to see if Postgres responds
        await pool.query('SELECT 1');
        res.json({ status: 'success', message: 'Connected' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// 1. READ ALL USERS
app.get('/api/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users ORDER BY user_id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// 2. CREATE A USER
app.post('/api/users', async (req, res) => {
    try {
        const { first_name, last_name, email, phone_number } = req.body;
        const newUser = await pool.query(
            'INSERT INTO users (first_name, last_name, email, phone_number) VALUES($1, $2, $3, $4) RETURNING *',
            [first_name, last_name, email, phone_number]
        );
        res.json(newUser.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send(err.message);
    }
});

// 3. UPDATE A USER
app.put('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, email, phone_number } = req.body;
        const updateUser = await pool.query(
            'UPDATE users SET first_name = $1, last_name = $2, email = $3, phone_number = $4 WHERE user_id = $5 RETURNING *',
            [first_name, last_name, email, phone_number, id]
        );
        res.json(updateUser.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// 4. DELETE A USER
app.delete('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM users WHERE user_id = $1', [id]);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
