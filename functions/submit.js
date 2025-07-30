console.log("Incoming data:", data);
const { Client } = require('pg');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  const data = JSON.parse(event.body);

  const {
    name,
    your_questions,
    general_knowledge,
    vocabulary,
    grammar,
    spelling,
    fun_questions,
  } = data;

  // Basic input check
  if (!name || !name.trim()) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Name is required' }),
    };
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    // Create the table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        your_questions TEXT,
        general_knowledge TEXT,
        vocabulary TEXT,
        grammar TEXT,
        spelling TEXT,
        fun_questions TEXT,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Insert the data
    await client.query(
      `INSERT INTO messages 
      (name, your_questions, general_knowledge, vocabulary, grammar, spelling, fun_questions)
      VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        name,
        your_questions,
        general_knowledge,
        vocabulary,
        grammar,
        spelling,
        fun_questions,
      ]
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Data saved successfully' }),
    };
  } catch (err) {
    console.error("Database error:", err);
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Database error' }),
    };
  } finally {
    await client.end();
  }
};
