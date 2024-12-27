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
        console.log(user);

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

        // Render user info form
        document.getElementById('user-info').innerHTML = `
        <div class="container mt-5">
            <div class="row justify-content-center">
                <div class="col-12 col-md-8 col-lg-6" style="max-width: 500px;">
                    <div class="card p-4" style="border-radius: 15px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
                        <div class="card-body">
                            <h4 class="card-title text-center mb-4">Edit Profile</h4>
                            
                            <div class="mb-3" style="text-align: left;">
                                <label for="username" class="form-label">Username:</label>
                                <input type="text" class="form-control" id="username" value="${user.username}" disabled />
                            </div>

                            <div class="mb-3" style="text-align: left;">
                                <label for="userid" class="form-label">Userid:</label>
                                <input type="text" class="form-control" id="userid" value="${user.userId}" disabled />
                            </div>

                            <div class="mb-3" id="phone-container" style="text-align: left;">
                                <label for="phone" class="form-label">Phone:</label>
                                <div class="input-group">
                                    <input id="phone" type="text" class="form-control" value="${user.phone || ''}" disabled />
                                    <button id="edit-phone" class="btn btn-primary">Edit</button>
                                </div>
                            </div>

                            <div class="mb-3" id="state-container" style="text-align: left;">
                                <label for="state" class="form-label">State:</label>
                                <div class="input-group d-flex">
                                    <select id="state" class="form-select" style="max-width: 70%;" disabled>
                                        ${statesAndUTs.map(state => `
                                            <option value="${state}" ${state === user.state ? 'selected' : ''}>${state}</option>
                                        `).join('')}
                                    </select>
                                    <button id="edit-state" class="btn btn-primary ms-2">Edit</button>
                                </div>
                            </div>

                            <button id="saveBtn" class="btn btn-success w-100" disabled>Save Changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;

        // Initialize intl-tel-input
        const phoneInputField = document.querySelector("#phone");
        if (phoneInputField) {
            try {
                window.intlTelInput(phoneInputField, {
                    initialCountry: "in",
                    separateDialCode: true,
                    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
                });
            } catch (error) {
                console.error("Failed to initialize intl-tel-input:", error);
            }
        }

        const saveBtn = document.getElementById('saveBtn');

        // Enable phone editing
        const editPhoneBtn = document.getElementById('edit-phone');
        if (editPhoneBtn) {
            editPhoneBtn.addEventListener('click', () => {
                phoneInputField.disabled = false;
                saveBtn.disabled = false;
            });
        }

        // Enable state dropdown editing
        const editStateBtn = document.getElementById('edit-state');
        const stateSelect = document.getElementById('state');
        if (editStateBtn && stateSelect) {
            editStateBtn.addEventListener('click', () => {
                stateSelect.disabled = false;
                saveBtn.disabled = false;
            });
        }

        // Save button logic
        if (saveBtn) {
            saveBtn.addEventListener('click', async () => {
                const newPhone = phoneInputField.value;
                const newState = stateSelect.value;

                try {
                    const updateRes = await fetch('https://ghumo-qg2h.onrender.com/api/auth/user', {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ phone: newPhone, state: newState })
                    });

                    const updateResult = await updateRes.json();

                    if (updateRes.ok) {
                        alert('Profile updated successfully!');
                        phoneInputField.disabled = true;
                        stateSelect.disabled = true;
                        saveBtn.disabled = true;
                        window.location.reload();
                    } else {
                        alert('Failed to update profile: ' + (updateResult.message || 'Unknown error'));
                    }
                } catch (error) {
                    console.error("Error updating profile:", error);
                    alert('Error updating profile. Please try again.');
                }
            });
        }
    } catch (err) {
        console.error('Error fetching user data:', err);
        alert('Failed to load user data. Please try again later.');
    }
});
