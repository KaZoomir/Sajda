import React from 'react';

const Terms = () => {
  return (
    <div className="terms-container">
      <div className="terms-header">
        <h1>Условия использования</h1>
        <div className="divider"></div>
      </div>
      
      <div className="terms-content">
        <section className="terms-section">
          <h2>1. Введение</h2>
          <p>
            Добро пожаловать на веб-приложение Sajda. Используя наш сайт и сервисы, вы соглашаетесь 
            с настоящими условиями использования. Пожалуйста, внимательно прочитайте их.
          </p>
        </section>
        
        <section className="terms-section">
          <h2>2. Описание услуг</h2>
          <p>
            Веб-приложение Sajda предоставляет пользователям доступ к исламским инструментам, 
            включая время намаза, определение направления Киблы, чтение Корана, исламский календарь 
            и счетчик зикра. Эти услуги предназначены для помощи мусульманам в соблюдении 
            религиозных практик.
          </p>
          <p>
            Наше приложение является учебным проектом и не связано официально с мобильным 
            приложением Sajda.
          </p>
        </section>
        
        <section className="terms-section">
          <h2>3. Использование приложения</h2>
          <p>
            Приложение предназначено для личного некоммерческого использования. Пользователи 
            могут свободно пользоваться всеми функциями приложения, доступными через веб-интерфейс.
          </p>
          <p>
            Запрещается:
          </p>
          <ul>
            <li>Использовать приложение для незаконной деятельности</li>
            <li>Пытаться получить несанкционированный доступ к системам или данным</li>
            <li>Копировать, модифицировать или распространять содержимое без разрешения</li>
            <li>Использовать автоматизированные системы для доступа к приложению</li>
          </ul>
        </section>
        
        <section className="terms-section">
          <h2>4. Отказ от ответственности</h2>
          <p>
            Sajda Web App стремится предоставлять точную информацию, однако мы не гарантируем 
            точность данных о времени намаза, направлении Киблы и других религиозных сведениях.
          </p>
          <p>
            Пользователи должны проверять важную информацию из официальных источников. Наше 
            приложение предоставляется "как есть", без каких-либо гарантий, явных или 
            подразумеваемых.
          </p>
        </section>
        
        <section className="terms-section">
          <h2>5. Интеллектуальная собственность</h2>
          <p>
            Все права на бренд Sajda принадлежат их законным владельцам. Наш проект не 
            претендует на права, связанные с оригинальным приложением Sajda.
          </p>
          <p>
            Исходный код нашего веб-приложения и его дизайн являются интеллектуальной 
            собственностью разработчиков проекта.
          </p>
        </section>
        
        <section className="terms-section">
          <h2>6. Конфиденциальность</h2>
          <p>
            Информация о том, как мы собираем, используем и защищаем ваши данные, 
            содержится в нашей Политике конфиденциальности.
          </p>
        </section>
        
        <section className="terms-section">
          <h2>7. Изменения в условиях</h2>
          <p>
            Мы оставляем за собой право изменять настоящие условия в любое время. 
            Продолжая использовать наше приложение после внесения изменений, вы соглашаетесь 
            с обновленными условиями.
          </p>
        </section>
        
        <section className="terms-section">
          <h2>8. Контактная информация</h2>
          <p>
            Если у вас есть вопросы или предложения относительно наших Условий использования, 
            пожалуйста, свяжитесь с нами:
          </p>
          <p>
            Email: kazoomir@gmail.com<br />
            Instagram: <a href="https://instagram.com/sajda_web_app" target="_blank" rel="noopener noreferrer">@sajda_web_app</a>
          </p>
        </section>
        
        <div className="terms-footer">
          <p>Последнее обновление: 24 марта 2025 г.</p>
        </div>
      </div>
      
      <style jsx>{`
        .terms-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 30px;
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .terms-header {
          text-align: center;
          margin-bottom: 40px;
        }
        
        .terms-header h1 {
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
        
        .terms-section {
          margin-bottom: 40px;
        }
        
        .terms-section h2 {
          color: #2c3e50;
          margin-bottom: 20px;
          position: relative;
          padding-bottom: 10px;
        }
        
        .terms-section h2:after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 50px;
          height: 3px;
          background-color: #16a085;
        }
        
        .terms-section p {
          color: #555;
          line-height: 1.6;
          margin-bottom: 15px;
        }
        
        .terms-section ul {
          margin-left: 20px;
          margin-bottom: 15px;
        }
        
        .terms-section li {
          color: #555;
          margin-bottom: 10px;
        }
        
        .terms-section a {
          color: #16a085;
          text-decoration: none;
        }
        
        .terms-section a:hover {
          text-decoration: underline;
        }
        
        .terms-footer {
          margin-top: 50px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          color: #7f8c8d;
          font-size: 14px;
        }
        
        @media (max-width: 768px) {
          .terms-container {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default Terms;