const mysql = require('mysql2');
require('dotenv').config();  // Load environment variables from .env file

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

db.connect((err) => {
    if(err)
        console.log('error: ', err);
    else
        console.log('connected');
});

module.exports = db;
