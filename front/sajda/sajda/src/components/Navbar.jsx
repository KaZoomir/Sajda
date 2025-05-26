import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="site-title">
        <Link to="/">Sajda App</Link>
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/" className="nav-link">Время намаза</Link>
        </li>
        <li>
          <Link to="/qibla" className="nav-link">Кибла</Link>
        </li>
        {/* Add more navigation links as you develop more features */}
      </ul>
      
      <style jsx>{`
        .navbar {
          background-color: #2c3e50;
          color: white;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .site-title a {
          color: white;
          font-size: 1.5rem;
          font-weight: bold;
          text-decoration: none;
        }
        
        .nav-links {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        
        .nav-link {
          color: white;
          text-decoration: none;
          padding: 0.5rem 1rem;
          margin: 0 0.2rem;
          border-radius: 4px;
          transition: background-color 0.3s;
        }
        
        .nav-link:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        
        @media (max-width: 768px) {
          .navbar {
            flex-direction: column;
            padding: 1rem;
          }
          
          .site-title {
            margin-bottom: 1rem;
          }
          
          .nav-links {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;