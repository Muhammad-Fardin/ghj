document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');

    if (!token) {
        alert('No token found, please log in again.');
        window.location.href = '../pages/auth/login.html';
        return;
    }

    try {
        const res = await fetch('https://ghumo-qg2h.onrender.com/api/auth/user', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            throw new Error('Failed to fetch user data');
        }

        const user = await res.json();

        if (!user || !user.username) {
            alert('User data is incomplete or missing.');
            return;
        }

        // States and UTs array
        const statesAndUTs = [
            "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
            "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
            "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
            "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep",
            "Delhi", "Puducherry", "Ladakh"
        ];

        // Display user info
        document.getElementById('user-info').innerHTML = `
            <div class="container mt-5">
                <div class="row justify-content-center">
                    <div class="col-12 col-md-8 col-lg-6" style="max-width: 500px;">
                        <div class="card p-4" style="border-radius: 15px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
                            <div class="card-body">
                                <h4 class="card-title text-center mb-4">Edit Profile</h4>

                                <div class="mb-3" id="username-container">
                                    <label for="username" class="form-label">Username:</label>
                                    <input type="text" class="form-control" id="username" value="${user.username}" disabled />
                                </div>
                                <div class="mb-3" id="user-id-container">
                                    <label for="userid" class="form-label">Userid:</label>
                                    <input type="text" class="form-control" id="userid" value="${user.userId}" disabled />
                                </div>

                                <div class="mb-3" id="phone-container">
                                    <label for="phone" class="form-label">Phone:</label>
                                    <div class="input-group">
                                        <input id="phone" type="tel" class="form-control" value="${user.phone || ''}" disabled />
                                        <button id="edit-phone" class="btn btn-primary">Edit</button>
                                    </div>
                                </div>

                                <div class="mb-3" id="state-container">
                                    <label for="state" class="form-label">State:</label>
                                    <div class="input-group">
                                        <select id="state" class="form-select w-100" disabled>
                                            ${statesAndUTs.map(state => `
                                                <option value="${state}" ${state === user.state ? 'selected' : ''}>${state}</option>
                                            `).join('')}
                                        </select>
                                        <button id="edit-state" class="btn btn-primary ms-2">Edit</button>
                                    </div>
                                </div>

                                <button id="logout-btn" class="btn btn-danger w-100 mt-3" onClick={logOut()}>Log Out</button>
                                <button id="saveBtn" class="btn btn-success w-100 mt-3" disabled>Save Changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Attach Logout Event
        // const logoutBtn = document.getElementById('logout-btn');
        // logoutBtn.addEventListener('click', () => {
        //     localStorage.removeItem('token');
        //     window.location.href = './index.html';
        // });



        // Initialize intl-tel-input
        const phoneInput = document.getElementById('phone');
        const iti = window.intlTelInput(phoneInput, {
            initialCountry: 'in',  // Set to India or detect user location
            separateDialCode: true,
            utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js"
        });

        // Enable Phone Editing
        document.getElementById('edit-phone').addEventListener('click', () => {
            phoneInput.disabled = false;
            phoneInput.focus();
        });

        // Enable Save Button when phone changes
        phoneInput.addEventListener('input', () => {
            document.getElementById('saveBtn').disabled = false;
        });

        // Enable State Editing (Fix)
        document.getElementById('edit-state').addEventListener('click', () => {
            const stateInput = document.getElementById('state');
            stateInput.disabled = false;
            stateInput.focus();

            // Enable Save Button on Change
            stateInput.addEventListener('change', () => {
                document.getElementById('saveBtn').disabled = false;
            }, { once: true });
        });


        // Save Updated Phone Number
        document.getElementById('saveBtn').addEventListener('click', async () => {
            const fullPhoneNumber = iti.getNumber();
            const updatedState = document.getElementById('state').value;

            try {
                const updateRes = await fetch('https://ghumo-qg2h.onrender.com/api/auth/user', {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ phone: fullPhoneNumber, state: updatedState })
                });

                if (updateRes.ok) {
                    alert('Profile updated successfully!');
                    phoneInput.disabled = true;
                    document.getElementById('state').disabled = true;
                    document.getElementById('saveBtn').disabled = true;
                } else {
                    throw new Error('Failed to update phone.');
                }
            } catch (err) {
                console.error('Error updating phone:', err);
                alert('Could not update phone.');
            }
        });

    } catch (err) {
        console.error('Error fetching user data:', err);
        alert('Failed to load user data. Please try again later.');
    }
});

function logOut() {
    localStorage.removeItem('token');
    window.location.href = '../index.html'
}