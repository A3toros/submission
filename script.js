document.addEventListener('DOMContentLoaded', function() {
    const submitBtn = document.getElementById('submitBtn');
    const formContainer = document.getElementById('formContainer');
    const thankYouMessage = document.getElementById('thankYouMessage');
    
    submitBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const yourQuestions = document.getElementById('your-questions').value;
        const generalKnowledge = document.getElementById('general-knowledge').value;
        const vocabulary = document.getElementById('vocabulary').value;
        const grammar = document.getElementById('grammar').value;
        const spelling = document.getElementById('spelling').value;
        const funQuestions = document.getElementById('fun-questions').value;
        
        // Check if at least one question field is filled
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
        
        // Prepare data for submission
        const formData = {
            name: name,
            your_questions: yourQuestions,
            general_knowledge: generalKnowledge,
            vocabulary: vocabulary,
            grammar: grammar,
            spelling: spelling,
            fun_questions: funQuestions
        };
        
        // Change button state
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Storing in NeonDB...';
        submitBtn.disabled = true;
        
        // Send data to serverless function
        fetch('/.netlify/functions/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Hide form and show thank you message
            formContainer.style.display = 'none';
            thankYouMessage.style.display = 'block';
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was a problem with your submission. Please try again.');
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        });
    });
});