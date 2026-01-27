-- Insert dummy products into smartcart_db
USE smartcart_db;

INSERT INTO products (name, price) VALUES
('Wireless Headphones', 79.99),
('USB-C Cable', 12.99),
('Phone Case', 19.99),
('Screen Protector', 9.99),
('Portable Power Bank', 34.99),
('Bluetooth Speaker', 49.99),
('USB Hub', 24.99),
('Laptop Stand', 39.99),
('Mechanical Keyboard', 89.99),
('Wireless Mouse', 29.99),
('Monitor Light Bar', 59.99),
('HDMI Cable', 14.99),
('Phone Mount', 15.99),
('Cooling Pad', 44.99),
('Cable Organizer', 11.99);

-- Verify insertion
SELECT * FROM products;
