# 🌤️ Multi-Page Weather System

A comprehensive weather application built with vanilla JavaScript, HTML, and CSS. This project demonstrates modern web development practices including authentication, API integration, and responsive design.

## 📋 Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Page Descriptions](#page-descriptions)
- [Academic Concepts](#academic-concepts)
- [API Documentation](#api-documentation)
- [Future Enhancements](#future-enhancements)

## ✨ Features

### 🔐 Authentication System
- User registration with validation
- Login/logout functionality
- Session management using localStorage
- Protected routes

### 🌤️ Weather Features
- **Current Weather**: Real-time weather data for any city
- **5-Day Forecast**: Extended predictions with hourly breakdowns
- **Weather Alerts**: Rule-based warnings for extreme conditions
- **Search History**: Automatic tracking of searched cities
- **Geolocation**: Use device location for weather data

### ⚙️ Customization
- Temperature unit toggle (°C/°F)
- Default city setting
- Dark mode support
- Alert preferences

## 💻 Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **API**: OpenWeatherMap API
- **Storage**: localStorage for data persistence
- **Design**: Responsive, mobile-first approach
- **No Frameworks**: Pure vanilla JavaScript

## 📁 Project Structure

```
weather-system/
├── index.html          # Home page - Current weather
├── login.html          # User login
├── register.html       # User registration
├── forecast.html       # 5-day forecast
├── history.html        # Search history
├── alerts.html         # Weather alerts
├── settings.html       # User preferences
├── about.html          # Project documentation
│
├── css/
│   ├── main.css        # Global styles
│   ├── auth.css        # Authentication styles
│   └── weather.css     # Weather components
│
└── js/
    ├── auth.js         # Authentication logic
    ├── weather.js      # Weather API integration
    ├── settings.js     # Settings management
    ├── history.js      # History tracking
    └── navbar.js       # Navigation component
```

## 🚀 Setup Instructions

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Text editor (VS Code, Sublime Text, etc.)
- Web server (Live Server extension, Python http.server, or Node http-server)

### Installation Steps

1. **Download/Clone the project**
   ```bash
   # If you have git
   git clone [repository-url]
   
   # Or simply extract the zip file
   ```

2. **Navigate to the project directory**
   ```bash
   cd weather-system
   ```

3. **Start a local web server**
   
   **Option A: VS Code Live Server**
   - Install "Live Server" extension
   - Right-click on `login.html`
   - Select "Open with Live Server"

   **Option B: Python**
   ```bash
   python -m http.server 8000
   ```
   Then open `http://localhost:8000/login.html`

   **Option C: Node.js**
   ```bash
   npx http-server
   ```

4. **Access the application**
   - Open your browser
   - Navigate to the server URL
   - Start with `login.html` or `register.html`

### First-Time Usage

1. **Register a new account**
   - Click "Register here" on login page
   - Fill in your details (name, email, password)
   - Click "Create Account"

2. **Login**
   - Enter your email and password
   - Click "Login"

3. **Explore the application**
   - Use the navigation bar to visit different pages
   - Search for cities to get weather information
   - Customize settings to your preference

## 📄 Page Descriptions

### 1. Login Page (`login.html`)
**Purpose**: User authentication entry point

**Features**:
- Email and password validation
- Password visibility toggle
- Remember session using localStorage
- Redirect to home on successful login

**Academic Value**: Demonstrates form validation, event handling, localStorage usage

### 2. Register Page (`register.html`)
**Purpose**: New user registration

**Features**:
- User information collection (name, email, password)
- Client-side validation
- Password confirmation matching
- Duplicate email prevention

**Academic Value**: Input validation, data sanitization, CRUD operations on localStorage

### 3. Home Page (`index.html`)
**Purpose**: Display current weather for searched cities

**Features**:
- City search functionality
- Geolocation support
- Current weather display (temp, humidity, wind, etc.)
- Weather icon visualization
- Quick action links

**Academic Value**: API integration, async/await, data transformation, DOM manipulation

### 4. Forecast Page (`forecast.html`)
**Purpose**: Extended weather predictions

**Features**:
- 5-day daily forecast
- Hourly forecast (next 24 hours)
- Temperature ranges (high/low)
- Condition summaries

**Academic Value**: Data processing, array methods, statistical calculations, dynamic rendering

### 5. History Page (`history.html`)
**Purpose**: Track and display search history

**Features**:
- Chronological list of searched cities
- Timestamp display (relative and absolute)
- Quick re-search from history
- Clear history option
- Empty state handling

**Academic Value**: Data persistence, timestamp formatting, array manipulation

### 6. Alerts Page (`alerts.html`)
**Purpose**: Display weather warnings and advisories

**Features**:
- Rule-based alert generation
- Severity levels (high, medium, low)
- Alert types (heat, cold, wind, rain, etc.)
- Current conditions summary
- Alert legend

**Academic Value**: Conditional logic, rule engines, decision trees

### 7. Settings Page (`settings.html`)
**Purpose**: User preference customization

**Features**:
- Temperature unit toggle (°C/°F)
- Default city configuration
- Weather alerts on/off
- Dark mode toggle
- Reset to defaults option

**Academic Value**: State management, preference persistence, UI updates

### 8. About Page (`about.html`)
**Purpose**: Project documentation and information

**Features**:
- Project overview and objectives
- Technology stack details
- System architecture explanation
- Implementation highlights
- Future enhancements roadmap

**Academic Value**: Technical documentation, project presentation

## 🎓 Academic Concepts Demonstrated

### 1. Authentication & Authorization
- **Client-side authentication**: User registration and login
- **Session management**: Using localStorage to maintain login state
- **Protected routes**: Redirecting unauthorized users
- **Form validation**: Email format, password strength

### 2. API Integration
- **RESTful API consumption**: OpenWeatherMap API
- **Async operations**: Fetch API with async/await
- **Error handling**: Try-catch blocks, user-friendly error messages
- **Data caching**: Reducing API calls with localStorage cache

### 3. Data Management
- **CRUD operations**: Create, Read, Update, Delete user data
- **JSON serialization**: Converting objects to JSON strings
- **localStorage**: Persistent client-side storage
- **Data structures**: Arrays, objects, nested data

### 4. JavaScript Concepts
- **Modular code**: Separate files for different concerns
- **ES6+ features**: Arrow functions, template literals, destructuring
- **Event-driven programming**: Event listeners and handlers
- **DOM manipulation**: Creating, updating, removing elements

### 5. CSS & Design
- **Responsive design**: Mobile-first approach, media queries
- **CSS Grid & Flexbox**: Modern layout techniques
- **CSS Variables**: Theme customization
- **Animations**: Smooth transitions and loading states

### 6. Algorithm & Logic
- **Search algorithms**: Filtering and finding data
- **Data transformation**: Processing API responses
- **Conditional logic**: Alert generation based on thresholds
- **Aggregation**: Calculating averages, min/max values

## 🌐 API Documentation

### OpenWeatherMap API

**Base URL**: `https://api.openweathermap.org/data/2.5`

#### Endpoints Used:

1. **Current Weather**
   ```
   GET /weather?q={city}&appid={API_KEY}&units=metric
   ```
   Returns current weather conditions for a city.

2. **5-Day Forecast**
   ```
   GET /forecast?q={city}&appid={API_KEY}&units=metric
   ```
   Returns weather forecast for 5 days with 3-hour intervals.

3. **Geolocation Weather**
   ```
   GET /weather?lat={lat}&lon={lon}&appid={API_KEY}&units=metric
   ```
   Returns weather for specific coordinates.

#### Response Data Includes:
- Temperature (current, min, max, feels like)
- Weather condition (description, icon code)
- Humidity, pressure, visibility
- Wind speed and direction
- Cloudiness percentage
- Sunrise/sunset times

## 🎨 Customization

### Changing API Key
The API key is located in `js/weather.js`:
```javascript
const WEATHER_CONFIG = {
    API_KEY: 'YOUR_API_KEY_HERE',
    // ...
};
```

### Modifying Colors
Colors are defined as CSS variables in `css/main.css`:
```css
:root {
    --primary-color: #4f46e5;
    --secondary-color: #10b981;
    /* ... */
}
```

### Adding New Cities
Default city is set in settings. Users can change it via Settings page.

## 🐛 Troubleshooting

### API Errors
- **401 Unauthorized**: Invalid API key
- **404 Not Found**: City name incorrect or not in database
- **429 Too Many Requests**: API rate limit exceeded

### Login Issues
- **Clear browser data**: localStorage might be corrupted
- **Check browser console**: Look for JavaScript errors
- **Try incognito mode**: Test without extensions

### Display Issues
- **Clear cache**: Force refresh (Ctrl+F5 or Cmd+Shift+R)
- **Check browser compatibility**: Use modern browser
- **Responsive issues**: Check viewport meta tag

## 🔒 Security Notes

**⚠️ Important**: This is an educational project with limitations:

1. **Passwords**: Stored in plaintext in localStorage (NOT production-ready)
2. **API Key**: Exposed in client-side code (use backend proxy in production)
3. **No HTTPS**: Use HTTPS in production for secure data transmission
4. **localStorage**: Can be cleared by user, data not synced across devices

## 🚀 Future Enhancements

### Backend Integration
- Node.js/Express server
- MongoDB/PostgreSQL database
- Hashed passwords with bcrypt
- JWT authentication

### Advanced Features
- Weather maps with radar
- Air quality index
- Historical weather data
- Social sharing features
- Progressive Web App (PWA)
- Push notifications
- Multi-language support

### Performance
- Service workers for offline capability
- Lazy loading images
- Code splitting
- Optimized API calls

## 📝 License

This is an academic project created for educational purposes. Feel free to use it for learning and project submissions.

## 👥 Credits

- **Weather Data**: [OpenWeatherMap](https://openweathermap.org)
- **Icons**: SVG icons from Lucide Icons
- **Development**: Built with vanilla JavaScript

## 📧 Support

For issues, questions, or suggestions:
- Check the About page in the application
- Review this README thoroughly
- Consult browser console for errors

---

**Happy Weather Tracking! 🌤️**
