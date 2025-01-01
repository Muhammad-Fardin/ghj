// Toggle Login/Signup/Logout buttons based on token
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const userBtn = document.getElementById('user-btn');
  
  
    const toggleButtons = (show) => {
      if (show) {
        logoutBtn.classList.remove('d-none');
        userBtn.classList.remove('d-none');
        loginBtn.classList.add('d-none');
        signupBtn.classList.add('d-none');
      } else {
        loginBtn.classList.remove('d-none');
        signupBtn.classList.remove('d-none');
        logoutBtn.classList.add('d-none');
        userBtn.classList.add('d-none');
      }
    };
  
    // Check token and toggle buttons accordingly
    if (token) {
      toggleButtons(true);
    } else {
      toggleButtons(false);
    }
  
    // Logout functionality
    const handleLogout = (logoutBtnElement) => {
      localStorage.removeItem('token');
      toggleButtons(false);
      window.location.reload();
    };
  
    logoutBtn?.addEventListener('click', () => handleLogout(logoutBtn));
  });
  
  document.addEventListener('DOMContentLoaded', () => {
    const userButton = document.getElementById('user-icon');
    const token = localStorage.getItem('token');
  
    if (userButton) {
        userButton.addEventListener('click', () => {
            if (token) {
                // If user is logged in, redirect to the profile page
                window.location.href = './userpage.html';
            } else {
                // If user is not logged in, redirect to the login page
                window.location.href = './auth/login.html';
            }
        });
    }
  });