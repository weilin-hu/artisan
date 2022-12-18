const mysql   = require('mysql');
const config  = require('./config.json');

// connect to rds 
const db = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    port: config.port,
    database: config.db
});

module.exports = db;