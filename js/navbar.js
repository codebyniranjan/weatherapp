/**
 * ========================================
 * NAVIGATION MODULE
 * ========================================
 * Manages the shared navigation bar across all pages
 * Academic Purpose: Demonstrates DOM manipulation, active page detection, event handling
 */

/**
 * Create and insert navigation bar HTML
 */
function createNavbar() {
    const session = getCurrentSession();
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const isAdmin = checkIfAdmin();
    
    const navbarHTML = `
        <nav class="navbar">
            <div class="navbar-container">
                <div class="navbar-brand">
                    <svg class="brand-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                    </svg>
                    <span class="brand-text">Weather System</span>
                </div>
                
                <div class="navbar-menu" id="navbarMenu">
                    <a href="index.html" class="nav-link ${currentPage === 'index.html' ? 'active' : ''}">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                        <span>Home</span>
                    </a>
                    
                    <a href="forecast.html" class="nav-link ${currentPage === 'forecast.html' ? 'active' : ''}">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <span>Forecast</span>
                    </a>
                    
                    <a href="history.html" class="nav-link ${currentPage === 'history.html' ? 'active' : ''}">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <span>History</span>
                    </a>
                    
                    <a href="alerts.html" class="nav-link ${currentPage === 'alerts.html' ? 'active' : ''}">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                            <line x1="12" y1="9" x2="12" y2="13"></line>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                        <span>Alerts</span>
                    </a>
                    
                    <a href="settings.html" class="nav-link ${currentPage === 'settings.html' ? 'active' : ''}">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M12 1v6m0 6v6m-9-6h6m6 0h6M4.22 4.22l4.24 4.24m7.08 7.08l4.24 4.24M19.78 4.22l-4.24 4.24M9.02 14.54l-4.24 4.24"></path>
                        </svg>
                        <span>Settings</span>
                    </a>
                    
                    ${isAdmin ? `
                    <a href="admin.html" class="nav-link ${currentPage === 'admin.html' ? 'active' : ''}">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 2a3 3 0 0 0-3 3v4a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path>
                            <path d="M17 11a1 1 0 0 1 1 1v3a5 5 0 0 1-5 5 5 5 0 0 1-5-5v-3a1 1 0 0 1 1-1"></path>
                            <path d="M12 20v4"></path>
                            <path d="M8 24h8"></path>
                        </svg>
                        <span>Admin</span>
                    </a>
                    ` : ''}
                    
                    <a href="about.html" class="nav-link ${currentPage === 'about.html' ? 'active' : ''}">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="16" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                        <span>About</span>
                    </a>
                </div>
                
                <div class="navbar-actions">
                    <span class="user-name" id="navUserName">${session ? session.name : 'User'}${isAdmin ? ' (Admin)' : ''}</span>
                    <button class="logout-btn" id="logoutBtn" title="Logout">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        <span>Logout</span>
                    </button>
                </div>

                <button class="navbar-toggle" id="navbarToggle">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </nav>
    `;

    // Insert navbar at the beginning of body
    document.body.insertAdjacentHTML('afterbegin', navbarHTML);

    // Add event listeners
    setupNavbarListeners();
}

/**
 * Check if current user is admin
 */
function checkIfAdmin() {
    const session = getCurrentSession();
    if (!session) return false;
    
    const user = getCurrentUser();
    return user && user.isAdmin === true;
}

/**
 * Setup event listeners for navbar
 */
function setupNavbarListeners() {
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Mobile menu toggle
    const navbarToggle = document.getElementById('navbarToggle');
    const navbarMenu = document.getElementById('navbarMenu');
    
    if (navbarToggle && navbarMenu) {
        navbarToggle.addEventListener('click', () => {
            navbarMenu.classList.toggle('active');
            navbarToggle.classList.toggle('active');
        });

        // Close menu when clicking a link
        const navLinks = navbarMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navbarMenu.classList.remove('active');
                navbarToggle.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navbarToggle.contains(e.target) && !navbarMenu.contains(e.target)) {
                navbarMenu.classList.remove('active');
                navbarToggle.classList.remove('active');
            }
        });
    }
}

/**
 * Handle logout action
 */
function handleLogout() {
    const confirmed = confirm('Are you sure you want to logout?');
    if (confirmed) {
        logoutUser();
        window.location.href = 'login.html';
    }
}

/**
 * Initialize navbar on page load
 */
document.addEventListener('DOMContentLoaded', () => {
    // Only create navbar if user is logged in and not on auth pages
    const currentPage = window.location.pathname.split('/').pop();
    const authPages = ['login.html', 'register.html'];
    
    if (!authPages.includes(currentPage) && isLoggedIn()) {
        createNavbar();
    }
});
