// routes/friendRoutes.js
const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/authMiddleware');
const ctrl    = require('../controller/friendController');

router.use(auth);
router.post('/request',      ctrl.sendRequest);
router.get('/requests',      ctrl.listRequests);
router.post('/respond',      ctrl.respondRequest);
router.get('/list',          ctrl.listFriends);
router.get('/:friendId/cart', ctrl.viewFriendCart);
router.post('/remove', ctrl.removeFriend);

module.exports = router;
