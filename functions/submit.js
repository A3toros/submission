const { Client } = require('pg');

exports.handler = async function (event) {
  try {
    const data = JSON.parse(event.body);
    console.log("Received data:", data);

    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }, // Required for NeonDB
    });

    await client.connect();

    await client.query(`
      CREATE TABLE IF NOT EXISTS submissions (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        your_questions TEXT,
        general_knowledge TEXT,
        vocabulary TEXT,
        grammar TEXT,
        spelling TEXT,
        fun_questions TEXT
      );
    `);

    await client.query(
      `INSERT INTO submissions (name, your_questions, general_knowledge, vocabulary, grammar, spelling, fun_questions)
       VALUES ($1, $2, $3, $4, $5, $6, $7);`,
      [
        data.name,
        data.your_questions,
        data.general_knowledge,
        data.vocabulary,
        data.grammar,
        data.spelling,
        data.fun_questions,
      ]
    );

    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Submission stored successfully' }),
    };
  } catch (error) {
    console.error("Submission failed:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Submission failed' }),
    };
  }
};
