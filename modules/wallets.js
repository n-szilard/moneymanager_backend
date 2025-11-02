const express = require('express');
const router = express.Router();
const {query} = require('../utils/database');

// GET all wallets
router.get('/', (req, res) => {
    query('SELECT * FROM wallets', (err, result) => {
        if (err) return res.status(500).json({ error: 'Internal Server Error', message: err.message });
        res.json(result);
    }, req)
})


// GET one wallet by id
router.get('/:id', (req, res) => {
    const { id } = req.params;
    query('SELECT * FROM wallets WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Internal Server Error', message: err.message });
        if (result.length === 0) return res.status(404).json({ error: 'Wallet not found' });
        res.json(result[0]);
    }, req)
})

// GET all wallets by user id
router.get('/user/:uid', (req, res) => {
    const { uid } = req.params;
    query('SELECT * FROM wallets WHERE userID = ?', [uid], (err, result) => {
        if (err) return res.status(500).json({ error: 'Internal Server Error', message: err.message });
        if (result.length === 0) return res.status(404).json({ error: 'No wallets found for this user' });
        res.json(result);
    }, req)
})


// POST new wallet with user id
router.post('/', (req, res) => {
    const { userID, name, balance } = req.body;
    query('INSERT INTO wallets (userID, name, balance) VALUES (?, ?, ?)', [userID, name, balance], (err, result) => {
        if (err) return res.status(500).json({ error: 'Internal Server Error', message: err.message });
        res.status(201).json({ message: 'Wallet created successfully' });
    }, req)
})

// PATCH wallet name by id
router.patch('/name/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    query('UPDATE wallets SET name = ? WHERE id = ?', [name, id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Internal Server Error', message: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Wallet not found' });
        res.json({ message: 'Wallet name updated successfully' });
    }, req)
})

// PATCH wallet balance by id
router.patch('/balance/:id', (req, res) => {
    const { id } = req.params;
    const { balance } = req.body;
    query('UPDATE wallets SET balance = ? WHERE id = ?', [balance, id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Internal Server Error', message: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Wallet not found' });
        res.json({ message: 'Wallet balance updated successfully' });
    }, req)
})

// DELETE wallet by id
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    query('DELETE FROM wallets WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Internal Server Error', message: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Wallet not found' });
        res.json({ message: 'Wallet deleted successfully' });
    }, req)
})

module.exports = router;