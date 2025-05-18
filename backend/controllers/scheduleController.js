const db = require('../models/db');

exports.createSchedule = async (req, res) => {
  const { title, description, start_time, end_time, visibility } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO schedules (user_id, title, description, start_time, end_time, visibility) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [req.user.id, title, description, start_time, end_time, visibility]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getOwnSchedules = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM schedules WHERE user_id = $1",
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFriendSchedules = async (req, res) => {
  const friendId = req.params.friendId;
  try {
    const result = await db.query(
      `SELECT id, start_time, end_time, visibility,
        CASE 
          WHEN visibility = 'private' THEN 'Private Schedule'
          ELSE title
        END AS title,
        CASE 
          WHEN visibility = 'private' THEN null
          ELSE description
        END AS description
       FROM schedules
       WHERE user_id = $1 AND visibility IN ('public', 'private')`,
      [friendId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
