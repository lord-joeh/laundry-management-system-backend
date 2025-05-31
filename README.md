# Laundry Service App

A comprehensive laundry service software for online and walk-in bookings.

## Overview

This project is a Node.JS/Express backend service designed to manage laundry services, including customer registration, order management, service offerings, and payment processing. It provides a robust API for handling various operations related to laundry services.

## Features

- **User Authentication**: Secure registration, login, and password management.
- **Customer Management**: Create, read, update, and delete customer profiles.
- **Order Management**: Create and manage orders, track order status, and handle order updates.
- **Service Management**: Manage available laundry services, including creation, updates, and deletion.
- **Payment Integration**: Secure payment processing using Paystack.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Payment Gateway**: Paystack
- **Email Notifications**: Nodemailer
- **SMS Notifications**: Arkesel

## Project Structure

```
laundry-service-app/
├── config/
│   ├── db.js
│   └── paystack.js
├── public/
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── customerController.js
│   │   ├── orderController.js
│   │   ├── paymentController.js
│   │   └── serviceController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Customer.js
│   │   ├── Order.js
│   │   ├── Service.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── customerRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── serviceRoutes.js
│   ├── utils/
│   ├── app.js
│   └── server.js
├── .gitignore
├── package-lock.json
├── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Login a user.
- `POST /api/auth/reset-password`: Reset user password.
- `POST /api/auth/forgot-password`: Request a password reset.
- `POST /api/auth/change-password`: Change Password
- `GET /api/auth/logout`: Logout a user.
- `PUT /api/auth/:id`: Update User information.
- `DELETE /api/auth/:id`: Delete a user.


### Customer
- `POST /api/customers/`: Create a new customer.
- `GET /api/customers/`: Get all customers.
- `GET /api/customers/:id`: Get customer details by ID.
- `PUT /api/customers/:id`: Update customer information.
- `DELETE /api/customers/:id`: Delete a customer.

### Order
- `POST /api/orders/`: Create a new order.
- `GET /api/orders/:customerId`: Get all orders for a customer.
- `GET /api/orders/`: Get all orders (admin use).
- `GET /api/orders/:id`: Get order details by ID.
- `PUT /api/orders/:id`: Update an existing order.
- `DELETE /api/orders/:id`: Delete an order.

### Service
- `GET /api/services/`: Get all available laundry services.
- `GET /api/services/:id`: Get details of a specific service by ID.
- `POST /api/services/`: Create a new laundry service (admin only).
- `PUT /api/services/:id`: Update an existing laundry service (admin only).
- `DELETE /api/services/:id`: Delete a laundry service (admin only).

### Payment
- `POST /api/payments/initialize-payment/:id`: Initialize payment for an order.
- `GET /api/payments/verify-payment/:reference`: Verify payment status.

## Setup and Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/lord-joeh/laundry-service-backend.git
   cd laundry-service-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:
   ```
   PORT=5000
   MONGO_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret>
   PAYSTACK_SECRET_KEY=<your-paystack-secret-key>
   ```

4. Start the server:
   ```bash
   npm start
   ```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.
