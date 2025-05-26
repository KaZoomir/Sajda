import React from 'react';

const AboutUs = () => {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>О нас</h1>
        <div className="divider"></div>
      </div>
      
      <div className="about-content">
        <section className="about-section">
          <h2>О проекте</h2>
          <p>
            Данный веб-сайт представляет собой тестовую версию веб-приложения, 
            вдохновленного мобильным приложением Sajda. Поскольку оригинальное 
            приложение Sajda доступно только для мобильных устройств, мы решили 
            создать похожую функциональность для пользователей веб-платформ.
          </p>
          <p>
            Этот проект является экспериментальным и разработан для демонстрации 
            возможностей создания исламских приложений с использованием современных 
            веб-технологий.
          </p>
        </section>
        
        <section className="about-section">
          <h2>Особенности</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🕌</div>
              <h3>Время намаза</h3>
              <p>Определение точного времени намаза на основе вашего местоположения</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🧭</div>
              <h3>Направление Киблы</h3>
              <p>Определение направления Киблы для правильного совершения намаза</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📖</div>
              <h3>Коран</h3>
              <p>Чтение Корана на арабском языке с переводом на русский</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3>Исламский календарь</h3>
              <p>Календарь с отображением дат по хиджре и исламских праздников</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📿</div>
              <h3>Счетчик зикра</h3>
              <p>Удобный счетчик для отслеживания зикров во время поклонения</p>
            </div>
          </div>
        </section>
        
        <section className="about-section">
          <h2>Отличия от оригинального приложения</h2>
          <p>
            Важно отметить, что данный веб-сайт не связан с официальным мобильным 
            приложением Sajda и не является его официальной веб-версией. Мы создали 
            этот проект в учебных целях, вдохновившись функциональностью оригинального 
            приложения.
          </p>
          <p>
            Наша цель — предоставить мусульманам удобный инструмент для соблюдения 
            религиозных практик через веб-браузер, без необходимости установки 
            мобильного приложения.
          </p>
        </section>
        
        <section className="about-section">
          <h2>Технологии</h2>
          <p>
            Проект разработан с использованием современных веб-технологий:
          </p>
          <ul className="tech-list">
            <li><span className="tech-name">React</span> — для создания интерактивного пользовательского интерфейса</li>
            <li><span className="tech-name">React Router</span> — для навигации по страницам приложения</li>
            <li><span className="tech-name">Geolocation API</span> — для определения местоположения пользователя</li>
            <li><span className="tech-name">Alquran Cloud API</span> — для получения текстов Корана и переводов</li>
            <li><span className="tech-name">Aladhan API</span> — для получения времени намаза</li>
          </ul>
        </section>
        
        <section className="about-section">
          <h2>Обратная связь</h2>
          <p>
            Этот проект находится в стадии разработки. Если у вас есть предложения, 
            комментарии или вы заметили какие-либо ошибки, пожалуйста, сообщите нам.
          </p>
          <p>
            Мы стремимся улучшать функциональность и удобство использования этого 
            веб-приложения и ценим ваше мнение.
          </p>
          <p>
            По всем вопросам, связанным с работой сайта, пишите на адрес: <strong>kazoomir@gmail.com</strong>
          </p>
          <div className="contact-form">
            <form onSubmit={(e) => {
              e.preventDefault();
              alert('Сообщение будет отправлено на kazoomir@gmail.com');
              // In a real implementation, you would connect this to an email service
            }}>
              <div className="form-group">
                <label htmlFor="name">Ваше имя</label>
                <input type="text" id="name" placeholder="Введите ваше имя" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="Введите ваш email" required />
              </div>
              <div className="form-group">
                <label htmlFor="message">Сообщение</label>
                <textarea id="message" rows="5" placeholder="Введите ваше сообщение" required></textarea>
              </div>
              <input type="hidden" name="recipient" value="kazoomir@gmail.com" />
              <button type="submit" className="submit-button">Отправить</button>
            </form>
          </div>
        </section>
        
        <section className="about-section disclaimer">
          <h2>Отказ от ответственности</h2>
          <p>
            Данный веб-сайт является тестовым проектом и не связан с официальным 
            приложением Sajda. Все права на бренд Sajda принадлежат их законным владельцам.
          </p>
          <p>
            Мы стремимся предоставить точную информацию, но не несем ответственности 
            за любые ошибки или неточности в данных о времени намаза, направлении Киблы 
            и других религиозных сведениях.
          </p>
        </section>
      </div>
      
      <style jsx>{`
        .about-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 30px;
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .about-header {
          text-align: center;
          margin-bottom: 40px;
        }
        
        .about-header h1 {
          color: #2c3e50;
          font-size: 36px;
          margin-bottom: 15px;
        }
        
        .divider {
          width: 100px;
          height: 4px;
          background-color: #16a085;
          margin: 0 auto;
        }
        
        .about-section {
          margin-bottom: 50px;
        }
        
        .about-section h2 {
          color: #2c3e50;
          margin-bottom: 20px;
          position: relative;
          padding-bottom: 10px;
        }
        
        .about-section h2:after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 50px;
          height: 3px;
          background-color: #16a085;
        }
        
        .about-section p {
          color: #555;
          line-height: 1.6;
          margin-bottom: 15px;
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
          margin-top: 30px;
        }
        
        .feature-card {
          background-color: #f8f9fa;
          border-radius: 8px;
          padding: 25px;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .feature-icon {
          font-size: 36px;
          margin-bottom: 15px;
        }
        
        .feature-card h3 {
          color: #2c3e50;
          font-size: 20px;
          margin-bottom: 10px;
        }
        
        .feature-card p {
          color: #7f8c8d;
          margin: 0;
        }
        
        .tech-list {
          list-style-type: none;
          padding: 0;
          margin-top: 20px;
        }
        
        .tech-list li {
          padding: 10px 0;
          border-bottom: 1px solid #f0f0f0;
          color: #555;
        }
        
        .tech-list li:last-child {
          border-bottom: none;
        }
        
        .tech-name {
          color: #16a085;
          font-weight: bold;
          margin-right: 10px;
        }
        
        .contact-form {
          background-color: #f8f9fa;
          padding: 25px;
          border-radius: 8px;
          margin-top: 30px;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 8px;
          color: #2c3e50;
          font-weight: bold;
        }
        
        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
          transition: border-color 0.3s;
        }
        
        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #16a085;
        }
        
        .submit-button {
          background-color: #16a085;
          color: white;
          border: none;
          padding: 12px 25px;
          font-size: 16px;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .submit-button:hover {
          background-color: #1abc9c;
        }
        
        .disclaimer {
          background-color: #fef9e7;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #f39c12;
        }
        
        .disclaimer h2 {
          color: #f39c12;
        }
        
        .disclaimer h2:after {
          background-color: #f39c12;
        }
        
        @media (max-width: 768px) {
          .about-container {
            padding: 20px;
          }
          
          .features-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          }
        }
      `}</style>
    </div>
  );
};

export default AboutUs;