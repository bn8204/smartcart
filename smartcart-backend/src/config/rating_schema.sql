/**
 * Rating & Feedback Database Schema
 * Run this to create the necessary tables
 */

-- Product Ratings Table
CREATE TABLE IF NOT EXISTS product_ratings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  user_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_product (product_id),
  INDEX idx_order (order_id),
  INDEX idx_user (user_id),
  INDEX idx_created (created_at)
);

-- Delivery Feedback Table
CREATE TABLE IF NOT EXISTS delivery_feedback (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL UNIQUE,
  user_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  delivery_status ENUM('ON_TIME', 'EARLY', 'DELAYED') DEFAULT 'ON_TIME',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_order (order_id),
  INDEX idx_user (user_id),
  INDEX idx_delivery_status (delivery_status),
  INDEX idx_created (created_at)
);

-- View for Product Rating Statistics
CREATE OR REPLACE VIEW product_rating_stats AS
SELECT 
  p.id as product_id,
  p.name as product_name,
  COUNT(pr.id) as total_ratings,
  ROUND(AVG(pr.rating), 2) as average_rating,
  MAX(pr.created_at) as last_rating_date
FROM products p
LEFT JOIN product_ratings pr ON p.id = pr.product_id
GROUP BY p.id, p.name;

-- View for Delivery Feedback Statistics
CREATE OR REPLACE VIEW delivery_feedback_stats AS
SELECT 
  delivery_status,
  COUNT(*) as count,
  ROUND(AVG(rating), 2) as average_rating,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM delivery_feedback), 2) as percentage
FROM delivery_feedback
GROUP BY delivery_status;
