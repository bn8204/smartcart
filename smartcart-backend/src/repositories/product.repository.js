const db = require('../config/db');

// Helper function with timeout
const queryWithTimeout = (query, params, timeout = 5000) => {
  return new Promise((resolve, reject) => {
    let timeoutId;
    
    const handleQuery = () => {
      db.query(query, params, (error, results) => {
        clearTimeout(timeoutId);
        if (error) {
          console.error('Database query error:', error.message);
          return reject(error);
        }
        resolve(results || []);
      });
    };
    
    // Set timeout
    timeoutId = setTimeout(() => {
      reject(new Error('Database query timeout'));
    }, timeout);
    
    try {
      handleQuery();
    } catch (err) {
      clearTimeout(timeoutId);
      reject(err);
    }
  });
};

exports.findAll = async () => {
  try {
    console.log('Starting product query...');
    const results = await queryWithTimeout('SELECT * FROM products', []);
    console.log(`Product query returned ${results ? results.length : 0} rows`);
    return results || [];
  } catch (error) {
    console.error('findAll error:', error.message);
    throw error;
  }
};

exports.findById = async (productId) => {
  try {
    console.log(`Starting product by ID query for ID: ${productId}`);
    const results = await queryWithTimeout('SELECT * FROM products WHERE id = ?', [productId]);
    console.log(`Product by ID query returned ${results ? results.length : 0} rows`);
    return results && results.length > 0 ? results[0] : null;
  } catch (error) {
    console.error('findById error:', error.message);
    throw error;
  }
};