# Styles Laundry Service Application

## Overview
The Laundry Service Application is a comprehensive software solution designed to streamline the laundry booking process for customers. It allows users to book laundry services online or in-person, receive instant notifications, and manage their orders efficiently. The application is built using Node.js and Express.js for the backend, with MongoDB as the database.

## Features
- **Customer Account Management**: Users can create and manage their accounts, view order history, and track loyalty rewards.
- **Service Booking**: Customers can select from various laundry services such as wash and fold, dry cleaning, etc.
- **Payment Integration**: Supports online payments through Paystack and in-person cash payments.
- **Notifications**: Customers receive email and SMS notifications for order confirmations, payment receipts, and when their items are ready for pickup.
- **Admin Dashboard**: Real-time monitoring of orders, customer information, and financial transactions.

## Technology Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Frontend**: HTML, CSS, JavaScript
- **Payment Gateway**: Paystack
- **Notifications**: Email and SMS services

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/laundry-service-app.git

2. Navigate to the project directory:
   cd laundry-service-app

3. Install dependencies
   npm install

4. Set up environment Variables in the .env file:
   MONGO_URI=your_mongodb_connection_string
   PAYSTACK_SECRET_KEY=your_paystack_secret_key
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   JWT_SECRET=your_jwt_secret
   PORT=3000
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_PHONE_NUMBER=your_twilio_phone_number

5. Start the server
   npm start

# API Endpoints

# Authentication

  - POST /api/auth/register: Register a new user
  - POST /api/auth/login: Login an existing user
  - POST /api/auth/reset-password: Reset user password
  - POST /api/auth/logout: Logout an existing user

# Customer Management

  - POST /api/customers/createCustomer: Create a new customer
  - GET /api/customers/allCustomers: Retrieve all customers
  - GET /api/customers/:id: Retrieve a specific customer
  - PUT /api/customers/:id: Update customer information
  - DELETE /api/customers/:id: Delete a customer

# Order Management

  - POST /api/orders/createOrder: Create a new order
  - GET /api/orders/customer/:customerId: Retrieve all orders for a customer
  - GET /api/orders/orders: Retrieve all orders (admin use)
  - GET /api/orders/:id: Retrieve order details
  - PUT /api/orders/:id: Update order status
  - DELETE /api/orders/:id: Delete an order

# Service Management

  - GET /api/services: List all available services
  - GET /api/services/:id: Retrieve service details
  - POST /api/services: Create a new service
  - PUT /api/services/:id: Update an existing service
  - DELETE /api/services/:id: Delete a service

# Payment Management
   - POST /api/payments/initialize-payment/:orderId: Request Payment via PayStack
   - GET /api/payments/verify-payment/:reference: Verify payment

# Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

# License
This project is licensed under the MIT License. See the LICENSE file for details.

# Acknowledgments
Thanks to the contributors and the open-source community for their support and resources.