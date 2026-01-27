-- Add category column to products table if it doesn't exist
ALTER TABLE products ADD COLUMN category VARCHAR(100) DEFAULT 'Electronics';

-- Update existing products with categories
UPDATE products SET category = 'Audio' WHERE name LIKE '%Headphones%' OR name LIKE '%Speaker%';
UPDATE products SET category = 'Cables' WHERE name LIKE '%Cable%' OR name LIKE '%HDMI%' OR name LIKE '%USB%';
UPDATE products SET category = 'Mobile Accessories' WHERE name LIKE '%Case%' OR name LIKE '%Protector%' OR name LIKE '%Mount%' OR name LIKE '%Power Bank%';
UPDATE products SET category = 'Computer Accessories' WHERE name LIKE '%Keyboard%' OR name LIKE '%Mouse%' OR name LIKE '%Stand%' OR name LIKE '%Hub%' OR name LIKE '%Light%' OR name LIKE '%Pad%';
UPDATE products SET category = 'Organization' WHERE name LIKE '%Organizer%';

-- Verify the updates
SELECT category, COUNT(*) as product_count FROM products GROUP BY category;
SELECT * FROM products;
