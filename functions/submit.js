const { neon } = require('@neondatabase/serverless');

// Timeout after 8 seconds (Netlify's max is 10s)
const TIMEOUT = 8000;

exports.handler = async (event) => {
  // Set timeout promise
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Function timeout')), TIMEOUT);
  });

  try {
    const data = JSON.parse(event.body);
    
    // Validate at least one question exists
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
        body: 'At least one question must be filled'
      };
    }

    // Create Neon connection with timeout
    const sql = neon(process.env.DATABASE_URL, {
      connectionTimeoutMillis: 5000
    });
    
    // Run database query with timeout
    const dbPromise = sql`
      INSERT INTO submissions (
        name, 
        general_knowledge, 
        vocabulary, 
        grammar, 
        spelling, 
        fun_questions
      ) VALUES (
        ${data.name},
        ${data.general || null},
        ${data.vocabulary || null},
        ${data.grammar || null},
        ${data.spelling || null},
        ${data.fun || null}
      )
    `;

    // Race between database query and timeout
    await Promise.race([dbPromise, timeoutPromise]);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Submission successful' })
    };
  } catch (error) {
    console.error('SUBMISSION ERROR:', error);
    return {
      statusCode: 500,
      body: `Error: ${error.message}`
    };
  }
};