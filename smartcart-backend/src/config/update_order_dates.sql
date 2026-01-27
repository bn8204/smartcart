-- Update orders to show progression in tracking (for demo/testing)
-- This simulates orders moving through different stages based on when they were created

-- For older orders, change created_at to be several days ago
-- This will make the tracking timeline show progression

UPDATE orders SET created_at = DATE_SUB(NOW(), INTERVAL 3 DAY) WHERE id = 1;
UPDATE orders SET created_at = DATE_SUB(NOW(), INTERVAL 2 DAY) WHERE id = 2;
UPDATE orders SET created_at = DATE_SUB(NOW(), INTERVAL 1 DAY) WHERE id = 3;

-- Verify the updates
SELECT id, created_at, status, total FROM orders ORDER BY id;
