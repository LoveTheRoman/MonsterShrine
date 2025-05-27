// Monster Shrine Auth System
document.addEventListener('DOMContentLoaded', function() {
    // Initialize auth system
    checkAuthState();
    
    // Setup event listeners
    setupAuthEvents();
    
    // Profile picture editor
    setupAvatarUpload();
});

// ================= AUTH SYSTEM ================= //

function checkAuthState() {
    const user = JSON.parse(localStorage.getItem('monsterUser'));
    const loginBtn = document.getElementById('login-button');
    const profileSection = document.getElementById('user-profile');
    
    if (user) {
        // User is logged in
        if (loginBtn) loginBtn.style.display = 'none';
        if (profileSection) {
            profileSection.style.display = 'flex';
            // Update avatar if exists
            updateAllAvatars(user.avatar);
        }
    } else {
        // User is logged out
        if (loginBtn) loginBtn.style.display = 'block';
        if (profileSection) profileSection.style.display = 'none';
    }
}

function setupAuthEvents() {
    // Login button click
    document.getElementById('login-button')?.addEventListener('click', createLoginModal);
    
    // Logout link
    document.getElementById('logout-link')?.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('monsterUser');
        checkAuthState();
        window.location.href = 'index.html';
    });
}

function createLoginModal() {
    // Remove existing modal if any
    document.querySelector('.modal-overlay')?.remove();
    
    // Create new modal
    const modalHTML = `
    <div class="modal-overlay">
        <div class="login-modal">
            <div class="modal-header">
                <h2>MONSTER LOGIN</h2>
                <span class="close-modal">&times;</span>
            </div>
            <div class="modal-tabs">
                <button class="tab-button active" data-tab="login">Login</button>
                <button class="tab-button" data-tab="register">Register</button>
            </div>
            <div class="modal-body">
                <form id="monster-login-form" class="active">
                    <input type="email" placeholder="monster@energy.com" required>
                    <input type="password" placeholder="Password" required>
                    <button type="submit" class="monster-button">CHUG IT!</button>
                </form>
                <form id="monster-register-form">
                    <input type="text" placeholder="Monster Name" required>
                    <input type="email" placeholder="monster@energy.com" required>
                    <input type="password" placeholder="Password" required>
                    <input type="password" placeholder="Confirm Password" required>
                    <button type="submit" class="monster-button">JOIN THE HORDE!</button>
                </form>
            </div>
        </div>
    </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    setupModalEvents();
}

function setupModalEvents() {
    // Close modal
    document.querySelector('.close-modal')?.addEventListener('click', function() {
        document.querySelector('.modal-overlay').remove();
    });
    
    // Tab switching
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
    
    // Form submissions
    document.getElementById('monster-login-form')?.addEventListener('submit', handleLogin);
    document.getElementById('monster-register-form')?.addEventListener('submit', handleRegister);
}

function switchTab(tabName) {
    // Update active tab button
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
    });
    
    // Update active form
    document.querySelectorAll('.modal-body form').forEach(form => {
        form.classList.toggle('active', form.id === `monster-${tabName}-form`);
    });
}

function handleLogin(e) {
    e.preventDefault();
    const email = e.target.elements[0].value;
    const password = e.target.elements[1].value;
    
    // Simple validation
    if (password.length < 6) {
        alert("Password needs more Monster energy! (min 6 characters)");
        return;
    }
    
    // Create user data
    const user = {
        email: email,
        username: email.split('@')[0],
        avatar: `https://robohash.org/${email}?set=set4&size=150x150`,
        joined: new Date().toLocaleDateString(),
        monstersChugged: 0
    };
    
    localStorage.setItem('monsterUser', JSON.stringify(user));
    document.querySelector('.modal-overlay').remove();
    checkAuthState();
    alert("WELCOME TO THE MONSTER ARMY!");
}

function handleRegister(e) {
    e.preventDefault();
    const username = e.target.elements[0].value;
    const email = e.target.elements[1].value;
    const password = e.target.elements[2].value;
    const confirmPassword = e.target.elements[3].value;
    
    // Validation
    if (password !== confirmPassword) {
        alert("Passwords don't match! Too much Monster?");
        return;
    }
    
    if (password.length < 6) {
        alert("Password needs more kick! (min 6 characters)");
        return;
    }
    
    const user = {
        username: username,
        email: email,
        avatar: `https://robohash.org/${email}?set=set4&size=150x150`,
        joined: new Date().toLocaleDateString(),
        monstersChugged: 0,
        redbullsHated: "∞"
    };
    
    localStorage.setItem('monsterUser', JSON.stringify(user));
    document.querySelector('.modal-overlay').remove();
    checkAuthState();
    alert("WELCOME TO THE MONSTER HORDE!");
}

// ================= PROFILE PICTURE ================= //

function setupAvatarUpload() {
    const avatarUpload = document.getElementById('avatar-upload');
    const changeAvatarBtn = document.getElementById('change-avatar');
    
    if (changeAvatarBtn) {
        changeAvatarBtn.addEventListener('click', function() {
            avatarUpload?.click();
        });
    }
    
    if (avatarUpload) {
        avatarUpload.addEventListener('change', handleAvatarUpload);
    }
    
    // Load saved avatar
    const user = JSON.parse(localStorage.getItem('monsterUser'));
    if (user?.avatar) {
        updateAllAvatars(user.avatar);
    }
}

function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(event) {
        updateAllAvatars(event.target.result);
        
        // Save to localStorage
        const user = JSON.parse(localStorage.getItem('monsterUser')) || {};
        user.avatar = event.target.result;
        localStorage.setItem('monsterUser', JSON.stringify(user));
        
        alert("MONSTER FACE UPGRADED!");
    };
    reader.readAsDataURL(file);
}

function updateAllAvatars(avatarUrl) {
    document.querySelectorAll('#profile-avatar, #user-avatar').forEach(img => {
        if (avatarUrl) {
            img.src = avatarUrl;
        }
    });
}