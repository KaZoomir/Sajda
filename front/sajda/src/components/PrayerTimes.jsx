import { useEffect, useState, useCallback } from "react";

const PrayerTimes = () => {
  const [times, setTimes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState("");
  const [islamicDate, setIslamicDate] = useState("");
  const [cityName, setCityName] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [currentPrayer, setCurrentPrayer] = useState("");
  const [timeUntilNext, setTimeUntilNext] = useState("");
  
  // Function to convert to Hijri date
  const getHijriDate = () => {
    // This is a simplified version. For a full implementation, 
    // consider using a library like hijri-date or moment-hijri
    const today = new Date();
    // This is an approximation - in a real app, you would use a proper library
    const hijriYear = 1446; // Example fixed year
    const hijriMonthName = "Рамадан"; // Example fixed month
    const hijriDay = Math.floor(Math.random() * 20) + 1; // Random day for example
    
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
    let currentPrayerName = "Isha"; // Default to Isha if before Fajr
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
            currentPrayerName = "Isha"; // If before Fajr, current is Isha (from yesterday)
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
    const hours = Math.floor(timeDiff / (1000 * 60 * 60)).toString().padStart(2, '0');
    const minutes = Math.floor((timeDiff / (1000 * 60)) % 60).toString().padStart(2, '0');
    const seconds = Math.floor((timeDiff / 1000) % 60).toString().padStart(2, '0');
    
    setTimeUntilNext(`${hours}:${minutes}:${seconds}`);
  }, [times]);
  
  useEffect(() => {
    // Set date information
    const today = new Date();
    setCurrentDate(getWeekdayRussian());
    setIslamicDate(getHijriDate());
    setCurrentTime(formatTime(today));
    
    // Get user location and fetch prayer times
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            
            // Get city name from coordinates
            const locationResponse = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=ru`
            );
            
            if (locationResponse.ok) {
              const locationData = await locationResponse.json();
              setCityName(locationData.city || "Ваш город");
            }
            
            // Get prayer times
            const response = await fetch(
              `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`
            );
            
            if (!response.ok) {
              throw new Error("Failed to fetch prayer times");
            }
            
            const data = await response.json();
            setTimes(data.data.timings);
            setLoading(false);
          } catch (err) {
            setError("Не удалось загрузить время намаза. Пожалуйста, попробуйте позже.");
            setLoading(false);
          }
        },
        (geoError) => {
          setError("Для отображения времени намаза необходим доступ к местоположению.");
          setLoading(false);
        }
      );
    } else {
      setError("Геолокация не поддерживается в вашем браузере.");
      setLoading(false);
    }
  }, []);
  
  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      calculatePrayerTimes();
    }, 1000);
    
    return () => clearInterval(timer);
  }, [calculatePrayerTimes]);
  
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
          </div>
        </div>
        
        {loading && (
          <div className="loading-container">
            <div className="loading">Загрузка времени намаза...</div>
          </div>
        )}
        
        {error && (
          <div className="error-container">
            <div className="error-message">{error}</div>
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
        
        .loading-container, .error-container {
          padding: 50px;
          text-align: center;
        }
        
        .loading {
          color: #333;
          font-size: 18px;
        }
        
        .error-message {
          color: #e74c3c;
          background-color: #fadbd8;
          padding: 15px;
          border-radius: 5px;
          font-size: 16px;
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
        }
      `}</style>
    </div>
  );
};

export default PrayerTimes;