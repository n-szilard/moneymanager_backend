const express = require('express');
const router = express.Router();
const {query} = require('../utils/database');
const SHA1 = require("crypto-js/sha1");
const passwdRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

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


// LOGIN
router.post('/login', (req, res) => {
    let { email, password } = req.body;
    let table = 'users';

    if (!email || !password){
        res.status(400).send( { error: 'Hiányzó adatok!' });
        return;
    }

    query(`SELECT * FROM ${table} WHERE email=? AND password=?`, [email, SHA1(password).toString()], (error, results) => {
        if (error) return res.status(500).json({ error: error.message });
        if (results.length == 0){
            res.status(400).send({ error: 'Hibás belépési adatok!' });
            return;
        }
        res.status(200).json(results);
    }, req);

});

// Registation
router.post('/registration', (req, res) => {
    let table = 'users';
    let { name, email, password, confirm, phone} = req.body;

    if (!name || !email || !password || !confirm){
        res.status(400).send({ error: 'Hiányzó adatok!' });
        return;
    }

    if ( password != confirm){
        res.status(400).send({ error: 'A megadott jelszavak nem egeznek!' });
        return;
    }

    if (!password.match(passwdRegExp)){
        res.status(400).send({ error: 'A megadott jelszó nem elég biztonságos!' });
        return;
    }

    query(`SELECT id FROM ${table} WHERE email=?`, [email], (error, results)=>{
        if (error) return res.status(500).json({ error: error.message });

        if (results.length != 0){
            res.status(400).send({ error: 'A megadott e-mail cím már regisztrálva van!' });
            return;
        }

        query(`INSERT INTO ${table} (name, email, password, role, status) VALUES(?,?,?,'user','active')`, [name, email, SHA1(password).toString(), phone], (error, results) => {
            if (error) return res.status(500).json({ error: error.message });
            res.status(200).json(results);
        }, req);

    }, req);

});

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