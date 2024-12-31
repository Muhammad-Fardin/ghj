let map, userMarker, directionsService, directionsRenderer, placesService, placeListContainer;
let markers = [];
let selectedCountry = null; // Global variable for selected country
const radius = 5000; // Radius in meters to search nearby places

const mapStyles = [
    { "elementType": "geometry", "stylers": [{ "color": "#1f1f1f" }] },
    { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
    { "elementType": "labels.text.fill", "stylers": [{ "color": "#ffffff" }] },
    { "elementType": "labels.text.stroke", "stylers": [{ "color": "#1a1a1a" }] },
    { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#888888" }] },
    { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "color": "#444444" }] },
    { "featureType": "road.local", "elementType": "geometry", "stylers": [{ "color": "#333333" }] },
    { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#000000" }] },
    { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "color": "#2a2a2a" }] }
];

const fallbackLocation = { lat: 28.5245, lng: 77.1855 }; // Fallback location in case geolocation fails

async function init() {
    // Populate country dropdown
    await populateCountries();

    // Initialize the map after country is selected
    initMap();

    // Event listener for country selection
    document.getElementById('country-select').addEventListener('change', (event) => {
        selectedCountry = event.target.value;
        fetchNearbyPlaces(userMarker.getPosition().lat(), userMarker.getPosition().lng());
    });

    // Search input event listener
    document.getElementById('search-location').addEventListener('input', searchLocation);
}

// Fetch and populate countries in the dropdown
async function populateCountries() {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const countries = await response.json();

    // Sort countries alphabetically by name
    const sortedCountries = countries.sort((a, b) => a.name.common.localeCompare(b.name.common));

    const countrySelect = document.getElementById('country-select');

    // Populate the dropdown with sorted countries
    sortedCountries.forEach(country => {
        const option = document.createElement('option');
        option.value = country.cca2;
        option.textContent = country.name.common;
        countrySelect.appendChild(option);
    });
}

// Initialize the map with the user's location or fallback location
function initMap() {
    navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        initializeMap(latitude, longitude);
    }, (error) => {
        console.error('Geolocation failed:', error);
        console.log('Using fallback location:', fallbackLocation);
        initializeMap(fallbackLocation.lat, fallbackLocation.lng);
    }, { enableHighAccuracy: true });
}

function initializeMap(lat, lng) {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: lat, lng: lng },
        zoom: 14,
        mapTypeControl: false,
        zoomControl: true,
        streetViewControl: false,
        disableDefaultUI: true,
        styles: mapStyles,
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({ map: map });
    placesService = new google.maps.places.PlacesService(map);

    userMarker = new google.maps.Marker({
        position: { lat: lat, lng: lng },
        map: map,
        title: 'Your Location',
        icon: {
            url: '../img/favicon.png',
            scaledSize: new google.maps.Size(30, 30),
        },
    });

    map.setCenter({ lat: lat, lng: lng }); // Ensure the map is centered at user's location

    placeListContainer = document.getElementById('places');
    fetchNearbyPlaces(lat, lng);
}

document.getElementById('country-select').addEventListener('change', async (event) => {
    selectedCountry = event.target.value;

    if (selectedCountry) {
        const response = await fetch(`https://restcountries.com/v3.1/alpha/${selectedCountry}`);
        const countryData = await response.json();

        const country = countryData[0];
        const lat = country.latlng[0]; // Latitude
        const lng = country.latlng[1]; // Longitude

        // Center map on the selected country
        map.setCenter({ lat: lat, lng: lng });
        map.setZoom(6); // Adjust zoom level as needed
    }
});

document.getElementById('country-select').addEventListener('touchstart', async (event) => {
    selectedCountry = event.target.value;
    if (selectedCountry) {
        const response = await fetch(`https://restcountries.com/v3.1/alpha/${selectedCountry}`);
        const countryData = await response.json();

        const country = countryData[0];
        const lat = country.latlng[0]; // Latitude
        const lng = country.latlng[1]; // Longitude

        // Center map on the selected country
        map.setCenter({ lat: lat, lng: lng });
        map.setZoom(6); // Adjust zoom level as needed
    }
});

function fetchNearbyPlaces(lat, lng) {
    const queries = ['unesco world heritage site', 'historical monument'];
    queries.forEach(query => {
        const request = {
            location: new google.maps.LatLng(lat, lng),
            radius: radius,
            query: selectedCountry ? `${query} in ${selectedCountry}` : query,  // Use selected country in the query
        };

        placesService.textSearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                displayPlaceMarkers(results);
                populatePlaceList(results);
            } else {
                console.error('Places search failed:', status);
            }
        });
    });
}

function displayPlaceMarkers(places) {
    places.forEach(place => {
        const marker = new google.maps.Marker({
            position: place.geometry.location,
            map: map,
            title: place.name,
            icon: {
                url: '../img/pin.png',
                scaledSize: new google.maps.Size(30, 30),
            },
        });

        markers.push(marker);
        marker.addListener("click", () => {
            drawRoute(userMarker.getPosition(), marker.getPosition());
        });
    });
}

function populatePlaceList(places) {
    placeListContainer.innerHTML = '';
    places.forEach(place => {
        const placeItem = document.createElement('div');
        placeItem.classList.add('place-item');
        placeItem.innerHTML = `
            <div class="card mb-3">
                <div class="row no-gutters">
                    <div class="col-md-4">
                        <img src="${place.photos ? place.photos[0].getUrl() : '../img/default.png'}" class="card-img fixed-size" alt="${place.name}">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${place.name}</h5>
                            <p class="card-text">${place.formatted_address}</p>
                            <button class="my-2 btn btn-primary" onclick="scrollToMap(); drawRoute(userMarker.getPosition(), new google.maps.LatLng(${place.geometry.location.lat()}, ${place.geometry.location.lng()}))">Get Route</button>
                            <button class="my-2 btn btn-success" onclick="exploreMore('${place.name}')">Explore More</button>
                            <button class="my-2 btn btn-warning" onclick="bookRide('${place.name}')">Book a Ride</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        placeListContainer.appendChild(placeItem);
    });
}

function exploreMore(placeName) {
    // Check if the user is logged in by checking for token
    if (isUserLoggedIn()) {
        // If logged in, navigate to the place details page
        window.location.href = `place-details.html?place=${encodeURIComponent(placeName)}`;
    } else {
        // If not logged in, store the current page URL and redirect to login/signup page
        localStorage.setItem('redirectTo', window.location.href); // Store current page URL
        window.location.href = '../pages/auth/login.html'; // Redirect to the login/signup page
    }
}

// Check if the user is logged in by checking for token in localStorage
function isUserLoggedIn() {
    // This can be a check for a token or a session variable
    return localStorage.getItem('token') !== null; // Check for 'token' in localStorage
}




function bookRide(placeDetails) {
    // Retrieve the formatted address from the placeDetails
    const destination = encodeURIComponent(placeDetails.formatted_address);

    // Uber URL scheme for booking a ride
    const uberUrl = `https://m.uber.com/ul/?&pickup=my_location&dropoff[formatted_address]=${destination}`;

    // Open the Uber link in a new tab
    window.open(uberUrl, '_blank');
}


function drawRoute(origin, destination) {
    directionsService.route({
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
    }, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setOptions({
                polylineOptions: {
                    strokeColor: "#32cd32",
                    strokeWeight: 6,
                    strokeOpacity: 0.8,
                }
            });
            directionsRenderer.setDirections(result);
        } else {
            console.error('Directions request failed:', status);
        }
    });
}

function scrollToMap() {
    document.getElementById('map').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// document.getElementById('search-location').addEventListener('input', searchLocation);
document.getElementById('search-location').addEventListener('touchstart', searchLocation);
// Search for a location within the selected country
function searchLocation() {
    const searchQuery = document.getElementById('search-location').value;
    const request = {
        query: searchQuery + (selectedCountry ? `, ${selectedCountry}` : ''), // Append selected country if available
        fields: ['name', 'geometry'],
    };

    placesService.findPlaceFromQuery(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            const place = results[0];
            map.setCenter(place.geometry.location);
            userMarker.setPosition(place.geometry.location);
            fetchNearbyPlaces(place.geometry.location.lat(), place.geometry.location.lng());
        } else {
            console.error('Search failed:', status);
        }
    });
}

window.onload = init;

// CSS for image resizing
const style = document.createElement('style');
style.innerHTML = `
    .fixed-size {
        width: 100%;
        height: 200px;
        object-fit: cover;
    }
`;
document.head.appendChild(style);
