# SmartCart Backend - Project Structure

## Architecture Overview

```
smartcart-backend/
│
├── src/
│   ├── server.js                 ← Application entry point (PORT: 3000)
│   ├── app.js                    ← Express app configuration
│
│   ├── config/
│   │   └── db.js                 ← Database configuration
│
│   ├── routes/                   ← Routing Layer (API Endpoints)
│   │   ├── user.routes.js        (POST /api/users/register, /login)
│   │   ├── product.routes.js     (GET /api/products, /api/products/:id)
│   │   ├── order.routes.js       (GET /api/orders, POST /api/orders)
│   │   └── payment.routes.js     (POST /api/payments/confirm)
│
│   ├── controllers/              ← Controller Layer
│   │   ├── user.controller.js    → delegates to userService
│   │   ├── product.controller.js → delegates to productService
│   │   ├── order.controller.js   → delegates to orderService
│   │   └── payment.controller.js → delegates to paymentService
│
│   ├── services/                 ← Business Logic Layer
│   │   ├── user.service.js       → user rules & validation
│   │   ├── product.service.js    → product retrieval logic
│   │   ├── order.service.js      → order lifecycle management
│   │   ├── payment.service.js    → payment processing & order confirmation
│   │   └── notification.service.js → email notification logic
│
│   ├── repositories/             ← Data Access Layer
│   │   ├── user.repository.js
│   │   ├── product.repository.js
│   │   ├── order.repository.js
│   │   ├── orderItem.repository.js
│   │   ├── payment.repository.js
│   │   └── email.repository.js
│
│   └── utils/
│       └── email.util.js         ← Email helper utilities
│
├── package.json
└── README.md
```

## Layered Architecture Pattern

| Layer | Responsibility |
|-------|-----------------|
| **Routes** | Define API endpoints and map HTTP methods to controllers |
| **Controllers** | Handle HTTP requests, invoke services, format responses |
| **Services** | Implement business logic and coordinate workflows |
| **Repositories** | Perform database operations (CRUD) |
| **Utils** | Provide reusable helper utilities (email, validation) |

## Complete User Journey Flow

```
1. REGISTER
   POST /api/users/register
   → user.routes → user.controller → user.service → user.repository

2. LOGIN
   POST /api/users/login
   → user.routes → user.controller → user.service → user.repository

3. BROWSE PRODUCTS
   GET /api/products
   GET /api/products/:id
   → product.routes → product.controller → product.service → product.repository

4. CREATE ORDER
   POST /api/orders
   → order.routes → order.controller → order.service → order.repository

5. PROCESS PAYMENT
   POST /api/payments/confirm
   → payment.routes → payment.controller → payment.service → {
       - order.repository (update status to PAID)
       - notification.service → email.repository (send confirmation)
     }

6. VIEW ORDERS
   GET /api/orders
   → order.routes → order.controller → order.service → order.repository
```

## Key Design Principles

✅ **Separation of Concerns** - Each layer has a single responsibility  
✅ **Layered Architecture** - Clear flow from HTTP request to database  
✅ **Maintainability** - Easy to modify, test, and debug code  
✅ **Scalability** - Services can be extracted to microservices  
✅ **Reusability** - Services and repositories can be used by multiple controllers  

## Startup

```bash
npm install
npm start
# Server runs on http://localhost:3000
```
