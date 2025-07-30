const { Pool } = require('pg');

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    // Parse the request body
    const data = JSON.parse(event.body);

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

        // Create table if it doesn't exist
        await client.query(`
            CREATE TABLE IF NOT EXISTS questions (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                your_questions TEXT,
                general_knowledge TEXT,
                vocabulary TEXT,
                grammar TEXT,
                spelling TEXT,
                fun_questions TEXT,
                submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Insert the form data
        const result = await client.query(
            `INSERT INTO questions (
                name, 
                your_questions, 
                general_knowledge, 
                vocabulary, 
                grammar, 
                spelling, 
                fun_questions
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) 
            RETURNING id`,
            [
                data.name,
                data.your_questions,
                data.general_knowledge,
                data.vocabulary,
                data.grammar,
                data.spelling,
                data.fun_questions
            ]
        );

        // Release the client back to the pool
        client.release();

        return {
            statusCode: 200,
            body: JSON.stringify({ 
                message: 'Submission stored successfully', 
                id: result.rows[0].id 
            })
        };
    } catch (error) {
        console.error('Database error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    } finally {
        // End the pool
        await pool.end();
    }
};