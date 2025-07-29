const { neon } = require('@neondatabase/serverless');

exports.handler = async (event) => {
  console.log('Received submission request');
  
  try {
    const data = JSON.parse(event.body);
    console.log('Form data:', JSON.stringify(data, null, 2));
    
    // Validate name exists
    if (!data.name || data.name.trim() === '') {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Name is required' })
      };
    }

    // Validate at least one question exists
    const questions = [
      data.general,
      data.vocabulary,
      data.grammar,
      data.spelling,
      data.fun
    ];
    
    const hasQuestions = questions.some(q => q && q.trim() !== '');
    if (!hasQuestions) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'At least one question must be filled' })
      };
    }

    console.log('Connecting to NeonDB');
    const sql = neon(process.env.DATABASE_URL);
    
    console.log('Executing SQL query');
    const result = await sql`
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
      RETURNING id
    `;
    
    console.log('Insert successful. ID:', result[0].id);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Submission successful' })
    };
  } catch (error) {
    console.error('FULL ERROR:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      name: error.name
    });
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Database operation failed',
        message: error.message,
        code: error.code
      })
    };
  }
};