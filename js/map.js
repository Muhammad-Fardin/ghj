let map, userMarker, directionsService, directionsRenderer, placesService, placeListContainer;
let markers = [];
const radius = 5000; // Radius in meters to search nearby places

const mapStyles = [
    { "elementType": "geometry", "stylers": [{ "color": "#1f1f1f" }] },
    { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
    { "elementType": "labels.text.fill", "stylers": [{ "color": "#ffffff" }] },
    { "elementType": "labels.text.stroke", "stylers": [{ "color": "#1a1a1a" }] },
    // Make highways and primary roads a lighter, more visible color
    { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#888888" }] },
    { "featureType": "road.primary", "elementType": "geometry", "stylers": [{ "color": "#888888" }] },
    // De-emphasize secondary and tertiary roads with muted colors
    { "featureType": "road.secondary", "elementType": "geometry", "stylers": [{ "color": "#555555" }] },
    { "featureType": "road.tertiary", "elementType": "geometry", "stylers": [{ "color": "#444444" }] },
    // Make residential roads less prominent
    { "featureType": "road.residential", "elementType": "geometry", "stylers": [{ "color": "#333333" }] },
    // Keep water bodies in black
    { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#000000" }] },
    // Landscape area
    { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "color": "#2a2a2a" }] }
];

// Fallback location in case geolocation fails (New York City)
const fallbackLocation = { lat: 28.5245, lng: 77.1855 };

function initMap() {
    navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;

        // Initialize map with user's location
        initializeMap(latitude, longitude);
    }, (error) => {
        console.error('Geolocation failed:', error);
        // Fallback location if geolocation fails
        console.log('Using fallback location:', fallbackLocation);
        initializeMap(fallbackLocation.lat, fallbackLocation.lng);
    }, { enableHighAccuracy: true });
}

function initializeMap(lat, lng) {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: lat, lng: lng },
        zoom: 12,
        mapTypeControl: false,
        zoomControl: false,
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

function fetchNearbyPlaces(lat, lng) {
    const queries = ['unesco world heritage site', 'historical monument'];
    queries.forEach(query => {
        const request = {
            location: new google.maps.LatLng(lat, lng),
            radius: radius,
            query: query,
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
                            <button class="btn btn-primary" onclick="scrollToMap(); drawRoute(userMarker.getPosition(), new google.maps.LatLng(${place.geometry.location.lat()}, ${place.geometry.location.lng()}))">Get Route</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        placeListContainer.appendChild(placeItem);
    });
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

window.onload = initMap;

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
