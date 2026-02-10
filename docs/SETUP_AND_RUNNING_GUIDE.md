# 🚀 SmartCart Complete Setup & Running Guide

This guide explains how to run the entire SmartCart e-commerce platform with three separate applications on different ports.

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         MySQL Database                           │
│                    (Local or configured in app)                  │
└─────────────────────────────────────────────────────────────────┘
                                 ↑
                    ┌────────────┴────────────┐
                    ↑                         ↑
        ┌───────────────────┐     ┌──────────────────┐
        │   Backend API     │     │   Backend API    │
        │  (Port 3000)      │     │   (Port 3000)    │
        │  Node.js/Express  │     │  Node.js/Express │
        └───────────────────┘     └──────────────────┘
              ↑              ↑              ↑
              │              │              │
    ┌─────────┴──┐  ┌───────┴─────────┐  ┌─┴──────────┐
    │             │  │                 │  │            │
┌─────────────┐  │ ┌──────────────────┐ │ ┌──────────────┐
│  Port 3001  │  │ │   Port 3002      │ │ │   Port 3003  │
│  Customer   │  │ │   Admin          │ │ │   Analytics  │
│  Frontend   │  │ │   Dashboard      │ │ │   (Future)   │
│  (React)    │  │ │   (React)        │ │ │   (Future)   │
└─────────────┘  │ └──────────────────┘ │ └──────────────┘
```

## 🛠️ Prerequisites

1. **Node.js** (v14 or higher) - Download from https://nodejs.org/
2. **npm** (comes with Node.js)
3. **MySQL** (v5.7 or higher) - Download from https://dev.mysql.com/downloads/mysql/
4. **Git** (optional, for version control)

## 📝 Project Structure

```
E-com/
├── smartcart-backend/           # Backend API (Port 3000)
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   └── utils/
│   └── package.json
│
├── smartcart-frontend/          # Customer App (Port 3001)
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
└── smartcart-admin/             # Admin App (Port 3002) ✨ NEW
    ├── src/
    │   ├── pages/
    │   │   ├── AdminLogin.js
    │   │   └── AdminDashboard.js
    │   ├── App.js
    │   ├── App.css
    │   └── index.js
    ├── public/
    │   └── index.html
    └── package.json
```

## 🗄️ Database Setup

### Step 1: Create Database

```sql
-- Create database
CREATE DATABASE smartcart;

-- Use the database
USE smartcart;

-- Run the schema from smartcart-backend/src/config/schema.sql
-- Or execute the schema commands in your database tool
```

### Step 2: Database Structure

The database includes these tables:
- **users**: Customer accounts with authentication
- **products**: 55+ products with images (from Unsplash)
- **orders**: Customer orders with status tracking
- **order_items**: Individual items in orders

## 🚀 Running the Applications

### Method 1: Using Multiple Terminal Windows (Recommended)

Open 3 separate terminal/command prompt windows and run each command in its respective window.

#### Terminal 1: Start Backend API (Port 3000)

```bash
# Navigate to backend folder
cd E-com\smartcart-backend

# Install dependencies (first time only)
npm install

# Start the server
npm start
```

✅ You should see: `Server running on port 3000`

#### Terminal 2: Start Customer Frontend (Port 3001)

```bash
# Navigate to frontend folder (in a new terminal)
cd E-com\smartcart-frontend

# Install dependencies (first time only)
npm install

# Start the app on port 3001
set PORT=3001 && npm start
```

✅ Browser should automatically open http://localhost:3001

#### Terminal 3: Start Admin Dashboard (Port 3002)

```bash
# Navigate to admin folder (in a new terminal)
cd E-com\smartcart-admin

# Install dependencies (first time only)
npm install

# Start the admin app on port 3002
set PORT=3002 && npm start
```

✅ Browser should automatically open http://localhost:3002

---

### Method 2: Using Single Terminal with NPM Concurrently (Advanced)

If you want to run all three apps from a single terminal:

```bash
# Install concurrently globally
npm install -g concurrently

# Create a root package.json or use this command from E-com folder:
concurrently "cd smartcart-backend && npm start" "cd smartcart-frontend && PORT=3001 npm start" "cd smartcart-admin && PORT=3002 npm start"
```

---

### Method 3: Using Batch Script (Windows Only)

Create a file named `run-all.bat` in the `E-com` folder:

```batch
@echo off
start cmd /k "cd smartcart-backend && npm start"
timeout /t 3
start cmd /k "cd smartcart-frontend && set PORT=3001 && npm start"
timeout /t 3
start cmd /k "cd smartcart-admin && set PORT=3002 && npm start"
pause
```

Then run: `run-all.bat`

---

## 🌐 Accessing the Applications

After all three servers are running:

| Application | URL | Purpose |
|------------|-----|---------|
| **Customer Frontend** | http://localhost:3001 | Customer shopping, cart, orders |
| **Admin Dashboard** | http://localhost:3002 | Admin management panel |
| **Backend API** | http://localhost:3000 | RESTful API (used by both frontends) |

---

## 👥 Default User Accounts

### Customer Account
- **Email**: customer@example.com
- **Password**: password123

### Admin Account
- **Email**: admin@smartcart.com
- **Password**: admin@123

---

## 📱 Testing the Application

### 1. Test Customer Flow
1. Go to http://localhost:3001
2. Click "Login" → Use customer credentials
3. Browse products by category
4. Add items to cart
5. Proceed to checkout
6. Place order with any payment method
7. Check order status in "My Orders"

### 2. Test Admin Flow
1. Go to http://localhost:3002
2. Login with admin credentials (admin@smartcart.com / admin@123)
3. View dashboard statistics
4. Go to "Payment Verification" tab
5. Approve pending orders
6. Go to "Order Management" tab
7. Update order statuses (Paid → Dispatched → Delivered)
8. See updates reflected on customer's order tracking page

### 3. Test Order Tracking
1. After placing an order as customer
2. Go to "My Orders"
3. See order with "PENDING" status
4. As admin, approve payment → status becomes "PAID"
5. Update status → "DISPATCHED"
6. Update status → "OUT_FOR_DELIVERY"
7. Update status → "DELIVERED"
8. See timeline update on customer side

---

## ⚙️ Port Configuration

If the default ports are already in use, you can change them:

### Windows
```bash
# Use a different port
set PORT=3001 && npm start
set PORT=3002 && npm start
set PORT=3000 && npm start
```

### Mac/Linux
```bash
PORT=3001 npm start
PORT=3002 npm start
PORT=3000 npm start
```

### Change Backend Port
Edit `smartcart-backend/src/server.js`:
```javascript
const PORT = process.env.PORT || 3000; // Change 3000 to your port
```

Then update the API_BASE URL in both frontend apps:
- `smartcart-frontend/src/App.js`
- `smartcart-admin/src/pages/AdminDashboard.js`

Change: `const API_BASE = 'http://localhost:3000/api';` to your new port

---

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Windows - Find and kill process on port 3001
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3001
kill -9 <PID>
```

### Database Connection Error
1. Check MySQL is running
2. Verify database credentials in `smartcart-backend/src/config/db.js`
3. Ensure database schema is created
4. Check firewall settings

### npm install Fails
```bash
# Clear npm cache
npm cache clean --force

# Try installing again
npm install
```

### React Port Already in Use
```bash
# Use a different port
set PORT=3010 && npm start  # Instead of 3001
```

### Backend Not Connecting
1. Check if backend is running on port 3000
2. Check API_BASE URL in frontend apps
3. Check CORS settings in `smartcart-backend/src/app.js`
4. Check network connectivity

---

## 🔒 Security Notes

### Current Setup (Development)
- ✅ Admin app on separate port (3002)
- ✅ Admin login required
- ✅ Customer and admin data isolated
- ⚠️ Credentials are hardcoded (OK for development)

### Production Recommendations
- 🔐 Use environment variables for database credentials
- 🔐 Use JWT tokens instead of localStorage
- 🔐 Implement HTTPS
- 🔐 Use secure password hashing (bcrypt)
- 🔐 Implement rate limiting
- 🔐 Add CORS restrictions
- 🔐 Use .env files for sensitive data
- 🔐 Implement audit logging

---

## 📊 API Endpoints

### Orders (Used by Admin Dashboard)
```
GET    /api/orders              - Get all orders
POST   /api/orders              - Create order
GET    /api/orders/:id          - Get specific order
POST   /api/orders/:id/update-status  - Update order status
```

### Products
```
GET    /api/products            - Get all products
GET    /api/products/:id        - Get specific product
```

### Users
```
POST   /api/users/register      - Register new user
POST   /api/users/login         - User login
GET    /api/users/:id           - Get user profile
```

---

## 📝 Common Commands

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json && npm install
```

---

## ✅ Verification Checklist

- [ ] Node.js and npm installed
- [ ] MySQL database created and running
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Admin app dependencies installed
- [ ] Backend started on port 3000
- [ ] Frontend started on port 3001
- [ ] Admin app started on port 3002
- [ ] All three applications accessible in browser
- [ ] Can login as customer
- [ ] Can login as admin
- [ ] Can create order as customer
- [ ] Can approve payment as admin
- [ ] Can update order status as admin
- [ ] Status updates visible on customer tracking page

---

## 🎉 You're All Set!

Your SmartCart e-commerce platform is now running with:
- ✅ Customer-facing frontend on **port 3001**
- ✅ Isolated admin dashboard on **port 3002**
- ✅ Backend API on **port 3000**
- ✅ Complete order workflow (creation → approval → delivery)

**Happy coding! 🚀**

---

## 📞 Need Help?

1. Check the terminal output for error messages
2. Verify all three servers are running
3. Check database connectivity
4. Ensure ports are not in use by other applications
5. Review the individual README files in each folder

---

**Last Updated**: 2024
**Platform**: SmartCart E-commerce System v1.0
