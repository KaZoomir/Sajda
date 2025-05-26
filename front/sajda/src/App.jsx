import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PrayerTimes from './components/PrayerTimes';
import QiblaFinder from './components/QiblaFinder';
import ZikrCounter from './components/ZikrCounter';
import IslamicCalendar from './components/IslamicCalendar';
import QuranReader from './components/QuranReader';
import AboutUs from './components/AboutUs'
import Terms from './components/Terms';
import Privacy from './components/Privacy';

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Navigation bar */}
        <nav className="navbar">
          <div className="nav-brand">
            <Link to="/">Sajda App</Link>
          </div>
          <div className="nav-links">
            <Link to="/" className="nav-link">Время намаза</Link>
            <Link to="/qibla" className="nav-link">Кибла</Link>
            <Link to="/quran" className="nav-link">Коран</Link>
            <Link to="/calendar" className="nav-link">Календарь</Link>
            <Link to="/dhikr" className="nav-link">Зикр</Link>
            <Link to="/about" className="nav-link">О нас</Link>
          </div>
        </nav>
        
        {/* Main content area */}
        <div className="content">
          <Routes>
            <Route path="/" element={<PrayerTimes />} />
            <Route path="/qibla" element={<QiblaFinder />} />
            <Route path="/quran" element={<QuranReader />} />
            <Route path="/calendar" element={<IslamicCalendar />} />
            <Route path="/dhikr" element={<ZikrCounter />} />
            <Route path = "/about" element = {<AboutUs />}/>
            <Route path = "/terms" element = {<Terms />}/>
            <Route path = "/privacy" element = {<Privacy />}/>
          </Routes>
        </div>
        
        {/* Footer */}
        <footer className="footer">
        <div className="footer-content">
        <div className="footer-logo">Sajda App © 2025</div>
        <div className="footer-links">
        <a href="/terms" className="footer-link">Условия использования</a>
        <a href="/privacy" className="footer-link">Конфиденциальность</a>
        <a href="https://instagram.com/sajda_web_app" target="_blank" rel="noopener noreferrer" className="footer-link">Контакты</a>
        </div>
        </div>
        </footer>
      </div>
      
      <style jsx>{`
        .app-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        
        .navbar {
          background-color: #2c3e50;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 50px;
          height: 70px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .nav-brand a {
          color: white;
          text-decoration: none;
          font-size: 24px;
          font-weight: bold;
        }
        
        .nav-links {
          display: flex;
          gap: 20px;
        }
        
        .nav-link {
          color: white;
          text-decoration: none;
          padding: 8px 15px;
          border-radius: 4px;
          transition: background-color 0.3s;
        }
        
        .nav-link:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        
        .content {
          flex: 1;
          background-color: #f0f2f5;
          padding: 30px 0;
        }
        
        .footer {
          background-color: #2c3e50;
          color: white;
          padding: 20px 50px;
        }
        
        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .footer-links {
          display: flex;
          gap: 20px;
        }
        
        .footer-link {
          color: #ecf0f1;
          text-decoration: none;
          opacity: 0.8;
          transition: opacity 0.3s;
        }
        
        .footer-link:hover {
          opacity: 1;
        }

        
        
        .placeholder-page {
          background-color: white;
          border-radius: 10px;
          padding: 50px;
          text-align: center;
          font-size: 24px;
          color: #7f8c8d;
          max-width: 1200px;
          margin: 0 auto;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        }
        
        @media (max-width: 900px) {
          .navbar {
            padding: 0 20px;
            flex-direction: column;
            height: auto;
            padding: 15px;
          }
          
          .nav-brand {
            margin-bottom: 15px;
          }
          
          .nav-links {
            flex-wrap: wrap;
            justify-content: center;
            gap: 10px;
          }
          
          .footer-content {
            flex-direction: column;
            gap: 15px;
          }
          
          .footer-links {
            flex-wrap: wrap;
            justify-content: center;
          }
        }
      `}</style>
    </Router>
  );
}

export default App;