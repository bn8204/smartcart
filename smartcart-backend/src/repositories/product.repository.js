const db = require('../config/db');

exports.findAll = async () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM products';
    db.query(query, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

exports.findById = async (productId) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM products WHERE id = ?';
    db.query(query, [productId], (err, results) => {
      if (err) reject(err);
      resolve(results[0] || null);
    });
  });
};