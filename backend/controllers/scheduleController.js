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
      `SELECT schedules.*, users.name AS owner_name
       FROM schedules
       JOIN users ON schedules.user_id = users.id
       WHERE schedules.user_id = $1`,
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
      `SELECT 
        schedules.id, 
        schedules.start_time, 
        schedules.end_time, 
        schedules.visibility,
        schedules.title,
        schedules.description,
        users.name AS owner_name,
        schedules.user_id AS owner_id
       FROM schedules
       JOIN users ON schedules.user_id = users.id
       WHERE schedules.user_id = $1 
       AND schedules.visibility != 'hidden'
       ORDER BY schedules.start_time ASC`,
      [friendId]
    );
    
    // Transform the data to handle private schedules
    const schedules = result.rows.map(schedule => ({
      ...schedule,
      title: schedule.visibility === 'private' ? 'Busy' : schedule.title,
      description: schedule.visibility === 'private' ? null : schedule.description
    }));
    
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
