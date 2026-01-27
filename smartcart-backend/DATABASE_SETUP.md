-- SmartCart Database Setup Instructions

## 📋 Database Configuration

### Prerequisites
- MySQL Server installed and running
- Database credentials: root / password (configure in `src/config/db.js`)

### Setup Steps

1. **Create Database:**
   ```sql
   CREATE DATABASE smartcart_db;
   ```

2. **Use Database:**
   ```sql
   USE smartcart_db;
   ```

3. **Execute Schema File:**
   Run all SQL commands from `schema.sql` in order:
   ```sql
   -- Users table
   CREATE TABLE users (
     id INT PRIMARY KEY AUTO_INCREMENT,
     name VARCHAR(255),
     email VARCHAR(255) UNIQUE,
     password VARCHAR(255),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- Products table
   CREATE TABLE products (
     id INT PRIMARY KEY AUTO_INCREMENT,
     name VARCHAR(255),
     price DECIMAL(10,2)
   );

   -- Orders table
   CREATE TABLE orders (
     id INT PRIMARY KEY AUTO_INCREMENT,
     user_id INT,
     total DECIMAL(10,2),
     status VARCHAR(50),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (user_id) REFERENCES users(id)
   );

   -- Order Items table
   CREATE TABLE order_items (
     id INT PRIMARY KEY AUTO_INCREMENT,
     order_id INT,
     product_id INT,
     quantity INT,
     price DECIMAL(10,2),
     FOREIGN KEY (order_id) REFERENCES orders(id),
     FOREIGN KEY (product_id) REFERENCES products(id)
   );

   -- Email Logs table
   CREATE TABLE email_logs (
     id INT PRIMARY KEY AUTO_INCREMENT,
     order_id INT,
     sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (order_id) REFERENCES orders(id)
   );
   ```

### Verify Installation
```sql
SHOW TABLES;
DESCRIBE users;
DESCRIBE products;
DESCRIBE orders;
DESCRIBE order_items;
DESCRIBE email_logs;
```

### Database Relationships

```
users (1) ──→ (N) orders
         ├────→ (N) email_logs
         
products (1) ──→ (N) order_items

orders (1) ──→ (N) order_items
       ├────→ (N) email_logs
```

### Key Fields

| Table | Primary Key | Foreign Keys | Unique |
|-------|-------------|--------------|--------|
| users | id | - | email |
| products | id | - | - |
| orders | id | user_id | - |
| order_items | id | order_id, product_id | - |
| email_logs | id | order_id | - |

---

**Setup complete!** You can now run the SmartCart backend.