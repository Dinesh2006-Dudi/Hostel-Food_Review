// ============================================================
//  HostelBite — Module 1: Login JS
//  File: js/login.js
// ============================================================

(function () {
  // Redirect if already logged in
  if (HostelBite.currentUser) {
    window.location.href = HostelBite.isAdmin ? 'admin-dashboard.html' : 'dashboard.html';
    return;
  }

  const form    = document.getElementById('login-form');
  const errorBox = document.getElementById('error-box');
  const btn     = document.getElementById('login-btn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email    = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
      errorBox.textContent = '❌ Please fill in all fields.';
      errorBox.classList.add('show');
      return;
    }

    // Show spinner
    btn.innerHTML = '<span class="spinner"></span>Logging in...';
    btn.disabled  = true;
    errorBox.classList.remove('show');

    await new Promise(r => setTimeout(r, 700)); // simulate network

    const result = HostelBite.login(email, password);

    if (result.ok) {
      showToast(`Welcome back! 🍽️`, 'success');
      setTimeout(() => {
        window.location.href = result.role === 'admin' ? 'admin-dashboard.html' : 'dashboard.html';
      }, 600);
    } else {
      errorBox.textContent = '❌ Invalid email or password. Please try again.';
      errorBox.classList.add('show');
      btn.innerHTML = 'Login →';
      btn.disabled  = false;
    }
  });

  // Quick-fill demo accounts
  document.querySelectorAll('.demo-hint').forEach(hint => {
    hint.style.cursor = 'pointer';
  });
})();
