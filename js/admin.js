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

    const socket = io('wss://ghj-api.vercel.app', {
        transports: ['websocket', 'polling'],
        path: '/socket.io/'
    });  // Change to live URL if necessary

    // Socket Listeners for Real-time Updates
    socket.on('activeUsers', (activeUsers) => {
        updateElementText('active-users', activeUsers);
    });

    socket.on('loggedInUsers', (loggedInUsers) => {
        updateElementText('logged-in-users', loggedInUsers);
    });

    socket.on('bookingClick', (clickData) => {
        const bookingClicksList = document.getElementById('booking-clicks-list');
        const div = document.createElement('div');
        div.classList.add('booking-click-item');
        div.innerHTML = `
            <strong>User:</strong> ${clickData.userId} <br>
            <strong>Redirect URL:</strong> ${clickData.redirectTo} <br>
            <strong>Time:</strong> ${new Date(clickData.timestamp).toLocaleString()}
        `;
        bookingClicksList.prepend(div);
    });

    // Fetch Metrics Periodically
    async function fetchMetrics() {
        try {
            const response = await fetch('https://ghj-api.vercel.app/api/metrics');
            const data = await response.json();

            updateElementText('active-users', data.activeUsers);
            updateElementText('logged-in-users', data.loggedInUsers);
            updateElementText('booking-clicks', data.bookingClicks);
            renderBookingUrlClicks(data.urlClickData);

            updateLastFetched();
        } catch (error) {
            console.error('Error fetching metrics:', error);
            showError('Failed to fetch metrics. Please check your connection.');
        }
    }

    // Update Metric Values
    function updateElementText(elementId, value) {
        const el = document.getElementById(elementId);
        if (el) el.textContent = value;
    }

    // Update Last Fetched Time
    function updateLastFetched() {
        const lastUpdatedEl = document.getElementById('last-updated');
        if (lastUpdatedEl) {
            lastUpdatedEl.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
        }
    }

    // Error Handling
    function showError(message) {
        alert(message || 'Error occurred!');
    }

    // Create Navbar Dynamically
    function createNavbar() {
        const navbar = document.createElement('nav');
        navbar.classList.add('navbar', 'navbar-expand-lg', 'navbar-light', 'bg-light');
        navbar.innerHTML = `
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <div class="container-fluid">
                    <a class="navbar-brand" href="/">Ghumojaha</a>
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav">
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


    function renderBookingUrlClicks(urlClickData) {
        const list = document.getElementById('redirect-urls');
        list.innerHTML = '';  // Clear existing list
    
        urlClickData.forEach(item => {
            const li = document.createElement('li');
            li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
            li.innerHTML = `
                <a href="${item._id}" target="_blank">${item._id}</a>
                <span class="badge click-count bg-secondary rounded-pill">${item.count}</span>
            `;
            list.appendChild(li);
        });
    }
    
    // Initial Metric Fetch
    fetchMetrics();
    
    // Polling for Updates Every 10 Seconds
    setInterval(fetchMetrics, 10000);
});
