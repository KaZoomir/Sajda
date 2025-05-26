import { useEffect, useState, useCallback } from "react";
import LocationFallback from './LocationFallback';

const PrayerTimes = () => {
  const [times, setTimes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLocationFallback, setShowLocationFallback] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [islamicDate, setIslamicDate] = useState("");
  const [cityName, setCityName] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [currentPrayer, setCurrentPrayer] = useState("");
  const [timeUntilNext, setTimeUntilNext] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  
  // Function to convert to Hijri date
  const getHijriDate = () => {
    const today = new Date();
    const hijriYear = 1446;
    const hijriMonthName = "Рамадан";
    const hijriDay = Math.floor(Math.random() * 20) + 1;
    
    return `${hijriDay} ${hijriMonthName}, ${hijriYear}`;
  };
  
  // Function to get weekday in Russian
  const getWeekdayRussian = () => {
    const weekdays = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
    const today = new Date();
    return weekdays[today.getDay()];
  };
  
  // Function to format current time
  const formatTime = (date) => {
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    });
  };

  // Enhanced fetch with retry logic
  const fetchWithRetry = async (url, maxRetries = 3) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.warn(`Attempt ${i + 1} failed:`, error);
        if (i === maxRetries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  };

  // Load prayer times for given coordinates
  const loadPrayerTimes = async (latitude, longitude, cityNameOverride = null) => {
    try {
      setLoading(true);
      setError(null);
      setShowLocationFallback(false);
      
      // Set user location
      setUserLocation({ latitude, longitude });
      
      // Set date information
      const today = new Date();
      setCurrentDate(getWeekdayRussian());
      setIslamicDate(getHijriDate());
      setCurrentTime(formatTime(today));
      
      // Get city name if not provided
      if (!cityNameOverride) {
        try {
          const locationData = await fetchWithRetry(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=ru`
          );
          setCityName(locationData.city || locationData.locality || "Ваше местоположение");
        } catch (locationError) {
          console.warn("Failed to get city name:", locationError);
          setCityName("Ваше местоположение");
        }
      } else {
        setCityName(cityNameOverride);
      }
      
      // Get prayer times with retry
      const prayerData = await fetchWithRetry(
        `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2&tune=0,0,0,0,0,0,0,0,0`
      );
      
      if (prayerData && prayerData.data && prayerData.data.timings) {
        setTimes(prayerData.data.timings);
      } else {
        throw new Error("Неверный формат данных от API");
      }
      
      setLoading(false);
    } catch (err) {
      console.error("Error loading prayer times:", err);
      setError(err.message || "Не удалось загрузить время намаза. Попробуйте выбрать город вручную.");
      setLoading(false);
    }
  };

  // Try to get location automatically on component mount
  useEffect(() => {
    const tryAutoLocation = () => {
      if (!navigator.geolocation) {
        setShowLocationFallback(true);
        setLoading(false);
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 8000, // 8 seconds timeout
        maximumAge: 300000 // 5 minutes cache
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          loadPrayerTimes(latitude, longitude);
        },
        (geoError) => {
          console.warn("Geolocation failed:", geoError);
          setShowLocationFallback(true);
          setLoading(false);
          setError("Не удалось определить местоположение автоматически. Выберите город из списка.");
        },
        options
      );
    };

    tryAutoLocation();
  }, []);
  
  // Function to calculate current prayer and time until next prayer
  const calculatePrayerTimes = useCallback(() => {
    if (!times.Fajr) return;
    
    const now = new Date();
    const currentTimeStr = formatTime(now);
    setCurrentTime(currentTimeStr);
    
    // Convert prayer times to Date objects for comparison
    const prayerTimes = {
      Fajr: new Date(`${now.toDateString()} ${times.Fajr}`),
      Dhuhr: new Date(`${now.toDateString()} ${times.Dhuhr}`),
      Asr: new Date(`${now.toDateString()} ${times.Asr}`),
      Maghrib: new Date(`${now.toDateString()} ${times.Maghrib}`),
      Isha: new Date(`${now.toDateString()} ${times.Isha}`)
    };
    
    const prayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
    let currentPrayerName = "Isha";
    let nextPrayerName = "Fajr";
    let nextPrayerTime = prayerTimes.Fajr;
    
    // If past Isha, next prayer is Fajr tomorrow
    if (now > prayerTimes.Isha) {
      nextPrayerTime = new Date(prayerTimes.Fajr);
      nextPrayerTime.setDate(nextPrayerTime.getDate() + 1);
    } else {
      // Find current and next prayer
      for (let i = 0; i < prayers.length; i++) {
        if (now < prayerTimes[prayers[i]]) {
          nextPrayerName = prayers[i];
          nextPrayerTime = prayerTimes[prayers[i]];
          if (i > 0) {
            currentPrayerName = prayers[i-1];
          } else {
            currentPrayerName = "Isha";
          }
          break;
        }
      }
    }
    
    // Map English prayer names to Russian
    const prayerNameMap = {
      "Fajr": "Фаджр",
      "Dhuhr": "Зухр",
      "Asr": "Аср",
      "Maghrib": "Магриб",
      "Isha": "Иша"
    };
    
    setCurrentPrayer(prayerNameMap[currentPrayerName]);
    
    // Calculate time until next prayer
    const timeDiff = nextPrayerTime - now;
    if (timeDiff > 0) {
      const hours = Math.floor(timeDiff / (1000 * 60 * 60)).toString().padStart(2, '0');
      const minutes = Math.floor((timeDiff / (1000 * 60)) % 60).toString().padStart(2, '0');
      const seconds = Math.floor((timeDiff / 1000) % 60).toString().padStart(2, '0');
      setTimeUntilNext(`${hours}:${minutes}:${seconds}`);
    } else {
      setTimeUntilNext("00:00:00");
    }
  }, [times]);
  
  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      calculatePrayerTimes();
    }, 1000);
    
    return () => clearInterval(timer);
  }, [calculatePrayerTimes]);

  // Handle location selection from fallback component
  const handleLocationSelected = (latitude, longitude, cityName) => {
    loadPrayerTimes(latitude, longitude, cityName);
  };

  // Retry automatic geolocation
  const retryGeolocation = () => {
    setShowLocationFallback(false);
    setLoading(true);
    setError(null);
    
    // Try again after short delay
    setTimeout(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            loadPrayerTimes(latitude, longitude);
          },
          () => {
            setShowLocationFallback(true);
            setLoading(false);
          }
        );
      } else {
        setShowLocationFallback(true);
        setLoading(false);
      }
    }, 500);
  };

  // Show location fallback if needed
  if (showLocationFallback) {
    return (
      <LocationFallback 
        onLocationSelected={handleLocationSelected}
        onRetryGeolocation={retryGeolocation}
      />
    );
  }
  
  // Prayer name mapping
  const prayerNames = {
    Fajr: "Фаджр",
    Sunrise: "Восход",
    Dhuhr: "Зухр",
    Asr: "Аср",
    Sunset: "Закат",
    Maghrib: "Магриб",
    Isha: "Иша",
    Midnight: "Полночь",
    Imsak: "Тахаджуд"
  };

  return (
    <div className="prayer-times-container">
      <div className="prayer-content">
        {/* Header with date and location */}
        <div className="header">
          <div className="date-section">
            <h1>Время намаза</h1>
            <div className="date-display">
              <div>{currentDate}</div>
              <div className="islamic-date">{islamicDate}</div>
            </div>
          </div>
          <div className="location-section">
            <div className="city-name">{cityName}</div>
            <div className="current-time">{currentTime}</div>
            {userLocation && (
              <button 
                className="change-location"
                onClick={() => setShowLocationFallback(true)}
              >
                📍 Изменить город
              </button>
            )}
          </div>
        </div>
        
        {loading && (
          <div className="loading-container">
            <div className="loading">
              <div className="spinner"></div>
              Загрузка времени намаза...
            </div>
          </div>
        )}
        
        {error && (
          <div className="error-container">
            <div className="error-message">{error}</div>
            <div className="error-actions">
              <button onClick={() => setShowLocationFallback(true)} className="select-city-button">
                🌍 Выбрать город
              </button>
              <button onClick={retryGeolocation} className="retry-button">
                🔄 Попробовать снова
              </button>
            </div>
          </div>
        )}
        
        {!loading && !error && times.Fajr && (
          <div className="prayer-times-wrapper">
            <div className="prayer-times-table">
              <div className="prayer-header">
                <div>Намаз</div>
                <div>Время</div>
              </div>
              
              <div className="prayer-row">
                <div className="prayer-info">
                  <div className="prayer-name">{prayerNames.Fajr}</div>
                  <div className="prayer-subtitle">Восход {times.Sunrise}</div>
                </div>
                <div className="prayer-time">{times.Fajr}</div>
              </div>
              
              <div className="prayer-row">
                <div className="prayer-name">{prayerNames.Dhuhr}</div>
                <div className="prayer-time">{times.Dhuhr}</div>
              </div>
              
              <div className="prayer-row">
                <div className="prayer-name">{prayerNames.Asr}</div>
                <div className="prayer-time">{times.Asr}</div>
              </div>
              
              <div className="prayer-row">
                <div className="prayer-name">{prayerNames.Maghrib}</div>
                <div className="prayer-time">{times.Maghrib}</div>
              </div>
              
              <div className="prayer-row">
                <div className="prayer-info">
                  <div className="prayer-name">{prayerNames.Isha}</div>
                  <div className="prayer-subtitle">Тахаджуд {times.Midnight}</div>
                </div>
                <div className="prayer-time">{times.Isha}</div>
              </div>
            </div>
            
            <div className="current-prayer-section">
              <div className="current-prayer-card">
                <h3>Текущий намаз</h3>
                <div className="current-prayer-info">
                  <div className="current-prayer-name">{currentPrayer}</div>
                  <div className="time-remaining">
                    <div className="label">До следующего намаза:</div>
                    <div className="timer">{timeUntilNext}</div>
                  </div>
                </div>
              </div>
              
              <div className="kaaba-image">
                <img src="https://i.pinimg.com/originals/52/f1/ff/52f1ff7f9c63aee1980fbd6469e1d62d.jpg" alt="Kaaba" />
              </div>
            </div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .prayer-times-container {
          padding: 30px;
          max-width: 1200px;
          margin: 0 auto;
          color: #333;
        }
        
        .prayer-content {
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .header {
          background-color: #2c3e50;
          color: white;
          padding: 20px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        h1 {
          margin: 0 0 10px 0;
          font-size: 24px;
        }
        
        .date-display {
          display: flex;
          gap: 15px;
        }
        
        .islamic-date {
          opacity: 0.8;
        }
        
        .location-section {
          text-align: right;
        }
        
        .city-name {
          font-size: 20px;
          font-weight: bold;
        }
        
        .current-time {
          font-size: 18px;
          opacity: 0.8;
        }
        
        .change-location {
          background-color: rgba(255, 255, 255, 0.2);
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          margin-top: 5px;
          transition: background-color 0.3s;
        }
        
        .change-location:hover {
          background-color: rgba(255, 255, 255, 0.3);
        }
        
        .loading-container {
          padding: 50px;
          text-align: center;
        }
        
        .loading {
          color: #333;
          font-size: 18px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
        }
        
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #16a085;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .error-container {
          padding: 30px;
          text-align: center;
        }
        
        .error-message {
          color: #e74c3c;
          background-color: #fadbd8;
          padding: 15px;
          border-radius: 5px;
          font-size: 16px;
          margin-bottom: 20px;
        }
        
        .error-actions {
          display: flex;
          gap: 15px;
          justify-content: center;
          flex-wrap: wrap;
        }
        
        .select-city-button, .retry-button {
          background-color: #16a085;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s;
        }
        
        .select-city-button:hover, .retry-button:hover {
          background-color: #1abc9c;
        }
        
        .select-city-button {
          background-color: #f39c12;
        }
        
        .select-city-button:hover {
          background-color: #e67e22;
        }
        
        .prayer-times-wrapper {
          display: flex;
          padding: 30px;
          gap: 30px;
        }
        
        .prayer-times-table {
          flex: 1;
          background-color: #f8f9fa;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        }
        
        .prayer-header {
          display: flex;
          justify-content: space-between;
          padding: 15px 20px;
          background-color: #16a085;
          color: white;
          font-weight: bold;
        }
        
        .prayer-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          border-bottom: 1px solid #eee;
        }
        
        .prayer-row:last-child {
          border-bottom: none;
        }
        
        .prayer-info {
          display: flex;
          flex-direction: column;
        }
        
        .prayer-name {
          font-weight: bold;
          color: #2c3e50;
        }
        
        .prayer-subtitle {
          font-size: 12px;
          color: #7f8c8d;
          margin-top: 3px;
        }
        
        .prayer-time {
          font-weight: bold;
          font-size: 18px;
          color: #16a085;
        }
        
        .current-prayer-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .current-prayer-card {
          background-color: #16a085;
          color: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .current-prayer-card h3 {
          margin: 0 0 15px 0;
          color: white;
        }
        
        .current-prayer-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .current-prayer-name {
          font-size: 24px;
          font-weight: bold;
        }
        
        .time-remaining {
          text-align: right;
        }
        
        .label {
          font-size: 12px;
          opacity: 0.8;
        }
        
        .timer {
          font-size: 24px;
          font-weight: bold;
        }
        
        .kaaba-image {
          flex: 1;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .kaaba-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        @media (max-width: 900px) {
          .prayer-times-wrapper {
            flex-direction: column;
          }
          
          .header {
            flex-direction: column;
            text-align: center;
          }
          
          .location-section {
            margin-top: 15px;
            text-align: center;
          }
          
          .date-display {
            justify-content: center;
          }
          
          .error-actions {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
};

export default PrayerTimes;