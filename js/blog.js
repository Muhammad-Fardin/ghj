document.addEventListener('DOMContentLoaded', function() {
    // Retrieve the token from localStorage
    const token = localStorage.getItem('token');

    // Function to decode the JWT token (it is Base64 encoded)
    function decodeToken(token) {
        if (!token) return null;
        const payload = token.split('.')[1]; // Get the payload part of the JWT
        const decoded = JSON.parse(atob(payload)); // Decode the Base64 URL-encoded string
        return decoded;
    }

    // Check if the user is an admin by decoding the token
    const decodedToken = decodeToken(token);
    const isAdmin = decodedToken && decodedToken.role === 'admin'; // Assuming 'role' is part of the token's payload

    const adminMessage = document.getElementById('admin-message');
    const blogForm = document.getElementById('blog-form');

    // If the user is an admin, show the form; otherwise, show the error message
    if (isAdmin) {
        blogForm.classList.remove('d-none'); // Show form if admin
        blogForm.classList.add('d-block');
        adminMessage.classList.add('d-none'); // Hide error message
    } else {
        adminMessage.classList.remove('d-none'); // Show error message if not admin
        adminMessage.classList.add('d-block');
        blogForm.classList.add('d-none'); // Hide form if not admin
    }

    // Handle form submission
    blogForm.addEventListener('submit', function(e) {
        e.preventDefault();
    
        const blogData = {
            title: document.getElementById('title').value,
            image: document.getElementById('image').value || null,
            videoUrl: document.getElementById('videoUrl').value || null,
            text: document.getElementById('text').value
        };
    
        console.log('Sending blog data:', blogData);  // Log data before sending
    
        // Check if token exists before sending
        if (!token) {
            alert('You must be logged in to add a blog.');
            return;
        }
    
        // Send the blog data via a POST request using Fetch API
        fetch('https://ghumo-qg2h.onrender.com/api/blog/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,  // Add token here
            },
            body: JSON.stringify(blogData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert('Blog added successfully!');
                window.location.href = './dashboard.html'; // Redirect to the admin dashboard or another page
            } else {
                alert(data.error || 'Failed to add blog.');  // Display the error from the backend, if available
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while adding the blog.');
        });
    });
});
