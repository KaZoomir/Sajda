import { useEffect, useState, useRef } from "react";
import LocationFallback from './LocationFallback';

const QiblaFinder = () => {
  const [qiblaDirection, setQiblaDirection] = useState(null);
  const [currentDirection, setCurrentDirection] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLocationFallback, setShowLocationFallback] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState('unknown');
  const [userLocation, setUserLocation] = useState(null);
  const [cityName, setCityName] = useState('');
  const [compassCalibrated, setCompassCalibrated] = useState(false);
  const compassRef = useRef(null);

  // Calculate Qibla direction
  const calculateQibla = (latitude, longitude) => {
    // Coordinates of Kaaba
    const kaabaLat = 21.4225;
    const kaabaLong = 39.8262;
    
    // Convert to radians
    const lat1 = latitude * (Math.PI / 180);
    const lat2 = kaabaLat * (Math.PI / 180);
    const longDiff = (kaabaLong - longitude) * (Math.PI / 180);
    
    // Calculate direction
    const y = Math.sin(longDiff);
    const x = Math.cos(lat1) * Math.tan(lat2) - Math.sin(lat1) * Math.cos(longDiff);
    let qiblaAngle = Math.atan2(y, x) * (180 / Math.PI);
    
    // Normalize to 0-360
    qiblaAngle = (qiblaAngle + 360) % 360;
    
    return qiblaAngle;
  };

  // Request device orientation permission (required for iOS 13+)
  const requestOrientationPermission = async () => {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const permission = await DeviceOrientationEvent.requestPermission();
        setPermissionStatus(permission);
        if (permission === 'granted') {
          window.addEventListener("deviceorientation", handleOrientation);
          setCompassCalibrated(true);
          return true;
        } else {
          setError("Необходимо разрешение на использование компаса. Пожалуйста, разрешите доступ к датчикам устройства.");
          return false;
        }
      } catch (error) {
        console.error('Error requesting orientation permission:', error);
        setError("Ошибка при запросе разрешения на использование компаса.");
        return false;
      }
    } else {
      // For non-iOS devices or older iOS versions
      if (window.DeviceOrientationEvent) {
        window.addEventListener("deviceorientation", handleOrientation);
        setPermissionStatus('granted');
        setCompassCalibrated(true);
        return true;
      } else {
        setError("Ваше устройство не поддерживает компас.");
        return false;
      }
    }
  };

  // Handle device orientation changes
  const handleOrientation = (event) => {
    if (event.alpha !== null) {
      // For iOS devices
      if (event.webkitCompassHeading) {
        setCurrentDirection(event.webkitCompassHeading);
      } 
      // For Android devices
      else if (event.alpha) {
        setCurrentDirection(360 - event.alpha);
      }
    }
  };

  // Load Qibla direction for given coordinates
  const loadQiblaDirection = async (latitude, longitude, cityNameOverride = null) => {
    try {
      setLoading(true);
      setError(null);
      setShowLocationFallback(false);
      
      // Set user location
      setUserLocation({ latitude, longitude });
      
      // Calculate Qibla direction
      const qiblaAngle = calculateQibla(latitude, longitude);
      setQiblaDirection(qiblaAngle);
      
      // Get city name if not provided
      if (!cityNameOverride) {
        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=ru`
          );
          if (response.ok) {
            const locationData = await response.json();
            setCityName(locationData.city || locationData.locality || "Ваше местоположение");
          } else {
            setCityName("Ваше местоположение");
          }
        } catch (locationError) {
          console.warn("Failed to get city name:", locationError);
          setCityName("Ваше местоположение");
        }
      } else {
        setCityName(cityNameOverride);
      }
      
      setLoading(false);
      
      // Try to set up device orientation for compass
      await requestOrientationPermission();
    } catch (err) {
      console.error("Error loading Qibla direction:", err);
      setError(err.message || "Не удалось загрузить направление Киблы.");
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
        timeout: 8000,
        maximumAge: 300000
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          loadQiblaDirection(latitude, longitude);
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

    // Clean up
    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  // Manual permission request button
  const handlePermissionRequest = async () => {
    setLoading(true);
    const granted = await requestOrientationPermission();
    if (granted) {
      setError(null);
    }
    setLoading(false);
  };

  // Handle location selection from fallback component
  const handleLocationSelected = (latitude, longitude, cityName) => {
    loadQiblaDirection(latitude, longitude, cityName);
  };

  // Retry automatic geolocation
  const retryGeolocation = () => {
    setShowLocationFallback(false);
    setLoading(true);
    setError(null);
    
    setTimeout(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            loadQiblaDirection(latitude, longitude);
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

  // Calculate the rotation for the compass
  const compassRotation = currentDirection;
  // Calculate the rotation for the Qibla pointer
  const qiblaPointerRotation = qiblaDirection ? qiblaDirection - currentDirection : 0;

  // Show location fallback if needed
  if (showLocationFallback) {
    return (
      <div className="qibla-fallback-wrapper">
        <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '20px' }}>
          🧭 Направление Киблы
        </h2>
        <LocationFallback 
          onLocationSelected={handleLocationSelected}
          onRetryGeolocation={retryGeolocation}
        />
      </div>
    );
  }

  return (
    <div className="qibla-finder-container">
      <div className="qibla-header">
        <h2>🧭 Направление Киблы</h2>
        {cityName && (
          <div className="location-info">
            <span className="city-name">📍 {cityName}</span>
            <button 
              className="change-location"
              onClick={() => setShowLocationFallback(true)}
            >
              Изменить город
            </button>
          </div>
        )}
      </div>
      
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Определение направления Киблы...</p>
        </div>
      )}
      
      {error && !loading && (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <div className="error-actions">
            {permissionStatus !== 'granted' && (
              <button 
                className="permission-button"
                onClick={handlePermissionRequest}
              >
                🧭 Разрешить доступ к компасу
              </button>
            )}
            <button 
              className="select-city-button"
              onClick={() => setShowLocationFallback(true)}
            >
              🌍 Выбрать другой город
            </button>
          </div>
        </div>
      )}
      
      {!loading && !error && qiblaDirection !== null && (
        <div className="compass-container">
          {permissionStatus !== 'granted' && (
            <div className="permission-request">
              <p>Для работы компаса необходимо разрешение на использование датчиков устройства.</p>
              <button 
                className="permission-button"
                onClick={handlePermissionRequest}
              >
                🧭 Включить компас
              </button>
            </div>
          )}
          
          <div className="qibla-info-cards">
            <div className="info-card">
              <div className="info-label">Направление Киблы</div>
              <div className="info-value">{Math.round(qiblaDirection)}°</div>
              <div className="info-subtitle">от севера</div>
            </div>
            
            <div className="info-card">
              <div className="info-label">Текущее направление</div>
              <div className="info-value">{Math.round(currentDirection)}°</div>
              <div className="info-subtitle">
                {compassCalibrated ? '✅ Компас активен' : '⚠️ Компас не активен'}
              </div>
            </div>
            
            <div className="info-card">
              <div className="info-label">Разница</div>
              <div className="info-value">{Math.round(Math.abs(qiblaPointerRotation))}°</div>
              <div className="info-subtitle">
                {Math.abs(qiblaPointerRotation) < 10 ? '🎯 Точно!' : '↻ Поворачивайте'}
              </div>
            </div>
          </div>
          
          <div 
            className="compass" 
            ref={compassRef}
            style={{ 
              transform: `rotate(${compassRotation}deg)`,
              opacity: compassCalibrated ? 1 : 0.5
            }}
          >
            <div className="compass-face">
              <div className="compass-marking north">N</div>
              <div className="compass-marking east">E</div>
              <div className="compass-marking south">S</div>
              <div className="compass-marking west">W</div>
              
              {/* Compass ticks */}
              {[...Array(12)].map((_, i) => (
                <div 
                  key={i} 
                  className="compass-tick"
                  style={{ 
                    transform: `rotate(${i * 30}deg) translateY(-110px)`,
                    height: i % 3 === 0 ? '20px' : '10px'
                  }}
                />
              ))}
              
              <div 
                className="qibla-pointer"
                style={{ 
                  transform: `rotate(${qiblaPointerRotation}deg)`,
                  filter: Math.abs(qiblaPointerRotation) < 10 ? 'brightness(1.2) drop-shadow(0 0 10px #16a085)' : 'none'
                }}
              >
                <div className="kaaba-icon">🕋</div>
                <div className="qibla-line"></div>
              </div>
              
              {/* Center point */}
              <div className="compass-center"></div>
            </div>
          </div>
          
          <div className="instructions">
            <div className="instruction-card primary">
              <h4>🎯 Как пользоваться</h4>
              <p>Поворачивайте устройство до тех пор, пока 🕋 не будет указывать вверх. Тогда вы будете смотреть в направлении Киблы.</p>
            </div>
            
            <div className="instruction-card secondary">
              <h4>📱 Советы</h4>
              <ul>
                <li>Держите телефон горизонтально</li>
                <li>Убедитесь что поблизости нет металлических предметов</li>
                <li>Калибруйте компас движением в виде восьмерки</li>
                <li>Для точности проверьте направление по нескольким источникам</li>
              </ul>
            </div>
            
            {!compassCalibrated && (
              <div className="instruction-card warning">
                <h4>⚠️ Компас не активен</h4>
                <p>Разрешите доступ к датчикам устройства для работы компаса. На iPhone это может потребовать разрешения в настройках Safari.</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      <style jsx>{`
        .qibla-fallback-wrapper {
          padding: 20px;
        }
        
        .qibla-finder-container {
          padding: 20px;
          max-width: 600px;
          margin: 0 auto;
          background-color: white;
          border-radius: 15px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        
        .qibla-header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #ecf0f1;
        }
        
        .qibla-header h2 {
          color: #2c3e50;
          margin-bottom: 15px;
        }
        
        .location-info {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 15px;
          flex-wrap: wrap;
        }
        
        .city-name {
          background-color: #e8f6f3;
          color: #16a085;
          padding: 8px 15px;
          border-radius: 20px;
          font-weight: bold;
        }
        
        .change-location {
          background-color: #f39c12;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 15px;
          cursor: pointer;
          font-size: 12px;
          transition: background-color 0.3s;
        }
        
        .change-location:hover {
          background-color: #e67e22;
        }
        
        .loading-container {
          text-align: center;
          padding: 40px;
        }
        
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #16a085;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .error-container {
          background-color: #fadbd8;
          padding: 20px;
          border-radius: 10px;
          margin: 20px 0;
          text-align: center;
        }
        
        .error-message {
          color: #e74c3c;
          margin-bottom: 15px;
          font-weight: 500;
        }
        
        .error-actions {
          display: flex;
          gap: 10px;
          justify-content: center;
          flex-wrap: wrap;
        }
        
        .permission-button, .select-city-button {
          background-color: #16a085;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.3s;
        }
        
        .permission-button:hover, .select-city-button:hover {
          background-color: #1abc9c;
        }
        
        .select-city-button {
          background-color: #f39c12;
        }
        
        .select-city-button:hover {
          background-color: #e67e22;
        }
        
        .permission-request {
          background-color: #fff3cd;
          padding: 20px;
          border-radius: 10px;
          margin: 20px 0;
          border: 1px solid #ffeaa7;
          text-align: center;
        }
        
        .qibla-info-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
          margin-bottom: 30px;
        }
        
        .info-card {
          background-color: #f8f9fa;
          padding: 15px;
          border-radius: 10px;
          text-align: center;
          border: 2px solid transparent;
          transition: all 0.3s;
        }
        
        .info-card:hover {
          border-color: #16a085;
          transform: translateY(-2px);
        }
        
        .info-label {
          font-size: 12px;
          color: #7f8c8d;
          text-transform: uppercase;
          margin-bottom: 5px;
        }
        
        .info-value {
          font-size: 24px;
          font-weight: bold;
          color: #2c3e50;
          margin-bottom: 5px;
        }
        
        .info-subtitle {
          font-size: 11px;
          color: #95a5a6;
        }
        
        .compass-container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .compass {
          width: 280px;
          height: 280px;
          position: relative;
          transition: transform 0.2s ease-out, opacity 0.3s;
          margin: 20px 0;
        }
        
        .compass-face {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: linear-gradient(145deg, #ffffff, #f0f0f0);
          border: 3px solid #16a085;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 
            0 8px 16px rgba(0, 0, 0, 0.1),
            inset 0 2px 4px rgba(255, 255, 255, 0.8),
            inset 0 -2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .compass-marking {
          position: absolute;
          font-weight: bold;
          color: #2c3e50;
          font-size: 20px;
          z-index: 3;
        }
        
        .north { 
          top: 15px; 
          color: #e74c3c;
          font-size: 24px;
          font-weight: 900;
        }
        .east { right: 15px; }
        .south { bottom: 15px; }
        .west { left: 15px; }
        
        .compass-tick {
          position: absolute;
          width: 2px;
          background-color: #7f8c8d;
          top: 50%;
          left: 50%;
          transform-origin: 0 0;
          z-index: 2;
        }
        
        .qibla-pointer {
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          z-index: 4;
          transition: filter 0.3s;
        }
        
        .kaaba-icon {
          position: absolute;
          top: 20px;
          font-size: 32px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
          z-index: 5;
        }
        
        .qibla-line {
          position: absolute;
          top: 50px;
          width: 4px;
          height: 60px;
          background: linear-gradient(to bottom, #16a085, transparent);
          border-radius: 2px;
          box-shadow: 0 0 10px rgba(22, 160, 133, 0.5);
        }
        
        .compass-center {
          position: absolute;
          width: 12px;
          height: 12px;
          background-color: #16a085;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 6;
          box-shadow: 0 0 8px rgba(22, 160, 133, 0.6);
        }
        
        .instructions {
          width: 100%;
          margin-top: 30px;
        }
        
        .instruction-card {
          background-color: #f8f9fa;
          padding: 15px;
          border-radius: 10px;
          margin-bottom: 15px;
          border-left: 4px solid #16a085;
        }
        
        .instruction-card.primary {
          background-color: #e8f6f3;
          border-left-color: #16a085;
        }
        
        .instruction-card.secondary {
          background-color: #f4f4f4;
          border-left-color: #7f8c8d;
        }
        
        .instruction-card.warning {
          background-color: #fff3cd;
          border-left-color: #f39c12;
        }
        
        .instruction-card h4 {
          margin: 0 0 10px 0;
          color: #2c3e50;
          font-size: 16px;
        }
        
        .instruction-card p {
          margin: 0;
          color: #555;
          line-height: 1.4;
        }
        
        .instruction-card ul {
          margin: 0;
          padding-left: 20px;
          color: #555;
        }
        
        .instruction-card li {
          margin-bottom: 5px;
        }
        
        @media (max-width: 768px) {
          .qibla-finder-container {
            padding: 15px;
            margin: 10px;
          }
          
          .compass {
            width: 250px;
            height: 250px;
          }
          
          .qibla-info-cards {
            grid-template-columns: 1fr;
          }
          
          .location-info {
            flex-direction: column;
          }
        }
        
        @media (max-width: 480px) {
          .compass {
            width: 220px;
            height: 220px;
          }
          
          .kaaba-icon {
            font-size: 28px;
          }
        }
      `}</style>
    </div>
  );
};

export default QiblaFinder;