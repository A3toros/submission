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
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch('/.netlify/functions/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      const responseData = await response.json();
      
      if (response.ok) {
        form.style.display = 'none';
        thankYou.style.display = 'block';
      } else {
        showError(`Server error: ${responseData.error || response.statusText}\nDetails: ${responseData.message || 'No details'}`);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        showError('Request timed out. Please try again.');
      } else {
        showError(`Network error: ${error.message}`);
      }
      console.error('Submission error:', error);
    }
  });
  
  function showError(message) {
    // Create or update error display
    let errorDiv = document.getElementById('error-message');
    if (!errorDiv) {
      errorDiv = document.createElement('div');
      errorDiv.id = 'error-message';
      errorDiv.style.color = 'red';
      errorDiv.style.marginTop = '20px';
      errorDiv.style.padding = '10px';
      errorDiv.style.border = '1px solid red';
      form.parentNode.insertBefore(errorDiv, form.nextSibling);
    }
    errorDiv.textContent = `Error: ${message}`;
  }
});