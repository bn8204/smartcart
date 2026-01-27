const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '45PVPS@iram2026',
  database: 'smartcart_db'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed');
    return;
  }
  console.log('SmartCart database connected');
});

module.exports = db;