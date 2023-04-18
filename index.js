const express = require('express')
const app = express()
const cors = require('cors');
const Router = require('./src/routes/index')
require('dotenv').config()
require('./src/database/connection')
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}.`);
});

app.use('/api/v1', Router);

app.get('/api', (req, res) => {
    res.status(200).json({ msg: 'Working fine' });
});