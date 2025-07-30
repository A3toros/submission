const { Client } = require('pg');

exports.handler = async function(event, context) {
  try {
    const data = JSON.parse(event.body);
    console.log('Received data:', data);

    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    });

    await client.connect();

    const query = `
      INSERT INTO submissions (
        name,
        your_questions,
        general_knowledge,
        vocabulary,
        grammar,
        spelling,
        fun_questions
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;

    const values = [
      data.name,
      data.your_questions,
      data.general_knowledge,
      data.vocabulary,
      data.grammar,
      data.spelling,
      data.fun_questions,
    ];

    await client.query(query, values);
    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Submission successful' }),
    };
  } catch (error) {
    console.error('Submission failed:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Submission failed' }),
    };
  }
};
