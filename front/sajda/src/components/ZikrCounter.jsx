import React, { useState, useEffect } from 'react';

const ZikrCounter = () => {
  // State for tracking zikr counts
  const [counts, setCounts] = useState({
    subhanAllah: 0,
    alhamdulillah: 0,
    allahuAkbar: 0,
    lailahaillallah: 0,
    istighfar: 0,
    salawat: 0,
  });
  
  // State for tracking which zikr is currently active
  const [activeZikr, setActiveZikr] = useState('subhanAllah');
  
  // State for total count
  const [totalCount, setTotalCount] = useState(0);
  
  // State for daily stats
  const [dailyStats, setDailyStats] = useState({
    today: 0,
    week: 0,
    month: 0,
    total: 0
  });
  
  // List of zikr types with translations
  const zikrTypes = [
    { id: 'subhanAllah', name: 'Субхан Аллах', arabic: 'سُبْحَانَ ٱللَّٰهِ', translation: 'Пречист Аллах' },
    { id: 'alhamdulillah', name: 'Альхамдулиллях', arabic: 'ٱلْحَمْدُ لِلَّٰهِ', translation: 'Хвала Аллаху' },
    { id: 'allahuAkbar', name: 'Аллаху Акбар', arabic: 'ٱللَّٰهُ أَكْبَرُ', translation: 'Аллах Велик' },
    { id: 'lailahaillallah', name: 'Ля иляха илляЛлах', arabic: 'لَا إِلَٰهَ إِلَّا ٱللَّٰهُ', translation: 'Нет божества, кроме Аллаха' },
    { id: 'istighfar', name: 'Астагфируллах', arabic: 'أَسْتَغْفِرُ ٱللَّٰهَ', translation: 'Я прошу прощения у Аллаха' },
    { id: 'salawat', name: 'Салават', arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ', translation: 'О Аллах, благослови Мухаммада' },
  ];

  // Load saved counts from localStorage on component mount
  useEffect(() => {
    const savedCounts = localStorage.getItem('zikrCounts');
    const savedStats = localStorage.getItem('zikrStats');
    
    if (savedCounts) {
      setCounts(JSON.parse(savedCounts));
    }
    
    if (savedStats) {
      setDailyStats(JSON.parse(savedStats));
    } else {
      // Initialize stats if not present
      const initialStats = {
        today: 0,
        week: 0,
        month: 0,
        total: 0
      };
      setDailyStats(initialStats);
      localStorage.setItem('zikrStats', JSON.stringify(initialStats));
    }
  }, []);

  // Save counts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('zikrCounts', JSON.stringify(counts));
    
    // Calculate total count from all zikr types
    const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
    setTotalCount(total);
    
    // Update daily stats
    const updatedStats = {
      ...dailyStats,
      today: total, // Simplified for example (in real app, need date tracking)
      total: total
    };
    setDailyStats(updatedStats);
    localStorage.setItem('zikrStats', JSON.stringify(updatedStats));
  }, [counts]);

  // Handle zikr counter increment
  const incrementZikr = () => {
    setCounts(prevCounts => {
      // Create a new object with the updated count
      const newCounts = {
        ...prevCounts,
        [activeZikr]: (prevCounts[activeZikr] + 1) % 31 // Reset after 41 (0-41 = 42 values)
      };
      return newCounts;
    });
  };

  // Reset the counter for active zikr
  const resetCounter = () => {
    setCounts(prevCounts => ({
      ...prevCounts,
      [activeZikr]: 0
    }));
  };

  // Reset all counters
  const resetAllCounters = () => {
    const resetCounts = {};
    Object.keys(counts).forEach(key => {
      resetCounts[key] = 0;
    });
    setCounts(resetCounts);
  };

  // Get current zikr information
  const currentZikr = zikrTypes.find(zikr => zikr.id === activeZikr);
  
  // Calculate progress for the circular progress indicator (0-41)
  const circleProgress = counts[activeZikr] / 31 * 100;
  
  // Calculate the coordinates for the progress circle
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  // Adjust the calculation to start from the top (90 degrees)
  const strokeDashoffset = circumference - (circleProgress / 100) * circumference;
  
  // Add CSS to rotate the SVG to start from the top
  useEffect(() => {
    const progressRing = document.querySelector('.progress-ring-circle');
    if (progressRing) {
      progressRing.style.transform = 'rotate(-90deg)';
      progressRing.style.transformOrigin = 'center';
    }
  }, []);

  return (
    <div className="zikr-counter-container">
      <div className="zikr-header">
        <h1>Счетчик Зикра</h1>
        <div className="stats-overview">
          <div className="stat-item">
            <div className="stat-value">{dailyStats.today}</div>
            <div className="stat-label">Сегодня</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{dailyStats.week}</div>
            <div className="stat-label">Неделя</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{dailyStats.month}</div>
            <div className="stat-label">Месяц</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{dailyStats.total}</div>
            <div className="stat-label">Всего</div>
          </div>
        </div>
      </div>
      
      <div className="zikr-content">
        <div className="zikr-selector">
          <h3>Выберите Зикр</h3>
          <div className="zikr-buttons">
            {zikrTypes.map(zikr => (
              <button 
                key={zikr.id}
                className={`zikr-button ${activeZikr === zikr.id ? 'active' : ''}`}
                onClick={() => setActiveZikr(zikr.id)}
              >
                {zikr.name}
                <span className="zikr-count-badge">{counts[zikr.id]}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="zikr-counter">
          <div className="zikr-display">
            <div className="zikr-info">
              <div className="zikr-arabic">{currentZikr.arabic}</div>
              <div className="zikr-name">{currentZikr.name}</div>
              <div className="zikr-translation">{currentZikr.translation}</div>
            </div>
            
            <div className="zikr-progress">
              <svg className="progress-ring" width="300" height="300">
                {/* Background circle */}
                <circle
                  className="progress-ring-circle-bg"
                  stroke="#e6e6e6"
                  strokeWidth="10"
                  fill="transparent"
                  r={radius}
                  cx="150"
                  cy="150"
                />
                {/* Progress circle - fixed to start from 90 degrees (top) */}
                <circle
                  className="progress-ring-circle"
                  stroke="#16a085"
                  strokeWidth="10"
                  fill="transparent"
                  r={radius}
                  cx="150"
                  cy="150"
                  style={{
                    strokeDasharray: `${circumference} ${circumference}`,
                    strokeDashoffset: strokeDashoffset
                  }}
                />
                {/* Counter text */}
                <text x="150" y="150" textAnchor="middle" alignmentBaseline="middle" 
                      fontSize="50" fontWeight="bold" fill="#2c3e50">
                  {counts[activeZikr]}
                </text>
                {/* Max count text */}
                <text x="150" y="190" textAnchor="middle" alignmentBaseline="middle" 
                      fontSize="18" fill="#7f8c8d">
                  из 31
                </text>
              </svg>
              
              <button className="counter-button" onClick={incrementZikr}>
                Нажмите для подсчета
              </button>
            </div>
          </div>
          
          <div className="zikr-controls">
            <button className="reset-button" onClick={resetCounter}>
              Сбросить текущий зикр
            </button>
            <button className="reset-all-button" onClick={resetAllCounters}>
              Сбросить все счетчики
            </button>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .zikr-counter-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 30px;
          color: #333;
        }
        
        .zikr-header {
          background-color: #2c3e50;
          color: white;
          padding: 20px 30px;
          border-radius: 10px 10px 0 0;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        
        .zikr-header h1 {
          margin: 0 0 20px 0;
          color: white;
        }
        
        .stats-overview {
          display: flex;
          justify-content: space-between;
          background-color: rgba(255, 255, 255, 0.1);
          padding: 15px;
          border-radius: 8px;
        }
        
        .stat-item {
          text-align: center;
          flex: 1;
        }
        
        .stat-value {
          font-size: 24px;
          font-weight: bold;
        }
        
        .stat-label {
          font-size: 14px;
          opacity: 0.8;
        }
        
        .zikr-content {
          background-color: white;
          border-radius: 0 0 10px 10px;
          padding: 30px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-wrap: wrap;
          gap: 30px;
        }
        
        .zikr-selector {
          flex: 1;
          min-width: 300px;
        }
        
        .zikr-selector h3 {
          margin: 0 0 15px 0;
          color: #2c3e50;
        }
        
        .zikr-buttons {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .zikr-button {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background-color: #f8f9fa;
          border: none;
          border-radius: 8px;
          text-align: left;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .zikr-button:hover {
          background-color: #e9ecef;
        }
        
        .zikr-button.active {
          background-color: #16a085;
          color: white;
        }
        
        .zikr-count-badge {
          background-color: rgba(0, 0, 0, 0.1);
          border-radius: 15px;
          padding: 3px 10px;
          font-size: 14px;
        }
        
        .zikr-button.active .zikr-count-badge {
          background-color: rgba(255, 255, 255, 0.2);
        }
        
        .zikr-counter {
          flex: 2;
          min-width: 400px;
        }
        
        .zikr-display {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 30px;
        }
        
        .zikr-info {
          text-align: center;
        }
        
        .zikr-arabic {
          font-size: 36px;
          margin-bottom: 10px;
          font-family: 'Traditional Arabic', 'Scheherazade', serif;
        }
        
        .zikr-name {
          font-size: 24px;
          font-weight: bold;
          color: #2c3e50;
          margin-bottom: 5px;
        }
        
        .zikr-translation {
          font-size: 16px;
          color: #7f8c8d;
        }
        
        .zikr-progress {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }
        
        .progress-ring {
          /* Removed the rotation from here */
        }
        
        .progress-ring-circle-bg {
          opacity: 0.2;
        }
        
        .progress-ring-circle {
          transition: stroke-dashoffset 0.3s;
          transform: rotate(-90deg);
          transform-origin: center;
        }
        
        .counter-button {
          background-color: #16a085;
          color: white;
          padding: 15px 30px;
          font-size: 18px;
          border: none;
          border-radius: 30px;
          cursor: pointer;
          transition: background-color 0.3s;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .counter-button:hover {
          background-color: #1abc9c;
        }
        
        .counter-button:active {
          transform: scale(0.98);
        }
        
        .zikr-controls {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-top: 30px;
        }
        
        .reset-button, .reset-all-button {
          padding: 8px 15px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .reset-button {
          background-color: #f8f9fa;
          color: #333;
        }
        
        .reset-button:hover {
          background-color: #e9ecef;
        }
        
        .reset-all-button {
          background-color: #e74c3c;
          color: white;
        }
        
        .reset-all-button:hover {
          background-color: #c0392b;
        }
        
        @media (max-width: 992px) {
          .zikr-content {
            flex-direction: column;
          }
          
          .zikr-counter, .zikr-selector {
            min-width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default ZikrCounter;