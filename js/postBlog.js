document.addEventListener('DOMContentLoaded', async function () {
    const token = localStorage.getItem('token');

    // Select form and admin message elements
    const adminMessage = document.getElementById('admin-message');
    const blogForm = document.getElementById('blog-form');

    // Redirect if no token
    if (!token) {
        window.location.href = '/';
        return;
    }

    // Call check-admin API to verify admin role
    const response = await fetch('https://ghj-api.vercel.app/api/admin/check-admin', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    const data = await response.json();

    // Handle admin validation response
    if (data.isAdmin) {
        blogForm.classList.remove('d-none');
        blogForm.classList.add('d-block');
        adminMessage.classList.add('d-none');
    } else {
        adminMessage.classList.remove('d-none');
        adminMessage.classList.add('d-block');
        blogForm.classList.add('d-none');
        setTimeout(() => {
            window.location.href = '/';
        }, 2000);  // Redirect to home after 2 seconds
    }

    // Handle form submission
    blogForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const blogData = {
            title: document.getElementById('title').value,
            image: document.getElementById('image').value || null,
            videoUrl: document.getElementById('videoUrl').value || null,
            text: document.getElementById('text').value,
        };

        // Send blog data to the backend
        fetch('https://ghj-api.vercel.app/api/blog/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(blogData),
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert('Blog added successfully!');
                window.location.href = './dashboard.html';
            } else {
                alert(data.error || 'Failed to add blog.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while adding the blog.');
        });
    });
});
