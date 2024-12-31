"use strict";

// Toggle Navbar on click
document.addEventListener("DOMContentLoaded", function () {
  const toggler = document.querySelector('.navbar-toggler');
  const collapse = document.querySelector('#navbarCollapse');

  toggler.addEventListener('click', function () {
    collapse.style.display = collapse.style.display === "block" ? "none" : "block";
  });
});

// Back to Top Button functionality
const backToTopButton = document.querySelector(".back-to-top");

window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    backToTopButton.style.display = "block";
    backToTopButton.style.opacity = "1";
    backToTopButton.style.transition = "opacity 0.5s ease";
  } else {
    backToTopButton.style.opacity = "0";
    setTimeout(() => (backToTopButton.style.display = "none"), 500);
  }
});

backToTopButton.addEventListener("click", (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Date and Time Picker functionality
document.addEventListener("DOMContentLoaded", function () {
  const dateInputs = document.querySelectorAll(".date input");
  const timeInputs = document.querySelectorAll(".time input");

  dateInputs.forEach((input) => {
    input.addEventListener("focus", () => input.type = "date");
    input.addEventListener("blur", () => { if (!input.value) input.type = "text"; });
  });

  timeInputs.forEach((input) => {
    input.addEventListener("focus", () => input.type = "time");
    input.addEventListener("blur", () => { if (!input.value) input.type = "text"; });
  });
});

// Testimonials Carousel using Swiper.js
document.addEventListener("DOMContentLoaded", function () {
  const carouselContainer = document.querySelector(".testimonial-carousel");

  if (carouselContainer) {
    new Swiper(".testimonial-carousel", {
      loop: true,
      autoplay: { delay: 3000 },
      speed: 1500,
      spaceBetween: 30,
      centeredSlides: true,
      pagination: { el: ".swiper-pagination", clickable: true },
      breakpoints: {
        0: { slidesPerView: 1 },
        576: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        992: { slidesPerView: 3 }
      }
    });
  }
});

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
              window.location.href = './pages/userpage.html';
          } else {
              // If user is not logged in, redirect to the login page
              window.location.href = './pages/auth/login.html';
          }
      });
  }
});

// Redirect to login page if not logged in when booking tickets
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const bookTicketsBtn = document.getElementById('bookTicketsBtn');
  
  // Socket.io connection
  const socket = io('https://ghj-api.vercel.app:5000');  // Connect to backend server

  bookTicketsBtn.addEventListener('click', (event) => {
    if (!token) {
      event.preventDefault(); // Prevent default redirection if not logged in
      window.location.href = './pages/auth/login.html';  // Redirect to login page if not logged in
    } else {
      // Emit booking click event to backend with user info and redirect URL
      const user = JSON.parse(localStorage.getItem('user')); // Get user info from localStorage
      const userId = user ? user._id : null; // Get user ID if logged in
      const redirectTo = 'https://asi.paygov.org.in/asi-webapp/#/ticketbooking'; // URL where user is being redirected

      // Emit the booking click event to the backend
      socket.emit('bookingClick', { userId, redirectTo });

      // Redirect to ASI website if logged in
      window.open(redirectTo, '_blank');
    }
  });
});
