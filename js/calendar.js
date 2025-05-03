let currentDate = new Date();
let events = [
    {
        startDate: '2025-04-25',
        endDate: '2025-04-25',
        title: 'Mathematik Klausur',
        type: 'exam'
    },
    {
        startDate: '2025-04-28',
        endDate: '2025-04-30',
        title: 'Projektwoche',
        type: 'lesson'
    }
];

function initCalendar() {
    const monthDisplay = document.getElementById('monthDisplay');
    const calendarDays = document.getElementById('calendarDays');
    const prevMonth = document.getElementById('prevMonth');
    const nextMonth = document.getElementById('nextMonth');
    const todayBtn = document.getElementById('todayBtn');

    const renderCalendar = () => {
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const prevLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        const firstDayIndex = (firstDay.getDay() + 6) % 7;
        const lastDayIndex = (lastDay.getDay() + 6) % 7;
        const nextDays = 7 - lastDayIndex - 1;

        monthDisplay.innerHTML = `${currentDate.toLocaleString('de-DE', { month: 'long' })} ${currentDate.getFullYear()}`;
        
        let days = '';

        for (let x = firstDayIndex; x > 0; x--) {
            const day = prevLastDay.getDate() - x + 1;
            days += `<div class="calendar-day prev-month">${day}</div>`;
        }

        const isDateInRange = (dateStr, event) => {
            const date = new Date(dateStr);
            const start = new Date(event.startDate);
            const end = new Date(event.endDate);
            return date >= start && date <= end;
        };

        const isFirstDay = (dateStr, event) => dateStr === event.startDate;

        for (let i = 1; i <= lastDay.getDate(); i++) {
            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const dayEvents = events.filter(event => isDateInRange(dateStr, event));
            
            let eventHtml = '';
            if (dayEvents.length > 0) {
                eventHtml = dayEvents.map(event => {
                    const isFirst = isFirstDay(dateStr, event);
                    return `
                        <div class="event ${event.type} ${isFirst ? 'event-start' : 'event-continuation'}"
                             data-event-id="${event.startDate}-${event.type}">
                            ${isFirst ? event.title : ''}
                        </div>
                    `;
                }).join('');
            }

            const isToday = i === new Date().getDate() && 
                           currentDate.getMonth() === new Date().getMonth() && 
                           currentDate.getFullYear() === new Date().getFullYear();

            days += `
                <div class="calendar-day ${isToday ? 'today' : ''}" data-date="${dateStr}">
                    <span class="day-number">${i}</span>
                    <div class="events-container">${eventHtml}</div>
                </div>
            `;
        }

        for (let j = 1; j <= nextDays; j++) {
            days += `<div class="calendar-day next-month">${j}</div>`;
        }

        calendarDays.innerHTML = days;
    };

    prevMonth.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonth.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    todayBtn.addEventListener('click', () => {
        currentDate = new Date();
        renderCalendar();
    });

    renderCalendar();
}

function addEvent(startDate, endDate, title, type) {
    events.push({
        startDate,
        endDate: endDate || startDate,
        title,
        type
    });
    initCalendar();
}

document.addEventListener('DOMContentLoaded', initCalendar);