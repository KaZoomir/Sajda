import { useEffect, useState, useRef } from "react";

const QiblaFinder = () => {
  const [qiblaDirection, setQiblaDirection] = useState(null);
  const [currentDirection, setCurrentDirection] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const compassRef = useRef(null);

  useEffect(() => {
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

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const qiblaAngle = calculateQibla(latitude, longitude);
          setQiblaDirection(qiblaAngle);
          setLoading(false);
          
          // Set up device orientation for compass
          if (window.DeviceOrientationEvent) {
            window.addEventListener("deviceorientation", handleOrientation);
          } else {
            setError("Ваше устройство не поддерживает компас.");
            setLoading(false);
          }
        },
        () => {
          setError("Для определения направления Киблы необходим доступ к местоположению.");
          setLoading(false);
        }
      );
    } else {
      setError("Геолокация не поддерживается в вашем браузере.");
      setLoading(false);
    }

    // Clean up
    return () => {
      if (window.DeviceOrientationEvent) {
        window.removeEventListener("deviceorientation", handleOrientation);
      }
    };
  }, []);

  // Handle device orientation changes
  const handleOrientation = (event) => {
    // For iOS devices
    if (event.webkitCompassHeading) {
      setCurrentDirection(event.webkitCompassHeading);
    } 
    // For Android devices
    else if (event.alpha) {
      setCurrentDirection(360 - event.alpha);
    }
  };

  // Calculate the rotation for the compass
  const compassRotation = currentDirection;
  // Calculate the rotation for the Qibla pointer
  const qiblaPointerRotation = qiblaDirection ? qiblaDirection - currentDirection : 0;

  return (
    <div className="qibla-finder-container">
      <h2>Направление Киблы</h2>
      
      {loading && <p>Определение направления Киблы...</p>}
      
      {error && <p className="error-message">{error}</p>}
      
      {!loading && !error && qiblaDirection !== null && (
        <div className="compass-container">
          <div 
            className="compass" 
            ref={compassRef}
            style={{ transform: `rotate(${compassRotation}deg)` }}
          >
            <div className="compass-face">
              <div className="compass-marking north">N</div>
              <div className="compass-marking east">E</div>
              <div className="compass-marking south">S</div>
              <div className="compass-marking west">W</div>
              
              <div 
                className="qibla-pointer"
                style={{ transform: `rotate(${qiblaPointerRotation}deg)` }}
              >
                <div className="kaaba-icon">🕋</div>
              </div>
            </div>
          </div>
          
          <div className="instructions">
            <p>Поверните устройство, чтобы найти направление Киблы.</p>
            <p>Кибла находится на <strong>{Math.round(qiblaDirection)}°</strong> от севера.</p>
            <p>Когда 🕋 указывает вверх, вы смотрите в направлении Киблы.</p>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .qibla-finder-container {
          padding: 20px;
          max-width: 500px;
          margin: 0 auto;
          background-color: #f8f9fa;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          text-align: center;
        }
        
        h2 {
          color: #2c3e50;
          margin-bottom: 20px;
        }
        
        .compass-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 20px;
        }
        
        .compass {
          width: 250px;
          height: 250px;
          position: relative;
          transition: transform 0.2s ease-out;
        }
        
        .compass-face {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: white;
          border: 2px solid #3498db;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        
        .compass-marking {
          position: absolute;
          font-weight: bold;
          color: #2c3e50;
        }
        
        .north { top: 10px; }
        .east { right: 10px; }
        .south { bottom: 10px; }
        .west { left: 10px; }
        
        .qibla-pointer {
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
        }
        
        .kaaba-icon {
          position: absolute;
          top: 10px;
          font-size: 24px;
        }
        
        .instructions {
          margin-top: 20px;
          background-color: white;
          padding: 15px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .error-message {
          color: #e74c3c;
          text-align: center;
          padding: 10px;
          background-color: #fadbd8;
          border-radius: 5px;
        }
      `}</style>
    </div>
  );
};

export default QiblaFinder;
