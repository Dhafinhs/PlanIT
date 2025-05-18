const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const db = require('../models/db');

router.get('/search', auth, async (req, res) => {
  const { query } = req.query;
  try {
    const result = await db.query(
      "SELECT id, name FROM users WHERE name ILIKE $1 AND id != $2",
      [`%${query}%`, req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, name FROM users WHERE id != $1",
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
