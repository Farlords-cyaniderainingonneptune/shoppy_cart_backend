# ShoppyCart Backend

A robust and feature-rich REST API backend for ShoppyCart, a comprehensive shopping list and budget management application designed for both business owners and individuals.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Available Scripts](#available-scripts)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [File Organization](#file-organization)
- [Development](#development)
- [License](#license)

## 🎯 Overview

ShoppyCart Backend is an Express.js-based REST API that powers the ShoppyCart application. It provides comprehensive functionality for managing shopping lists, tracking expenses, and organizing items by category. The backend supports multiple authentication methods, real-time data management, and budget tracking features.

## ✨ Features

- **User Authentication**
  - Email/password registration and login
  - Google OAuth 2.0 integration
  - JWT-based token authentication
  - Email verification system
  - Password hashing with bcrypt

- **Shopping Cart Management**
  - Create, read, update, and delete shopping carts
  - Manage items with quantity and pricing
  - Mark items as purchased/unpurchased
  - Archive and delete carts
  - Cart status tracking (active, archived, deleted)

- **Item Management**
  - Add items to shopping lists
  - Edit item details (name, price, quantity)
  - Set item purchase status
  - Item categorization
  - Track item popularity

- **User Management**
  - User roles (admin, user)
  - User status tracking (active, inactive)
  - Admin seeding functionality
  - User verification system

- **Budget & Expense Tracking**
  - Track expenses as deficit, surplus, or stagnant
  - Price and quantity management
  - Budget analysis features

- **Additional Features**
  - Email notifications via Nodemailer
  - CORS support for cross-origin requests
  - Helmet security middleware
  - Compression for optimized responses
  - Database migrations with db-migrate
  - Google GenAI integration for AI-powered features

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Runtime** | Node.js |
| **Framework** | Express.js 5.2.1 |
| **Database** | PostgreSQL |
| **Authentication** | Passport.js, JWT, Google OAuth 2.0 |
| **Password Hashing** | bcrypt, bcryptjs |
| **Validation** | Joi 18.2.1 |
| **Email** | Nodemailer 8.0.7 |
| **Session Management** | express-session |
| **Security** | Helmet 8.1.0 |
| **Compression** | compression 1.8.1 |
| **CORS** | cors 2.8.6 |
| **Database ORM** | pg-promise 12.6.2 |
| **Migrations** | db-migrate 0.11.14, db-migrate-pg 1.5.2 |
| **AI Integration** | @google/genai 1.52.0 |
| **Development** | Nodemon 3.1.14 |
| **Environment** | dotenv 17.4.2 |

## 📁 Project Structure

```
src/
├── index.js                          # Application entry point
├── seedAdmin.js                      # Admin user seeding script
├── api/
│   ├── controllers/                  # Request handlers
│   │   ├── controllers.auth.js      # Authentication logic
│   │   ├── controllers.cart.js      # Cart management logic
│   │   ├── controllers.list.js      # Shopping list logic
│   │   └── controllers.prompts.js   # AI prompts logic
│   ├── middlewares/                  # Express middlewares
│   │   ├── middlewares.auth.js      # Authentication checks
│   │   ├── middlewares.models.js    # Data validation
│   │   └── middlewares.passport.js  # Passport configuration
│   ├── models/                       # Database models & queries
│   │   ├── models.auth.js
│   │   ├── models.cart.js
│   │   ├── models.list.js
│   │   └── models.prompt.js
│   ├── queries/                      # SQL queries
│   │   ├── queries.auth.js
│   │   ├── queries.cart.js
│   │   ├── queries.list.js
│   │   └── queries.prompt.js
│   ├── routes/                       # API route definitions
│   │   ├── index.js
│   │   ├── routes.auth.js
│   │   ├── routes.cart.js
│   │   └── routes.prompt.js
│   └── services/                     # External services
│       └── email.js                  # Email sending service
├── config/                           # Configuration files
│   ├── db/
│   │   └── index.js                  # Database connection
│   ├── email/
│   │   └── index.js                  # Email transporter setup
│   └── passport/
│       └── index.js                  # Passport strategies
└── lib/
    ├── schemas/
    │   └── schema.auth.js            # Joi validation schemas
    └── utils/
        ├── utils.hash.js             # Hashing utilities
        └── utils.helpers.js          # Helper functions

migrations/                            # Database migrations
├── sqls/
│   ├── 20260509061940-shoppyCartBackend-up.sql
│   └── 20260509061940-shoppyCartBackend-down.sql
└── package.json
```

## 📦 Prerequisites

- Node.js v16 or higher
- PostgreSQL 12 or higher
- npm or yarn package manager
- Environment variables configuration

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ShoppyCart-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install migration dependencies**
   ```bash
   cd migrations
   npm install
   cd ..
   ```

4. **Create environment configuration**
   ```bash
   cp .env.example .env
   ```

## 🗄️ Database Setup

1. **Create database**
   ```bash
   createdb shoppycart
   ```

2. **Run migrations**
   ```bash
   npm run migrate
   ```

3. **Seed admin user (optional)**
   ```bash
   npm run seedAdmin
   ```

4. **Rollback migrations (if needed)**
   ```bash
   npm run migrate:down
   ```

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start the production server |
| `npm run dev` | Start the development server with auto-reload (Nodemon) |
| `npm run migrate` | Run database migrations up |
| `npm run migrate:down` | Rollback database migrations |
| `npm run migrate:create` | Create a new migration file |
| `npm run seedAdmin` | Seed an admin user to the database |
| `npm test` | Run tests (currently not configured) |

## 🔌 API Endpoints

### Base URL
```
http://localhost:3000/api/v1
```

### Authentication Routes (`/auth`)
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login with email and password
- `GET /auth/google` - Initiate Google OAuth login
- `GET /auth/google/callback` - Google OAuth callback
- `POST /auth/verify-email` - Verify email address
- `POST /auth/logout` - Logout user

### Cart Routes (`/cart`)
- `GET /cart` - Get all carts for user
- `POST /cart` - Create a new cart
- `PUT /cart/:id` - Update cart details
- `DELETE /cart/:id` - Delete a cart
- `GET /cart/:id/items` - Get items in a cart
- `POST /cart/:id/items` - Add item to cart
- `PUT /cart/:id/items/:itemId` - Update item in cart
- `DELETE /cart/:id/items/:itemId` - Remove item from cart
- `PATCH /cart/:id/items/:itemId/purchase` - Mark item as purchased

## 🔐 Authentication

The API uses multiple authentication strategies:

### JWT Authentication
- Issued upon successful login
- Included in request headers as `Authorization: Bearer <token>`
- Default expiration: 24 hours

### Google OAuth 2.0
- Allows users to login with Google accounts
- Automatically creates user profile from Google data
- Managed through Passport.js strategy

### Session-based Authentication
- Express-session for maintaining user sessions
- Secure, httpOnly cookies with 24-hour expiration
- Enhanced security in production with secure flag

## 👨‍💻 Development

### Running in Development Mode
```bash
npm run dev
```
This uses Nodemon to automatically restart the server when file changes are detected.

### Database Debugging
- Check migrations status: `npm run migrate`
- Create new migration: `npm run migrate:create`
- Rollback: `npm run migrate:down`

### Code Structure Best Practices
- **Separation of Concerns**: Controllers handle requests, models manage data, services handle external operations
- **Validation**: Use Joi schemas defined in `lib/schemas/`
- **Error Handling**: Implement try-catch blocks in controllers
- **Security**: Use Helmet, CORS, compression, and authentication middleware

## 📄 License

ISC

## 👤 Author

Neptunian Cyanide

---

## 🤝 Contributing

When contributing to this project:
1. Follow the existing code structure and naming conventions
2. Use Joi for input validation
3. Implement proper error handling
4. Test API endpoints thoroughly
5. Update this README if adding new features

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Passport.js Documentation](http://www.passportjs.org/)
- [Joi Validation Documentation](https://joi.dev/)
- [db-migrate Documentation](https://db-migrate.readthedocs.io/)
