/* transactions tabla:
    ID, walletID, amount, categoryID, type (kiadas/bevetel)
 */

const express = require('express');
const router = express.Router();
const {query} = require('../utils/database');

// GET all transactions
router.get('/', (req, res) => {
    query('SELECT * FROM transactions', (err, result) => {
        if (err) return res.status(500).json({ error: 'Internal Server Error', message: err.message });
        res.json(result);
    }, req)
})

// GET all transaction by user id
router.get('/user/:uid', (req, res) => {
    const { uid } = req.params;
    query('SELECT t.ID, t.amount, t.categoryID, t.type, t.walletID, c.name AS categoryName, w.name AS walletName FROM transactions t JOIN wallets w ON t.walletID = w.ID JOIN categories c ON t.categoryID = c.ID WHERE w.userID = ?', [uid], (err, result) => {
        if (err) return res.status(500).json({ error: 'Internal Server Error', message: err.message });
        res.json(result);
    })
})

// GET all transactions by wallet id
router.get('/wallet/:wid', (req, res) => {
    const { wid } = req.params;
    query('SELECT * FROM transactions WHERE walletID = ?', [wid], (err, result) => {
        if (err) return res.status(500).json({ error: 'Internal Server Error', message: err.message });
        if (result.length === 0) return res.status(404).json({ error: 'No transactions found for this wallet' });
        res.json(result);
    }, req)
})

// GET all transactions by wallet id and category id
router.get('/wallet/:wid/category/:cid', (req, res) => {
    const { wid, cid } = req.params;
    query('SELECT * FROM transactions WHERE walletID = ? AND categoryID = ?', [wid, cid], (err, result) => {
        if (err) return res.status(500).json({ error: 'Internal Server Error', message: err.message });
        if (result.length === 0) return res.status(404).json({ error: 'No transactions found for this wallet and category' });
        res.json(result);
    }, req)
})

// GET all transactions by wallet id and type
router.get('/wallet/:wid/type/:type', (req, res) => {
    const { wid, type } = req.params;
    query('SELECT * FROM transactions WHERE walletID = ? AND type = ?', [wid, type], (err, result) => {
        if (err) return res.status(500).json({ error: 'Internal Server Error', message: err.message });
        if (result.length === 0) return res.status(404).json({ error: 'No transactions found for this wallet and type' });
        res.json(result);
    }, req)
})

// GET one transaction by id
router.get('/:id', (req, res) => {
    const { id } = req.params;
    query('SELECT * FROM transactions WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Internal Server Error', message: err.message });
        if (result.length === 0) return res.status(404).json({ error: 'Transaction not found' });
        res.json(result[0]);
    }, req)
})

// POST new transaction
router.post('/', (req, res) => {
    const { walletID, amount, categoryID, type } = req.body;
    query('INSERT INTO transactions (walletID, amount, categoryID, type) VALUES (?, ?, ?, ?)', [walletID, amount, categoryID, type], (err, result) => {
        if (err) return res.status(500).json({ error: 'Internal Server Error', message: err.message });
        res.status(201).json({ message: 'Transaction created successfully' });
    }, req)
})

// PATCH transaction data by id
router.patch('/:id', (req, res) => {
    const { id } = req.params;
    const { walletID, amount, categoryID, type } = req.body;

    query('UPDATE transactions SET walletID = ?, amount = ?, categoryID = ?, type = ? WHERE id = ?', [walletID, amount, categoryID, type, id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Internal Server Error', message: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Transaction not found' });
        res.json({ message: 'Transaction updated successfully' });
    }, req)
})

// DELETE transaction by id
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    query('DELETE FROM transactions WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Internal Server Error', message: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Transaction not found' });
        res.json({ message: 'Transaction deleted successfully' });
    }, req)
})

module.exports = router;
