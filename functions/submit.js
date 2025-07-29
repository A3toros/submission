const { neon } = require('@neondatabase/serverless');

exports.handler = async (event) => {
  // Set headers for consistent JSON responses
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  };

  try {
    const data = JSON.parse(event.body);
    
    // Validate name
    if (!data.name || data.name.trim() === '') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Name is required' })
      };
    }

    // Validate at least one question
    const questionsExist = [
      data.general,
      data.vocabulary,
      data.grammar,
      data.spelling,
      data.fun
    ].some(val => val && val.trim() !== '');
    
    if (!questionsExist) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'At least one question must be filled' })
      };
    }

    // Connect to NeonDB
    const sql = neon(process.env.DATABASE_URL);
    
    // Insert into database
    await sql`
      INSERT INTO submissions (
        name, 
        general_knowledge, 
        vocabulary, 
        grammar, 
        spelling, 
        fun_questions
      ) VALUES (
        ${data.name.trim()},
        ${data.general?.trim() || null},
        ${data.vocabulary?.trim() || null},
        ${data.grammar?.trim() || null},
        ${data.spelling?.trim() || null},
        ${data.fun?.trim() || null}
      )
    `;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Submission successful' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Database operation failed',
        message: error.message
      })
    };
  }
};