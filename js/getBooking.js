document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('https://ghj-api.vercel.app/api/places/');
        const places = await response.json();
        console.log(places)
        const container = document.getElementById('placesContainer');


        places.forEach(place => {
            const placeCard = document.createElement('div');
            placeCard.className = 'col-md-4 mb-4 d-flex align-items-stretch';
            placeCard.innerHTML = `
                <div class="card h-100">
                    <img src="${place.image}" class="card-img-top" alt="${place.name}">
                    <div class="card-body">
                        <h5 class="card-title">${place.name}</h5>
                        <p class="card-text">Location: ${place.location}</p>
                        <p class="card-text">Rating: ${place.rating} &#9733;</p>
                        <a href="${place.bookingUrl}" class="btn btn-primary w-100" target="_blank">Book Now</a>
                        <a href="${place.aboutUrl || '#'}" class="btn btn-secondary w-100 mt-2" ${place.aboutUrl ? '' : 'disabled'} target="_blank">Know More</a>
                    </div>
                </div>
            `;
            container.appendChild(placeCard);
        });

    } catch (error) {
        console.error('Error fetching places:', error);
    }
});