import React, { useState, useEffect } from 'react';

const IslamicCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const [islamicDate, setIslamicDate] = useState({});
  
  // Islamic month names in Arabic and Russian
  const islamicMonths = [
    { arabic: "محرم", russian: "Мухаррам" },
    { arabic: "صفر", russian: "Сафар" },
    { arabic: "ربيع الأول", russian: "Раби аль-авваль" },
    { arabic: "ربيع الثاني", russian: "Раби ас-сани" },
    { arabic: "جمادى الأولى", russian: "Джумада аль-уля" },
    { arabic: "جمادى الآخرة", russian: "Джумада ас-сани" },
    { arabic: "رجب", russian: "Раджаб" },
    { arabic: "شعبان", russian: "Шаабан" },
    { arabic: "رمضان", russian: "Рамадан" },
    { arabic: "شوال", russian: "Шавваль" },
    { arabic: "ذو القعدة", russian: "Зуль-каада" },
    { arabic: "ذو الحجة", russian: "Зуль-хиджа" }
  ];
  
  // Names of weekdays in Russian
  const weekdays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  
  // Gregorian month names in Russian
  const gregorianMonths = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
  ];
  
  // List of Islamic holidays and important days
  const islamicHolidays = {
    "1-1": { name: "Исламский Новый год", color: "#f39c12" },
    "1-10": { name: "День Ашура", color: "#f39c12" },
    "3-12": { name: "Маулид ан-Наби (Рождение Пророка)", color: "#16a085" },
    "7-27": { name: "Лейлят аль-Мирадж (Ночь Вознесения)", color: "#16a085" },
    "8-15": { name: "Лейлят аль-Бараат (Ночь Прощения)", color: "#16a085" },
    "9-1": { name: "Начало Рамадана", color: "#16a085" },
    "9-27": { name: "Лейлят аль-Кадр (Ночь Предопределения)", color: "#16a085" },
    "10-1": { name: "Ид аль-Фитр (Ураза-байрам)", color: "#e74c3c" },
    "12-10": { name: "Ид аль-Адха (Курбан-байрам)", color: "#e74c3c" }
  };
  
  // Function to convert Gregorian date to Islamic date (Hijri)
  const convertToIslamicDate = (date) => {
    // This is a simplified calculation and may be off by 1-2 days
    // In a production app, you would use a library like hijri-date or moment-hijri
    
    const gregorianDate = new Date(date);
    
    // Days since January 1, 1970
    const days = Math.floor(gregorianDate.getTime() / (1000 * 60 * 60 * 24));
    
    // Approximate conversion to Islamic calendar
    // January 1, 1970 was Shawwal 22, 1389 in the Islamic calendar
    const islamicDays = days + 10631; // Days from start of Islamic epoch to Jan 1, 1970
    
    const cycles = Math.floor(islamicDays / 10631); // Number of 30-year cycles
    const remainingDays = islamicDays % 10631; // Days since the last 30-year cycle
    
    // Calculate year, month, and day
    let year = cycles * 30;
    let month = 0;
    let dayOfMonth = 0;
    
    // Calculate remaining years, months, and days
    let dayCounter = remainingDays;
    let monthLengths = [];
    
    while (dayCounter > 0) {
      // Determine if it's a leap year in the Islamic calendar
      const isLeapYear = [2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29].includes(year % 30);
      
      // Set month lengths for this year
      monthLengths = [];
      for (let i = 0; i < 12; i++) {
        if (i % 2 === 0) {
          monthLengths[i] = 30; // Odd months have 30 days
        } else {
          monthLengths[i] = 29; // Even months have 29 days
        }
      }
      
      // Adjust the last month for leap years
      if (isLeapYear) {
        monthLengths[11] = 30;
      }
      
      const daysInYear = monthLengths.reduce((sum, days) => sum + days, 0);
      
      if (dayCounter > daysInYear) {
        year++;
        dayCounter -= daysInYear;
      } else {
        break;
      }
    }
    
    // Find the month and day
    for (let i = 0; i < 12; i++) {
      if (dayCounter <= monthLengths[i]) {
        month = i;
        dayOfMonth = dayCounter;
        break;
      } else {
        dayCounter -= monthLengths[i];
      }
    }
    
    return {
      year: Math.floor(year + 1390), // 1390 AH corresponds to 1970 CE
      month: month,
      day: Math.floor(dayOfMonth)
    };
  };
  
  // Function to get Islamic date for a specific day
  const getIslamicDate = (day) => {
    const islamicDate = convertToIslamicDate(day);
    return {
      day: islamicDate.day,
      month: islamicDate.month,
      year: islamicDate.year,
      formatted: `${islamicDate.day} ${islamicMonths[islamicDate.month].russian}, ${islamicDate.year} г.х.`
    };
  };
  
  // Function to go to the previous month
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  // Function to go to the next month
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  // Function to go to the current month
  const goToToday = () => {
    setCurrentMonth(new Date());
  };
  
  // Function to build the calendar days for the current month
  useEffect(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
    // Convert to Monday as first day of week (0 = Monday, 6 = Sunday)
    let dayOfWeek = firstDay.getDay() - 1;
    if (dayOfWeek === -1) dayOfWeek = 6;
    
    // Calculate days from previous month to show
    const prevMonthDays = [];
    const daysFromPrevMonth = dayOfWeek;
    if (daysFromPrevMonth > 0) {
      const prevMonth = new Date(year, month, 0);
      const prevMonthLastDay = prevMonth.getDate();
      
      for (let i = prevMonthLastDay - daysFromPrevMonth + 1; i <= prevMonthLastDay; i++) {
        const date = new Date(year, month - 1, i);
        const islamicDateObj = getIslamicDate(date);
        
        prevMonthDays.push({
          date,
          day: i,
          isCurrentMonth: false,
          isToday: false,
          islamicDay: islamicDateObj.day,
          islamicMonth: islamicDateObj.month,
          islamicYear: islamicDateObj.year
        });
      }
    }
    
    // Current month days
    const currentMonthDays = [];
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      const isToday = date.toDateString() === new Date().toDateString();
      const islamicDateObj = getIslamicDate(date);
      
      currentMonthDays.push({
        date,
        day: i,
        isCurrentMonth: true,
        isToday,
        islamicDay: islamicDateObj.day,
        islamicMonth: islamicDateObj.month,
        islamicYear: islamicDateObj.year
      });
    }
    
    // Calculate days from next month to show
    const nextMonthDays = [];
    const totalDaysShown = prevMonthDays.length + currentMonthDays.length;
    const daysFromNextMonth = 42 - totalDaysShown; // Show 6 weeks (42 days)
    
    for (let i = 1; i <= daysFromNextMonth; i++) {
      const date = new Date(year, month + 1, i);
      const islamicDateObj = getIslamicDate(date);
      
      nextMonthDays.push({
        date,
        day: i,
        isCurrentMonth: false,
        isToday: false,
        islamicDay: islamicDateObj.day,
        islamicMonth: islamicDateObj.month,
        islamicYear: islamicDateObj.year
      });
    }
    
    // Set the calendar days
    setCalendarDays([...prevMonthDays, ...currentMonthDays, ...nextMonthDays]);
    
    // Set the current Islamic date
    setIslamicDate(getIslamicDate(new Date()));
  }, [currentMonth]);
  
  // Check if a day has a special Islamic event
  const getIslamicHoliday = (islamicDay, islamicMonth) => {
    const key = `${islamicMonth + 1}-${islamicDay}`;
    return islamicHolidays[key];
  };
  
  return (
    <div className="islamic-calendar-container">
      <div className="calendar-header">
        <h1>Исламский календарь</h1>
        <div className="current-date-display">
          <div className="gregorian-date">
            {new Date().toLocaleDateString('ru-RU', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
          <div className="islamic-date">
            {islamicDate.formatted}
          </div>
        </div>
      </div>
      
      <div className="calendar-controls">
        <button onClick={prevMonth} className="month-nav">
          &lt; Пред
        </button>
        <h2>
          {gregorianMonths[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>
        <button onClick={nextMonth} className="month-nav">
          След &gt;
        </button>
      </div>
      
      <button onClick={goToToday} className="today-button">
        Сегодня
      </button>
      
      <div className="calendar-grid">
        {/* Weekday headers */}
        {weekdays.map((day, index) => (
          <div key={`weekday-${index}`} className="calendar-weekday">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {calendarDays.map((day, index) => {
          const holiday = getIslamicHoliday(day.islamicDay, day.islamicMonth);
          
          return (
            <div 
              key={`day-${index}`} 
              className={`calendar-day ${!day.isCurrentMonth ? 'other-month' : ''} ${day.isToday ? 'today' : ''} ${holiday ? 'holiday' : ''}`}
              style={holiday ? { borderColor: holiday.color } : {}}
            >
              <div className="gregorian-day">{day.day}</div>
              <div className="islamic-day">{day.islamicDay}</div>
              {holiday && (
                <div className="holiday-indicator" style={{ backgroundColor: holiday.color }}>
                  {holiday.name}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="holiday-legend">
        <h3>Исламские праздники и особые дни</h3>
        <div className="legend-items">
          {Object.entries(islamicHolidays).map(([key, holiday]) => (
            <div key={key} className="legend-item">
              <div className="legend-color" style={{ backgroundColor: holiday.color }}></div>
              <div className="legend-text">{holiday.name}</div>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        .islamic-calendar-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 30px;
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .calendar-header {
          margin-bottom: 30px;
          text-align: center;
        }
        
        .calendar-header h1 {
          color: #2c3e50;
          margin-bottom: 10px;
        }
        
        .current-date-display {
          background-color: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
        }
        
        .gregorian-date {
          font-size: 18px;
          font-weight: bold;
          color: #2c3e50;
        }
        
        .islamic-date {
          font-size: 16px;
          color: #16a085;
          margin-top: 5px;
        }
        
        .calendar-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .calendar-controls h2 {
          margin: 0;
          color: #2c3e50;
        }
        
        .month-nav {
          background-color: #16a085;
          color: white;
          border: none;
          padding: 8px 15px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s;
        }
        
        .month-nav:hover {
          background-color: #1abc9c;
        }
        
        .today-button {
          display: block;
          margin: 0 auto 20px;
          background-color: #2c3e50;
          color: white;
          border: none;
          padding: 8px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s;
        }
        
        .today-button:hover {
          background-color: #34495e;
        }
        
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 10px;
          margin-bottom: 30px;
        }
        
        .calendar-weekday {
          text-align: center;
          font-weight: bold;
          padding: 10px;
          background-color: #2c3e50;
          color: white;
          border-radius: 4px;
        }
        
        .calendar-day {
          height: 90px;
          border: 1px solid #e9ecef;
          border-radius: 4px;
          padding: 5px;
          position: relative;
          background-color: white;
          transition: all 0.3s;
        }
        
        .calendar-day:hover {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }
        
        .calendar-day.other-month {
          opacity: 0.5;
        }
        
        .calendar-day.today {
          background-color: #e8f6f3;
          border: 2px solid #16a085;
        }
        
        .calendar-day.holiday {
          background-color: rgba(255, 255, 255, 0.9);
          border-width: 2px;
        }
        
        .gregorian-day {
          font-size: 18px;
          font-weight: bold;
          color: #2c3e50;
        }
        
        .islamic-day {
          font-size: 14px;
          color: #16a085;
        }
        
        .holiday-indicator {
          position: absolute;
          bottom: 5px;
          left: 5px;
          right: 5px;
          padding: 3px;
          border-radius: 3px;
          font-size: 10px;
          color: white;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .holiday-legend {
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
        }
        
        .holiday-legend h3 {
          margin-top: 0;
          margin-bottom: 15px;
          color: #2c3e50;
          font-size: 18px;
        }
        
        .legend-items {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        
        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 5px 10px;
          background-color: white;
          border-radius: 4px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .legend-color {
          width: 15px;
          height: 15px;
          border-radius: 50%;
        }
        
        .legend-text {
          font-size: 14px;
          color: #2c3e50;
        }
        
        @media (max-width: 768px) {
          .islamic-calendar-container {
            padding: 15px;
          }
          
          .calendar-grid {
            gap: 5px;
          }
          
          .calendar-day {
            height: 70px;
          }
          
          .legend-items {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default IslamicCalendar;