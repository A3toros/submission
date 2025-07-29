const { neon } = require('@neondatabase/serverless');

exports.handler = async () => {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const result = await sql`SELECT 1`;
    return {
      statusCode: 200,
      body: JSON.stringify({ status: 'OK', result })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Database connection failed',
        message: error.message
      })
    };
  }
};