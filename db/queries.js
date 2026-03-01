import pool from "./pool";

async function insertUser(firstName, lastName, email, password) {
  await pool.query(
    "INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)",
    [firstName, lastName, email, password],
  );
}

async function getUserByEmail(email) {
  const { rows } = await pool.query("Select * FROM users WHERE email = $1", [
    email,
  ]);
  return rows[0];
}

async function getUserById(id) {
  const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return rows[0];
}

async function updateUserMembership(userId) {
  await pool.query("UPDATE users SET is_member = true WHERE id = $1", [userId]);
}

async function updateUserAdmin(userId) {
  await pool.query("UPDATE users SET is_admin = true WHERE id = $1", [userId]);
}

async function getAllMessages() {
  const { rows } = await pool.query(`
    SELECT 
      messages.id,
      messages.title,
      messages.text,
      messages.timestamp,
      users.first_name,
      users.last_name
    FROM messages
    JOIN users ON messages.user_id = users.id
    ORDER BY messages.timestamp DESC
  `);
  return rows;
}

async function createMessage(title, text, userId) {
  await pool.query(
    "INSERT INTO messages (title,text,user_id) VALUES ($1, $2, $3)",
    [title, text, userId],
  );
}

async function deleteMessage(messageId) {
  await pool.query("DELETE FROM messages WHERE id = $1", [messageId]);
}

export {
  insertUser,
  getUserByEmail,
  getUserById,
  updateUserMembership,
  updateUserAdmin,
  getAllMessages,
  createMessage,
  deleteMessage,
};
