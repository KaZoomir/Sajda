import React, { useState, useEffect } from 'react';

const QuranReader = () => {
  // State variables
  const [surahs, setSurahs] = useState([]);
  const [currentSurah, setCurrentSurah] = useState(1);
  const [currentAyahs, setCurrentAyahs] = useState([]);
  const [translations, setTranslations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTranslation, setShowTranslation] = useState(true);
  const [fontSize, setFontSize] = useState(20);
  const [translationId, setTranslationId] = useState('ru.kuliev'); // Default to Russian translation

  // Available translations
  const availableTranslations = [
    { id: 'ru.kuliev', name: 'Кулиев (Русский)' },
    { id: 'ru.osmanov', name: 'Османов (Русский)' },
    { id: 'ru.porokhova', name: 'Порохова (Русский)' },
    { id: 'ru.krachkovsky', name: 'Крачковский (Русский)' },
  ];

  // Fetch list of all surahs
  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const response = await fetch('https://api.alquran.cloud/v1/surah');
        if (!response.ok) {
          throw new Error('Failed to fetch Surah list');
        }
        const data = await response.json();
        setSurahs(data.data);
      } catch (err) {
        setError('Не удалось загрузить список сур. Пожалуйста, попробуйте позже.');
        console.error(err);
      }
    };

    fetchSurahs();
  }, []);

  // Fetch current surah in Arabic and the selected translation
  useEffect(() => {
    const fetchSurah = async () => {
      if (!currentSurah) return;
      
      setLoading(true);
      try {
        // Fetch Arabic text
        const arabicResponse = await fetch(`https://api.alquran.cloud/v1/surah/${currentSurah}`);
        if (!arabicResponse.ok) {
          throw new Error('Failed to fetch Surah in Arabic');
        }
        const arabicData = await arabicResponse.json();
        setCurrentAyahs(arabicData.data.ayahs);
        
        // Fetch translation
        const translationResponse = await fetch(`https://api.alquran.cloud/v1/surah/${currentSurah}/${translationId}`);
        if (!translationResponse.ok) {
          throw new Error('Failed to fetch Surah translation');
        }
        const translationData = await translationResponse.json();
        setTranslations(translationData.data.ayahs);
        
        setLoading(false);
      } catch (err) {
        setError('Не удалось загрузить суру. Пожалуйста, попробуйте позже.');
        setLoading(false);
        console.error(err);
      }
    };

    fetchSurah();
  }, [currentSurah, translationId]);

  // Handle surah change
  const handleSurahChange = (e) => {
    setCurrentSurah(Number(e.target.value));
  };

  // Handle translation toggle
  const toggleTranslation = () => {
    setShowTranslation(!showTranslation);
  };

  // Handle font size change
  const changeFontSize = (change) => {
    setFontSize(prevSize => Math.max(16, Math.min(32, prevSize + change)));
  };

  // Handle translation change
  const handleTranslationChange = (e) => {
    setTranslationId(e.target.value);
  };

  // Go to next surah
  const nextSurah = () => {
    if (currentSurah < 114) {
      setCurrentSurah(currentSurah + 1);
      window.scrollTo(0, 0);
    }
  };

  // Go to previous surah
  const prevSurah = () => {
    if (currentSurah > 1) {
      setCurrentSurah(currentSurah - 1);
      window.scrollTo(0, 0);
    }
  };

  // Get current surah details
  const currentSurahDetails = surahs.find(surah => surah.number === currentSurah);

  return (
    <div className="quran-reader-container">
      <div className="quran-header">
        <h1>Коран</h1>
        <div className="surah-selector">
          <label htmlFor="surah-select">Выберите суру:</label>
          <select 
            id="surah-select"
            value={currentSurah}
            onChange={handleSurahChange}
            className="surah-select"
          >
            {surahs.map(surah => (
              <option key={surah.number} value={surah.number}>
                {surah.number}. {surah.name} ({surah.englishName})
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="quran-controls">
        <div className="controls-group">
          <button 
            className="control-button"
            onClick={toggleTranslation}
          >
            {showTranslation ? 'Скрыть перевод' : 'Показать перевод'}
          </button>
          
          <div className="font-size-controls">
            <button 
              className="control-button font-button"
              onClick={() => changeFontSize(-2)}
            >
              A-
            </button>
            <button 
              className="control-button font-button"
              onClick={() => changeFontSize(2)}
            >
              A+
            </button>
          </div>
        </div>
        
        <div className="translation-selector">
          <label htmlFor="translation-select">Перевод:</label>
          <select 
            id="translation-select"
            value={translationId}
            onChange={handleTranslationChange}
            className="translation-select"
          >
            {availableTranslations.map(translation => (
              <option key={translation.id} value={translation.id}>
                {translation.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="loading">Загрузка суры...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="quran-content">
          {currentSurahDetails && (
            <div className="surah-header">
              <h2 className="surah-name">{currentSurahDetails.name}</h2>
              <h3 className="surah-name-english">{currentSurahDetails.englishName}</h3>
              <p className="surah-info">
                {currentSurahDetails.revelationType === 'Meccan' ? 'Мекканская' : 'Мединская'} сура • 
                {currentSurahDetails.numberOfAyahs} аятов
              </p>
              
              {currentSurah !== 9 && ( // Surah At-Tawbah (9) does not start with Bismillah
                <div className="bismillah">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </div>
              )}
            </div>
          )}
          
          <div className="ayahs-container">
            {currentAyahs.map((ayah, index) => (
              <div key={ayah.number} className="ayah-container">
                <div 
                  className="ayah-arabic"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {ayah.text}
                  <span className="ayah-number">{ayah.numberInSurah}</span>
                </div>
                
                {showTranslation && translations[index] && (
                  <div className="ayah-translation">
                    {translations[index].text}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="navigation-buttons">
            <button 
              className="nav-button prev-button"
              onClick={prevSurah}
              disabled={currentSurah === 1}
            >
              &larr; Предыдущая сура
            </button>
            
            <button 
              className="nav-button next-button"
              onClick={nextSurah}
              disabled={currentSurah === 114}
            >
              Следующая сура &rarr;
            </button>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .quran-reader-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 30px;
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .quran-header {
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
        }
        
        .quran-header h1 {
          color: #2c3e50;
          margin: 0;
        }
        
        .surah-selector {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .surah-select, .translation-select {
          padding: 8px 15px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
          min-width: 200px;
        }
        
        .quran-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          background-color: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          flex-wrap: wrap;
          gap: 15px;
        }
        
        .controls-group {
          display: flex;
          gap: 15px;
          align-items: center;
        }
        
        .control-button {
          padding: 8px 15px;
          background-color: #16a085;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .control-button:hover {
          background-color: #1abc9c;
        }
        
        .font-size-controls {
          display: flex;
          gap: 5px;
        }
        
        .font-button {
          padding: 8px 12px;
          font-weight: bold;
        }
        
        .translation-selector {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .loading {
          text-align: center;
          padding: 50px;
          font-size: 18px;
          color: #7f8c8d;
        }
        
        .error-message {
          text-align: center;
          padding: 20px;
          background-color: #fadbd8;
          border-radius: 5px;
          color: #e74c3c;
          margin: 20px 0;
        }
        
        .surah-header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
        }
        
        .surah-name {
          font-size: 36px;
          margin: 0;
          color: #2c3e50;
        }
        
        .surah-name-english {
          font-size: 20px;
          color: #7f8c8d;
          margin: 5px 0 10px;
        }
        
        .surah-info {
          color: #7f8c8d;
          margin: 0;
        }
        
        .bismillah {
          font-size: 28px;
          margin: 30px 0;
          text-align: center;
          color: #16a085;
          font-family: 'Traditional Arabic', 'Scheherazade', serif;
        }
        
        .ayahs-container {
          direction: rtl;
          margin-bottom: 30px;
        }
        
        .ayah-container {
          margin-bottom: 30px;
        }
        
        .ayah-arabic {
          line-height: 1.8;
          margin-bottom: 10px;
          font-family: 'Traditional Arabic', 'Scheherazade', serif;
        }
        
        .ayah-number {
          display: inline-block;
          width: 30px;
          height: 30px;
          text-align: center;
          line-height: 30px;
          background-color: #16a085;
          color: white;
          border-radius: 50%;
          margin: 0 5px;
          font-size: 14px;
          font-family: Arial, sans-serif;
        }
        
        .ayah-translation {
          font-size: 16px;
          line-height: 1.6;
          color: #555;
          margin-top: 10px;
          direction: ltr;
          text-align: left;
          border-left: 3px solid #16a085;
          padding-left: 15px;
        }
        
        .navigation-buttons {
          display: flex;
          justify-content: space-between;
          margin-top: 30px;
        }
        
        .nav-button {
          padding: 10px 20px;
          background-color: #2c3e50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .nav-button:hover:not(:disabled) {
          background-color: #34495e;
        }
        
        .nav-button:disabled {
          background-color: #95a5a6;
          cursor: not-allowed;
        }
        
        @media (max-width: 768px) {
          .quran-reader-container {
            padding: 15px;
          }
          
          .quran-header, .quran-controls {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .surah-selector, .translation-selector {
            width: 100%;
            margin-top: 10px;
          }
          
          .surah-select, .translation-select {
            width: 100%;
          }
          
          .controls-group {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
};

export default QuranReader;

