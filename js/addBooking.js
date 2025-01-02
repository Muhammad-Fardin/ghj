document.addEventListener('DOMContentLoaded', async function () {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = './index.js';
        return;
    }

    // Verify if the user is an admin through the check-admin API
    const response = await fetch('https://ghj-api.vercel.app/api/admin/check-admin', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    const data = await response.json();

    if (!data.isAdmin) {
        alert('Access denied. Admin privileges required.');
        window.location.href = '/';
        return;
    }

    // Admin validation passed - allow form submission
    document.getElementById('addPlaceForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const placeData = {
            name: document.getElementById('placeName').value,
            location: document.getElementById('location').value,
            image: document.getElementById('imageUrl').value,
            bookingUrl: document.getElementById('bookingUrl').value,
            rating: parseFloat(document.getElementById('rating').value),
            aboutUrl: document.getElementById('aboutUrl').value,
        };

        try {
            const placeResponse = await fetch('https://ghj-api.vercel.app/api/places', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(placeData),
            });

            const result = await placeResponse.json();
            if (placeResponse.ok) {
                alert(result.message);
                document.getElementById('addPlaceForm').reset();
            } else {
                alert(result.error || 'Failed to add place');
            }
        } catch (error) {
            console.error('Error adding place:', error);
            alert('Error occurred while adding place.');
        }
    });
});
