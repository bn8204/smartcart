# SmartCart Frontend

A React-based e-commerce frontend for SmartCart platform.

## Features

- User registration and authentication
- Product catalog browsing
- Shopping cart management
- Order placement
- Responsive design
- API integration with backend

## Project Structure

```
smartcart-frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── Navbar.js
│   ├── pages/
│   │   ├── Home.js
│   │   ├── Products.js
│   │   ├── Register.js
│   │   ├── Login.js
│   │   └── Cart.js
│   ├── services/
│   │   └── api.js
│   ├── App.js
│   ├── App.css
│   └── index.js
└── package.json
```

## Installation

```bash
# Navigate to frontend directory
cd smartcart-frontend

# Install dependencies
npm install

# Start development server
npm start
```

## Available Scripts

```bash
# Start development server
npm start

# Build for production
npm build

# Run tests
npm test
```

## Configuration

The frontend connects to the backend API at `http://localhost:3000/api`. Make sure the backend is running before starting the frontend.

## Features by Page

- **Home**: Landing page with features overview
- **Products**: Browse and view all available products
- **Cart**: Manage items in shopping cart
- **Register**: Create new user account
- **Login**: Authenticate and login

## API Integration

The frontend communicates with the backend through the API service (`src/services/api.js`):

- User registration and login
- Product listing
- Order creation
- Payment confirmation

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
