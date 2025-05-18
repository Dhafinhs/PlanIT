const db = require('../models/db');

exports.sendFriendRequest = async (req, res) => {
  const { friend_id } = req.body;
  try {
    await db.query("INSERT INTO friends (user_id, friend_id, status) VALUES ($1, $2, 'pending')", [req.user.id, friend_id]);
    res.json({ message: 'Request sent' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.acceptFriendRequest = async (req, res) => {
  const { friend_id } = req.body;
  try {
    await db.query("UPDATE friends SET status = 'accepted' WHERE user_id = $1 AND friend_id = $2", [friend_id, req.user.id]);
    await db.query("INSERT INTO friends (user_id, friend_id, status) VALUES ($1, $2, 'accepted')", [req.user.id, friend_id]);
    res.json({ message: 'Friend added' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getFriends = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT users.id, users.name FROM users JOIN friends ON users.id = friends.friend_id WHERE friends.user_id = $1 AND status = 'accepted'",
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
