const signupForm = document.getElementById('signup-form');
const errorMessage = document.getElementById("error-message");

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", 
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi"
];

// Populate state dropdown dynamically
const stateDropdown = document.getElementById("state");

indianStates.forEach(state => {
  const option = document.createElement("option");
  option.value = state;
  option.textContent = state;
  stateDropdown.appendChild(option);
});

signupForm.addEventListener("submit", function (event) {
  const phoneNumber = phoneInputField.value.trim();

  if (!/^\d{10}$/.test(phoneNumber)) {
    errorMessage.textContent = "Phone number must be exactly 10 digits.";
    event.preventDefault();  // Prevent form submission
  } else {
    errorMessage.textContent = "";  // Clear error if valid
  }
});

const phoneInputField = document.querySelector("#phone");
const phoneInput = window.intlTelInput(phoneInputField, {
  initialCountry: "in",
  separateDialCode: true,
  utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js"
});

if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const state = document.getElementById('state').value;
    const password = document.getElementById('password').value;
    
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, phone, state, password }),
      });
  
      if (!res.ok) throw new Error('Signup failed');
      
      const data = await res.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      window.location.href = './auth/login.html';

    } catch (error) {
      document.getElementById('error-message').textContent = error.message;
    }
  });
}
