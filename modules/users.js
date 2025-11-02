const express = require('express');
const router = express.Router();
const {query} = require('../utils/database');

// GET all users
router.get('/', (req, res) => {
    query('SELECT * FROM users', (err, result) => {
        if (err) return res.status(500).json({ error: 'Internal Server Error', message: err.message });
        res.json(result);
    }, req)
})


// GET user by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    query('SELECT * FROM users WHERE ID = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Internal Server Error', message: err.message });
        if (result.length === 0) return res.status(404).json({ error: 'User not found' });
        res.json(result[0]);
    }, req)
})


// POST new user
router.post('/', (req, res) => {
    const { name, email, password } = req.body;
    query('INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, "user", "active")', [name, email, password], (err, result) => {
        if (err) return res.status(500).json({ error: 'Internal Server Error', message: err.message });
        res.status(201).json({ message: 'User created successfully' });
    }, req)
})

// DELETE user by ID
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Internal Server Error', message: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    }, req)
})

// PATCH user password with old password
router.patch('/:id/password', (req, res) => {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;
    if (oldPassword === newPassword) {
        return res.status(400).json({error: 'New password must be different from old password'});
    }
    query('UPDATE users SET password = ? WHERE id = ? AND password = ?', [newPassword, id, oldPassword], (err, result) => {
        if (err) return res.status(500).json({error: 'Internal Server Error', message: err.message});
        if (result.affectedRows === 0) return res.status(401).json({error: 'Invalid old password'});
        res.json({message: 'Password updated successfully'});
    }, req)
})

// PATCH user data
router.patch('/:id', (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id], (err, result) => {
        if (err) return res.status(500).json({error: 'Internal Server Error', message: err.message});
        if (result.affectedRows === 0) return res.status(404).json({error: 'User not found'});
        res.json({message: 'User updated successfully'});
    }, req)
})

module.exports = router;