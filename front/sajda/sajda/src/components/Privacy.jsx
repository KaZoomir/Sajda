import React from 'react';

const Privacy = () => {
  return (
    <div className="privacy-container">
      <div className="privacy-header">
        <h1>Политика конфиденциальности</h1>
        <div className="divider"></div>
      </div>
      
      <div className="privacy-content">
        <section className="privacy-section">
          <h2>1. Введение</h2>
          <p>
            Мы уважаем вашу конфиденциальность и стремимся защищать ваши личные данные. 
            Эта политика конфиденциальности объясняет, как мы собираем, используем и 
            защищаем информацию при использовании нашего веб-приложения Sajda.
          </p>
        </section>
        
        <section className="privacy-section">
          <h2>2. Собираемая информация</h2>
          <p>
            Наше приложение может собирать следующие типы информации:
          </p>
          <ul>
            <li>
              <strong>Геолокационные данные</strong>: С вашего разрешения, мы собираем данные 
              о вашем местоположении для определения времени намаза и направления Киблы.
            </li>
            <li>
              <strong>Данные устройства</strong>: Информация о вашем устройстве, такая как 
              ориентация устройства (для компаса Киблы) и тип браузера.
            </li>
            <li>
              <strong>Локальное хранилище</strong>: Мы используем локальное хранилище вашего 
              браузера для сохранения настроек и предпочтений (например, счетчики зикра).
            </li>
            <li>
              <strong>Контактная информация</strong>: Если вы добровольно предоставляете нам
              информацию через форму обратной связи, мы собираем ваше имя и email.
            </li>
          </ul>
        </section>
        
        <section className="privacy-section">
          <h2>3. Использование информации</h2>
          <p>
            Мы используем собранную информацию для следующих целей:
          </p>
          <ul>
            <li>Предоставление основных функций приложения (время намаза, Кибла, и т.д.)</li>
            <li>Сохранение ваших настроек и предпочтений</li>
            <li>Улучшение и оптимизация нашего приложения</li>
            <li>Ответы на ваши вопросы и обращения</li>
          </ul>
        </section>
        
        <section className="privacy-section">
          <h2>4. Хранение данных</h2>
          <p>
            Большинство данных хранится локально на вашем устройстве и не передается на наши серверы.
          </p>
          <p>
            Данные о местоположении обрабатываются в режиме реального времени и не сохраняются 
            после закрытия приложения. Настройки и счетчики зикра сохраняются в локальном хранилище
            вашего браузера для удобства использования.
          </p>
        </section>
        
        <section className="privacy-section">
          <h2>5. Передача данных третьим сторонам</h2>
          <p>
            Мы используем следующие сторонние API для предоставления функций приложения:
          </p>
          <ul>
            <li>
              <strong>Alquran Cloud API</strong>: Для получения текстов Корана и переводов.
              Мы не передаем этому сервису никакую личную информацию о вас.
            </li>
            <li>
              <strong>Aladhan API</strong>: Для получения времени намаза на основе вашего 
              местоположения. Сервису передаются только географические координаты.
            </li>
            <li>
              <strong>Big Data Cloud API</strong>: Для определения названия города по координатам.
              Сервису передаются только географические координаты.
            </li>
          </ul>
          <p>
            Мы не продаем, не обмениваем и не передаем ваши личные данные третьим лицам, кроме 
            случаев, когда это необходимо для предоставления запрошенных вами услуг.
          </p>
        </section>
        
        <section className="privacy-section">
          <h2>6. Cookies и аналогичные технологии</h2>
          <p>
            Наше приложение не использует файлы cookies для отслеживания. Мы используем только 
            локальное хранилище браузера (localStorage), чтобы сохранять ваши настройки и данные 
            счетчиков зикра непосредственно на вашем устройстве.
          </p>
        </section>
        
        <section className="privacy-section">
          <h2>7. Права пользователей</h2>
          <p>
            Вы имеете следующие права в отношении ваших данных:
          </p>
          <ul>
            <li>Право на доступ к своим данным</li>
            <li>Право на удаление своих данных (вы можете очистить локальное хранилище браузера)</li>
            <li>Право отозвать разрешение на использование геолокации через настройки браузера</li>
          </ul>
        </section>
        
        <section className="privacy-section">
          <h2>8. Безопасность</h2>
          <p>
            Мы придерживаемся разумных мер безопасности для защиты вашей информации. Так как 
            большинство данных хранится локально на вашем устройстве, риск несанкционированного 
            доступа к этим данным минимален.
          </p>
        </section>
        
        <section className="privacy-section">
          <h2>9. Изменения в политике конфиденциальности</h2>
          <p>
            Мы можем обновлять нашу политику конфиденциальности время от времени. Изменения 
            вступают в силу с момента их публикации на этой странице.
          </p>
        </section>
        
        <section className="privacy-section">
          <h2>10. Контактная информация</h2>
          <p>
            Если у вас есть вопросы или предложения относительно нашей Политики конфиденциальности, 
            пожалуйста, свяжитесь с нами:
          </p>
          <p>
            Email: kazoomir@gmail.com<br />
            Instagram: <a href="https://instagram.com/sajda_web_app" target="_blank" rel="noopener noreferrer">@sajda_web_app</a>
          </p>
        </section>
        
        <div className="privacy-footer">
          <p>Последнее обновление: 24 марта 2025 г.</p>
        </div>
      </div>
      
      <style jsx>{`
        .privacy-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 30px;
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .privacy-header {
          text-align: center;
          margin-bottom: 40px;
        }
        
        .privacy-header h1 {
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
        
        .privacy-section {
          margin-bottom: 40px;
        }
        
        .privacy-section h2 {
          color: #2c3e50;
          margin-bottom: 20px;
          position: relative;
          padding-bottom: 10px;
        }
        
        .privacy-section h2:after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 50px;
          height: 3px;
          background-color: #16a085;
        }
        
        .privacy-section p {
          color: #555;
          line-height: 1.6;
          margin-bottom: 15px;
        }
        
        .privacy-section ul {
          margin-left: 20px;
          margin-bottom: 15px;
        }
        
        .privacy-section li {
          color: #555;
          margin-bottom: 10px;
        }
        
        .privacy-section strong {
          color: #2c3e50;
        }
        
        .privacy-section a {
          color: #16a085;
          text-decoration: none;
        }
        
        .privacy-section a:hover {
          text-decoration: underline;
        }
        
        .privacy-footer {
          margin-top: 50px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          color: #7f8c8d;
          font-size: 14px;
        }
        
        @media (max-width: 768px) {
          .privacy-container {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default Privacy;