import React, { useState } from 'react';

const LocationFallback = ({ 
  onLocationSelected, 
  onRetryGeolocation, 
  title = "🗺️ Выберите ваше местоположение",
  description = "Для корректной работы приложения нужно знать ваше местоположение"
}) => {
  const [selectedCity, setSelectedCity] = useState('');
  const [customLat, setCustomLat] = useState('');
  const [customLng, setCustomLng] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  // Популярные города Казахстана
  const kazakhstanCities = [
    { name: 'Алматы', lat: 43.2220, lng: 76.8512 },
    { name: 'Астана (Нур-Султан)', lat: 51.1694, lng: 71.4491 },
    { name: 'Усть-Каменогорск', lat: 49.9489, lng: 82.6142 },
    { name: 'Шымкент', lat: 42.3000, lng: 69.5997 },
    { name: 'Караганда', lat: 49.8047, lng: 73.1094 },
    { name: 'Актобе', lat: 50.2839, lng: 57.1670 },
    { name: 'Тараз', lat: 42.9000, lng: 71.3667 },
    { name: 'Павлодар', lat: 52.2873, lng: 76.9674 },
    { name: 'Семей', lat: 50.4111, lng: 80.2275 },
    { name: 'Атырау', lat: 47.1164, lng: 51.8724 },
    { name: 'Костанай', lat: 53.2141, lng: 63.6246 },
    { name: 'Кызылорда', lat: 44.8479, lng: 65.5093 },
    { name: 'Уральск', lat: 51.2167, lng: 51.3667 },
    { name: 'Петропавловск', lat: 54.8667, lng: 69.1500 },
    { name: 'Актау', lat: 43.6481, lng: 51.1801 },
    { name: 'Кокшетау', lat: 53.2833, lng: 69.3833 },
    { name: 'Талдыкорган', lat: 45.0167, lng: 78.3833 },
    { name: 'Экибастуз', lat: 51.7333, lng: 75.3167 },
  ];

  // Другие крупные города мира для мусульман
  const worldCities = [
    { name: 'Мекка 🕋', lat: 21.4225, lng: 39.8262 },
    { name: 'Медина 🕌', lat: 24.4686, lng: 39.6142 },
    { name: 'Москва 🇷🇺', lat: 55.7558, lng: 37.6173 },
    { name: 'Стамбул 🇹🇷', lat: 41.0082, lng: 28.9784 },
    { name: 'Ташкент 🇺🇿', lat: 41.2995, lng: 69.2401 },
    { name: 'Бишкек 🇰🇬', lat: 42.8746, lng: 74.5698 },
    { name: 'Душанбе 🇹🇯', lat: 38.5598, lng: 68.7870 },
    { name: 'Ашхабад 🇹🇲', lat: 37.9601, lng: 58.3261 },
    { name: 'Баку 🇦🇿', lat: 40.4093, lng: 49.8671 },
    { name: 'Тегеран 🇮🇷', lat: 35.6892, lng: 51.3890 },
    { name: 'Лондон 🇬🇧', lat: 51.5074, lng: -0.1278 },
    { name: 'Нью-Йорк 🇺🇸', lat: 40.7128, lng: -74.0060 },
  ];

  // Российские города
  const russianCities = [
    { name: 'Москва', lat: 55.7558, lng: 37.6173 },
    { name: 'Санкт-Петербург', lat: 59.9311, lng: 30.3609 },
    { name: 'Казань', lat: 55.8304, lng: 49.0661 },
    { name: 'Екатеринбург', lat: 56.8431, lng: 60.6454 },
    { name: 'Новосибирск', lat: 55.0084, lng: 82.9357 },
    { name: 'Челябинск', lat: 55.1644, lng: 61.4368 },
    { name: 'Омск', lat: 54.9885, lng: 73.3242 },
    { name: 'Ростов-на-Дону', lat: 47.2357, lng: 39.7015 },
  ];

  const handleCitySelect = (city) => {
    setSelectedCity(city.name);
    onLocationSelected(city.lat, city.lng, city.name);
  };

  const handleCustomLocation = () => {
    const lat = parseFloat(customLat);
    const lng = parseFloat(customLng);
    
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      alert('Пожалуйста, введите корректные координаты:\nШирота: от -90 до 90\nДолгота: от -180 до 180');
      return;
    }
    
    onLocationSelected(lat, lng, `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert('Геолокация не поддерживается вашим браузером');
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 12000,
      maximumAge: 0
    };

    const loadingEl = document.querySelector('.auto-detect-section .detect-button');
    if (loadingEl) {
      loadingEl.textContent = '📍 Определяем...';
      loadingEl.disabled = true;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onLocationSelected(latitude, longitude, 'Ваше местоположение');
      },
      (error) => {
        if (loadingEl) {
          loadingEl.textContent = '🎯 Определить автоматически';
          loadingEl.disabled = false;
        }
        
        let errorMessage = 'Ошибка получения местоположения:\n\n';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += '❌ Доступ запрещен\n\nРазрешите доступ к местоположению:\n• Safari: Настройки → Конфиденциальность → Местоположение\n• Chrome: Настройки → Конфиденциальность → Местоположение';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += '❌ Местоположение недоступно\n\nУбедитесь что:\n• GPS включен на устройстве\n• Есть подключение к интернету\n• Вы находитесь не в помещении';
            break;
          case error.TIMEOUT:
            errorMessage += '⏱️ Время ожидания истекло\n\nПопробуйте:\n• Перезагрузить страницу\n• Выйти на открытое место\n• Проверить интернет соединение';
            break;
          default:
            errorMessage += '❓ Неизвестная ошибка\n\nПопробуйте выбрать город вручную';
            break;
        }
        alert(errorMessage);
      },
      options
    );
  };

  return (
    <div className="location-fallback">
      <div className="fallback-header">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      <div className="location-options">
        {/* Кнопка автоопределения */}
        <div className="auto-detect-section">
          <button className="detect-button" onClick={detectLocation}>
            🎯 Определить автоматически
          </button>
          <p className="hint">Разрешите доступ к местоположению в браузере</p>
        </div>

        <div className="divider">или выберите город</div>

        {/* Казахстан */}
        <div className="cities-section">
          <h3>🇰🇿 Казахстан</h3>
          <div className="cities-grid">
            {kazakhstanCities.map((city) => (
              <button
                key={city.name}
                className={`city-button ${selectedCity === city.name ? 'selected' : ''}`}
                onClick={() => handleCitySelect(city)}
              >
                {city.name}
              </button>
            ))}
          </div>
        </div>

        {/* Россия */}
        <div className="cities-section">
          <h3>🇷🇺 Россия</h3>
          <div className="cities-grid">
            {russianCities.map((city) => (
              <button
                key={city.name}
                className={`city-button ${selectedCity === city.name ? 'selected' : ''}`}
                onClick={() => handleCitySelect(city)}
              >
                {city.name}
              </button>
            ))}
          </div>
        </div>

        {/* Другие страны */}
        <div className="cities-section">
          <h3>🌍 Другие города</h3>
          <div className="cities-grid">
            {worldCities.map((city) => (
              <button
                key={city.name}
                className={`city-button ${selectedCity === city.name ? 'selected' : ''}`}
                onClick={() => handleCitySelect(city)}
              >
                {city.name}
              </button>
            ))}
          </div>
        </div>

        {/* Кастомные координаты */}
        <div className="custom-section">
          <button 
            className="custom-toggle"
            onClick={() => setShowCustom(!showCustom)}
          >
            📍 Ввести координаты вручную
          </button>
          
          {showCustom && (
            <div className="custom-coordinates">
              <div className="coord-inputs">
                <div className="input-group">
                  <label>Широта (-90 до 90):</label>
                  <input
                    type="number"
                    step="any"
                    min="-90"
                    max="90"
                    placeholder="43.2220"
                    value={customLat}
                    onChange={(e) => setCustomLat(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label>Долгота (-180 до 180):</label>
                  <input
                    type="number"
                    step="any"
                    min="-180"
                    max="180"
                    placeholder="76.8512"
                    value={customLng}
                    onChange={(e) => setCustomLng(e.target.value)}
                  />
                </div>
              </div>
              <button className="apply-custom" onClick={handleCustomLocation}>
                Применить координаты
              </button>
              <div className="coord-help">
                <p className="coord-hint">
                  💡 Найти координаты можно на Google Maps или Яндекс.Картах
                </p>
                <div className="coord-examples">
                  <strong>Примеры:</strong>
                  <div className="example-coords">
                    <button onClick={() => { setCustomLat('49.9489'); setCustomLng('82.6142'); }}>
                      Усть-Каменогорск
                    </button>
                    <button onClick={() => { setCustomLat('43.2220'); setCustomLng('76.8512'); }}>
                      Алматы
                    </button>
                    <button onClick={() => { setCustomLat('51.1694'); setCustomLng('71.4491'); }}>
                      Астана
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .location-fallback {
          max-width: 900px;
          margin: 0 auto;
          padding: 30px;
          background-color: white;
          border-radius: 15px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .fallback-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .fallback-header h2 {
          color: #2c3e50;
          margin-bottom: 10px;
          font-size: 28px;
        }

        .fallback-header p {
          color: #7f8c8d;
          font-size: 16px;
          max-width: 500px;
          margin: 0 auto;
        }

        .auto-detect-section {
          text-align: center;
          margin-bottom: 30px;
          padding: 25px;
          background: linear-gradient(135deg, #e8f6f3, #d5f4ee);
          border-radius: 15px;
          border: 2px solid #16a085;
        }

        .detect-button {
          background: linear-gradient(135deg, #16a085, #1abc9c);
          color: white;
          border: none;
          padding: 18px 35px;
          font-size: 18px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s;
          margin-bottom: 12px;
          box-shadow: 0 4px 12px rgba(22, 160, 133, 0.3);
          font-weight: 600;
        }

        .detect-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(22, 160, 133, 0.4);
        }

        .detect-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .hint {
          font-size: 14px;
          color: #27ae60;
          margin: 0;
          font-weight: 500;
        }

        .divider {
          text-align: center;
          margin: 40px 0;
          color: #7f8c8d;
          position: relative;
          font-size: 16px;
          font-weight: 500;
        }

        .divider::before,
        .divider::after {
          content: '';
          position: absolute;
          top: 50%;
          width: 35%;
          height: 2px;
          background: linear-gradient(to right, transparent, #ecf0f1, transparent);
        }

        .divider::before {
          left: 0;
        }

        .divider::after {
          right: 0;
        }

        .cities-section {
          margin-bottom: 35px;
        }

        .cities-section h3 {
          color: #2c3e50;
          margin-bottom: 20px;
          padding: 12px 0;
          border-bottom: 3px solid #ecf0f1;
          font-size: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .cities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 12px;
        }

        .city-button {
          background: linear-gradient(135deg, #f8f9fa, #ffffff);
          border: 2px solid #ecf0f1;
          padding: 15px 20px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 15px;
          text-align: left;
          font-weight: 500;
          position: relative;
          overflow: hidden;
        }

        .city-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(22, 160, 133, 0.1), transparent);
          transition: left 0.5s;
        }

        .city-button:hover::before {
          left: 100%;
        }

        .city-button:hover {
          background: linear-gradient(135deg, #e8f6f3, #f0faf8);
          border-color: #16a085;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(22, 160, 133, 0.15);
        }

        .city-button.selected {
          background: linear-gradient(135deg, #16a085, #1abc9c);
          color: white;
          border-color: #16a085;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(22, 160, 133, 0.3);
        }

        .custom-section {
          border-top: 2px solid #ecf0f1;
          padding-top: 25px;
          margin-top: 20px;
        }

        .custom-toggle {
          background: linear-gradient(135deg, #f39c12, #e67e22);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.3s;
          font-weight: 600;
        }

        .custom-toggle:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(243, 156, 18, 0.3);
        }

        .custom-coordinates {
          margin-top: 20px;
          padding: 25px;
          background: linear-gradient(135deg, #fdf6e3, #fcf4dc);
          border-radius: 12px;
          border: 2px solid #f39c12;
        }

        .coord-inputs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
        }

        .input-group label {
          margin-bottom: 8px;
          font-weight: 600;
          color: #2c3e50;
          font-size: 14px;
        }

        .input-group input {
          padding: 12px 15px;
          border: 2px solid #ddd;
          border-radius: 8px;
          font-size: 16px;
          transition: all 0.3s;
        }

        .input-group input:focus {
          outline: none;
          border-color: #f39c12;
          box-shadow: 0 0 0 3px rgba(243, 156, 18, 0.1);
        }

        .apply-custom {
          background: linear-gradient(135deg, #f39c12, #e67e22);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          margin-bottom: 15px;
          font-weight: 600;
          transition: all 0.3s;
        }

        .apply-custom:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(243, 156, 18, 0.3);
        }

        .coord-help {
          border-top: 1px solid rgba(243, 156, 18, 0.3);
          padding-top: 15px;
        }

        .coord-hint {
          font-size: 13px;
          color: #8b7355;
          margin: 0 0 15px 0;
        }

        .coord-examples strong {
          color: #8b7355;
          font-size: 14px;
        }

        .example-coords {
          display: flex;
          gap: 10px;
          margin-top: 8px;
          flex-wrap: wrap;
        }

        .example-coords button {
          background-color: rgba(243, 156, 18, 0.1);
          border: 1px solid rgba(243, 156, 18, 0.3);
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          color: #8b7355;
          transition: all 0.3s;
        }

        .example-coords button:hover {
          background-color: rgba(243, 156, 18, 0.2);
          border-color: #f39c12;
        }

        @media (max-width: 768px) {
          .location-fallback {
            padding: 20px;
            margin: 10px;
          }

          .cities-grid {
            grid-template-columns: 1fr;
          }

          .coord-inputs {
            grid-template-columns: 1fr;
          }

          .detect-button {
            font-size: 16px;
            padding: 15px 30px;
          }

          .example-coords {
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .fallback-header h2 {
            font-size: 24px;
          }

          .cities-section h3 {
            font-size: 18px;
          }

          .auto-detect-section {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default LocationFallback;