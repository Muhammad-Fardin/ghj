document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = '/';
        return;
    }

    // Admin Check - Redirect if not admin
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

    // Create Navbar
    createNavbar();

    // Your existing code continues here...

    const socket = io('https://ghj-api.vercel.app', {
        transports: ['websocket', 'polling'],  // Fallback in case websocket fails
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
    });

    socket.on('activeUsers', (count) => {
        updateMetric('active-users', count);
    });

    socket.on('bookingClickCountUpdated', (count) => {
        const bookingClicksEl = document.getElementById('booking-clicks-count');
        if (bookingClicksEl) {
            bookingClicksEl.textContent = count;
        }
    });

    socket.on('bookingClickLogged', (data) => {
        const bookingClicksList = document.getElementById('booking-clicks-list');
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

    socket.on('loggedInUsers', (count) => {
        updateMetric('logged-in-users', count);
    });


    async function fetchMetrics() {
        try {
            const response = await fetch('https://ghj-api.vercel.app/api/metrics');

            if (!response.ok) {
                throw new Error('Failed to fetch metrics');
            }

            const data = await response.json();

            updateMetric('active-users', data.activeUsers);
            updateMetric('logged-in-users', data.loggedInUsers);
            updateMetric('booking-clicks', data.bookingClicks);

            if (Array.isArray(data.graphData)) {
                renderGraph(data.graphData);
            } else {
                console.error('Invalid graph data:', data.graphData);
            }

            const bookingClicksList = document.getElementById('booking-clicks-list');
            if (bookingClicksList) {
                bookingClicksList.innerHTML = '';

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

    function createNavbar() {
        const navbar = document.createElement('nav');
        navbar.classList.add('navbar', 'navbar-expand-lg', 'navbar-light', 'bg-light');
        navbar.innerHTML = `
          <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
        <a class="navbar-brand" href="/">Ghumojaha</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ml-auto">
                <li class="nav-item">
                    <a class="nav-link" href="../../index.html">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="./dashboard.html">Dashboard</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="./blog.html">Add Blog</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="./booking.html">Add Place</a>
                </li>
            </ul>
        </div>
    </div>
</nav>
        `;
        document.body.prepend(navbar);
    }
});
