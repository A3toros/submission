const { neon } = require('@neondatabase/serverless');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body);
    const sql = neon(process.env.DATABASE_URL);
    
    // Validate at least one question exists
    const questionsExist = [
      data.general,
      data.vocabulary,
      data.grammar,
      data.spelling,
      data.fun
    ].some(val => val.trim() !== '');

    if (!questionsExist) {
      return {
        statusCode: 400,
        body: 'At least one question must be filled'
      };
    }

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
        ${data.name},
        ${data.general || null},
        ${data.vocabulary || null},
        ${data.grammar || null},
        ${data.spelling || null},
        ${data.fun || null}
      )
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Submission successful' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: `Server error: ${error.message}`
    };
  }
};