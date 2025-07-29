const { neon } = require('@neondatabase/serverless');

exports.handler = async () => {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const results = await sql`
      SELECT * FROM submissions 
      ORDER BY submitted_at DESC
    `;

    return {
      statusCode: 200,
      body: JSON.stringify(results),
      headers: { 'Content-Type': 'application/json' }
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: `Error fetching messages: ${error.message}`
    };
  }
};