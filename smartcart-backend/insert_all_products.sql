-- Insert dummy products with new categories
USE smartcart_db;

-- Insert Food & Grocery Items
INSERT INTO products (name, price, category) VALUES
('Basmati Rice (1kg)', 299.99, 'Grocery'),
('Whole Wheat Flour (5kg)', 249.99, 'Grocery'),
('Cooking Oil (1L)', 189.99, 'Grocery'),
('Dal/Lentils (1kg)', 159.99, 'Grocery'),
('Sugar (1kg)', 49.99, 'Grocery'),
('Salt (1kg)', 29.99, 'Grocery'),
('Spice Mix (100g)', 89.99, 'Grocery'),
('Tea Leaves (500g)', 199.99, 'Grocery');

-- Insert Vegetables
INSERT INTO products (name, price, category) VALUES
('Tomato (500g)', 39.99, 'Vegetables'),
('Onion (1kg)', 49.99, 'Vegetables'),
('Potato (1kg)', 34.99, 'Vegetables'),
('Carrot (500g)', 44.99, 'Vegetables'),
('Cucumber (500g)', 29.99, 'Vegetables'),
('Bell Pepper (500g)', 69.99, 'Vegetables'),
('Broccoli (500g)', 79.99, 'Vegetables'),
('Spinach (250g)', 34.99, 'Vegetables');

-- Insert Fruits
INSERT INTO products (name, price, category) VALUES
('Banana (1kg)', 59.99, 'Fruits'),
('Apple (500g)', 149.99, 'Fruits'),
('Orange (1kg)', 79.99, 'Fruits'),
('Mango (1kg)', 199.99, 'Fruits'),
('Guava (500g)', 49.99, 'Fruits'),
('Watermelon (1pc)', 129.99, 'Fruits'),
('Papaya (1pc)', 79.99, 'Fruits'),
('Grapes (500g)', 119.99, 'Fruits');

-- Insert Clothing Items
INSERT INTO products (name, price, category) VALUES
('Men T-Shirt', 399.99, 'Clothes'),
('Women Top', 499.99, 'Clothes'),
('Jeans', 1199.99, 'Clothes'),
('Summer Dress', 799.99, 'Clothes'),
('Casual Shirt', 699.99, 'Clothes'),
('Polo Shirt', 599.99, 'Clothes'),
('Sports T-Shirt', 449.99, 'Clothes'),
('Hoodie', 899.99, 'Clothes');

-- Insert Food Items (Ready-to-eat)
INSERT INTO products (name, price, category) VALUES
('Instant Noodles (Pack of 4)', 99.99, 'Food Items'),
('Biscuits (500g)', 129.99, 'Food Items'),
('Chips (200g)', 89.99, 'Food Items'),
('Chocolate Bar', 59.99, 'Food Items'),
('Peanut Butter (500g)', 349.99, 'Food Items'),
('Breakfast Cereal (400g)', 199.99, 'Food Items'),
('Jam (500g)', 149.99, 'Food Items'),
('Honey (500ml)', 249.99, 'Food Items');

-- Verify all products with categories
SELECT category, COUNT(*) as product_count FROM products GROUP BY category ORDER BY category;
SELECT * FROM products;
