"use strict";

// Dropdown on mouse hover
document.addEventListener("DOMContentLoaded", function () {
  const toggler = document.querySelector('.navbar-toggler');
  const collapse = document.querySelector('#navbarCollapse');

  toggler.addEventListener('click', function () {
      if (collapse.style.display === "block") {
          collapse.style.display = "none";
      } else {
          collapse.style.display = "block";
      }
  });
});



// Back to top button
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
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// Date and time picker (requires a date picker library)
document.addEventListener("DOMContentLoaded", function () {
  const dateInputs = document.querySelectorAll(".date input");
  const timeInputs = document.querySelectorAll(".time input");

  dateInputs.forEach((input) => {
    input.addEventListener("focus", () => {
      input.type = "date";
    });
    input.addEventListener("blur", () => {
      if (!input.value) input.type = "text";
    });
  });

  timeInputs.forEach((input) => {
    input.addEventListener("focus", () => {
      input.type = "time";
    });
    input.addEventListener("blur", () => {
      if (!input.value) input.type = "text";
    });
  });
});

// Testimonials carousel (requires a carousel library like OwlCarousel or Swiper)
document.addEventListener("DOMContentLoaded", function () {
  const carouselContainer = document.querySelector(".testimonial-carousel");

  if (carouselContainer) {
    // Example using Swiper.js (you'll need to include Swiper library in your project)
    new Swiper(".testimonial-carousel", {
      loop: true,
      autoplay: {
        delay: 3000,
      },
      speed: 1500,
      spaceBetween: 30,
      centeredSlides: true,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        576: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
        },
        992: {
          slidesPerView: 3,
        },
      },
    });
  }
});




  document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const token = localStorage.getItem('token');
    const loginBtnMobile = document.getElementById('login-btn-mobile');
    const signupBtnMobile = document.getElementById('signup-btn-mobile');
    const logoutBtnMobile = document.getElementById('logout-btn-mobile');
    const userBtn = document.getElementById('user-btn');
    const userBtnMobile = document.getElementById('user-btn-mobile');

    // Check token and toggle buttons accordingly
    if (token) {
      // If there's a token, show logout and hide login/signup
      logoutBtn.classList.remove('d-none');
      userBtn.classList.remove('d-none');
      loginBtn.classList.add('d-none');
      signupBtn.classList.add('d-none');
  
      // For mobile version
      logoutBtnMobile.classList.remove('d-none');
      userBtnMobile.classList.remove('d-none');
      loginBtnMobile.classList.add('d-none');
      signupBtnMobile.classList.add('d-none');
    } else {
      // If there's no token, show login/signup and hide logout
      loginBtn.classList.remove('d-none');
      signupBtn.classList.remove('d-none');
      logoutBtn.classList.add('d-none');
      userBtn.classList.add('d-none');

  
      // For mobile version
      loginBtnMobile.classList.remove('d-none');
      signupBtnMobile.classList.remove('d-none');
      logoutBtnMobile.classList.add('d-none');
      userBtnMobile.classList.add('d-none');

    }
  
    // Logout functionality
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        // Remove token on logout
        localStorage.removeItem('token');
        // Hide logout and show login/signup
        logoutBtn.classList.add('d-none');
        userBtn.classList.add('d-none');
        loginBtn.classList.remove('d-none');
        signupBtn.classList.remove('d-none');
        // Optional: Reload page to apply changes
        window.location.reload();
      });
    }
  
    if (logoutBtnMobile) {
      logoutBtnMobile.addEventListener('click', () => {
        // Remove token on logout
        localStorage.removeItem('token');
        // Hide logout and show login/signup
        logoutBtnMobile.classList.add('d-none');
        loginBtnMobile.classList.remove('d-none');
        signupBtnMobile.classList.remove('d-none');
        // Optional: Reload page to apply changes
        window.location.reload();
      });
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const bookTicketsBtn = document.getElementById('bookTicketsBtn');
  
    // Check if the user is logged in and handle button click
    bookTicketsBtn.addEventListener('click', (event) => {
      if (!token) {
        event.preventDefault();  // Prevent the default behavior (like redirecting)
        showToast();  // Show the toast if not logged in
      } else {
        window.open('https://asi.paygov.org.in/asi-webapp/#/ticketbooking', '_blank');
      }
    });
  
    // Function to show toast notification
    function showToast() {
      // Clear any previous timeout and hide the toast first if it's already visible
      const toastElement = document.getElementById('loginToast');
      toastElement.classList.remove('show');
      
      // Reflow the toast to ensure it gets shown
      void toastElement.offsetWidth;
  
      // Show the toast (via Bootstrap)
      toastElement.classList.add('show');
  
      // Set the toast to hide after 3 seconds
      setTimeout(() => {
        toastElement.classList.remove('show');
      }, 2000); // Show for 3 seconds
    }
  });
  
  
 