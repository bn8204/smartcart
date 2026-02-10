const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '45PVPS@iram2026',
  database: 'smartcart_db'
});

connection.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.message);
    setTimeout(() => connection.connect(), 2000);
  } else {
    console.log('SmartCart database connected');
  }
});

connection.on('error', (err) => {
  console.error('Database error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    connection.connect();
  }
  if (err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
    connection.connect();
  }
});

module.exports = connection;