/**
 * ========================================
 * AUTHENTICATION MODULE
 * ========================================
 * Handles user registration, login, logout, and session management
 * Uses localStorage for data persistence (frontend-only implementation)
 * Academic Purpose: Demonstrates client-side authentication, validation, and session handling
 */

// ========================================
// CONFIGURATION
// ========================================
const AUTH_CONFIG = {
    USERS_KEY: 'weather_app_users',
    SESSION_KEY: 'weather_app_session',
    MIN_PASSWORD_LENGTH: 6,
    DEFAULT_ADMIN: {
        username: 'Admin',
        email: 'admin@weather.com',
        password: 'admin@123'
    }
};

// ========================================
// INITIALIZATION
// ========================================

/**
 * Initialize default admin account if no users exist
 */
function initializeDefaultAdmin() {
    const users = getAllUsers();
    
    // Check if default admin already exists
    const adminExists = users.some(u => u.email === AUTH_CONFIG.DEFAULT_ADMIN.email);
    
    if (!adminExists && users.length === 0) {
        // Create default admin
        const defaultAdmin = {
            id: 'admin-' + Date.now().toString(),
            name: AUTH_CONFIG.DEFAULT_ADMIN.username,
            email: AUTH_CONFIG.DEFAULT_ADMIN.email,
            password: AUTH_CONFIG.DEFAULT_ADMIN.password,
            createdAt: new Date().toISOString(),
            isAdmin: true,
            preferences: {
                temperatureUnit: 'celsius',
                defaultCity: 'Thiruvananthapuram',
                enableAlerts: true,
                darkMode: true
            }
        };
        
        users.push(defaultAdmin);
        saveUsers(users);
        console.log('✅ Default admin account created');
    }
}

// Initialize admin on script load
initializeDefaultAdmin();

// ========================================
// USER MANAGEMENT FUNCTIONS
// ========================================

/**
 * Get all registered users from localStorage
 * @returns {Array} Array of user objects
 */
function getAllUsers() {
    const users = localStorage.getItem(AUTH_CONFIG.USERS_KEY);
    return users ? JSON.parse(users) : [];
}

/**
 * Save users array to localStorage
 * @param {Array} users - Array of user objects
 */
function saveUsers(users) {
    localStorage.setItem(AUTH_CONFIG.USERS_KEY, JSON.stringify(users));
}

/**
 * Find user by email
 * @param {string} email - User email
 * @returns {Object|null} User object or null if not found
 */
function findUserByEmail(email) {
    const users = getAllUsers();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase());
}

// ========================================
// VALIDATION FUNCTIONS
// ========================================

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with isValid and message
 */
function validatePassword(password) {
    if (password.length < AUTH_CONFIG.MIN_PASSWORD_LENGTH) {
        return {
            isValid: false,
            message: `Password must be at least ${AUTH_CONFIG.MIN_PASSWORD_LENGTH} characters long`
        };
    }
    return { isValid: true, message: 'Password is valid' };
}

/**
 * Validate name (non-empty, reasonable length)
 * @param {string} name - Name to validate
 * @returns {Object} Validation result
 */
function validateName(name) {
    if (!name || name.trim().length < 2) {
        return {
            isValid: false,
            message: 'Name must be at least 2 characters long'
        };
    }
    if (name.trim().length > 50) {
        return {
            isValid: false,
            message: 'Name must not exceed 50 characters'
        };
    }
    return { isValid: true, message: 'Name is valid' };
}

// ========================================
// REGISTRATION FUNCTION
// ========================================

/**
 * Register a new user
 * @param {string} name - User's full name
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Object} Registration result with success status and message
 */
function registerUser(name, email, password) {
    // Validate inputs
    const nameValidation = validateName(name);
    if (!nameValidation.isValid) {
        return { success: false, message: nameValidation.message };
    }

    if (!isValidEmail(email)) {
        return { success: false, message: 'Please enter a valid email address' };
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
        return { success: false, message: passwordValidation.message };
    }

    // Check if user already exists
    if (findUserByEmail(email)) {
        return { success: false, message: 'An account with this email already exists' };
    }

    // Create new user object
    const users = getAllUsers();
    
    // Don't make first user admin anymore since default admin exists
    const newUser = {
        id: Date.now().toString(), // Simple ID generation
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: password, // Note: In production, this should be hashed
        createdAt: new Date().toISOString(),
        isAdmin: false, // Regular users are not admin by default
        preferences: {
            temperatureUnit: 'celsius',
            defaultCity: 'Thiruvananthapuram',
            enableAlerts: true,
            darkMode: false
        }
    };

    // Save user
    users.push(newUser);
    saveUsers(users);

    return { 
        success: true, 
        message: 'Registration successful! Please login to continue.',
        user: { id: newUser.id, name: newUser.name, email: newUser.email, isAdmin: newUser.isAdmin }
    };
}

// ========================================
// LOGIN FUNCTION
// ========================================

/**
 * Authenticate user and create session
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Object} Login result with success status and message
 */
function loginUser(email, password) {
    // Validate inputs
    if (!email || !password) {
        return { success: false, message: 'Please enter both email and password' };
    }

    if (!isValidEmail(email)) {
        return { success: false, message: 'Please enter a valid email address' };
    }

    // Find user
    const user = findUserByEmail(email);
    
    if (!user) {
        return { success: false, message: 'Invalid email or password' };
    }

    // Verify password
    if (user.password !== password) {
        return { success: false, message: 'Invalid email or password' };
    }

    // Create session
    const session = {
        userId: user.id,
        name: user.name,
        email: user.email,
        loginTime: new Date().toISOString()
    };

    localStorage.setItem(AUTH_CONFIG.SESSION_KEY, JSON.stringify(session));

    return { 
        success: true, 
        message: 'Login successful!',
        user: session
    };
}

// ========================================
// SESSION MANAGEMENT
// ========================================

/**
 * Get current session
 * @returns {Object|null} Session object or null if not logged in
 */
function getCurrentSession() {
    const session = localStorage.getItem(AUTH_CONFIG.SESSION_KEY);
    return session ? JSON.parse(session) : null;
}

/**
 * Check if user is logged in
 * @returns {boolean} True if user is logged in
 */
function isLoggedIn() {
    return getCurrentSession() !== null;
}

/**
 * Logout user (clear session)
 */
function logoutUser() {
    localStorage.removeItem(AUTH_CONFIG.SESSION_KEY);
    return { success: true, message: 'Logged out successfully' };
}

/**
 * Get current user's full data
 * @returns {Object|null} User object or null
 */
function getCurrentUser() {
    const session = getCurrentSession();
    if (!session) return null;

    const users = getAllUsers();
    return users.find(user => user.id === session.userId);
}

// ========================================
// PAGE PROTECTION
// ========================================

/**
 * Protect page - redirect to login if not authenticated
 * Call this function at the start of protected pages
 */
function requireAuth() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
    }
}

/**
 * Redirect to home if already logged in
 * Call this on login/register pages
 */
function redirectIfLoggedIn() {
    if (isLoggedIn()) {
        window.location.href = 'index.html';
    }
}

// ========================================
// ADMIN FUNCTIONS
// ========================================

/**
 * Check if current user is admin
 * @returns {boolean} True if current user has admin privileges
 */
function isAdmin() {
    const user = getCurrentUser();
    return user && user.isAdmin === true;
}

/**
 * Delete a user by ID (admin only)
 * @param {string} userId - ID of user to delete
 * @returns {Object} Result with success status and message
 */
function deleteUser(userId) {
    if (!isAdmin()) {
        return { success: false, message: 'Unauthorized: Admin access required' };
    }

    const session = getCurrentSession();
    if (session.userId === userId) {
        return { success: false, message: 'Cannot delete your own account' };
    }

    const users = getAllUsers();
    const userIndex = users.findIndex(user => user.id === userId);

    if (userIndex === -1) {
        return { success: false, message: 'User not found' };
    }

    const deletedUser = users[userIndex];
    users.splice(userIndex, 1);
    saveUsers(users);

    return { 
        success: true, 
        message: `User ${deletedUser.name} deleted successfully`,
        deletedUser: { id: deletedUser.id, name: deletedUser.name, email: deletedUser.email }
    };
}

/**
 * Get all users with admin check
 * @returns {Array|null} Array of users if admin, null otherwise
 */
function getAllUsersAdmin() {
    if (!isAdmin()) {
        return null;
    }
    return getAllUsers();
}

/**
 * Toggle admin status for a user (super admin only)
 * @param {string} userId - ID of user to toggle
 * @returns {Object} Result with success status
 */
function toggleAdminStatus(userId) {
    if (!isAdmin()) {
        return { success: false, message: 'Unauthorized: Admin access required' };
    }

    const session = getCurrentSession();
    if (session.userId === userId) {
        return { success: false, message: 'Cannot modify your own admin status' };
    }

    const users = getAllUsers();
    const user = users.find(u => u.id === userId);

    if (!user) {
        return { success: false, message: 'User not found' };
    }

    user.isAdmin = !user.isAdmin;
    saveUsers(users);

    return {
        success: true,
        message: `${user.name} ${user.isAdmin ? 'granted' : 'revoked'} admin privileges`,
        isAdmin: user.isAdmin
    };
}

// ========================================
// EXPORT FOR USE IN OTHER FILES
// ========================================
// These functions are now available globally
