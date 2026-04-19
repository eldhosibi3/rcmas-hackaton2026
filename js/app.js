function createElement(html) {
    const div = document.createElement('div');
    div.innerHTML = html.trim();
    div.className = 'view';
    return div;
}

function updateNav() {
    const user = Store.data.currentUser;
    const nav = document.getElementById('main-nav');
    const publicNav = document.getElementById('public-nav');
    const roleBadge = document.getElementById('user-role-badge');
    const logoutBtn = document.getElementById('logout-btn');
    const welcomeMessage = document.getElementById('user-welcome-message'); // Assuming an element for the welcome message

    if (user) {
        nav.classList.remove('hidden');
        nav.style.display = 'flex'; // Ensure it's visible
        if(publicNav) publicNav.style.display = 'none'; // Hide public nav if user is logged in
        
        // Update user info in the nav without regenerating innerHTML
        if (welcomeMessage) {
            welcomeMessage.textContent = `Welcome, ${user.name || user.id} (${user.role})`;
        }
        if(roleBadge) {
            roleBadge.textContent = `${user.role} (${user.id})`; // Update role badge if it exists
        }

        if (logoutBtn) {
            // Remove any existing event listener to prevent duplicates
            logoutBtn.onclick = null; 
            logoutBtn.onclick = () => {
                Store.logout();
                Router.navigate('#/');
                updateNav();
            };
        }
    } else {
        nav.classList.add('hidden');
        nav.style.display = 'none'; // Ensure it's hidden
        if(publicNav) publicNav.style.display = 'flex'; // Show public nav if no user is logged in
    }
}

function applyCMS() {
    const cms = Store.data.cms;
    if(!cms) return;
    
    const navPhone = document.getElementById('nav-contact-phone');
    if(navPhone && cms.contactPhone) navPhone.innerHTML = `<i style="margin-right:5px;">📞</i> Emergency: ${cms.contactPhone}`;

    const navEmail = document.getElementById('nav-contact-email');
    if(navEmail && cms.contactEmail) navEmail.innerHTML = `<i style="margin-right:5px;">📧</i> ${cms.contactEmail}`;

    const navTitle = document.getElementById('nav-title');
    if(navTitle && cms.hospitalName) navTitle.textContent = cms.hospitalName;

    const pageTitle = document.getElementById('page-title');
    if(pageTitle && cms.hospitalName) pageTitle.textContent = cms.hospitalName;

    const navLogo = document.getElementById('nav-logo');
    if(navLogo && cms.logo) navLogo.src = cms.logo;

    if(cms.heroImage) {
        document.body.style.backgroundImage = `url('${cms.heroImage}')`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    Store.init();
    applyCMS();

    // Guard routes
    Router.beforeEach((path) => {
        const publicPaths = ['#/', '#/login', '#/register', '#/departments', '#/doctors'];
        const user = Store.data.currentUser;
        
        if (!user && !publicPaths.includes(path)) {
            return '#/login';
        }
        if (user && publicPaths.includes(path)) {
            const routeRole = user.role.toLowerCase().replace(' assistant', '');
            return `#/${routeRole}-dashboard`;
        }
        return null;
    });

    Router.add('#/', renderHome);
    Router.add('#/departments', renderDepartments);
    Router.add('#/doctors', renderDoctors);
    Router.add('#/register', renderRegister);
    Router.add('#/login', renderLogin);
    Router.add('#/admin-dashboard', renderAdminDashboard);
    Router.add('#/patient-dashboard', renderPatientDashboard);
    Router.add('#/doctor-dashboard', renderDoctorDashboard);
    Router.add('#/pharmacist-dashboard', renderPharmacistDashboard);
    Router.add('#/lab-dashboard', renderLabDashboard);

    Router.init();
    updateNav();
});

// --- VIEWS --- //

function renderHome() {
    const cms = Store.data.cms || {};
    return createElement(`
        <div class="home-container" style="padding-bottom:2rem;">
            <div style="border-radius:var(--radius); overflow:hidden; position:relative; box-shadow:var(--shadow-lg);">
                <div class="hero-bg" style="position:absolute; inset:0; background: url('${cms.heroImage || 'img/hero.png'}') center/cover no-repeat; z-index:0;"></div>
                <div style="position:relative; z-index:1; background: linear-gradient(to right, rgba(15,23,42,0.95), rgba(15,23,42,0.4)); padding:6rem 3rem; min-height:500px; display:flex; flex-direction:column; justify-content:center;">
                    <span style="color:var(--primary-color); font-weight:bold; letter-spacing:2px; margin-bottom:1rem; display:block; animation: slideUpFade 0.6s ease-out both;">${cms.slogan || 'PREMIUM HEALTHCARE'}</span>
                    <h2 style="color:white; font-size:3.5rem; margin-bottom:1.5rem; line-height:1.2; max-width:800px; animation: slideUpFade 0.8s ease-out both;">${cms.hospitalName || 'Global Multispeciality Hospital'}</h2>
                    <p style="color:#cbd5e1; font-size:1.25rem; max-width:600px; margin-bottom:2.5rem; animation: slideUpFade 1s ease-out both;">
                        ${cms.heroDescription || 'Providing world-class medical excellence for our community in Kakkanad. State-of-the-art facilities, renowned experts, and compassionate care.'}
                    </p>
                    <div style="display:flex; gap:1.5rem; animation: slideUpFade 1.2s ease-out both; flex-wrap:wrap;">
                        <a href="#/register" class="btn btn-primary btn-lg" style="box-shadow: 0 0 20px rgba(37,99,235,0.5);">Register as New Patient</a>
                        <a href="#/login" class="btn btn-secondary btn-lg" style="background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); backdrop-filter:blur(5px);">Access Portal</a>
                    </div>
                </div>
            </div>
            
            <div class="home-features-grid">
                <div class="card hover-effect" style="animation: slideUpFade 1.4s ease-out both;">
                    <div style="font-size:2.5rem; margin-bottom:15px;">🏥</div>
                    <h3 style="color:var(--primary-color); margin-bottom:10px; font-size:1.4rem;">Advanced Care</h3>
                    <p style="color:var(--text-secondary); line-height:1.6;">Pioneering treatments across specialized departments including Cardiology, Neurology, and Orthopedics.</p>
                </div>
                <div class="card hover-effect" style="animation: slideUpFade 1.5s ease-out both;">
                    <div style="font-size:2.5rem; margin-bottom:15px;">⚕️</div>
                    <h3 style="color:var(--primary-color); margin-bottom:10px; font-size:1.4rem;">24/7 Availability</h3>
                    <p style="color:var(--text-secondary); line-height:1.6;">Round-the-clock emergency support and state-of-the-art laboratory testing with real-time results.</p>
                </div>
                <div class="card hover-effect" style="animation: slideUpFade 1.6s ease-out both;">
                    <div style="font-size:2.5rem; margin-bottom:15px;">📱</div>
                    <h3 style="color:var(--primary-color); margin-bottom:10px; font-size:1.4rem;">Digital Health</h3>
                    <p style="color:var(--text-secondary); line-height:1.6;">Manage your comprehensive health records, book lab tests securely, and interact directly online.</p>
                </div>
            </div>
        </div>
    `);
}

function renderDepartments() {
    let deptsHtml = Store.catalogs.departments.map(d => `
        <div class="card hover-effect" style="text-align:center; padding:2rem;">
            <div style="font-size:3rem; margin-bottom:15px; color:var(--primary-color);">🏥</div>
            <h3 style="color:var(--text-primary); font-size:1.5rem;">${d}</h3>
            <p style="color:var(--text-secondary); margin-top:10px;">World-class facilities and expert care.</p>
        </div>
    `).join('');

    return createElement(`
        <div class="home-container" style="padding: 2rem 0;">
            <h2 style="text-align:center; margin-bottom:10px; color:var(--primary-color);">Hospital Departments</h2>
            <p style="text-align:center; color:var(--text-secondary); margin-bottom:30px; font-size:1.1rem;">Explore our specialized centers of excellence.</p>
            <div class="dashboard-grid">
                ${deptsHtml}
            </div>
            <div style="text-align:center; margin-top:30px;">
                <a href="#/doctors" class="btn btn-secondary btn-lg">Find Specialists</a>
            </div>
        </div>
    `);
}

function renderDoctors() {
    let filterOptions = '<option value="">All Departments</option>' + Store.catalogs.departments.map(d => `<option value="${d}">${d}</option>`).join('');
    
    // Initial display of all doctors
    const getDoctorsHtml = (deptFilter) => {
        return Store.getDoctors().filter(d => !deptFilter || d.department === deptFilter).map(d => `
            <div class="card hover-effect" style="display:flex; align-items:center; gap:20px;">
                <div style="width:80px; height:80px; background:var(--primary-color); color:white; border-radius:50%; display:flex; justify-content:center; align-items:center; font-size:2rem; font-weight:bold; flex-shrink:0;">
                    ${d.name.charAt(4) || d.name.charAt(0)}
                </div>
                <div>
                    <h3 style="color:var(--text-primary); margin-bottom:5px;">${d.name}</h3>
                    <span style="background:var(--bg-color); color:var(--text-secondary); padding:4px 10px; border-radius:12px; font-size:0.85em; border:1px solid var(--border-color);">${d.department}</span>
                </div>
            </div>
        `).join('') || '<p style="text-align:center; grid-column:1/-1; color:var(--text-secondary);">No doctors found.</p>';
    };

    const el = createElement(`
        <div class="home-container" style="padding: 2rem 0;">
            <h2 style="text-align:center; margin-bottom:10px; color:var(--primary-color);">Our Medical Experts</h2>
            <p style="text-align:center; color:var(--text-secondary); margin-bottom:30px; font-size:1.1rem;">Find the right specialist for your healthcare needs.</p>
            
            <div style="max-width:500px; margin:0 auto 30px auto; display:flex; gap:10px;">
                <select id="doc-dept-filter" class="form-control" style="font-size:1.1rem; padding:10px;">
                    ${filterOptions}
                </select>
            </div>

            <div id="doctors-list" class="dashboard-grid">
                ${getDoctorsHtml('')}
            </div>
            
            <div style="text-align:center; margin-top:40px;">
                <a href="#/login" class="btn btn-primary btn-lg">Login to Book Appointment</a>
            </div>
        </div>
    `);

    el.querySelector('#doc-dept-filter').addEventListener('change', (e) => {
        el.querySelector('#doctors-list').innerHTML = getDoctorsHtml(e.target.value);
    });

    return el;
}

function renderRegister() {
    const el = createElement(`
        <div class="card" style="max-width: 500px; margin: 0 auto;">
            <h2 style="margin-bottom: 20px;">New Patient Registration</h2>
            <div id="check-new-section">
                <p>Are you a new patient?</p>
                <div style="display: flex; gap: 10px; margin-top: 15px;">
                    <button class="btn btn-primary" id="btn-is-new">Yes, I am new</button>
                    <a href="#/login" class="btn btn-secondary">No, take me to login</a>
                </div>
            </div>
            
            <form id="register-form" class="hidden" style="margin-top: 20px;">
                <div class="form-group">
                    <label>Full Name</label>
                    <input type="text" id="reg-name" class="form-control" required>
                </div>
                
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                    <div class="form-group">
                        <label>Age</label>
                        <input type="number" id="reg-age" class="form-control" required min="0" max="150" placeholder="Years">
                    </div>
                    <div class="form-group">
                        <label>Gender</label>
                        <select id="reg-gender" class="form-control" required>
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>

                <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:10px;">
                    <div class="form-group">
                        <label>Blood Group</label>
                        <select id="reg-blood" class="form-control" required>
                            <option value="">Select</option>
                            <option value="A+">A+</option><option value="A-">A-</option>
                            <option value="B+">B+</option><option value="B-">B-</option>
                            <option value="O+">O+</option><option value="O-">O-</option>
                            <option value="AB+">AB+</option><option value="AB-">AB-</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Height (cm)</label>
                        <input type="number" id="reg-height" class="form-control" required min="30" max="300" placeholder="e.g. 170">
                    </div>
                    <div class="form-group">
                        <label>Weight (kg)</label>
                        <input type="number" id="reg-weight" class="form-control" required min="2" max="300" placeholder="e.g. 70">
                    </div>
                </div>

                <div class="form-group">
                    <label>Mobile Number</label>
                    <input type="tel" id="reg-phone" class="form-control" required>
                </div>
                
                <div id="otp-section" class="hidden">
                    <p class="text-success" style="color:var(--success); margin: 10px 0;">Demo OTP sent to mobile!</p>
                    <div class="form-group">
                        <label>Enter Demo OTP</label>
                        <input type="text" id="reg-otp" class="form-control" value="1234">
                    </div>
                    <div class="form-group">
                        <label>Set Password</label>
                        <input type="password" id="reg-password" class="form-control">
                    </div>
                </div>

                <div style="margin-top: 20px; display:flex; justify-content: space-between;">
                    <button type="button" id="btn-send-otp" class="btn btn-secondary">Send OTP</button>
                    <button type="submit" id="btn-finish-reg" class="btn btn-primary hidden">Submit Registration</button>
                </div>
            </form>
            <div id="reg-success" class="hidden" style="margin-top: 20px; color: var(--success); font-weight: bold;">
            </div>
        </div>
    `);

    const checkSect = el.querySelector('#check-new-section');
    const regForm = el.querySelector('#register-form');
    const otpSect = el.querySelector('#otp-section');
    const btnSendOtp = el.querySelector('#btn-send-otp');
    const btnFinish = el.querySelector('#btn-finish-reg');
    const successSect = el.querySelector('#reg-success');

    el.querySelector('#btn-is-new').addEventListener('click', () => {
        checkSect.classList.add('hidden');
        regForm.classList.remove('hidden');
    });

    btnSendOtp.addEventListener('click', () => {
        if (!el.querySelector('#reg-name').value || !el.querySelector('#reg-phone').value) {
            alert("Please enter Name and Phone first.");
            return;
        }
        btnSendOtp.classList.add('hidden');
        otpSect.classList.remove('hidden');
        btnFinish.classList.remove('hidden');
        el.querySelector('#reg-password').setAttribute('required', 'true');
    });

    regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = el.querySelector('#reg-name').value;
        const phone = el.querySelector('#reg-phone').value;
        const password = el.querySelector('#reg-password').value;
        const otp = el.querySelector('#reg-otp').value;
        
        const physicalDetails = {
            age: el.querySelector('#reg-age')?.value || 'N/A',
            gender: el.querySelector('#reg-gender')?.value || 'N/A',
            bloodGroup: el.querySelector('#reg-blood')?.value || 'N/A',
            height: el.querySelector('#reg-height')?.value || 'N/A',
            weight: el.querySelector('#reg-weight')?.value || 'N/A'
        };
        
        if (otp !== '1234') {
            alert('Invalid OTP (hint: use 1234)');
            return;
        }

        const res = Store.registerPatient(name, phone, password, physicalDetails);
        if (res.success) {
            regForm.classList.add('hidden');
            successSect.classList.remove('hidden');
            successSect.innerHTML = `Registration Successful! <br><br> Your Patient ID is: <strong>${res.id}</strong> <br> Please save this ID to login. <br><br> <a href="#/login" class="btn btn-primary">Go to Login</a>`;
        } else {
            alert(res.msg);
        }
    });

    return el;
}

function renderLogin() {
    const el = createElement(`
        <div style="display:flex; justify-content:center; align-items:center; min-height: 70vh;">
            <div class="card" style="width: 100%; max-width: 450px; padding: 2.5rem; border-radius: 16px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15); animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.8);">
                
                <div style="position:absolute; top:-50px; left:-50px; width:150px; height:150px; background:var(--primary-color); opacity:0.1; border-radius:50%; filter:blur(20px);"></div>
                <div style="position:absolute; bottom:-50px; right:-50px; width:150px; height:150px; background:var(--success); opacity:0.1; border-radius:50%; filter:blur(20px);"></div>

                <div style="text-align:center; margin-bottom: 2rem; position:relative; z-index:1;">
                    <h2 style="font-size: 2rem; color: var(--text-primary); margin-bottom: 5px; font-weight:800; letter-spacing:-0.5px;">Welcome Back</h2>
                    <p style="color: var(--text-secondary); font-size:0.95rem;">Sign in to your account</p>
                </div>
                
                <div class="tabs" style="display:flex; justify-content:center; gap:8px; margin-bottom: 2rem; border:none; background:var(--bg-color); padding:5px; border-radius:12px; position:relative; z-index:1; box-shadow: inset 0 2px 4px 0 rgba(0,0,0,0.05);">
                    <button class="tab-btn active" data-type="patient" style="flex:1; border:none; border-radius:8px; padding: 0.6rem; font-size:0.9rem; transition:all 0.3s;">Patient</button>
                    <button class="tab-btn" data-type="employee" style="flex:1; border:none; border-radius:8px; padding: 0.6rem; font-size:0.9rem; transition:all 0.3s;">Employee</button>
                    <button class="tab-btn" data-type="admin" style="flex:1; border:none; border-radius:8px; padding: 0.6rem; font-size:0.9rem; transition:all 0.3s;">Admin</button>
                </div>
                
                <form id="login-form" style="position:relative; z-index:1;">
                    <input type="hidden" id="login-type" value="patient">
                    <div class="form-group" id="user-id-group" style="margin-bottom:1.2rem;">
                        <label id="user-id-label" style="font-size:0.9rem; font-weight:600; margin-bottom:8px;">Patient ID or Mobile Number</label>
                        <input type="text" id="login-id" class="form-control" required placeholder="e.g. P1001 or 9876543210" style="padding:0.9rem 1rem; border-radius:10px; background:var(--card-bg); font-size:0.95rem;">
                    </div>
                    <div class="form-group" style="margin-bottom:1rem;">
                        <label style="font-size:0.9rem; font-weight:600; margin-bottom:8px;">Password</label>
                        <input type="password" id="login-password" class="form-control" required placeholder="Enter your password" style="padding:0.9rem 1rem; border-radius:10px; background:var(--card-bg); font-size:0.95rem;">
                    </div>
                    
                    <div style="display:flex; justify-content:flex-end; margin-bottom: 1.5rem;">
                        <a href="javascript:void(0)" id="btn-forgot-password" style="font-size: 0.85em; color:var(--primary-color); text-decoration:none; font-weight:600; transition:opacity 0.2s;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">Forgot details?</a>
                    </div>

                    <div id="login-error" style="color:var(--danger); margin-bottom: 15px; font-size:0.9rem; text-align:center; font-weight:500;"></div>
                    
                    <button type="submit" class="btn btn-primary" style="width: 100%; padding:0.9rem; border-radius:10px; font-size:1rem; font-weight:700; letter-spacing:0.5px; box-shadow:0 10px 15px -3px rgba(37,99,235,0.3); transition:transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-2px)';" onmouseout="this.style.transform='translateY(0)';">Sign In</button>
                </form>

            <div id="forgot-password-modal" class="hidden" style="margin-top: 20px; padding-top:20px; border-top: 1px solid var(--border-color);">
                 <h4>Recover Info / Reset Password</h4>
                 <div class="form-group mt-2">
                    <label>Mobile Number</label>
                    <input type="tel" id="forgot-phone" class="form-control">
                 </div>
                 <button type="button" class="btn btn-secondary btn-sm" id="btn-send-recover">Send OTP</button>
                 
                 <div id="recover-action" class="hidden mt-2" style="margin-top: 10px;">
                    <p style="color:var(--success); margin-bottom:10px;">OTP Sent! (Demo)</p>
                    <div id="found-id" style="margin-bottom:10px; font-weight:bold;"></div>
                    <div class="form-group">
                        <label>New Password</label>
                        <input type="password" id="forgot-new-pwd" class="form-control">
                    </div>
                    <button type="button" class="btn btn-primary btn-sm" id="btn-save-pwd">Change Password</button>
                 </div>
            </div>
        </div>
    `);

    const tabs = el.querySelectorAll('.tab-btn');
    const label = el.querySelector('#user-id-label');
    const typeInput = el.querySelector('#login-type');
    const forgotLink = el.querySelector('#forgot-password-link');
    const forgotModal = el.querySelector('#forgot-password-modal');

    tabs.forEach(t => t.addEventListener('click', () => {
        tabs.forEach(x => x.classList.remove('active'));
        t.classList.add('active');
        const type = t.dataset.type;
        typeInput.value = type;
        
        if (type === 'patient') { label.textContent = 'Patient ID or Mobile Number'; forgotLink.classList.remove('hidden'); }
        if (type === 'employee') { label.textContent = 'Employee ID'; forgotLink.classList.add('hidden'); forgotModal.classList.add('hidden'); }
        if (type === 'admin') { label.textContent = 'Admin Username'; forgotLink.classList.add('hidden'); forgotModal.classList.add('hidden'); }
    }));

    // Forgot password flow
    let recoveredPatient = null;
    el.querySelector('#btn-forgot-password').addEventListener('click', () => {
        forgotModal.classList.remove('hidden');
    });
    
    el.querySelector('#btn-send-recover').addEventListener('click', () => {
        const phone = el.querySelector('#forgot-phone').value;
        const p = Store.data.patients.find(x => x.phone === phone);
        if(p) {
            recoveredPatient = p;
            el.querySelector('#recover-action').classList.remove('hidden');
            el.querySelector('#found-id').textContent = `Your Patient ID is: ${p.id}`;
        } else {
            alert('Mobile number not found');
        }
    });

    el.querySelector('#btn-save-pwd').addEventListener('click', () => {
        const newPwd = el.querySelector('#forgot-new-pwd').value;
        if(newPwd && recoveredPatient) {
            recoveredPatient.password = newPwd;
            Store.save();
            alert('Password updated successfully! Please login.');
            forgotModal.classList.add('hidden');
        }
    });

    el.querySelector('#login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const res = Store.login(
            el.querySelector('#login-id').value.trim(),
            el.querySelector('#login-password').value,
            typeInput.value
        );
        if (res.success) {
            updateNav();
            const routeRole = res.role.toLowerCase().replace(' assistant', '');
            Router.navigate(`#/${routeRole}-dashboard`);
        } else {
            el.querySelector('#login-error').textContent = res.msg;
        }
    });

    return el;
}

// --- DASHBOARDS --- //
/* admin security audit feature */

    const renderAdminDashboard = function() {
    const el = createElement(`
        <h2 style="margin-bottom:20px;">Admin Dashboard</h2>
        <div class="dashboard-grid" style="grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));">
            <div class="card">
                <h3>Register Hospital Staff</h3>
                <form id="emp-form" style="margin-top:20px;">
                    <div class="form-group">
                        <label>Employee Name</label>
                        <input type="text" id="emp-name" class="form-control" required placeholder="e.g. Dr. Jane Smith">
                    </div>
                    <div class="form-group">
                        <label>Role</label>
                        <select id="emp-role" class="form-control" required>
                            <option value="Doctor">Doctor</option>
                            <option value="Pharmacist">Pharmacist</option>
                            <option value="Lab Assistant">Lab Assistant</option>
                        </select>
                    </div>
                    <div class="form-group" id="dept-group">
                        <label>Department</label>
                        <select id="emp-dept" class="form-control">
                            <option value="">Select Department</option>
                            ${Store.catalogs.departments.map(d => `<option value="${d}">${d}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Set Password</label>
                        <input type="password" id="emp-pass" class="form-control" required>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width:100%;">Register Employee</button>
                    <div id="emp-success" class="hidden" style="color:var(--success); margin-top:15px; font-weight:bold; text-align:center;"></div>
                </form>
            </div>
            
            <div class="card" style="display:flex; flex-direction:column;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; flex-wrap:wrap; gap:10px;">
                    <h3 style="margin:0;">Hospital Directory</h3>
                    <input type="text" id="admin-search-dir" class="form-control" placeholder="Search ID or Name..." style="width:200px;">
                </div>
                
                <h4 style="color:var(--text-secondary); border-bottom:1px solid var(--border-color); padding-bottom:5px; margin-bottom:10px;">Employees</h4>
                <div id="dir-employees" style="max-height: 250px; overflow-y:auto; margin-bottom:20px; font-size:0.9em; background:var(--bg-color); border-radius:4px; border:1px solid var(--border-color);"></div>
                
                <h4 style="color:var(--text-secondary); border-bottom:1px solid var(--border-color); padding-bottom:5px; margin-bottom:10px;">Patients</h4>
                <div id="dir-patients" style="max-height: 250px; overflow-y:auto; font-size:0.9em; background:var(--bg-color); border-radius:4px; border:1px solid var(--border-color);"></div>
            </div>

            <div class="card" style="grid-column: 1 / -1;">
                <h3 style="color: var(--danger);"><i style="margin-right:8px;">🔒</i> Security Audit Log (Admin Only)</h3>
                <p style="font-size:0.85em; color:var(--text-secondary); margin-bottom:15px;">Warning: This section displays sensitive credential data. Do not share.</p>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px;">
                    <div>
                        <h4 style="margin-bottom:10px;">Employee Credentials</h4>
                        <div id="admin-emp-creds" style="max-height:200px; overflow-y:auto; font-family:monospace; font-size:0.9em; background:var(--card-bg); padding:10px; border:1px solid var(--border-color); border-radius:var(--radius);"></div>
                    </div>
                    <div>
                        <h4 style="margin-bottom:10px;">Patient Credentials</h4>
                        <div id="admin-pat-creds" style="max-height:200px; overflow-y:auto; font-family:monospace; font-size:0.9em; background:var(--card-bg); padding:10px; border:1px solid var(--border-color); border-radius:var(--radius);"></div>
                    </div>
                </div>
                </div>
            </div>

            <div class="card" style="grid-column: 1 / -1;">
                <h3><i style="margin-right:8px;">🌐</i> Content Management (CMS)</h3>
                <p style="font-size:0.85em; color:var(--text-secondary); margin-bottom:15px;">Update the public website content globally.</p>
                <form id="cms-form" style="display:grid; grid-template-columns: 1fr 1fr; gap:15px;">
                    <div class="form-group">
                        <label>Hospital Name / Title</label>
                        <input type="text" id="cms-title" class="form-control" value="${Store.data.cms.hospitalName}">
                    </div>
                    <div class="form-group">
                        <label>Slogan (Homepage)</label>
                        <input type="text" id="cms-slogan" class="form-control" value="${Store.data.cms.slogan}">
                    </div>
                    <div class="form-group" style="grid-column: 1 / -1;">
                        <label>Homepage Description</label>
                        <textarea id="cms-desc" class="form-control" rows="3">${Store.data.cms.heroDescription}</textarea>
                    </div>
                    <div class="form-group">
                        <label>Emergency Phone</label>
                        <input type="text" id="cms-phone" class="form-control" value="${Store.data.cms.contactPhone}">
                    </div>
                    <div class="form-group">
                        <label>Contact Email</label>
                        <input type="text" id="cms-email" class="form-control" value="${Store.data.cms.contactEmail}">
                    </div>
                    <div class="form-group">
                        <label>Global Background Image URL</label>
                        <input type="text" id="cms-bg" class="form-control" value="${Store.data.cms.heroImage}">
                    </div>
                    <div class="form-group">
                        <label>Hospital Logo URL</label>
                        <input type="text" id="cms-logo" class="form-control" value="${Store.data.cms.logo}">
                    </div>
                    <div style="grid-column: 1 / -1; display:flex; justify-content:flex-end;">
                        <button type="submit" class="btn btn-primary" style="width:200px;">Save Website Changes</button>
                    </div>
                </form>
            </div>
        </div>
        <!-- Edit Employee Modal -->
        <div id="edit-emp-modal" class="hidden" style="position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.5); z-index:1000; display:flex; justify-content:center; align-items:center; padding: 20px;">
            <div class="card" style="width:100%; max-width:500px; position:relative; background: var(--card-bg);">
                <button type="button" id="close-edit-modal" style="position:absolute; top:10px; right:15px; background:none; border:none; font-size:1.5em; cursor:pointer; color:var(--text-primary);">&times;</button>
                <h3 style="margin-bottom: 15px;">Edit Employee</h3>
                <form id="edit-emp-form">
                    <input type="hidden" id="edit-emp-id">
                    <div class="form-group">
                        <label>Employee Name</label>
                        <input type="text" id="edit-emp-name" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Role</label>
                        <select id="edit-emp-role" class="form-control" required>
                            <option value="Doctor">Doctor</option>
                            <option value="Pharmacist">Pharmacist</option>
                            <option value="Lab Assistant">Lab Assistant</option>
                        </select>
                    </div>
                    <div class="form-group" id="edit-dept-group">
                        <label>Department</label>
                        <select id="edit-emp-dept" class="form-control">
                            <option value="">Select Department</option>
                            ${Store.catalogs.departments.map(d => `<option value="${d}">${d}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="text" id="edit-emp-pass" class="form-control" required>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width:100%;">Save Changes</button>
                </form>
            </div>
        </div>

        <!-- Edit Patient Modal -->
        <div id="edit-pat-modal" class="hidden" style="position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.5); z-index:1000; display:flex; justify-content:center; align-items:center; padding: 20px;">
            <div class="card" style="width:100%; max-width:500px; position:relative; background: var(--card-bg);">
                <button type="button" id="close-edit-pat-modal" style="position:absolute; top:10px; right:15px; background:none; border:none; font-size:1.5em; cursor:pointer; color:var(--text-primary);">&times;</button>
                <h3 style="margin-bottom: 15px;">Edit Patient</h3>
                <form id="edit-pat-form">
                    <input type="hidden" id="edit-pat-id">
                    <div class="form-group">
                        <label>Patient Name</label>
                        <input type="text" id="edit-pat-name" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Phone Number</label>
                        <input type="tel" id="edit-pat-phone" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="text" id="edit-pat-pass" class="form-control" required>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width:100%;">Save Changes</button>
                </form>
            </div>
        </div>
    `);

    const deptGroup = el.querySelector('#dept-group');
    el.querySelector('#emp-role').addEventListener('change', (e) => {
        if(e.target.value === 'Doctor') deptGroup.classList.remove('hidden');
        else deptGroup.classList.add('hidden');
    });

    const renderDir = (query = '') => {
        const q = query.toLowerCase();
        
        let empsHtml = '';
        Store.data.employees.forEach(e => {
            if(e.name.toLowerCase().includes(q) || e.id.toLowerCase().includes(q) || e.role.toLowerCase().includes(q)) {
                empsHtml += `<div style="padding:10px; border-bottom:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:5px;">
                    <span><strong style="color:var(--primary-color);">${e.id}</strong> - ${e.name}</span>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span style="color:var(--text-secondary); font-size:0.9em; background:var(--card-bg); padding:2px 8px; border-radius:12px;">${e.role} ${e.department ? '('+e.department+')' : ''}</span>
                        <button class="btn btn-secondary btn-sm btn-edit-emp" data-id="${e.id}" style="padding:3px 8px; font-size:0.8em;">Edit</button>
                        <button class="btn btn-primary btn-sm btn-del-emp" data-id="${e.id}" style="padding:3px 8px; font-size:0.8em; background:var(--danger); border:none;">Remove</button>
                    </div>
                </div>`;
            }
        });
        el.querySelector('#dir-employees').innerHTML = empsHtml || '<div style="padding:15px; color:var(--text-secondary); text-align:center;">No employees found.</div>';

        // Add listeners for edit/delete buttons
        el.querySelectorAll('.btn-edit-emp').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                const emp = Store.data.employees.find(x => x.id === id);
                if (emp) {
                    el.querySelector('#edit-emp-id').value = emp.id;
                    el.querySelector('#edit-emp-name').value = emp.name;
                    el.querySelector('#edit-emp-role').value = emp.role;
                    el.querySelector('#edit-emp-dept').value = emp.department || '';
                    el.querySelector('#edit-emp-pass').value = emp.password;
                    
                    if (emp.role === 'Doctor') el.querySelector('#edit-dept-group').classList.remove('hidden');
                    else el.querySelector('#edit-dept-group').classList.add('hidden');
                    
                    el.querySelector('#edit-emp-modal').classList.remove('hidden');
                }
            });
        });

        el.querySelectorAll('.btn-del-emp').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                if (confirm('Are you sure you want to remove employee ' + id + '?')) {
                    Store.removeEmployee(id);
                    renderDir(el.querySelector('#admin-search-dir').value);
                    renderCreds();
                }
            });
        });

        let patsHtml = '';
        Store.data.patients.forEach(p => {
            if(p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.phone.includes(q)) {
                patsHtml += `<div style="padding:10px; border-bottom:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:5px;">
                    <span><strong style="color:var(--primary-color);">${p.id}</strong> - ${p.name}</span>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span style="color:var(--text-secondary); font-size:0.9em;">Ph: ${p.phone}</span>
                        <button class="btn btn-secondary btn-sm btn-edit-pat" data-id="${p.id}" style="padding:3px 8px; font-size:0.8em;">Edit</button>
                        <button class="btn btn-primary btn-sm btn-del-pat" data-id="${p.id}" style="padding:3px 8px; font-size:0.8em; background:var(--danger); border:none;">Remove</button>
                    </div>
                </div>`;
            }
        });
        el.querySelector('#dir-patients').innerHTML = patsHtml || '<div style="padding:15px; color:var(--text-secondary); text-align:center;">No patients found.</div>';

        // Add listeners for patient edit/delete
        el.querySelectorAll('.btn-edit-pat').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                const pat = Store.data.patients.find(x => x.id === id);
                if (pat) {
                    el.querySelector('#edit-pat-id').value = pat.id;
                    el.querySelector('#edit-pat-name').value = pat.name;
                    el.querySelector('#edit-pat-phone').value = pat.phone;
                    el.querySelector('#edit-pat-pass').value = pat.password;
                    el.querySelector('#edit-pat-modal').classList.remove('hidden');
                }
            });
        });

        el.querySelectorAll('.btn-del-pat').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                if (confirm('Are you sure you want to remove patient ' + id + '?')) {
                    Store.removePatient(id);
                    renderDir(el.querySelector('#admin-search-dir').value);
                    renderCreds();
                }
            });
        });
    };

    const renderCreds = () => {
        let empsCreds = Store.data.employees.map(e => `<div>ID: <strong>${e.id}</strong> (<span style="color:#666">${e.name}</span>) - Pwd: <strong style="color:var(--danger)">${e.password}</strong></div>`).join('');
        el.querySelector('#admin-emp-creds').innerHTML = empsCreds || 'No employees.';
        
        let patsCreds = Store.data.patients.map(p => `<div>ID: <strong>${p.id}</strong> (<span style="color:#666">${p.name}</span>) - Pwd: <strong style="color:var(--danger)">${p.password}</strong></div>`).join('');
        el.querySelector('#admin-pat-creds').innerHTML = patsCreds || 'No patients.';
    };

    renderDir();
    renderCreds();
    
    el.querySelector('#admin-search-dir').addEventListener('input', (e) => {
        renderDir(e.target.value);
    });

    el.querySelector('#close-edit-modal').addEventListener('click', () => {
        el.querySelector('#edit-emp-modal').classList.add('hidden');
    });

    el.querySelector('#edit-emp-role').addEventListener('change', (e) => {
        if(e.target.value === 'Doctor') el.querySelector('#edit-dept-group').classList.remove('hidden');
        else el.querySelector('#edit-dept-group').classList.add('hidden');
    });

    el.querySelector('#edit-emp-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const id = el.querySelector('#edit-emp-id').value;
        const role = el.querySelector('#edit-emp-role').value;
        const name = el.querySelector('#edit-emp-name').value;
        const dept = el.querySelector('#edit-emp-dept').value;
        const pass = el.querySelector('#edit-emp-pass').value;

        if (Store.updateEmployee(id, name, role, dept, pass)) {
            el.querySelector('#edit-emp-modal').classList.add('hidden');
            renderDir(el.querySelector('#admin-search-dir').value);
            renderCreds();
        }
    });

    el.querySelector('#cms-form').addEventListener('submit', (e) => {
        e.preventDefault();
        Store.updateCMS({
            hospitalName: el.querySelector('#cms-title').value,
            slogan: el.querySelector('#cms-slogan').value,
            heroDescription: el.querySelector('#cms-desc').value,
            contactPhone: el.querySelector('#cms-phone').value,
            contactEmail: el.querySelector('#cms-email').value,
            heroImage: el.querySelector('#cms-bg').value,
            logo: el.querySelector('#cms-logo').value
        });
        applyCMS();
        alert('Website content updated successfully!');
    });

    el.querySelector('#close-edit-pat-modal').addEventListener('click', () => {
        el.querySelector('#edit-pat-modal').classList.add('hidden');
    });

    el.querySelector('#edit-pat-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const id = el.querySelector('#edit-pat-id').value;
        const name = el.querySelector('#edit-pat-name').value;
        const phone = el.querySelector('#edit-pat-phone').value;
        const pass = el.querySelector('#edit-pat-pass').value;

        if (Store.updatePatient(id, { name, phone, password: pass })) {
            el.querySelector('#edit-pat-modal').classList.add('hidden');
            renderDir(el.querySelector('#admin-search-dir').value);
            renderCreds();
        }
    });

    el.querySelector('#emp-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const role = el.querySelector('#emp-role').value;
        const name = el.querySelector('#emp-name').value;
        const dept = el.querySelector('#emp-dept').value;
        const pass = el.querySelector('#emp-pass').value;

        const res = Store.registerEmployee(name, role, dept, pass);
        if(res.success) {
            const succ = el.querySelector('#emp-success');
            succ.innerHTML = `Registered ${role}!<br>Login ID is: <strong>${res.id}</strong>`;
            succ.classList.remove('hidden');
            e.target.reset();
            deptGroup.classList.remove('hidden');
            renderDir(); // Refresh directory directly when new is added
            renderCreds(); // Refresh credentials
            setTimeout(() => succ.classList.add('hidden'), 5000);
        }
    });

    return el;
}


function renderPatientDashboard() {
    const user = Store.data.currentUser;
    const p = Store.getPatient(user.id);
    
    let doctorsHtml = '<option value="">Select Doctor</option>';
    Store.getDoctors().forEach(d => {
        doctorsHtml += `<option value="${d.id}">${d.name} (${d.department})</option>`;
    });

    let appsHtml = '';
    Store.getPatientAppointments(user.id).forEach(a => {
        const doc = Store.data.employees.find(e => e.id === a.doctorId);
        appsHtml += `<div style="padding:15px; border-bottom:1px solid var(--border-color); margin-bottom:10px; background:var(--bg-color); border-radius:8px; transition: all 0.3s ease; box-shadow: var(--shadow-sm);" onmouseover="this.style.transform='translateX(5px)'; this.style.boxShadow='var(--shadow-md)';" onmouseout="this.style.transform='translateX(0)'; this.style.boxShadow='var(--shadow-sm)';">
            <div style="display:flex; justify-content:space-between;">
                <span><strong>Date:</strong> ${a.date} at ${a.time || 'N/A'}</span>
                <span style="font-size:1.2em;font-weight:bold;color:var(--primary-color); background:var(--card-bg); padding:2px 10px; border-radius:12px;">Token: ${a.token}</span>
            </div>
            <div style="margin-top:5px;"><strong>Doctor:</strong> ${doc ? doc.name : a.doctorId}</div>
            <div style="margin-top:5px; font-size:0.85em; color:var(--success); font-weight:600;">Fee Paid: Rs. ${a.fee || 250}</div>
        </div>`;
    });

    let recordsHtml = '';
    p.records.forEach(r => {
        const doc = Store.data.employees.find(e => e.id === r.doctorId);
        recordsHtml += `<div style="padding:15px; border-bottom:1px solid var(--border-color); margin-bottom:10px; background:var(--bg-color); border-radius:8px; transition: all 0.3s ease;" onmouseover="this.style.transform='translateX(5px)'" onmouseout="this.style.transform='translateX(0)'">
            <strong style="color:var(--primary-color);font-size:0.9em;">📅 ${r.date}</strong><br>
            <div style="margin-top:5px;"><strong>Diagnosed by:</strong> ${doc ? doc.name : r.doctorId}</div>
            <div style="margin-top:8px; background:var(--card-bg); padding:10px; border-radius:var(--radius); border:1px solid var(--border-color);">
                <strong>Condition/Notes:</strong> ${r.condition}
            </div>
        </div>`;
    });

    let rxHtml = '';
    p.prescriptions.slice().reverse().forEach(rx => {
        const doc = Store.data.employees.find(e => e.id === rx.doctorId);
        let mText = rx.meds && rx.meds.length > 0 ? rx.meds.map(m => m.name).join(', ') : rx.details;
        rxHtml += `<div style="padding:15px; border-bottom:1px solid var(--border-color); margin-bottom:10px; background:var(--bg-color); border-radius:8px; transition: all 0.3s ease;" onmouseover="this.style.transform='translateX(5px)'" onmouseout="this.style.transform='translateX(0)'">
            <strong style="color:var(--primary-color);font-size:0.9em;">📅 ${rx.date}</strong><br>
            <div style="margin-top:5px;"><strong>Doctor:</strong> ${doc ? doc.name : rx.doctorId}</div>
            <div style="margin-top:5px;"><strong>Medicines:</strong> ${mText}</div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:10px;">
                <span style="font-size:0.85em; padding:4px 10px; border-radius:12px; font-weight:bold; background:${rx.status==='Pending'?'#fef3c7':'#d1fae5'}; color:${rx.status==='Pending'?'#d97706':'#059669'};">${rx.status}</span>
                <button class="btn btn-secondary btn-sm" onclick="downloadRx('${rx.id}', '${p.id}')">Download</button>
            </div>
        </div>`;
    });

    let labsHtml = '';
    Store.getLabResults(user.id).forEach(l => {
        labsHtml += `<div style="padding:15px; border-bottom:1px solid var(--border-color); margin-bottom:10px; background:var(--bg-color); border-radius:8px; transition: all 0.3s ease;" onmouseover="this.style.transform='translateX(5px)'" onmouseout="this.style.transform='translateX(0)'">
            <strong style="color:var(--primary-color);font-size:0.95em;">🔬 ${l.date} - ${l.testName || 'Lab Test'}</strong><br>
            <div style="margin-top:8px; font-size:0.9em; background:var(--card-bg); padding:10px; border:1px solid var(--border-color); border-radius:var(--radius); line-height:1.6;">
                ${l.details}
            </div>
        </div>`;
    });

    const physicalStr = p.age ? `Age: ${p.age} | Gender: ${p.gender} | Blood: <strong style="color:#fcd34d;">${p.bloodGroup}</strong> | Height: ${p.height}cm | Weight: ${p.weight}kg` : 'No physical details recorded.';
    
    const el = createElement(`
        <div style="animation: slideUpFade 0.4s ease-out both;">
            <h2 style="margin-bottom:5px; font-size: 2rem;">Welcome, <span style="color:var(--primary-color)">${p.name.split(' ')[0]}</span> 👋</h2>
            <p style="color:var(--text-secondary); margin-bottom:20px;">Here is your personalized health dashboard.</p>
        </div>
        
        <div style="background: linear-gradient(135deg, var(--primary-color), #4f46e5); color:white; padding:15px 20px; border-radius:var(--radius); margin-bottom:25px; box-shadow:var(--shadow-md); animation: slideUpFade 0.5s ease-out both; display:flex; justify-content:space-between; align-items:center;">
            <div style="display:flex; align-items:center; gap:15px;">
                <div style="font-size:2rem; background:rgba(255,255,255,0.2); width:50px; height:50px; display:flex; justify-content:center; align-items:center; border-radius:50%;">👤</div>
                <div>
                    <h4 style="margin:0; font-size:1.1rem;">My Profile Data</h4>
                    <span style="font-size:0.9rem; opacity:0.9;">${physicalStr}</span>
                </div>
            </div>
            <div>
                <button id="btn-pat-edit-profile" class="btn" style="background:rgba(255,255,255,0.2); color:white; border:1px solid rgba(255,255,255,0.5);">Edit Details</button>
            </div>
        </div>

        <div id="pat-profile-form-container" class="card hidden" style="margin-bottom:25px; animation: slideUpFade 0.5s ease-out both;">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color); padding-bottom:15px; margin-bottom:15px;">
                <h3 style="margin:0;">📝 Edit Health Profile</h3>
                <button id="btn-pat-del-acc" class="btn btn-sm" style="background:var(--danger); color:white; border:none;">🗑️ Delete Account</button>
            </div>
            <form id="pat-edit-form" style="display:grid; grid-template-columns: 1fr 1fr; gap:15px;">
                <div class="form-group">
                    <label>Name</label>
                    <input type="text" id="pat-edit-name" class="form-control" value="${p.name}" required>
                </div>
                <div class="form-group">
                    <label>Phone Number</label>
                    <input type="tel" id="pat-edit-phone" class="form-control" value="${p.phone}" required>
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="text" id="pat-edit-pass" class="form-control" value="${p.password}" required>
                </div>
                <div class="form-group">
                    <label>Age</label>
                    <input type="number" id="pat-edit-age" class="form-control" value="${p.age || ''}" placeholder="Age">
                </div>
                <div class="form-group">
                    <label>Height (cm)</label>
                    <input type="number" id="pat-edit-height" class="form-control" value="${p.height || ''}" placeholder="Height">
                </div>
                <div class="form-group">
                    <label>Weight (kg)</label>
                    <input type="number" id="pat-edit-weight" class="form-control" value="${p.weight || ''}" placeholder="Weight">
                </div>
                <div class="form-group" style="grid-column: 1 / -1; display:flex; justify-content:flex-end; gap:10px; margin-top:10px;">
                    <button type="button" id="btn-cancel-edit-prof" class="btn btn-secondary">Cancel</button>
                    <button type="submit" class="btn btn-primary">Save Updates</button>
                </div>
            </form>
        </div>

        <div class="dashboard-grid">
            <div class="card hover-effect" style="animation: slideUpFade 0.6s ease-out both;">
                <h3 style="border-bottom:2px solid var(--primary-color); padding-bottom:10px; margin-bottom:15px;">📅 Book Appointment</h3>
                <form id="book-form" style="margin-top:15px;">
                    <div class="form-group">
                        <label>Doctor</label>
                        <select id="book-doc" class="form-control" required>${doctorsHtml}</select>
                    </div>
                    <div class="form-group">
                        <label>Date</label>
                        <input type="date" id="book-date" class="form-control" required min="${new Date().toISOString().split('T')[0]}">
                    </div>
                    
                    <div class="form-group hidden" id="slot-group">
                        <label>Available Time Slots</label>
                        <select id="book-time" class="form-control" required></select>
                    </div>
                    
                    <button type="button" id="btn-check-slots" class="btn btn-secondary" style="width:100%; margin-bottom:10px;">Check Availability</button>
                    
                    <div id="payment-section" class="hidden" style="margin-top:20px; padding:15px; border:1px solid var(--border-color); border-radius:var(--radius); text-align:center; background: var(--bg-color);">
                        <h4 style="margin-bottom:10px;">Payment Required</h4>
                        <p style="font-size:1.1em;">Consultation Fee: <strong style="color:var(--primary-color);">Rs 250</strong></p>
                        <div style="background:#fff; padding:10px; display:inline-block; margin:15px 0; border:1px solid var(--border-color); border-radius:8px;">
                            <!-- Mock QR Code -->
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=HospitalConsultationFee250" alt="Payment QR Code" width="150" height="150" />
                        </div>
                        <p style="font-size:0.85em; color:var(--text-secondary); margin-bottom:15px;">Scan via any UPI app to pay (Demo)</p>
                        <button type="submit" id="btn-pay-book" class="btn btn-primary" style="width:100%;">Simulate Payment & Book</button>
                    </div>
                    <div id="book-success" class="hidden" style="color:var(--success); margin-top:10px; font-weight:bold;"></div>
                </form>
                
                <div id="slip-section" class="hidden" style="margin-top:20px;">
                    <div style="padding:15px; border:2px dashed var(--success); border-radius:var(--radius); background:var(--bg-color);">
                        <h4 style="color:var(--success); margin-bottom:15px; text-align:center;">Booking Confirmed!</h4>
                        <div id="slip-content" style="font-family:monospace; font-size:0.9em; line-height:1.5; margin-bottom:15px; padding:10px; background:var(--card-bg); border:1px solid var(--border-color);"></div>
                        <button id="btn-download-slip" class="btn btn-secondary" style="width:100%;">Download Appointment Slip</button>
                    </div>
                </div>
            </div>
            
            <div style="display:flex; flex-direction:column; gap:1.5rem;">
                <div class="card hover-effect" style="animation: slideUpFade 0.7s ease-out both;">
                    <h3 style="border-bottom:2px solid var(--primary-color); padding-bottom:10px; margin-bottom:15px;">📋 My Appointments</h3>
                    <div>${appsHtml || '<p style="color:var(--text-secondary);">No appointments found.</p>'}</div>
                </div>
                <div class="card hover-effect" style="animation: slideUpFade 0.8s ease-out both;">
                    <h3 style="border-bottom:2px solid var(--primary-color); padding-bottom:10px; margin-bottom:15px;">🧪 Lab Results</h3>
                    <div>${labsHtml || '<p style="color:var(--text-secondary);">No lab results available.</p>'}</div>
                </div>
            </div>
            
            <div class="card hover-effect" style="grid-column: 1 / -1; animation: slideUpFade 0.9s ease-out both;">
                <h3 style="border-bottom:2px solid var(--primary-color); padding-bottom:10px; margin-bottom:15px;">🔬 Self-Book Lab Tests</h3>
                <form id="book-lab-form" style="display:flex; gap:15px; align-items:flex-start; flex-wrap:wrap;">
                    <div style="flex:1; min-width:250px;">
                        <p style="font-size:0.9em; color:var(--text-secondary); margin-bottom:10px;">Select required lab tests below:</p>
                        <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap:10px;">
                            ${Store.catalogs.labTests.map(t => `<label style="font-weight:normal; background:var(--bg-color); padding:5px 10px; border-radius:8px; border:1px solid var(--border-color); cursor:pointer;"><input type="checkbox" name="s-labs" value="${t.id}" data-price="${t.price}"> ${t.name} (Rs.${t.price})</label>`).join('')}
                        </div>
                    </div>
                    <div id="s-lab-pay-box" class="hidden" style="border:1px solid var(--border-color); padding:15px; border-radius:8px; text-align:center; min-width:250px;">
                        <h4 style="margin-bottom:10px;">Lab Bill: Rs. <span id="s-lab-total">0</span></h4>
                        <img id="s-lab-qr" src="" alt="Lab QR" style="width:120px; height:120px; border:1px solid #ddd; padding:5px; background:white; margin-bottom:10px;">
                        <button type="submit" class="btn btn-primary" style="width:100%;">Pay via QR & Book Tests</button>
                    </div>
                </form>
            </div>
            
            <div class="card hover-effect" style="grid-column: 1 / -1; animation: slideUpFade 1.0s ease-out both;">
                <h3 style="border-bottom:2px solid var(--primary-color); padding-bottom:10px; margin-bottom:15px;">📁 Medical Records & Prescriptions</h3>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
                    <div>
                        <h4 style="margin-bottom:10px; color:var(--primary-color);">🩺 Clinical Conditions</h4>
                        <div>${recordsHtml || '<p style="color:var(--text-secondary);">No medical records found.</p>'}</div>
                    </div>
                    <div>
                        <h4 style="margin-bottom:10px; color:var(--primary-color);">💊 Prescriptions</h4>
                        <div>${rxHtml || '<p style="color:var(--text-secondary);">No prescriptions found.</p>'}</div>
                    </div>
                </div>
            </div>
        </div>
    `);

    if(!window.downloadRx) {
        window.downloadRx = (rxId, pid) => {
            const pt = Store.getPatient(pid);
            const r = pt.prescriptions.find(x => x.id === rxId);
            const d = Store.data.employees.find(e => e.id === r.doctorId);
            const data = `HOSPITAL PRESCRIPTION\nDate: ${r.date}\nDoctor: ${d?d.name:r.doctorId}\nPatient: ${pt.name}\n\nMEDICINES:\n${r.meds ? r.meds.map(m=>'- '+m.name).join('\n') : r.details}\n\nTotal: Rs.${r.totalAmount || 0}\nStatus: ${r.status}`;
            const blob = new Blob([data], {type: 'text/plain'});
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `Prescription_${rxId}.txt`;
            a.click();
        };
    }

    const sLabForm = el.querySelector('#book-lab-form');
    const sLabBoxes = sLabForm.querySelectorAll('input[name="s-labs"]');
    const sLabPayBox = el.querySelector('#s-lab-pay-box');
    const sLabTotalSp = el.querySelector('#s-lab-total');
    const sLabQr = el.querySelector('#s-lab-qr');
    
    const updTotal = () => {
        let t = 0;
        sLabBoxes.forEach(cb => { if(cb.checked) t += parseInt(cb.dataset.price); });
        if(t > 0) {
            sLabPayBox.classList.remove('hidden');
            sLabTotalSp.textContent = t;
            sLabQr.src = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=LabFee${t}`;
        } else {
            sLabPayBox.classList.add('hidden');
        }
    };
    sLabBoxes.forEach(cb => cb.addEventListener('change', updTotal));

    sLabForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const selectedLabs = Array.from(sLabBoxes).filter(b => b.checked).map(b => b.value);
        if(selectedLabs.length > 0) {
            Store.requestLabTest(user.id, 'Self-Booked', selectedLabs, true);
            alert('Payment successful & Labs booked! Present your Patient ID at the Lab.');
            Router.handleRoute();
        }
    });

    const docSelect = el.querySelector('#book-doc');
    const dateInput = el.querySelector('#book-date');
    const btnCheck = el.querySelector('#btn-check-slots');
    const slotGroup = el.querySelector('#slot-group');
    const timeSelect = el.querySelector('#book-time');
    const paymentSection = el.querySelector('#payment-section');
    const bookForm = el.querySelector('#book-form');
    
    btnCheck.addEventListener('click', () => {
        if(!docSelect.value || !dateInput.value) {
            alert('Please select a doctor and date first.');
            return;
        }
        const slots = Store.getAvailableSlots(docSelect.value, dateInput.value);
        if(slots.length === 0) {
            alert('No available slots for this doctor on the selected date.');
            return;
        }
        timeSelect.innerHTML = slots.map(s => `<option value="${s}">${s}</option>`).join('');
        slotGroup.classList.remove('hidden');
        paymentSection.classList.remove('hidden');
        btnCheck.classList.add('hidden');
    });

    const resetBookingUI = () => {
        slotGroup.classList.add('hidden');
        paymentSection.classList.add('hidden');
        btnCheck.classList.remove('hidden');
        el.querySelector('#slip-section').classList.add('hidden');
    };
    docSelect.addEventListener('change', resetBookingUI);
    dateInput.addEventListener('change', resetBookingUI);

    bookForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const docId = docSelect.value;
        const date = dateInput.value;
        const time = timeSelect.value;
        
        const res = Store.bookAppointment(user.id, docId, date, time);
        if(res.success) {
            bookForm.classList.add('hidden');
            const slipSection = el.querySelector('#slip-section');
            const slipContent = el.querySelector('#slip-content');
            const doc = Store.data.employees.find(emp => emp.id === docId);
            
            const pName = user.name || p.name;
            const slipData = `GLOBAL MULTISPECIALITY HOSPITAL\n=================================\nAPPOINTMENT SLIP\n---------------------------------\nDate       : ${date}\nTime       : ${time}\nToken No   : ${res.token}\nPatient ID : ${user.id}\nPatient    : ${pName}\nDoctor     : ${doc ? doc.name : docId}\n---------------------------------\nFee Status : Rs. 250 (PAID via UPI)\n=================================`;

            slipContent.innerHTML = slipData.replace(/\\n/g, '<br>');
            slipSection.classList.remove('hidden');

            el.querySelector('#btn-download-slip').addEventListener('click', () => {
                const blob = new Blob([slipData.replace(/<br>/g, '\\n')], {type: 'text/plain'});
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Appointment_Slip_Token_${res.token}.txt`;
                a.click();
            });
            
            // Note: We don't force re-route immediately so the user can download the slip.
        }
    });

    // Add Profile Editing Logic
    el.querySelector('#btn-pat-edit-profile').addEventListener('click', () => {
        el.querySelector('#pat-profile-form-container').classList.toggle('hidden');
    });
    
    el.querySelector('#btn-cancel-edit-prof').addEventListener('click', () => {
        el.querySelector('#pat-profile-form-container').classList.add('hidden');
    });

    el.querySelector('#pat-edit-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const updates = {
            name: el.querySelector('#pat-edit-name').value,
            phone: el.querySelector('#pat-edit-phone').value,
            password: el.querySelector('#pat-edit-pass').value,
            age: el.querySelector('#pat-edit-age').value,
            height: el.querySelector('#pat-edit-height').value,
            weight: el.querySelector('#pat-edit-weight').value
        };
        Store.updatePatient(p.id, updates);
        Store.data.currentUser.name = updates.name; // Keep current user session in sync
        Store.save();
        alert('Profile updated successfully!');
        const routeRole = Store.data.currentUser.role.toLowerCase().replace(' assistant', '');
        Router.navigate('#/'); // Navigate away to force refresh
        setTimeout(() => Router.navigate('#/' + routeRole + '-dashboard'), 50);
    });

    el.querySelector('#btn-pat-del-acc').addEventListener('click', () => {
        if (confirm('Warning: This action is permanent! Are you absolutely sure you want to delete your account?')) {
            Store.removePatient(p.id);
            Store.logout();
            Router.navigate('#/');
            updateNav();
        }
    });

    return el;
}

function renderDoctorDashboard() {
    const user = Store.data.currentUser;
    const today = new Date().toISOString().split('T')[0];
    
    let bookingsHtml = '';
    Store.getDoctorAppointments(user.id, today).forEach(a => {
        const p = Store.getPatient(a.patientId);
        bookingsHtml += `<div style="padding:10px; border-bottom:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center; background:var(--bg-color); transition:background 0.2s;" onmouseover="this.style.background='var(--card-bg)'" onmouseout="this.style.background='var(--bg-color)'">
            <div>
                <strong>Token: ${a.token} (${a.time || 'N/A'})</strong><br>
                Patient: ${p ? p.name : a.patientId}
            </div>
            <button class="btn btn-secondary btn-sm btn-load-patient" data-pid="${a.patientId}">Interact</button>
        </div>`;
    });

    const profileImg = user.photo ? `<img src="${user.photo}" style="width:50px; height:50px; border-radius:50%; object-fit:cover; border:2px solid white;">` : `<div style="font-size:2rem; background:rgba(255,255,255,0.2); width:50px; height:50px; display:flex; justify-content:center; align-items:center; border-radius:50%;">👤</div>`;

    const el = createElement(`
        <div style="animation: slideUpFade 0.4s ease-out both;">
            <h2 style="margin-bottom:10px; font-size: 2rem;">Welcome, <span style="color:var(--primary-color)">${user.name.startsWith('Dr.') ? user.name : 'Dr. ' + user.name}</span> 👋</h2>
            <p style="color:var(--text-secondary); margin-bottom:20px;">Doctor Workspace - ${user.department || 'General'}</p>
        </div>

        <div style="background: linear-gradient(135deg, var(--primary-color), #4f46e5); color:white; padding:15px 20px; border-radius:var(--radius); margin-bottom:25px; box-shadow:var(--shadow-md); animation: slideUpFade 0.5s ease-out both; display:flex; justify-content:space-between; align-items:center;">
            <div style="display:flex; align-items:center; gap:15px;">
                ${profileImg}
                <div>
                    <h4 style="margin:0; font-size:1.1rem;">My Profile & Leave Management</h4>
                    <span style="font-size:0.9rem; opacity:0.9;">Manage your details and availability</span>
                </div>
            </div>
            <div>
                <button id="btn-doc-edit-profile" class="btn" style="background:rgba(255,255,255,0.2); color:white; border:1px solid rgba(255,255,255,0.5);">Manage</button>
            </div>
        </div>

        <div id="doc-profile-form-container" class="card hidden" style="margin-bottom:25px; animation: slideUpFade 0.5s ease-out both;">
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:25px;">
                <div>
                    <h3 style="border-bottom:1px solid var(--border-color); padding-bottom:10px; margin-bottom:15px;">📝 Edit Personal Details</h3>
                    <form id="doc-edit-form" style="display:flex; flex-direction:column; gap:15px;">
                        <div class="form-group">
                            <label>Name</label>
                            <input type="text" id="doc-edit-name" class="form-control" value="${user.name}" required>
                        </div>
                        <div class="form-group">
                            <label>Photo URL (Optional)</label>
                            <input type="url" id="doc-edit-photo" class="form-control" value="${user.photo || ''}" placeholder="https://example.com/photo.jpg">
                        </div>
                        <div class="form-group">
                            <label>Password</label>
                            <input type="text" id="doc-edit-pass" class="form-control" value="${user.password}" required>
                        </div>
                        <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:10px;">
                            <button type="button" id="btn-cancel-edit-prof" class="btn btn-secondary">Cancel</button>
                            <button type="submit" class="btn btn-primary">Save Updates</button>
                        </div>
                    </form>
                </div>
                <div>
                    <h3 style="border-bottom:1px solid var(--border-color); padding-bottom:10px; margin-bottom:15px;">⏱️ Manage Availability</h3>
                    <p style="font-size:0.85em; color:var(--text-secondary); margin-bottom:10px;">Block specific time slots so patients cannot book them. Mark Full Day for leave.</p>
                    <form id="avail-form" style="display:flex; flex-direction:column; gap:10px;">
                        <input type="date" id="avail-date" class="form-control" required min="${today}">
                        <select id="avail-time" class="form-control" required>
                            <option value="ALL">Full Day (Mark Leave)</option>
                            <option value="09:00 AM">09:00 AM</option>
                            <option value="09:30 AM">09:30 AM</option>
                            <option value="10:00 AM">10:00 AM</option>
                            <option value="10:30 AM">10:30 AM</option>
                            <option value="11:00 AM">11:00 AM</option>
                            <option value="11:30 AM">11:30 AM</option>
                            <option value="02:00 PM">02:00 PM</option>
                            <option value="02:30 PM">02:30 PM</option>
                            <option value="03:00 PM">03:00 PM</option>
                            <option value="03:30 PM">03:30 PM</option>
                            <option value="04:00 PM">04:00 PM</option>
                        </select>
                        <button type="submit" class="btn btn-secondary" style="width:100%;">Block Time Slot</button>
                        <div id="avail-success" class="hidden" style="color:var(--danger); font-weight:bold; text-align:center;">Slot Blocked</div>
                    </form>
                </div>
            </div>
        </div>

        <div class="dashboard-grid">
            <div style="display:flex; flex-direction:column; gap:1.5rem;">
                <div class="card hover-effect" style="animation: slideUpFade 0.6s ease-out both;">
                    <h3 style="border-bottom:2px solid var(--primary-color); padding-bottom:10px; margin-bottom:15px;">📅 Today's Bookings (${today})</h3>
                    <div style="margin-top:10px;">
                        ${bookingsHtml || '<div style="padding:15px;text-align:center;color:var(--text-secondary);">No bookings for today.</div>'}
                    </div>
                </div>
            </div>
            
            <div class="card hover-effect" style="grid-column: span 2; animation: slideUpFade 0.8s ease-out both;">
                <h3 style="border-bottom:2px solid var(--primary-color); padding-bottom:10px; margin-bottom:15px;">🔍 Patient Search & Update</h3>
                <div style="display:flex; gap:10px; margin-top:15px;">
                    <input type="text" id="search-pid" class="form-control" placeholder="Enter Patient ID (e.g. P1001)">
                    <button id="btn-search-p" class="btn btn-secondary" style="white-space: nowrap;">Search Records</button>
                </div>
                
                <div id="p-details" class="hidden" style="margin-top: 25px; animation: slideUpFade 0.4s ease-out both;">
                    <h4 id="pd-name" style="font-size:1.2rem; color:var(--primary-color);"></h4>
                    <div style="margin: 15px 0;">
                        <h5 style="margin-bottom:10px;">Past Records</h5>
                        <ul id="pd-records" style="font-size:0.95em; padding-left:20px; color:var(--text-secondary);"></ul>
                    </div>
                    
                    <form id="update-form" style="margin-top: 25px; border-top: 1px solid var(--border-color); padding-top: 15px;">
                        <input type="hidden" id="upd-pid">
                        <div class="form-group">
                            <label>Update Condition / Clinical Notes</label>
                            <textarea id="upd-cond" class="form-control" rows="3" required></textarea>
                        </div>
                        <div class="form-group">
                            <label>Prescribe Medicine (Optional)</label>
                            <textarea id="upd-rx-notes" class="form-control" rows="2" placeholder="Additional dosing directions..."></textarea>
                            <div style="margin-top:10px; display:grid; grid-template-columns: 1fr 1fr; gap:5px;">
                                ${Store.catalogs.medicines.map(m => `<label style="font-size:0.9em; font-weight:normal;"><input type="checkbox" name="meds" value="${m.id}"> ${m.name} (Rs.${m.price})</label>`).join('')}
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Request Lab Test (Optional)</label>
                            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:5px; margin-top:5px;">
                                ${Store.catalogs.labTests.map(t => `<label style="font-size:0.9em; font-weight:normal;"><input type="checkbox" name="labs" value="${t.id}"> ${t.name} (Rs.${t.price})</label>`).join('')}
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary" style="width:100%;">Save Patient Details</button>
                    </form>
                </div>
            </div>
        </div>
    `);

    el.querySelector('#btn-doc-edit-profile')?.addEventListener('click', () => {
        el.querySelector('#doc-profile-form-container').classList.toggle('hidden');
    });

    el.querySelector('#btn-cancel-edit-prof')?.addEventListener('click', () => {
        el.querySelector('#doc-profile-form-container').classList.add('hidden');
    });

    el.querySelector('#doc-edit-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const updates = {
            name: el.querySelector('#doc-edit-name').value,
            photo: el.querySelector('#doc-edit-photo').value,
            password: el.querySelector('#doc-edit-pass').value
        };
        Store.updateEmployeeDetails(user.id, updates);
        Store.data.currentUser = { ...Store.data.currentUser, ...updates }; // sync session
        alert('Profile updated successfully!');
        const routeRole = Store.data.currentUser.role.toLowerCase().replace(' assistant', '');
        Router.navigate('#/'); // Navigate away to force refresh
        setTimeout(() => Router.navigate('#/' + routeRole + '-dashboard'), 50);
    });

    el.querySelector('#btn-search-p').addEventListener('click', () => {
        const pid = el.querySelector('#search-pid').value.trim();
        const p = Store.getPatient(pid);
        if(p) {
            const physicalStr = p.age ? `<div style="font-size:0.85em; color:var(--text-secondary); margin-top:5px; padding:5px; background:var(--bg-color); border-radius:4px; border:1px solid var(--border-color);">Age: ${p.age} | ${p.gender} | Blood: <strong style="color:var(--danger);">${p.bloodGroup}</strong> | H: ${p.height}cm | W: ${p.weight}kg</div>` : '';
            el.querySelector('#pd-name').innerHTML = `Patient: ${p.name} (ID: ${p.id}) ${physicalStr}`;
            el.querySelector('#upd-pid').value = p.id;
            let recs = '';
            p.records.forEach(r => {
                const doc = Store.data.employees.find(e => e.id === r.doctorId);
                recs += `<li style="margin-bottom:5px;"><strong>${r.date}</strong> - ${r.condition} (Doc: ${doc ? doc.name : r.doctorId})</li>`;
            });
            let rxRecs = '';
            p.prescriptions.forEach(r => {
                const doc = Store.data.employees.find(e => e.id === r.doctorId);
                let medsTxt = r.meds ? r.meds.map(m=>m.name).join(', ') : r.details;
                rxRecs += `<li style="margin-bottom:10px; padding:10px; background:var(--bg-color); border-radius:4px;">
                    <strong>${r.date}</strong> (Doc: ${doc ? doc.name : r.doctorId})<br>
                    Meds: ${medsTxt} <span style="font-size:0.8em;">(${r.status})</span>
                    <br><button class="btn btn-secondary btn-sm" style="margin-top:5px;" onclick="downloadRx('${r.id}', '${p.id}')">Download</button>
                </li>`;
            });
            let labsRecs = '';
            Store.getLabResults(p.id).forEach(l => {
                labsRecs += `<li style="margin-bottom:10px; padding:10px; background:var(--card-bg); border:1px solid var(--border-color); border-radius:4px;">
                    <strong style="color:var(--primary-color);">${l.date} - ${l.testName || 'Lab Test'}</strong><br>
                    <div style="font-size:0.85em; margin-top:5px; color:var(--text-secondary); line-height:1.4;">${l.details}</div>
                </li>`;
            });
            el.querySelector('#pd-records').outerHTML = `
                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:15px;">
                    <div><strong>Clinical Notes</strong><ul style="margin-top:5px; padding-left:15px; font-size:0.9em; color:var(--text-secondary);">${recs || '<li>No prior records</li>'}</ul></div>
                    <div><strong>Past Prescriptions</strong><ul style="margin-top:5px; padding-left:0; list-style-type:none; font-size:0.9em; color:var(--text-secondary);">${rxRecs || '<li>No prescriptions</li>'}</ul></div>
                    <div><strong>Lab Results</strong><ul style="margin-top:5px; padding-left:0; list-style-type:none; font-size:0.9em; color:var(--text-secondary);">${labsRecs || '<li>No lab results</li>'}</ul></div>
                </div>
            `;
            el.querySelector('#p-details').classList.remove('hidden');
        } else {
            alert('Patient not found');
            el.querySelector('#p-details').classList.add('hidden');
        }
    });

    el.querySelectorAll('.btn-load-patient').forEach(btn => {
        btn.addEventListener('click', (e) => {
            el.querySelector('#search-pid').value = e.target.dataset.pid;
            el.querySelector('#btn-search-p').click();
        });
    });

    el.querySelector('#avail-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const date = el.querySelector('#avail-date').value;
        const time = el.querySelector('#avail-time').value;
        Store.blockTimeSlot(user.id, date, time);
        const succ = el.querySelector('#avail-success');
        succ.classList.remove('hidden');
        setTimeout(() => succ.classList.add('hidden'), 2000);
    });

    el.querySelector('#update-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const pid = el.querySelector('#upd-pid').value;
        const cond = el.querySelector('#upd-cond').value;
        const rxNotes = el.querySelector('#upd-rx-notes').value;
        const selectedMeds = Array.from(el.querySelectorAll('input[name="meds"]:checked')).map(cb => cb.value);
        const selectedLabs = Array.from(el.querySelectorAll('input[name="labs"]:checked')).map(cb => cb.value);
        
        if (cond) Store.addRecord(pid, user.id, cond);
        if (selectedMeds.length > 0 || rxNotes) Store.addPrescription(pid, user.id, selectedMeds, rxNotes);
        if (selectedLabs.length > 0) Store.requestLabTest(pid, user.id, selectedLabs, false);
        
        alert('Patient updated successfully (Condition, Prescriptions, Lab Tests logged)!');
        e.target.reset();
        el.querySelector('#p-details').classList.add('hidden');
        el.querySelector('#search-pid').value = '';
    });

    return el;
}

function renderPharmacistDashboard() {
    const user = Store.data.currentUser;
    const pendingRx = Store.getAllPendingPrescriptions();
    let pendingRxHtml = '';

    if (pendingRx.length === 0) {
        pendingRxHtml = '<p style="color:var(--text-secondary); text-align:center; padding:15px;">No pending prescriptions system-wide.</p>';
    } else {
        pendingRx.slice().reverse().forEach(rx => {
            const doc = Store.data.employees.find(e => e.id === rx.doctorId);
            let medsListHtml = '';
            if(rx.meds && rx.meds.length > 0) {
                medsListHtml = rx.meds.map(m => `<div>${m.name} - Rs.${m.price}</div>`).join('');
                medsListHtml += `<div style="margin-top:10px; font-weight:bold; color:var(--primary-color);">Total Price: Rs.${rx.totalAmount}</div>`;
            } else if (rx.details) {
                medsListHtml = `<div>${rx.details}</div>`;
            } else { medsListHtml = `<div>No medications.</div>`; }

            pendingRxHtml += `
                <div style="padding: 15px; border: 1px solid var(--border-color); margin-bottom: 10px; border-radius: var(--radius); background: var(--bg-color); transition: all 0.3s ease; box-shadow: var(--shadow-sm);" onmouseover="this.style.transform='translateX(5px)'; this.style.boxShadow='var(--shadow-md)';" onmouseout="this.style.transform='translateX(0)'; this.style.boxShadow='var(--shadow-sm)';">
                    <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                        <strong style="color:var(--primary-color);">Patient: ${rx.patientName} (${rx.patientId})</strong>
                        <span style="color:var(--text-secondary);">${rx.date}</span>
                    </div>
                    <div style="margin-bottom:5px;"><strong>Doctor:</strong> ${doc ? doc.name : rx.doctorId}</div>
                    <div style="margin-bottom:15px; padding:10px; background:var(--card-bg); border:1px solid var(--border-color); border-radius:var(--radius);">
                        ${medsListHtml}
                        ${rx.details && rx.meds && rx.meds.length > 0 ? `<div style="margin-top:5px; font-size:0.85em; color:var(--text-secondary);">Notes: ${rx.details}</div>` : ''}
                    </div>
                    <button class="btn btn-primary btn-sm btn-mark-rx-global" data-pid="${rx.patientId}" data-rxid="${rx.id}" style="width:100%;">Process & Mark Bought</button>
                </div>
            `;
        });
    }

    const el = createElement(`
        <div style="animation: slideUpFade 0.4s ease-out both;">
            <h2 style="margin-bottom:5px; font-size: 2rem;">Welcome, <span style="color:var(--primary-color)">${user.name}</span> 👋</h2>
            <p style="color:var(--text-secondary); margin-bottom:20px;">Pharmacy Terminal</p>
        </div>
        <div class="dashboard-grid">
            <div class="card hover-effect" style="animation: slideUpFade 0.5s ease-out both;">
                <h3 style="border-bottom:2px solid var(--primary-color); padding-bottom:10px; margin-bottom:15px;">🔔 Global Pending Prescriptions</h3>
                <div style="margin-top: 10px;">
                    ${pendingRxHtml}
                </div>
            </div>

            <div class="card hover-effect" style="animation: slideUpFade 0.6s ease-out both;">
                <h3 style="border-bottom:2px solid var(--primary-color); padding-bottom:10px; margin-bottom:15px;">🔍 Search Patient Prescriptions</h3>
                <div style="display:flex; gap:10px; margin-top:15px; margin-bottom: 25px;">
                    <input type="text" id="rx-pid" class="form-control" placeholder="Enter Patient ID (e.g. P1001)">
                    <button id="btn-search-rx" class="btn btn-secondary">Search History</button>
                </div>
                <div id="rx-list" style="margin-top: 10px;">
                    <p style="color:var(--text-secondary); text-align:center;">Enter a Patient ID to view their full prescription history.</p>
                </div>
            </div>
        </div>
    `);

    // Global mark listener
    el.querySelectorAll('.btn-mark-rx-global').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const rxId = e.target.dataset.rxid;
            const pid = e.target.dataset.pid;
            Store.markPrescriptionBought(pid, rxId);
            alert('Prescription marked as bought system-wide!');
            Router.navigate('#/');
            setTimeout(() => Router.navigate('#/pharmacist-dashboard'), 50);
        });
    });

    el.querySelector('#btn-search-rx').addEventListener('click', () => {
        const pid = el.querySelector('#rx-pid').value.trim();
        const p = Store.getPatient(pid);
        const listEl = el.querySelector('#rx-list');
        listEl.innerHTML = '';
        
        if(p) {
            if(p.prescriptions.length === 0) {
                listEl.innerHTML = '<p style="text-align:center;">No prescriptions found for this patient.</p>';
                return;
            }
            p.prescriptions.slice().reverse().forEach(rx => {
                const doc = Store.data.employees.find(e => e.id === rx.doctorId);
                const item = document.createElement('div');
                item.style.cssText = 'padding: 15px; border: 1px solid var(--border-color); margin-bottom: 10px; border-radius: var(--radius); background: var(--bg-color); transition: all 0.3s ease; box-shadow: var(--shadow-sm);';
                item.onmouseover = () => { item.style.transform='translateX(5px)'; item.style.boxShadow='var(--shadow-md)'; };
                item.onmouseout = () => { item.style.transform='translateX(0)'; item.style.boxShadow='var(--shadow-sm)'; };
                
                let badgeColor = rx.status === 'Pending' ? 'var(--warning)' : 'var(--success)';
                
                let medsListHtml = '';
                if(rx.meds && rx.meds.length > 0) {
                    medsListHtml = rx.meds.map(m => `<div>${m.name} - Rs.${m.price}</div>`).join('');
                    medsListHtml += `<div style="margin-top:10px; font-weight:bold; color:var(--primary-color);">Total Price: Rs.${rx.totalAmount}</div>`;
                } else if (rx.details) {
                    medsListHtml = `<div>${rx.details}</div>`; // Legacy fallback
                } else { medsListHtml = `<div>No medications.</div>`; }

                item.innerHTML = `
                    <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                        <strong style="color:var(--text-secondary);">${rx.date}</strong>
                        <span style="background:${badgeColor}; color:white; padding:2px 8px; border-radius:12px; font-size:0.8em; font-weight:bold;">${rx.status}</span>
                    </div>
                    <div style="margin-bottom:5px;"><strong>Doctor:</strong> ${doc ? doc.name : rx.doctorId}</div>
                    <div style="margin-bottom:15px; padding:10px; background:var(--card-bg); border:1px solid var(--border-color); border-radius:var(--radius);">
                        ${medsListHtml}
                        ${rx.details && rx.meds && rx.meds.length > 0 ? `<div style="margin-top:5px; font-size:0.85em; color:var(--text-secondary);">Notes: ${rx.details}</div>` : ''}
                    </div>
                    ${rx.status === 'Pending' && rx.totalAmount > 0 ? `
                        <div style="text-align:center; margin-bottom:10px;">
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=PharmacyPayment${rx.totalAmount}" alt="QR Code" style="border:1px solid #ccc; padding:5px; background:white;">
                            <div style="font-size:0.8em; color:var(--text-secondary); margin-top:5px;">Scan to Pay Rs.${rx.totalAmount} (Demo)</div>
                        </div>
                    ` : ''}
                    ${rx.status === 'Pending' ? `<button class="btn btn-primary" style="width:100%;">Confirm Payment & Mark Bought</button>` : ''}
                `;
                
                if(rx.status === 'Pending') {
                    item.querySelector('button').addEventListener('click', () => {
                        Store.markPrescriptionBought(pid, rx.id);
                        alert('Prescription marked as bought successfully!');
                        el.querySelector('#btn-search-rx').click(); // refresh list
                    });
                }
                listEl.appendChild(item);
            });
        } else {
            alert('Patient not found');
        }
    });

    return el;
}

function renderLabDashboard() {
    const user = Store.data.currentUser;
    const pendingReqs = Store.getPendingLabRequests();
    let reqsHtml = '';
    
    if(pendingReqs.length === 0) {
        reqsHtml = '<p style="color:var(--text-secondary); text-align:center; padding:15px;">No pending lab requests right now.</p>';
    } else {
        pendingReqs.slice().reverse().forEach(req => {
            const p = Store.getPatient(req.patientId);
            const docName = req.doctorId === 'Self-Booked' ? 'Self-Booked' : (Store.data.employees.find(e => e.id === req.doctorId)?.name || req.doctorId);
            const testNames = req.tests && req.tests.length > 0 ? req.tests.map(t=>t.name).join(', ') : req.details;
            
            reqsHtml += `<div style="padding: 15px; background:var(--bg-color); border:1px solid var(--border-color); border-radius:var(--radius); margin-bottom:10px; transition: all 0.3s ease; box-shadow: var(--shadow-sm);" onmouseover="this.style.transform='translateX(5px)'; this.style.boxShadow='var(--shadow-md)';" onmouseout="this.style.transform='translateX(0)'; this.style.boxShadow='var(--shadow-sm)';">
                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                    <strong>Date: ${req.date}</strong>
                    <span style="color:var(--warning); font-size:0.85em; font-weight:bold; border:1px solid var(--warning); padding:2px 8px; border-radius:12px;">${req.paymentStatus}</span>
                </div>
                <div style="margin-bottom:5px;"><strong>Patient:</strong> ${p?.name || 'Unknown'} (${req.patientId})</div>
                <div style="margin-bottom:5px;"><strong>Requested By:</strong> ${docName}</div>
                <div style="margin-bottom:12px; font-size:0.9em; padding:8px; background:var(--card-bg); border-radius:4px; border:1px solid var(--border-color);"><strong>Investigating:</strong> ${testNames}</div>
                <button class="btn btn-primary btn-sm btn-upload-result" style="width:100%;" data-reqid="${req.id}">Process Results & Upload</button>
            </div>`;
        });
    }

    const el = createElement(`
        <div style="animation: slideUpFade 0.4s ease-out both;">
            <h2 style="margin-bottom:5px; font-size: 2rem;">Welcome, <span style="color:var(--primary-color)">${user.name}</span> 👋</h2>
            <p style="color:var(--text-secondary); margin-bottom:20px;">Laboratory Department</p>
        </div>
        <div class="dashboard-grid">
            <div class="card hover-effect" style="animation: slideUpFade 0.6s ease-out both;">
                <h3 style="border-bottom:2px solid var(--primary-color); padding-bottom:10px; margin-bottom:15px;">🔬 Pending Lab Requests</h3>
                <div style="margin-top:15px;">${reqsHtml}</div>
            </div>
            <div class="card hidden hover-effect" id="upload-panel" style="animation: slideUpFade 0.7s ease-out both;">
                <h3 style="border-bottom:2px solid var(--primary-color); padding-bottom:10px; margin-bottom:15px;">📤 Upload Test Results</h3>
                <div id="upload-context" style="margin:15px 0; padding:15px; background:var(--bg-color); border:1px solid var(--border-color); border-radius:var(--radius); font-size:0.9em;"></div>
                
                <form id="lab-form">
                    <input type="hidden" id="lab-req-id">
                    <div id="dynamic-params" style="margin-bottom:15px;"></div>
                    <button type="submit" class="btn btn-primary" style="width:100%; font-weight:bold;">Submit Official Results</button>
                </form>
            </div>
        </div>
    `);

    const uploadPanel = el.querySelector('#upload-panel');
    const dynamicParams = el.querySelector('#dynamic-params');
    const uploadContext = el.querySelector('#upload-context');

    el.querySelectorAll('.btn-upload-result').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const reqId = e.target.dataset.reqid;
            const req = pendingReqs.find(r => r.id === reqId);
            if(!req) return;
            
            el.querySelector('#lab-req-id').value = req.id;
            const p = Store.getPatient(req.patientId);
            uploadContext.innerHTML = `<strong style="color:var(--primary-color);">Patient:</strong> ${p ? p.name : 'Unknown'} (${req.patientId})<br><br><strong style="color:var(--primary-color);">Requested Tests:</strong><br> ${req.tests.map(t=>t.name).join(', ')}`;
            
            // Build dynamic UI
            let paramsHtml = '';
            if(req.tests && req.tests.length > 0) {
                req.tests.forEach(t => {
                    paramsHtml += `<h5 style="margin:15px 0 10px 0; color:var(--text-secondary); border-bottom:2px solid var(--border-color); padding-bottom:5px;">${t.name} Findings</h5>`;
                    if(t.params && t.params.length > 0) {
                        t.params.forEach(p => {
                            paramsHtml += `
                            <div class="form-group" style="margin-bottom:10px; display:flex; align-items:center; gap:10px;">
                                <label style="flex:1; font-size:0.9em; margin:0; font-weight:500;">${p}</label>
                                <input type="text" class="form-control lab-param-input" data-param="${p}" placeholder="Value..." required style="flex:1; padding:0.5rem;">
                            </div>`;
                        });
                    } else {
                        paramsHtml += `<textarea class="form-control lab-param-input" data-param="${t.name} Findings" rows="3" placeholder="Detailed findings..." required></textarea>`;
                    }
                });
            } else {
                paramsHtml = `<textarea class="form-control lab-param-input" data-param="General Findings" rows="4" placeholder="Full laboratory diagnostic results..." required></textarea>`;
            }
            dynamicParams.innerHTML = paramsHtml;
            uploadPanel.classList.remove('hidden');
            
            // Scroll to it
            uploadPanel.scrollIntoView({ behavior: 'smooth' });
        });
    });

    el.querySelector('#lab-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const reqId = el.querySelector('#lab-req-id').value;
        const inputs = el.querySelectorAll('.lab-param-input');
        const resultsObj = {};
        
        inputs.forEach(inp => {
            resultsObj[inp.dataset.param] = inp.value;
        });
        
        if(Store.uploadLabResult(reqId, resultsObj)) {
            alert('Lab results successfully uploaded to patient record!');
            Router.handleRoute(); // Refresh view
        } else {
            alert('Error processing lab result.');
        }
    });

    return el;
}
