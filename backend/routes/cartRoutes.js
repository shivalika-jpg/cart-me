
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { addItemToCart, getUserCart, removeItemFromCart } = require('../controller/cartController');

// Add auth middleware to all routes
router.post('/add', authMiddleware, addItemToCart);
router.get('/', authMiddleware, getUserCart);
router.delete('/:id', authMiddleware, removeItemFromCart);

module.exports = router;
