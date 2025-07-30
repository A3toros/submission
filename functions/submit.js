const { Client } = require('pg');
exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body);
    console.log('Received data:', data);

    const client = new Client({
      connectionString: process.env.NEON_DB_URL,
    });

    await client.connect();

    await client.query(
      `INSERT INTO messages (name, your_questions, general_knowledge, vocabulary, grammar, spelling, fun_questions)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
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
      body: JSON.stringify({ message: 'Success' }),
    };
  } catch (err) {
    console.error('Submission failed:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Submission failed', details: err.message }),
    };
  }
};
