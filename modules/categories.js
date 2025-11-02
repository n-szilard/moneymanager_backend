const express = require('express');
const router = express.Router();
const {query} = require('../utils/database');

// GET all categories
router.get('/', (req, res) => {
    query('SELECT * FROM categories', (err, result) => {
        if (err) return res.status(500).json({ error: 'Internal Server Error', message: err.message });
        res.json(result);
    }, req)
})


// GET one category by id
router.get('/:id', (req, res) => {
    const { id } = req.params;
    query('SELECT * FROM categories WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Internal Server Error', message: err.message });
        if (result.length === 0) return res.status(404).json({ error: 'Category not found' });
        res.json(result[0]);
    }, req)
})


// POST new category
router.post('/', (req, res) => {
    const { name } = req.body;
    query('INSERT INTO categories (name) VALUES (?)', [name], (err, result) => {
        if (err) return res.status(500).json({ error: 'Internal Server Error', message: err.message });
        res.status(201).json({ message: 'Category created successfully' });
    }, req)
})


// PATCH category name by id
router.patch('/name/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    query('UPDATE categories SET name = ? WHERE id = ?', [name, id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Internal Server Error', message: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Category not found' });
        res.json({ message: 'Category name updated successfully' });
    }, req)
})


// DELETE category by id
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    query('DELETE FROM categories WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Internal Server Error', message: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Category not found' });
        res.json({ message: 'Category deleted successfully' });
    }, req)
})

module.exports = router;