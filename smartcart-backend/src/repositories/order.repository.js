const db = require('../config/db');

exports.findAll = async () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        o.id,
        o.user_id,
        o.total as totalAmount,
        o.status,
        o.created_at as createdAt,
        u.name as userName,
        u.email as userEmail,
        'Credit Card' as paymentMethod
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `;
    db.query(query, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

exports.create = async (orderData) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO orders (user_id, total, status) VALUES (?, ?, ?)';
    db.query(query, [orderData.user_id, orderData.total, 'PENDING'], (err, result) => {
      if (err) {
        reject(err);
        return;
      }

      const orderId = result.insertId;

      // Insert order items if provided
      if (orderData.items && orderData.items.length > 0) {
        let insertedCount = 0;
        const totalItems = orderData.items.length;

        orderData.items.forEach(item => {
          const itemQuery = 'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)';
          db.query(itemQuery, [orderId, item.product_id, item.quantity, item.price], (itemErr) => {
            if (itemErr) {
              console.error('Error inserting order item:', itemErr);
            }
            insertedCount++;
            if (insertedCount === totalItems) {
              resolve({ id: orderId, ...orderData, status: 'PENDING' });
            }
          });
        });
      } else {
        resolve({ id: orderId, ...orderData, status: 'PENDING' });
      }
    });
  });
};

exports.updateStatus = async (orderId, status) => {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE orders SET status = ? WHERE id = ?';
    db.query(query, [status, orderId], (err) => {
      if (err) reject(err);
      resolve({ id: orderId, status });
    });
  });
};

exports.findOrderItems = async (orderId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT oi.*, p.name as product_name 
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `;
    db.query(query, [orderId], (err, results) => {
      if (err) reject(err);
      resolve(results || []);
    });
  });
};