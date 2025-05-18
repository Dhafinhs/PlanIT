const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { createSchedule, getOwnSchedules, getFriendSchedules } = require('../controllers/scheduleController');

router.post('/', auth, createSchedule);
router.get('/', auth, getOwnSchedules);
router.get('/:friendId', auth, getFriendSchedules);

module.exports = router;
