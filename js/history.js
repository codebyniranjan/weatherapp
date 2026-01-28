/**
 * ========================================
 * SEARCH HISTORY MODULE
 * ========================================
 * Manages weather search history for logged-in users
 * Academic Purpose: Demonstrates array manipulation, timestamp handling, and data persistence
 */

// ========================================
// CONFIGURATION
// ========================================
const HISTORY_CONFIG = {
    MAX_HISTORY_ITEMS: 20, // Maximum number of history items to store
    HISTORY_KEY_PREFIX: 'weather_history_'
};

/**
 * Get history key for current user
 * @returns {string} localStorage key for current user's history
 */
function getUserHistoryKey() {
    const session = getCurrentSession();
    if (!session) return null;
    return HISTORY_CONFIG.HISTORY_KEY_PREFIX + session.userId;
}

// ========================================
// HISTORY MANAGEMENT
// ========================================

/**
 * Get search history for current user
 * @returns {Array} Array of history objects
 */
function getSearchHistory() {
    const key = getUserHistoryKey();
    if (!key) return [];

    const history = localStorage.getItem(key);
    return history ? JSON.parse(history) : [];
}

/**
 * Save search history for current user
 * @param {Array} history - History array to save
 */
function saveSearchHistory(history) {
    const key = getUserHistoryKey();
    if (!key) return;

    // Limit history size
    const limitedHistory = history.slice(0, HISTORY_CONFIG.MAX_HISTORY_ITEMS);
    localStorage.setItem(key, JSON.stringify(limitedHistory));
}

/**
 * Add a city to search history
 * @param {string} city - City name
 * @param {Object} weatherData - Optional weather data snapshot
 */
function addToHistory(city, weatherData = null) {
    const history = getSearchHistory();
    
    // Create history entry
    const entry = {
        city: city,
        timestamp: new Date().toISOString(),
        temperature: weatherData ? weatherData.temperature : null,
        condition: weatherData ? weatherData.main : null,
        icon: weatherData ? weatherData.icon : null
    };

    // Remove duplicate if exists (same city)
    const filtered = history.filter(item => 
        item.city.toLowerCase() !== city.toLowerCase()
    );

    // Add new entry at the beginning
    filtered.unshift(entry);

    // Save updated history
    saveSearchHistory(filtered);
}

/**
 * Clear all search history for current user
 */
function clearSearchHistory() {
    const key = getUserHistoryKey();
    if (!key) return;
    
    localStorage.removeItem(key);
}

/**
 * Remove a specific history entry
 * @param {number} index - Index of entry to remove
 */
function removeHistoryEntry(index) {
    const history = getSearchHistory();
    if (index >= 0 && index < history.length) {
        history.splice(index, 1);
        saveSearchHistory(history);
    }
}

/**
 * Get formatted history items for display
 * @returns {Array} Array of formatted history objects
 */
function getFormattedHistory() {
    const history = getSearchHistory();
    
    return history.map((item, index) => {
        const date = new Date(item.timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        let timeAgo;
        if (diffMins < 1) {
            timeAgo = 'Just now';
        } else if (diffMins < 60) {
            timeAgo = `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
        } else if (diffHours < 24) {
            timeAgo = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        } else if (diffDays < 7) {
            timeAgo = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        } else {
            timeAgo = date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
            });
        }

        return {
            index: index,
            city: item.city,
            timestamp: item.timestamp,
            timeAgo: timeAgo,
            temperature: item.temperature,
            condition: item.condition,
            icon: item.icon,
            fullDate: date.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            })
        };
    });
}

/**
 * Check if a city is in recent history
 * @param {string} city - City name
 * @returns {boolean} True if city is in history
 */
function isInHistory(city) {
    const history = getSearchHistory();
    return history.some(item => 
        item.city.toLowerCase() === city.toLowerCase()
    );
}

/**
 * Get most searched cities
 * @param {number} limit - Number of cities to return
 * @returns {Array} Array of city names
 */
function getMostSearchedCities(limit = 5) {
    const history = getSearchHistory();
    const cityCounts = {};

    // Count occurrences
    history.forEach(item => {
        const cityLower = item.city.toLowerCase();
        cityCounts[cityLower] = (cityCounts[cityLower] || 0) + 1;
    });

    // Sort by count and return top cities
    return Object.entries(cityCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([city, count]) => ({
            city: history.find(h => h.city.toLowerCase() === city).city,
            count: count
        }));
}
