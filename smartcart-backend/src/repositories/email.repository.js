const db = require('../config/db');

exports.logEmail = async (orderId) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO email_logs (order_id, sent_at) VALUES (?, NOW())';
    db.query(query, [orderId], (err, result) => {
      if (err) reject(err);
      resolve({ orderId, sent: true, timestamp: new Date(), logId: result.insertId });
    });
  });
};