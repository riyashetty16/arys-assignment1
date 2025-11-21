// Signup functionality
document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signupForm');
  
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    clearErrors();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validation
    if (!email || !password || !confirmPassword) {
      showError('formError', 'Please fill in all fields');
      return;
    }
    
    if (password.length < 6) {
      showError('passwordError', 'Password must be at least 6 characters');
      return;
    }
    
    if (password !== confirmPassword) {
      showError('confirmPasswordError', 'Passwords do not match');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError('emailError', 'Please enter a valid email address');
      return;
    }
    
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Success - redirect to customize page
        window.location.href = '/customize';
      } else {
        showError('formError', data.error || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
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

