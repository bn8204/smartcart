# SmartCart Backend API

An e-commerce backend API built with Express.js following a layered architecture pattern with clear separation of concerns.

## Features

- **User Management** - User registration and authentication
- **Product Catalog** - Product browsing and retrieval
- **Order Management** - Order creation and tracking
- **Payment Processing** - Payment confirmation and status updates
- **Email Notifications** - Order confirmation notifications
- **Layered Architecture** - Separation between routes, controllers, services, and data access layers

## 🏗️ Architecture

The project follows a **layered architecture pattern**:

```
Routes (API Endpoints)
    ↓
Controllers (Request Handling)
    ↓
Services (Business Logic)
    ↓
Repositories (Data Access)
    ↓
Database
```

### Layer Responsibilities

| Layer | Responsibility |
|-------|-----------------|
| **Routes** | Define API endpoints and map HTTP methods to controllers |
| **Controllers** | Handle HTTP requests, invoke services, format responses |
| **Services** | Implement business logic and coordinate workflows |
| **Repositories** | Perform database operations (CRUD) |
| **Utils** | Provide reusable helper utilities (email, validation) |

## 📁 Project Structure

```
smartcart-backend/
├── src/
│   ├── server.js                 ← Application entry point
│   ├── app.js                    ← Express configuration
│   ├── config/                   ← Configuration files
│   ├── routes/                   ← API route definitions
│   ├── controllers/              ← Request handlers
│   ├── services/                 ← Business logic
│   ├── repositories/             ← Data access layer
│   └── utils/                    ← Helper utilities
├── package.json
└── README.md
```

## 🚀 Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd smartcart-backend

# Install dependencies
npm install

# Create .env file (if needed)
cp .env.example .env

# Start development server
npm run dev

# OR start production server
npm start
```

## 🔌 API Endpoints

### Users
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order

### Payments
- `POST /api/payments/confirm` - Confirm payment and send confirmation email

## Development

```bash
# Start with auto-reload
npm run dev

# Start production server
npm start
```

## 🔧 Requirements

- Node.js >= 14.0.0
- nRequirements

- Node.js >= 14.0.0
- npm >= 6.0.0

## Dependencies

- **express** - Web application framework
- **dotenv** - Environment configuration
- **cors** - Cross-origin resource sharing
- **body-parser** - Request body parsing
- **nodemon** (dev) - Development server with auto-reload
1. **Register** - Create new user account
2. **Login** - Authenticate user
3. **Browse** - View available products
4. **Order** - Create order with selected products
5. **Payment** - Process payment
6. **Email** - Receive order confirmation
7. **Track** - View order history

## 📝 Configuration

Configure environment variables in `.env`:

```
PORT=3000
NODE_ENV=development
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
```

## 🤝 Contributing
Contributing

1. Create a new branch for your changes
2. Make commits with clear messages
3. Submit a pull request with description of changes

## License

This project is licensed under the MIT License.

## Authors

SmartCart Team