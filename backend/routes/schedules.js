const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { createSchedule, getOwnSchedules, getFriendSchedules, updateSchedule } = require('../controllers/scheduleController');

router.post('/', auth, createSchedule);
router.get('/', auth, getOwnSchedules);
router.get('/:friendId', auth, getFriendSchedules);
router.put('/:id', auth, updateSchedule);

module.exports = router;
