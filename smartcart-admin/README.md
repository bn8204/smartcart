# SmartCart Admin Dashboard

This is a separate admin dashboard application for the SmartCart e-commerce platform, running on port **3002**.

## 🔐 Security

- **Isolated from User App**: Completely separate React application from the customer-facing frontend (port 3001)
- **Admin Authentication**: Login required with admin credentials
- **Protected Routes**: Only authenticated admins can access the dashboard
- **Separate Port**: Runs on port 3002 (different from user app on 3001 and backend on 3000)

## 📋 Features

1. **Overview Dashboard**
   - Total orders count
   - Pending orders
   - Paid orders
   - Dispatched orders
   - Delivered orders
   - Failed/Cancelled orders
   - Total revenue

2. **Payment Verification**
   - Review pending payments
   - Approve or reject payments
   - Real-time order status updates

3. **Order Management**
   - View all orders
   - Update order status
   - Track delivery pipeline
   - Status workflow: PENDING → PAID → DISPATCHED → OUT_FOR_DELIVERY → DELIVERED

## 🚀 Getting Started

### Prerequisites
- Node.js and npm installed
- Backend running on port 3000
- Frontend running on port 3001

### Installation

```bash
# Navigate to smartcart-admin directory
cd smartcart-admin

# Install dependencies
npm install
```

### Running the Admin App

```bash
# Run on port 3002 (Windows)
set PORT=3002 && npm start

# Run on port 3002 (Mac/Linux)
PORT=3002 npm start
```

The admin dashboard will be available at: **http://localhost:3002**

## 🔑 Default Admin Credentials

- **Email**: admin@smartcart.com
- **Password**: admin@123

**⚠️ Important**: Change these credentials in production!

## 📁 Project Structure

```
smartcart-admin/
├── public/
│   └── index.html              # HTML entry point
├── src/
│   ├── pages/
│   │   ├── AdminLogin.js       # Admin login form
│   │   └── AdminDashboard.js   # Admin dashboard with 3 tabs
│   ├── App.js                  # Main app component with routing
│   ├── App.css                 # Admin UI styling
│   ├── index.js                # React entry point
│   └── index.css               # Global styles
├── package.json                # Dependencies and scripts
├── .gitignore                  # Git ignore rules
└── README.md                   # This file
```

## 🔗 API Integration

The admin app connects to the backend API at:
- Base URL: `http://localhost:3000/api`
- Endpoints used:
  - `GET /orders` - Fetch all orders
  - `POST /orders/:id/update-status` - Update order status

## 🎨 UI Components

### AdminLogin
- Email and password input fields
- Demo credentials display
- Security warning
- Form validation

### AdminDashboard
- Three-tab interface (Overview, Payment Verification, Order Management)
- Statistics cards with real-time data
- Expandable order cards
- Status dropdown for quick updates
- Color-coded status badges
- Responsive design for mobile/tablet

## 🔄 Authentication Flow

1. User enters admin credentials on login page
2. Credentials are validated (currently hardcoded)
3. Admin data and token stored in localStorage
4. User is redirected to dashboard
5. Dashboard fetches orders from backend API
6. Admin can manage orders and payments
7. Logout clears localStorage and returns to login

## 📊 Order Status Workflow

```
PENDING (⏳)
    ↓
PAID (✅)
    ↓
DISPATCHED (📦)
    ↓
OUT_FOR_DELIVERY (🚚)
    ↓
DELIVERED (✔️)
```

Alternative paths:
- PENDING → FAILED (❌)
- Any status → CANCELLED (🚫)

## 🛠️ Development

### Running Development Server
```bash
PORT=3002 npm start
```

### Building for Production
```bash
npm run build
```

### Running Tests
```bash
npm test
```

## 📝 Notes

- This application is **completely isolated** from the user-facing frontend
- Users cannot access the admin portal (different port and authentication)
- Each admin action is logged in the order status updates
- Real-time data fetching from backend API
- Responsive design works on desktop, tablet, and mobile devices

## 🔐 Future Enhancements

1. Database-backed admin authentication
2. Admin user management system
3. Audit logs for admin actions
4. Email notifications for status updates
5. Advanced filtering and search
6. Order analytics and reports
7. Bulk order status updates
8. Order notes and comments

## 📞 Support

For issues or questions about the admin dashboard, check the main SmartCart project documentation.

---

**Important**: This admin application is meant to be deployed securely. Change default credentials and consider implementing additional security measures in production.
