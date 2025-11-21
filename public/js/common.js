// Common functionality for all pages
document.addEventListener('DOMContentLoaded', async () => {
  await checkUserSession();
});

async function checkUserSession() {
  try {
    const response = await fetch('/api/user');
    if (response.ok) {
      const user = await response.json();
      const userEmailEl = document.getElementById('userEmail');
      const loginBtn = document.getElementById('loginBtn');
      const logoutBtn = document.getElementById('logoutBtn');
      
      if (userEmailEl) {
        userEmailEl.textContent = user.email;
        userEmailEl.style.display = 'block';
      }
      if (loginBtn) loginBtn.style.display = 'none';
      if (logoutBtn) logoutBtn.style.display = 'block';
    } else {
      // User not logged in
      const userEmailEl = document.getElementById('userEmail');
      const loginBtn = document.getElementById('loginBtn');
      const logoutBtn = document.getElementById('logoutBtn');
      
      if (userEmailEl) userEmailEl.style.display = 'none';
      if (loginBtn) loginBtn.style.display = 'block';
      if (logoutBtn) logoutBtn.style.display = 'none';
    }
  } catch (error) {
    console.error('Error checking session:', error);
  }
}

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(price);
}

