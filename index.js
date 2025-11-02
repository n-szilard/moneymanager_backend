const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const logger = require('./utils/logger');


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/users', require('./modules/users'));
app.use('/wallets', require('./modules/wallets'));

app.get('/', (req, res) => res.send('Money Manager API'));

app.listen(process.env.PORT, () => logger.info(`Server is running on port ${process.env.PORT}`));