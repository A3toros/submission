document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('submission-form');
  const thankYou = document.getElementById('thank-you');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
      name: form.elements.name.value,
      general: form.elements.general.value,
      vocabulary: form.elements.vocabulary.value,
      grammar: form.elements.grammar.value,
      spelling: form.elements.spelling.value,
      fun: form.elements.fun.value
    };

    try {
      const response = await fetch('/.netlify/functions/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        form.style.display = 'none';
        thankYou.style.display = 'block';
      } else {
        alert('Error submitting form');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Submission failed');
    }
  });
});