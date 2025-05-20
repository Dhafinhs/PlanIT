const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  createGroup,
  addMemberToGroup,
  getGroupDetails,
  setGroupSchedule,
  getUserGroups,
  getGroupSchedules,
  deleteGroup,
} = require('../controllers/groupController');

// Routes
router.post('/', auth, createGroup); // Endpoint untuk membuat grup
router.post('/:groupId/members', auth, addMemberToGroup); // Endpoint untuk menambahkan anggota ke grup
router.get('/:groupId', auth, getGroupDetails); // Endpoint untuk mendapatkan detail grup
router.post('/:groupId/schedule', auth, setGroupSchedule); // Endpoint untuk menetapkan jadwal grup
router.get('/:groupId/schedule', auth, getGroupSchedules); // Endpoint untuk mendapatkan jadwal grup
router.get('/', auth, getUserGroups); // Endpoint untuk mendapatkan grup pengguna
router.delete('/:groupId', auth, deleteGroup); // Endpoint untuk menghapus grup

module.exports = router;
