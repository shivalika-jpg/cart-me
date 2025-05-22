# Joint Shopping Cart

A full-stack web application that allows users to collaboratively create and manage shopping carts. Users can add friends, view their carts, and manage their own categories and items.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Joint Shopping Cart is a platform where users can maintain personal shopping carts and view their friends' carts by sending and accepting friend requests. The goal is to make shared shopping experiences more collaborative and organized.

---

## Features

- User authentication (login, signup)
- Add items to a categorized shopping cart
- Send and accept friend requests
- View friends’ carts (if the request is accepted)
- Friend request management (pending, accepted, rejected)
- Organized product categories with UI cards
- Cart visibility control based on friendship status

---

## Tech Stack

### Frontend
- HTML5, CSS3, JavaScript
- Responsive UI design with image assets
- Vanilla JS for interactivity

### Backend
- Node.js with Express.js
- MongoDB for data persistence
- Mongoose for database schema modeling
- JWT-based authentication

---

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/joint-shopping-cart.git
   cd joint-shopping-cart
Install dependencies

bash
Copy
Edit
npm install
Environment variables

Create a .env file in the root directory:

ini
Copy
Edit
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
Start the server

bash
Copy
Edit
npm start
Usage
Open the app in your browser at http://localhost:5000

Sign up or log in

Add items to your cart under different categories

Send friend requests to collaborate

View and interact with friends' carts

Project Structure
pgsql
Copy
Edit
project/
│
├── controllers/
│   └── authController.js
│   └── friendController.js
│   └── cartController.js
│
├── models/
│   └── User.js
│   └── FriendRequest.js
│   └── CartItem.js
│
├── routes/
│   └── authRoutes.js
│   └── friendRoutes.js
│   └── cartRoutes.js
│
├── public/
│   └── css/
│   └── js/
│   └── assets/
│
├── views/
│   └── home.html
│   └── login.html
│   └── signup.html
│   └── friends.html
│
├── app.js
└── package.json
API Endpoints
Auth Routes
POST /api/signup – Register a new user

POST /api/login – Log in and receive token

Friend Routes
POST /api/friends/send – Send friend request

GET /api/friends/requests – List incoming friend requests

POST /api/friends/respond – Accept or reject a request

GET /api/friends – List current friends

GET /api/friends/:friendId/cart – View a friend’s cart

Cart Routes
POST /api/cart/add – Add item to cart

GET /api/cart – Get my cart

DELETE /api/cart/:itemId – Remove item from cart

Future Enhancements
Recommendation system based on cart content

Group carts for shared occasions (e.g., birthdays, holidays)

Real-time collaboration using WebSockets

Notifications for accepted requests and cart updates

Contributing
Fork the repository

Create a new branch (git checkout -b feature-name)

Commit your changes (git commit -m "Add new feature")

Push to your branch (git push origin feature-name)

Open a Pull Request

License
This project is licensed under the MIT License.
