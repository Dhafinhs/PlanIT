const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { sendFriendRequest, acceptFriendRequest, getFriends } = require('../controllers/friendController');

router.post('/request', auth, sendFriendRequest);
router.post('/accept', auth, acceptFriendRequest);
router.get('/', auth, getFriends);

module.exports = router;
