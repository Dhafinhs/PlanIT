const db = require('../models/db');

exports.createGroup = async (req, res) => {
  const { name } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO groups (name, leader_id) VALUES ($1, $2) RETURNING *",
      [name, req.user.id]
    );
    const group = result.rows[0];
    await db.query(
      "INSERT INTO group_members (group_id, user_id) VALUES ($1, $2)",
      [group.id, req.user.id]
    );
    res.json(group);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.addMemberToGroup = async (req, res) => {
  const { groupId } = req.params;
  const { userId } = req.body;
  try {
    const group = await db.query("SELECT * FROM groups WHERE id = $1", [groupId]);
    if (group.rows[0].leader_id !== req.user.id) {
      return res.status(403).json({ error: "Only the group leader can add members." });
    }
    await db.query(
      "INSERT INTO group_members (group_id, user_id) VALUES ($1, $2)",
      [groupId, userId]
    );
    res.json({ message: "Member added to group." });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getGroupDetails = async (req, res) => {
  const { groupId } = req.params;
  try {
    const group = await db.query("SELECT * FROM groups WHERE id = $1", [groupId]);
    const members = await db.query(
      "SELECT users.id, users.name FROM group_members JOIN users ON group_members.user_id = users.id WHERE group_members.group_id = $1",
      [groupId]
    );
    res.json({ group: group.rows[0], members: members.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.setGroupSchedule = async (req, res) => {
  const { groupId } = req.params;
  const { title, description, start_time, end_time, visibility } = req.body;
  try {
    const group = await db.query("SELECT * FROM groups WHERE id = $1", [groupId]);
    if (group.rows[0].leader_id !== req.user.id) {
      return res.status(403).json({ error: "Only the group leader can set schedules." });
    }
    const members = await db.query(
      "SELECT user_id FROM group_members WHERE group_id = $1",
      [groupId]
    );
    const memberIds = members.rows.map((row) => row.user_id);

    for (const userId of memberIds) {
      await db.query(
        "INSERT INTO schedules (user_id, title, description, start_time, end_time, visibility) VALUES ($1, $2, $3, $4, $5, $6)",
        [userId, title, description, start_time, end_time, visibility]
      );
    }
    res.json({ message: "Schedule set for group members." });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getUserGroups = async (req, res) => {
  try {
    console.log('Fetching groups for user:', req.user.id); // Debug log
    const result = await db.query(
      `SELECT * FROM groups WHERE leader_id = $1 OR id IN (
        SELECT group_id FROM group_members WHERE user_id = $1
      )`,
      [req.user.id]
    );
    console.log('Groups fetched:', result.rows); // Debug log
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching groups:', err); // Debug log
    res.status(500).json({ error: err.message });
  }
};

exports.getGroupSchedules = async (req, res) => {
  const { groupId } = req.params;
  try {
    console.log(`Fetching schedules for group ID: ${groupId}`); // Debug log
    const result = await db.query(
      `SELECT * FROM schedules WHERE user_id IN (
        SELECT user_id FROM group_members WHERE group_id = $1
      ) ORDER BY start_time ASC`,
      [groupId]
    );
    console.log(`Schedules fetched for group ID ${groupId}:`, result.rows); // Debug log
    res.json(result.rows);
  } catch (err) {
    console.error(`Error fetching schedules for group ID ${groupId}:`, err); // Debug log
    res.status(500).json({ error: err.message });
  }
};

exports.deleteGroup = async (req, res) => {
  const { groupId } = req.params;
  try {
    console.log(`Attempting to delete group ID: ${groupId}`); // Debug log
    const group = await db.query("SELECT * FROM groups WHERE id = $1", [groupId]);
    if (group.rows.length === 0) {
      return res.status(404).json({ error: "Group not found." });
    }
    if (group.rows[0].leader_id !== req.user.id) {
      return res.status(403).json({ error: "Only the group leader can delete the group." });
    }
    await db.query("DELETE FROM groups WHERE id = $1", [groupId]);
    console.log(`Group ID ${groupId} deleted successfully.`); // Debug log
    res.json({ message: "Group deleted successfully." });
  } catch (err) {
    console.error(`Error deleting group ID ${groupId}:`, err); // Debug log
    res.status(500).json({ error: err.message });
  }
};
