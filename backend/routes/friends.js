const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { 
  sendFriendRequest, 
  acceptFriendRequest, 
  rejectFriendRequest,
  getFriends,
  getPendingRequests 
} = require('../controllers/friendController');

// Important: Put more specific routes first
router.get('/pending', auth, getPendingRequests);
router.post('/request', auth, sendFriendRequest);
router.post('/accept', auth, acceptFriendRequest);
router.post('/reject', auth, rejectFriendRequest);
router.get('/', auth, getFriends);

module.exports = router;
