const db = require('../config/db');

exports.create = async (userData) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO users (email, password, name) VALUES (?, ?, ?)';
    db.query(query, [userData.email, userData.password, userData.name], (err, result) => {
      if (err) reject(err);
      resolve({ id: result.insertId, ...userData });
    });
  });
};

exports.findByEmail = async (email) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    console.log('Searching for email:', email);
    db.query(query, [email], (err, results) => {
      console.log('Query results:', results);
      if (err) {
        console.error('Query error:', err);
        reject(err);
      }
      // results is an array, so get the first element
      const user = results && results.length > 0 ? results[0] : null;
      console.log('Found user:', user);
      resolve(user);
    });
  });
};