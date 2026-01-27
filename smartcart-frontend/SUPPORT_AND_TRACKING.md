# Support & Order Tracking Pages

## 📍 Pages Added

### 1. Order Tracking Page (`OrderTracking.js`)
**Location:** `💬 Track` button in navbar

**Features:**
- 🔍 Search orders by Order ID
- 📦 Real-time delivery progress visualization
- 📋 Order details (order date, total, status)
- 🎯 Tracking timeline showing:
  - Order Placed ✓
  - Payment Status
  - Processing
  - Dispatched
  - Out for Delivery
  - Delivered
- 📦 Order items list with product names and quantities
- 💬 Quick support access

**How to Use:**
1. Click "📍 Track" in the navbar
2. Enter your Order ID (1, 2, 3, etc.)
3. Click "Track Order"
4. View detailed tracking information

**Status Colors:**
- 🟢 **PAID** - Payment verified, being processed
- 🟠 **PENDING** - Awaiting payment verification
- 🔴 **FAILED** - Payment issue

---

### 2. Support Page (`Support.js`)
**Location:** `💬 Support` button in navbar

**Features:**
- 📧 **Email Support** - support@smartcart.com (24-hour response)
- 📱 **Phone Support** - +91 1800-SMARTCART (Mon-Fri: 10AM-6PM IST)
- 💬 **Live Chat** - Available 24/7
- **Contact Form** with:
  - Name field
  - Email field
  - Category selection (General, Order, Payment, Product, Returns, Other)
  - Subject field
  - Message field
  - Form validation
- ❓ **FAQ Section** covering:
  - Delivery timeframes
  - Return policy
  - Order tracking
  - Payment methods
  - Order cancellation
  - Payment security

**How to Use:**
1. Click "💬 Support" in the navbar
2. View contact methods
3. Fill out the contact form
4. Check FAQ for quick answers

---

## 🎯 Navigation Updates

**Navbar now includes:**
- Home
- Products
- Cart
- My Orders (logged-in users only)
- **📍 Track** (NEW)
- **💬 Support** (NEW)
- 💰 Admin
- Login/Register (guest users)

---

## 🔌 Integration

### App.js Changes
- Imported `Support` and `OrderTracking` components
- Added 'tracking' and 'support' cases to renderPage() switch
- Both pages render in main content area

### Navbar.js Changes
- Added Track button with 📍 emoji
- Added Support button with 💬 emoji
- Both buttons set active state based on currentPage

---

## 📊 How Tracking Works

1. **Fetch Orders:** Gets all orders from backend
2. **Search:** Finds order by ID user enters
3. **Display Progress:** Shows tracking timeline based on order status
4. **Show Items:** Lists all products in the order with quantities
5. **Total:** Displays order total amount

---

## 💡 Features Highlights

### Order Tracking
- ✅ Visual progress timeline
- ✅ Order status badges with colors
- ✅ Order items with product names
- ✅ Order date display
- ✅ Total amount display
- ✅ Support team quick-access button

### Support
- ✅ Multiple contact methods
- ✅ Contact form with validation
- ✅ Category-based support
- ✅ FAQ section
- ✅ Professional layout
- ✅ Success confirmation message

---

## 📱 Responsive Design

Both pages are:
- Mobile-friendly
- Tablet-optimized
- Desktop-ready
- Use flexbox and grid layouts
- Properly styled with shadows and colors

---

## 🚀 To Test

1. **Refresh your frontend** (still on port 3001)
2. **Order Tracking:**
   - Click "📍 Track" button
   - Enter Order ID: 1, 2, or 3 (depending on your orders)
   - View tracking timeline and items
3. **Support:**
   - Click "💬 Support" button
   - View contact methods and FAQ
   - Try submitting a test message

---
