/**
 * ========================================
 * SETTINGS MODULE
 * ========================================
 * Manages user preferences: temperature unit, default city, alerts, dark mode
 * Academic Purpose: Demonstrates localStorage for persistent preferences, event handling
 */

// ========================================
// CONFIGURATION
// ========================================
const SETTINGS_CONFIG = {
    SETTINGS_KEY: 'weather_app_settings',
    DEFAULT_SETTINGS: {
        temperatureUnit: 'celsius',
        defaultCity: 'Thiruvananthapuram',
        enableAlerts: true,
        darkMode: true  // Dark mode enabled by default
    }
};

// ========================================
// SETTINGS MANAGEMENT
// ========================================

/**
 * Get user settings from localStorage
 * @returns {Object} User settings object
 */
function getSettings() {
    const session = getCurrentSession();
    if (!session) return SETTINGS_CONFIG.DEFAULT_SETTINGS;

    const user = getCurrentUser();
    if (!user || !user.preferences) {
        return SETTINGS_CONFIG.DEFAULT_SETTINGS;
    }

    return user.preferences;
}

/**
 * Save user settings to localStorage
 * @param {Object} settings - Settings object to save
 * @returns {boolean} Success status
 */
function saveSettings(settings) {
    const session = getCurrentSession();
    if (!session) return false;

    const users = getAllUsers();
    const userIndex = users.findIndex(u => u.id === session.userId);
    
    if (userIndex === -1) return false;

    // Update user preferences
    users[userIndex].preferences = {
        ...users[userIndex].preferences,
        ...settings
    };

    saveUsers(users);
    return true;
}

/**
 * Update a specific setting
 * @param {string} key - Setting key
 * @param {*} value - Setting value
 * @returns {boolean} Success status
 */
function updateSetting(key, value) {
    const currentSettings = getSettings();
    currentSettings[key] = value;
    return saveSettings(currentSettings);
}

/**
 * Get temperature unit preference
 * @returns {string} 'celsius' or 'fahrenheit'
 */
function getTemperatureUnit() {
    const settings = getSettings();
    return settings.temperatureUnit || 'celsius';
}

/**
 * Get default city preference
 * @returns {string} City name
 */
function getDefaultCity() {
    const settings = getSettings();
    return settings.defaultCity || 'Thiruvananthapuram';
}

/**
 * Check if alerts are enabled
 * @returns {boolean} Alerts enabled status
 */
function areAlertsEnabled() {
    const settings = getSettings();
    return settings.enableAlerts !== false; // Default to true
}

/**
 * Check if dark mode is enabled
 * @returns {boolean} Dark mode status
 */
function isDarkModeEnabled() {
    const settings = getSettings();
    return settings.darkMode === true;
}

/**
 * Toggle temperature unit
 * @returns {string} New temperature unit
 */
function toggleTemperatureUnit() {
    const currentUnit = getTemperatureUnit();
    const newUnit = currentUnit === 'celsius' ? 'fahrenheit' : 'celsius';
    updateSetting('temperatureUnit', newUnit);
    return newUnit;
}

/**
 * Apply dark mode to page
 */
function applyDarkMode() {
    if (isDarkModeEnabled()) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

/**
 * Toggle dark mode
 * @returns {boolean} New dark mode status
 */
function toggleDarkMode() {
    const currentMode = isDarkModeEnabled();
    const newMode = !currentMode;
    updateSetting('darkMode', newMode);
    applyDarkMode();
    return newMode;
}

// ========================================
// RESET SETTINGS
// ========================================

/**
 * Reset all settings to defaults
 * @returns {boolean} Success status
 */
function resetSettings() {
    return saveSettings(SETTINGS_CONFIG.DEFAULT_SETTINGS);
}
