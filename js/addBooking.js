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
        const response = await fetch('https://ghj-api.vercel.app/api/places', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(placeData)
        });

        const result = await response.json();
        if (response.ok) {
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
