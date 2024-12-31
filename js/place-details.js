document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const token = localStorage.getItem('token');
    const userBtn = document.getElementById('user-btn');


    // Check token and toggle buttons accordingly
    if (token) {
      // If there's a token, show logout and hide login/signup
      logoutBtn.classList.remove('d-none');
      userBtn.classList.remove('d-none');
      loginBtn.classList.add('d-none');
      signupBtn.classList.add('d-none');

    } else {
      // If there's no token, show login/signup and hide logout
      loginBtn.classList.remove('d-none');
      signupBtn.classList.remove('d-none');
      logoutBtn.classList.add('d-none');
      userBtn.classList.add('d-none');

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
  });


const urlParams = new URLSearchParams(window.location.search);
const placeName = urlParams.get('place') || 'Eiffel Tower';  // Default for testing

// Fetch and display data for the selected place
fetchPlaceDetails(placeName);

function fetchPlaceDetails(placeName) {
    fetchGooglePlaceDetails(placeName);
    fetchWikipediaData(placeName);
    fetchYouTubeVideo(placeName);
}

function initMap() {
    fetchPlaceDetails(placeName);  // Call this only after Maps API is loaded
}

function fetchGooglePlaceDetails(placeName) {
    const map = new google.maps.Map(document.createElement('div'));  // Dummy map
    const service = new google.maps.places.PlacesService(map);

    service.textSearch({ query: placeName }, (results, status) => {
        const placeInfoDiv = document.getElementById('placeInfo');
        if (!placeInfoDiv) return;

        if (status === google.maps.places.PlacesServiceStatus.OK && results[0]) {
            const place = results[0];

            // Get more detailed place info
            service.getDetails({ placeId: place.place_id }, (details, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    displayPlaceDetails(details);
                } else {
                    placeInfoDiv.innerHTML = `<p>Details not available for "${placeName}".</p>`;
                }
            });
        } else {
            placeInfoDiv.innerHTML = `<p>No results found for "${placeName}".</p>`;
        }
    });
}

function displayPlaceDetails(placeDetails) {
    const placeInfoDiv = document.getElementById('placeInfo');

    const openingHours = placeDetails.opening_hours ? placeDetails.opening_hours.weekday_text.join(', ') : 'Not Available';
    const priceLevel = placeDetails.price_level ? `Entry Fee: ${placeDetails.price_level}` : 'Entry Fee: Not Available';

    const photos = placeDetails.photos ? placeDetails.photos.map((photo, index) =>
        `<div class="item ${index === 0 ? 'active' : ''}">
            <img src="${photo.getUrl({ maxWidth: 400 })}" class="d-block w-100" alt="${placeDetails.name}">
        </div>`).join('') : '';

    placeInfoDiv.innerHTML = `
        <div class="card">
            <div class="card-body">
                <h3 class="card-title">${placeDetails.name}</h3>
                <p><strong>Address:</strong> ${placeDetails.formatted_address || 'N/A'}</p>
                <p><strong>Opening Hours:</strong> ${openingHours}</p>
                <p>${priceLevel}</p>
                <div id="placeCarousel" class="owl-carousel owl-theme">
                    ${photos}
                </div>
            </div>
        </div>
    `;

    // Initialize Owl Carousel with autoplay and arrows
    $('#placeCarousel').owlCarousel({
        loop: true,
        margin: 10,
        nav: true,  // Show navigation arrows
        items: 1,
        autoplay: true,  // Enable autoplay
        autoplayTimeout: 3000,  // Time between each slide (in milliseconds)
        autoplayHoverPause: true,  // Pause autoplay when the user hovers over the carousel
        navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'],  // Left and right arrow icons
    });
}


function fetchWikipediaData(placeName) {
    const wikipediaUrl = `https://en.wikipedia.org/api/rest_v1/page/html/${encodeURIComponent(placeName)}`;

    fetch(wikipediaUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Wikipedia page for "${placeName}" not found.`);
            }
            return response.text();  // Use .text() to get the full HTML of the page
        })
        .then(data => {
            const placeDescriptionDiv = document.getElementById('placeDescription');
            if (!placeDescriptionDiv) return;

            // Parse the HTML response to extract the content
            const doc = new DOMParser().parseFromString(data, 'text/html');
            const content = doc.querySelector('.mw-parser-output'); // This is the content container for articles

            // Remove any unwanted elements (like the Table of Contents)
            if (content) {
                const unwantedElements = content.querySelectorAll('table, .reflist');
                unwantedElements.forEach(el => el.remove());

                // Extract a portion of the content to display
                const paragraphs = content.querySelectorAll('p');
                let detailedSummary = '';

                // Select a few paragraphs to create a more detailed summary
                for (let i = 0; i < Math.min(paragraphs.length, 5); i++) {
                    detailedSummary += `<p>${paragraphs[i].innerHTML}</p>`;
                }

                // Show the detailed content inside the placeDescription div
                placeDescriptionDiv.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h3 class="card-title text-center">About ${placeName}</h3>
                            <div class="place-summary">${detailedSummary}</div>
                        </div>
                    </div>
                `;

                // Apply custom styles
                const summaryText = document.querySelector('.place-summary');
                if (summaryText) {
                    summaryText.style.fontSize = '18px';  // Change the font size as needed
                    summaryText.style.color = 'black';   // Change the text color to black
                    summaryText.style.lineHeight = '1.6'; // Add line spacing for better readability
                }
            } else {
                placeDescriptionDiv.innerHTML = `<p>Could not retrieve detailed content for "${placeName}".</p>`;
            }
        })
        .catch(err => {
            console.error('Error fetching Wikipedia data:', err);
            const placeDescriptionDiv = document.getElementById('placeDescription');
            if (placeDescriptionDiv) {
                placeDescriptionDiv.innerHTML = `<p>Could not find data for "${placeName}".</p>`;
            }
        });
}

// Fetch YouTube videos related to the place
function fetchYouTubeVideo(placeName) {
    const apiKey = 'AIzaSyD30jytQI7SHrABQZkWdydj3PQUn5T0jXw';  // Replace with your YouTube API key
    const youtubeUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${placeName}&type=video&maxResults=5&key=${apiKey}`;

    fetch(youtubeUrl)
        .then(response => response.json())
        .then(data => {
            const placeVideoDiv = document.getElementById('placeVideo');
            if (!placeVideoDiv) return;

            if (data.items && data.items.length > 0) {
                // Get the ID of the first video
                const videoId = data.items[0].id.videoId;

                // Embed the first video
                placeVideoDiv.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h3 class="card-title">${placeName} - Video</h3>
                            <iframe width="100%" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
                        </div>
                    </div>
                `;
            } else {
                placeVideoDiv.innerHTML = `<p>No videos found for "${placeName}".</p>`;
            }
        })
        .catch(err => {
            console.error('Error fetching YouTube video:', err);
            placeVideoDiv.innerHTML = `<p>Unable to fetch video for "${placeName}".</p>`;
        });
}
