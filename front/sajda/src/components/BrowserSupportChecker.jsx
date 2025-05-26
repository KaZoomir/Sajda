import React, { useState, useEffect } from 'react';

const BrowserSupportChecker = ({ children }) => {
  const [browserSupport, setBrowserSupport] = useState({
    geolocation: false,
    deviceOrientation: false,
    localStorage: false,
    fetch: false,
    isSupported: false
  });
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    checkBrowserSupport();
  }, []);

  const checkBrowserSupport = () => {
    const support = {
      geolocation: !!navigator.geolocation,
      deviceOrientation: 'DeviceOrientationEvent' in window,
      localStorage: typeof(Storage) !== "undefined",
      fetch: typeof fetch !== 'undefined',
    };

    support.isSupported = Object.values(support).every(Boolean);
    
    setBrowserSupport(support);
    setShowWarning(!support.isSupported);
  };

  const requestPermissions = async () => {
    const permissions = [];

    // Request geolocation
    if (browserSupport.geolocation) {
      try {
        await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 5000
          });
        });
        permissions.push('✅ Геолокация разрешена');
      } catch (error) {
        permissions.push('❌ Геолокация отклонена');
      }
    }

    // Request device orientation (iOS)
    if (browserSupport.deviceOrientation && typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission === 'granted') {
          permissions.push('✅ Ориентация устройства разрешена');
        } else {
          permissions.push('❌ Ориентация устройства отклонена');
        }
      } catch (error) {
        permissions.push('❌ Ошибка при запросе ориентации');
      }
    } else if (browserSupport.deviceOrientation) {
      permissions.push('✅ Ориентация устройства доступна');
    }

    alert('Статус разрешений:\n' + permissions.join('\n'));
  };

  const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  };

  const isAndroid = () => {
    return /Android/.test(navigator.userAgent);
  };

  const getBrowserInfo = () => {
    const isIos = isIOS();
    const isAndroidDevice = isAndroid();
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isChrome = /Chrome/.test(navigator.userAgent);

    return {
      platform: isIos ? 'iOS' : isAndroidDevice ? 'Android' : 'Desktop',
      browser: isSafari ? 'Safari' : isChrome ? 'Chrome' : 'Other',
      userAgent: navigator.userAgent
    };
  };

  if (showWarning) {
    const browserInfo = getBrowserInfo();
    
    return (
      <div className="browser-warning-container">
        <div className="browser-warning">
          <h2>⚠️ Ограниченная поддержка браузера</h2>
          
          <div className="browser-info">
            <p><strong>Платформа:</strong> {browserInfo.platform}</p>
            <p><strong>Браузер:</strong> {browserInfo.browser}</p>
          </div>

          <div className="support-status">
            <h3>Поддержка функций:</h3>
            <ul>
              <li className={browserSupport.geolocation ? 'supported' : 'not-supported'}>
                {browserSupport.geolocation ? '✅' : '❌'} Геолокация
              </li>
              <li className={browserSupport.deviceOrientation ? 'supported' : 'not-supported'}>
                {browserSupport.deviceOrientation ? '✅' : '❌'} Компас/Ориентация
              </li>
              <li className={browserSupport.localStorage ? 'supported' : 'not-supported'}>
                {browserSupport.localStorage ? '✅' : '❌'} Локальное хранилище
              </li>
              <li className={browserSupport.fetch ? 'supported' : 'not-supported'}>
                {browserSupport.fetch ? '✅' : '❌'} Fetch API
              </li>
            </ul>
          </div>

          <div className="recommendations">
            <h3>Рекомендации:</h3>
            {browserInfo.platform === 'Desktop' && (
              <div className="recommendation">
                <p>📱 <strong>Для лучшего опыта используйте мобильное устройство</strong></p>
                <p>Компас Киблы работает только на устройствах с датчиками ориентации.</p>
              </div>
            )}
            
            {browserInfo.platform === 'iOS' && (
              <div className="recommendation">
                <p>🍎 <strong>Пользователи iOS:</strong></p>
                <ul>
                  <li>Используйте Safari для лучшей совместимости</li>
                  <li>Разрешите доступ к местоположению</li>
                  <li>Разрешите доступ к датчикам движения</li>
                </ul>
              </div>
            )}

            {browserInfo.platform === 'Android' && (
              <div className="recommendation">
                <p>🤖 <strong>Пользователи Android:</strong></p>
                <ul>
                  <li>Используйте Chrome для лучшей совместимости</li>
                  <li>Разрешите доступ к местоположению</li>
                  <li>Убедитесь что GPS включен</li>
                </ul>
              </div>
            )}

            {!browserSupport.geolocation && (
              <div className="recommendation critical">
                <p>❌ <strong>Геолокация не поддерживается</strong></p>
                <p>Время намаза и компас Киблы не будут работать. Обновите браузер или используйте другой.</p>
              </div>
            )}
          </div>

          <div className="actions">
            <button 
              className="test-button"
              onClick={requestPermissions}
            >
              Проверить разрешения
            </button>
            
            <button 
              className="continue-button"
              onClick={() => setShowWarning(false)}
            >
              Продолжить все равно
            </button>
          </div>
        </div>

        <style jsx>{`
          .browser-warning-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #f8f9fa;
            padding: 20px;
          }

          .browser-warning {
            max-width: 600px;
            background-color: white;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            text-align: center;
          }

          .browser-warning h2 {
            color: #e67e22;
            margin-bottom: 20px;
          }

          .browser-info {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: left;
          }

          .support-status {
            margin: 20px 0;
            text-align: left;
          }

          .support-status ul {
            list-style: none;
            padding: 0;
          }

          .support-status li {
            padding: 8px 0;
            border-bottom: 1px solid #eee;
          }

          .support-status li:last-child {
            border-bottom: none;
          }

          .supported {
            color: #27ae60;
          }

          .not-supported {
            color: #e74c3c;
          }

          .recommendations {
            text-align: left;
            margin: 20px 0;
          }

          .recommendation {
            background-color: #e8f6f3;
            padding: 15px;
            border-radius: 8px;
            margin: 10px 0;
            border-left: 4px solid #16a085;
          }

          .recommendation.critical {
            background-color: #fadbd8;
            border-left-color: #e74c3c;
          }

          .recommendation ul {
            margin: 10px 0 0 20px;
          }

          .actions {
            display: flex;
            gap: 15px;
            justify-content: center;
            margin-top: 30px;
            flex-wrap: wrap;
          }

          .test-button, .continue-button {
            padding: 12px 24px;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.3s;
          }

          .test-button {
            background-color: #16a085;
            color: white;
          }

          .test-button:hover {
            background-color: #1abc9c;
          }

          .continue-button {
            background-color: #95a5a6;
            color: white;
          }

          .continue-button:hover {
            background-color: #7f8c8d;
          }

          @media (max-width: 768px) {
            .browser-warning {
              padding: 20px;
              margin: 10px;
            }

            .actions {
              flex-direction: column;
            }
          }
        `}</style>
      </div>
    );
  }

  return children;
};

export default BrowserSupportChecker;