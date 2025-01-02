const socket = io('https://ghj-api.vercel.app', {  // Use HTTPS for secure connection
  transports: ['websocket', 'polling'],  // Enable fallback for better compatibility
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});

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
      
      // Emit login event to Socket.IO with error handling
      socket.emit('userLoggedIn', data.user._id, (ack) => {
        if (ack?.status === 'ok') {
          console.log('User login acknowledged by server.');
        } else {
          console.error('Failed to notify server of login:', ack?.error);
        }
      });

      handleLoginSuccess();
    } catch (error) {
      document.getElementById('error-message').textContent = error.message || 'Login failed';
    }
  });
}

function handleLoginSuccess() {

  window.location.href = '../../index.html';
}

// Socket Connection Error Handling
socket.on('connect_error', (err) => {
  console.error('Socket connection failed:', err.message);
  document.getElementById('error-message').textContent = 'Realtime connection failed. Try again later.';
});

socket.on('connect', () => {
  console.log('Socket connected successfully.');
});
