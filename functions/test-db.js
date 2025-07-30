const { neon } = require('@neondatabase/serverless');

exports.handler = async () => {
  try {
    console.log('Testing NeonDB connection');
    const sql = neon(process.env.DATABASE_URL);
    const result = await sql`SELECT 1 AS test_value`;
    console.log('Database test result:', result);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        status: 'SUCCESS',
        result 
      })
    };
  } catch (error) {
    console.error('Database test failed:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Database connection failed',
        message: error.message,
        code: error.code
      })
    };
  }
};