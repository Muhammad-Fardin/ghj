document.addEventListener('DOMContentLoaded', async () => {
    // Check if the user has admin rights before proceeding

    // Your existing code continues here...
    
    const socket = io('https://ghj-api.vercel.app:5000', {
        transports: ['websocket', 'polling'],  // Fallback in case websocket fails
        reconnection: true,  // Enable automatic reconnection
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
    });

    // Listen for active user updates
    socket.on('activeUsers', (count) => {
        updateMetric('active-users', count);
    });

    // Listen for the updated booking click count from the backend
    socket.on('bookingClickCountUpdated', (count) => {
        // Update the booking click count on the frontend
        const bookingClicksEl = document.getElementById('booking-clicks-count');
        if (bookingClicksEl) {
            bookingClicksEl.textContent = count;
        }
    });

    // Handle booking click updates
    socket.on('bookingClickLogged', (data) => {
        const bookingClicksList = document.getElementById('booking-clicks-list');

        // Add new booking click to the list of clicks
        if (bookingClicksList) {
            const div = document.createElement('div');
            div.classList.add('booking-click-item');
            div.innerHTML = `
                <strong>User:</strong> ${data.userId.username || 'Unknown'} <br>
                <strong>Redirect URL:</strong> ${data.redirectTo} <br>
                <strong>Time:</strong> ${new Date(data.timestamp).toLocaleString()}
            `;
            bookingClicksList.appendChild(div);
        }
    });

    // Listen for logged-in user count
    socket.on('loggedInUsers', (count) => {
        updateMetric('logged-in-users', count);
    });

    // Booking Button Click - Emit Event
    const bookTicketsBtn = document.getElementById('bookTicketsBtn');
    if (bookTicketsBtn) {
        bookTicketsBtn.addEventListener('click', () => {
            const userId = getUserId();  // Assume function to fetch logged-in user ID
            const redirectTo = 'https://asi.paygov.org.in/asi-webapp/#/ticketbooking';

            // Emit booking click only if user is logged in
            if (userId) {
                socket.emit('bookingClick', { userId, redirectTo });
            }
        });
    }

    async function fetchMetrics() {
        try {
            const response = await fetch('https://ghj-api.vercel.app/api/metrics');

            if (!response.ok) {
                throw new Error('Failed to fetch metrics');
            }

            const data = await response.json();

            // Update basic metrics (Active Users, Logged-In Users, etc.)
            updateMetric('active-users', data.activeUsers);
            updateMetric('logged-in-users', data.loggedInUsers);
            updateMetric('booking-clicks', data.bookingClicks);  // Display count of clicks

            // Render the graph if graph data is valid
            if (Array.isArray(data.graphData)) {
                renderGraph(data.graphData);  // Render the graph with data
            } else {
                console.error('Invalid graph data:', data.graphData);
            }

            // Check if bookingClickDetails is an array before calling forEach
            const bookingClicksList = document.getElementById('booking-clicks-list');
            if (bookingClicksList) {
                bookingClicksList.innerHTML = '';  // Clear the previous list

                if (Array.isArray(data.bookingClickDetails)) {
                    data.bookingClickDetails.forEach(click => {
                        const div = document.createElement('div');
                        div.classList.add('booking-click-item');
                        div.innerHTML = `
                            <strong>User:</strong> ${click.userId.username || 'Unknown'} <br>
                            <strong>Redirect URL:</strong> ${click.redirectTo} <br>
                            <strong>Time:</strong> ${new Date(click.timestamp).toLocaleString()}
                        `;
                        bookingClicksList.appendChild(div);
                    });
                } else {
                    console.warn('bookingClickDetails is not an array:', data.bookingClickDetails);
                }
            }

        } catch (error) {
            console.error('Error fetching metrics:', error);
        }
    }

    function updateMetric(metricId, value) {
        const element = document.getElementById(metricId);
        if (element) {
            element.textContent = value;
        }
    }

    function toBlog() {
        window.location.href = './blog.html';
    }
});
