// File: script.js
document.addEventListener('DOMContentLoaded', function() {
    const submitBtn = document.getElementById('submitBtn');
    const formContainer = document.getElementById('formContainer');
    const thankYouMessage = document.getElementById('thankYouMessage');

    submitBtn.addEventListener('click', async function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const yourQuestions = document.getElementById('your-questions').value;
        const generalKnowledge = document.getElementById('general-knowledge').value;
        const vocabulary = document.getElementById('vocabulary').value;
        const grammar = document.getElementById('grammar').value;
        const spelling = document.getElementById('spelling').value;
        const funQuestions = document.getElementById('fun-questions').value;

        const questionFields = [
            yourQuestions,
            generalKnowledge,
            vocabulary,
            grammar,
            spelling,
            funQuestions
        ];

        const isAtLeastOneFilled = questionFields.some(field => field.trim() !== '');

        if (!name.trim()) {
            alert('Please enter your name');
            return;
        }

        if (!isAtLeastOneFilled) {
            alert('Please fill in at least one question field');
            return;
        }

        const formData = {
            name,
            your_questions: yourQuestions,
            general_knowledge: generalKnowledge,
            vocabulary,
            grammar,
            spelling,
            fun_questions: funQuestions
        };

        submitBtn.textContent = 'Storing in NeonDB...';
        submitBtn.disabled = true;

        try {
            const response = await fetch('/.netlify/functions/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Submission failed');

            formContainer.style.display = 'none';
            thankYouMessage.style.display = 'block';
        } catch (err) {
            console.error(err);
            alert('Error submitting form');
            submitBtn.textContent = 'Submit';
            submitBtn.disabled = false;
        }
    });
});
