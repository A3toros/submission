const { Pool } = require('pg');

exports.handler = async (event, context) => {
    // Create a connection pool to NeonDB
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        // Connect to the database
        const client = await pool.connect();

        // Test the connection
        const result = await client.query('SELECT NOW() as current_time');

        // Release the client back to the pool
        client.release();

        return {
            statusCode: 200,
            body: JSON.stringify({ 
                message: 'Database connection successful',
                current_time: result.rows[0].current_time 
            })
        };
    } catch (error) {
        console.error('Database error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Database connection failed' })
        };
    } finally {
        // End the pool
        await pool.end();
    }
};