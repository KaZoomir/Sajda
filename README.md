# Sajda Web App

## Overview

Sajda Web App is a comprehensive Islamic web application inspired by the popular Sajda mobile app. This project aims to provide Muslims with essential religious tools and resources through a user-friendly web interface. While the original Sajda is only available as a mobile application, this web version brings similar functionality to desktop and mobile browsers.

## Features

### 🕌 Prayer Times
- Accurate prayer times based on your location
- Visual countdown to the next prayer
- Current prayer indicator
- Adjustable calculation methods

### 🧭 Qibla Finder
- Interactive compass to find the direction of the Kaaba
- Uses device geolocation and orientation sensors
- Clear visual guidance for proper prayer direction

### 📖 Quran Reader
- Complete Quran with Arabic text
- Russian translations from multiple scholars
  - Kuliev
  - Osmanov
  - Porokhova
  - Krachkovsky
- Adjustable font size
- Reading progress tracking

### 📅 Islamic Calendar
- Dual calendar system (Gregorian and Hijri)
- Important Islamic dates and holidays highlighted
- Monthly view with easy navigation

### 📿 Zikr Counter
- Digital tasbih (prayer beads) for counting dhikr
- Multiple preset phrases:
  - Subhan Allah (سُبْحَانَ ٱللَّٰهِ)
  - Alhamdulillah (ٱلْحَمْدُ لِلَّٰهِ)
  - Allahu Akbar (ٱللَّٰهُ أَكْبَرُ)
  - La ilaha illallah (لَا إِلَٰهَ إِلَّا ٱللَّٰهُ)
  - Astaghfirullah (أَسْتَغْفِرُ ٱللَّٰهَ)
  - Salawat (اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ)
- Statistics tracking for daily, weekly, and monthly recitations

## Technologies Used

- **React**: Front-end library for building the user interface
- **React Router**: For navigation between different pages
- **Geolocation API**: To determine user location for prayer times and qibla direction
- **DeviceOrientation API**: For compass functionality
- **Aladhan API**: For accurate prayer times calculation
- **Alquran Cloud API**: For Quran text and translations
- **Local Storage**: For saving user preferences and statistics

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/sajda-web-app.git

# Navigate to the project directory
cd sajda-web-app

# Install dependencies
npm install

# Start the development server
npm start
```

## Usage

1. Allow location permissions when prompted for accurate prayer times and qibla direction
2. Navigate through the application using the top navigation bar
3. Customize settings according to your preferences
4. For mobile devices, enable device orientation permissions for the qibla compass

## Project Structure

```
sajda-web-app/
├── public/
├── src/
│   ├── components/
│   │   ├── PrayerTimes.jsx       # Prayer times functionality
│   │   ├── QiblaFinder.jsx       # Qibla compass
│   │   ├── QuranReader.jsx       # Quran reading interface
│   │   ├── IslamicCalendar.jsx   # Islamic calendar
│   │   ├── ZikrCounter.jsx       # Digital tasbih
│   │   ├── AboutUs.jsx           # About page
│   │   ├── Terms.jsx             # Terms of Service
│   │   ├── Privacy.jsx           # Privacy Policy
│   │   ├── Contact.jsx           # Contact information
│   │   └── Navbar.jsx            # Navigation component
│   ├── App.jsx                   # Main application component
│   ├── App.css                   # App-specific styles
│   ├── index.jsx                 # Entry point
│   └── index.css                 # Global styles
└── package.json
```

## Disclaimer

This web application is a non-commercial project inspired by the Sajda mobile app but is not affiliated with or endorsed by the official Sajda app developers. All rights to the Sajda brand belong to their respective owners.

The project aims to provide Muslim users with convenient access to religious tools through web browsers. While we strive for accuracy in prayer times, qibla direction, and other religious information, users should verify important religious matters with local authorities or official sources.

## Contact

- Email: kazoomir@gmail.com
- Instagram: [@sajda_web_app](https://instagram.com/sajda_web_app)

## License

This project is available under the MIT License. See the LICENSE file for details.

---

*Note: This application is continuously being improved. If you encounter any issues or have suggestions, please contact us via the information provided above.*
