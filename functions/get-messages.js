const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.NEON_DB_URL,
  ssl: { rejectUnauthorized: false }
});

exports.handler = async function () {
  try {
    const result = await pool.query("SELECT * FROM messages ORDER BY created_at DESC");
    return {
      statusCode: 200,
      body: JSON.stringify(result.rows),
      headers: {
        "Content-Type": "application/json"
      }
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: "Database error: " + err.message
    };
  }
};
