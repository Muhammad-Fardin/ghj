const loginForm = document.getElementById('login-form');

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
      const res = await fetch('https://ghj-api.vercel.app/api/auth/login', {  // Ensure HTTPS for fetch
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Credentials': 'true' },
        credentials: 'include',  // Allow cookies (for session-based auth)
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error('Invalid email or password');  // Handle auth errors
      
      const data = await res.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      handleLoginSuccess();
    } catch (error) {
      document.getElementById('error-message').textContent = error.message || 'Login failed';
    }
  });
}

function handleLoginSuccess() {

  window.location.href = '../../index.html';
}


