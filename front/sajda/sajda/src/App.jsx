import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BrowserSupportChecker from './components/BrowserSupportChecker';
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
    <BrowserSupportChecker>
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
            
            {/* Mobile menu toggle */}
            <div className="mobile-menu-toggle" onClick={() => {
              const navLinks = document.querySelector('.nav-links');
              navLinks.classList.toggle('mobile-active');
            }}>
              <span></span>
              <span></span>
              <span></span>
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
            position: relative;
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
            transition: all 0.3s ease;
          }
          
          .nav-link {
            color: white;
            text-decoration: none;
            padding: 8px 15px;
            border-radius: 4px;
            transition: background-color 0.3s;
            white-space: nowrap;
          }
          
          .nav-link:hover {
            background-color: rgba(255, 255, 255, 0.1);
          }
          
          .mobile-menu-toggle {
            display: none;
            flex-direction: column;
            cursor: pointer;
            padding: 4px;
          }
          
          .mobile-menu-toggle span {
            width: 25px;
            height: 3px;
            background-color: white;
            margin: 3px 0;
            transition: 0.3s;
          }
          
          .content {
            flex: 1;
            background-color: #f0f2f5;
            padding: 30px 0;
            min-height: calc(100vh - 140px);
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
          
          /* Mobile styles */
          @media (max-width: 1024px) {
            .navbar {
              padding: 0 30px;
            }
            
            .footer {
              padding: 20px 30px;
            }
          }
          
          @media (max-width: 768px) {
            .navbar {
              padding: 15px 20px;
              height: auto;
            }
            
            .mobile-menu-toggle {
              display: flex;
            }
            
            .nav-links {
              position: fixed;
              top: 70px;
              left: -100%;
              width: 100%;
              height: calc(100vh - 70px);
              background-color: #2c3e50;
              flex-direction: column;
              padding: 20px;
              gap: 0;
              z-index: 1000;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            
            .nav-links.mobile-active {
              left: 0;
            }
            
            .nav-link {
              padding: 15px;
              border-bottom: 1px solid rgba(255, 255, 255, 0.1);
              text-align: center;
              font-size: 18px;
            }
            
            .nav-link:last-child {
              border-bottom: none;
            }
            
            .content {
              padding: 20px 0;
            }
            
            .footer {
              padding: 20px;
            }
            
            .footer-content {
              flex-direction: column;
              gap: 15px;
              text-align: center;
            }
            
            .footer-links {
              flex-wrap: wrap;
              justify-content: center;
              gap: 15px;
            }
          }
          
          @media (max-width: 480px) {
            .navbar {
              padding: 15px;
            }
            
            .nav-brand a {
              font-size: 20px;
            }
            
            .nav-links {
              top: 60px;
              height: calc(100vh - 60px);
            }
            
            .content {
              padding: 15px 0;
            }
            
            .footer {
              padding: 15px;
            }
          }
          
          /* Touch-friendly styles for mobile */
          @media (hover: none) and (pointer: coarse) {
            .nav-link {
              min-height: 48px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            
            .footer-link {
              min-height: 48px;
              display: flex;
              align-items: center;
            }
          }
          
          /* Loading animation */
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .content > * {
            animation: fadeIn 0.5s ease-in-out;
          }
          
          /* iOS Safari specific fixes */
          @supports (-webkit-touch-callout: none) {
            .navbar {
              position: sticky;
              top: 0;
              z-index: 1000;
            }
            
            .content {
              min-height: calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 140px);
              padding-top: max(30px, env(safe-area-inset-top));
              padding-left: env(safe-area-inset-left);
              padding-right: env(safe-area-inset-right);
            }
          }
        `}</style>
      </Router>
    </BrowserSupportChecker>
  );
}

export default App;