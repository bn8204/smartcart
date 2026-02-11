const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.MYSQL_TCP_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '45PVPS@iram2026',
  database: process.env.MYSQL_DBNAME || 'smartcart_db',
  port: process.env.MYSQL_TCP_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0
});

connection.connect((err) => {
  if (err) {
    console.warn('⚠️  Database connection warning:', err.message);
    console.warn('Database will retry connecting in 5 seconds...');
    setTimeout(() => connection.connect(), 5000);
  } else {
    console.log('✓ SmartCart database connected successfully');
  }
});

connection.on('error', (err) => {
  console.error('Database error:', err.message);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('Reconnecting to database...');
    connection.connect();
  }
  if (err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
    console.log('Reconnecting to database...');
    connection.connect();
  }
  if (err.code === 'PROTOCOL_ENQUEUE_AFTER_ACQUIRECONNECTION_FAILURE') {
    console.log('Reconnecting to database...');
    connection.connect();
  }
});

module.exports = connection;