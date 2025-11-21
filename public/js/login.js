// Login functionality
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    clearErrors();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Basic validation
    if (!email || !password) {
      showError('formError', 'Please fill in all fields');
      return;
    }
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Success - redirect to home or customize page
        window.location.href = '/customize';
      } else {
        showError('formError', data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      showError('formError', 'An error occurred. Please try again.');
    }
  });
});

function showError(elementId, message) {
  const errorEl = document.getElementById(elementId);
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add('show');
  }
}

function clearErrors() {
  document.querySelectorAll('.error-message').forEach(el => {
    el.classList.remove('show');
    el.textContent = '';
  });
}

