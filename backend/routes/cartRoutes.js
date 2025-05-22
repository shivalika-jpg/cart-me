
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { addItemToCart, getUserCart, removeItemFromCart } = require('../controller/cartController');
console.log('authMw:', authMiddleware);
console.log('controller exports:', require('../controller/cartController'));


router.post('/add', authMiddleware, addItemToCart);
router.get('/', authMiddleware, getUserCart);
router.delete('/:id', authMiddleware, removeItemFromCart);

module.exports = router;
