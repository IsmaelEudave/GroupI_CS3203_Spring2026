// calendarWidget.js

// 1. ISOLATED CSS
const calendarCSS = `
  .cal-container {
    font-family: 'DM Mono', 'Courier New', monospace;
    color: white;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .cal-container * { box-sizing: border-box; }

  /* ── Nav ── */
  .cal-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
  }
  .cal-nav h2 {
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #e8b84b;
  }
  .cal-nav-btns { display: flex; gap: 6px; }
  .cal-nav-btn {
    background: #1e1e24;
    border: 0.5px solid #2a2a30;
    border-radius: 6px;
    color: #aaa;
    font-size: 16px;
    width: 32px;
    height: 32px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s, color 0.15s;
  }
  .cal-nav-btn:hover { background: #2a2a30; color: white; }

  /* ── Day labels ── */
  .cal-days-row {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    text-align: center;
    margin-bottom: 6px;
  }
  .cal-days-row span {
    font-size: 11px;
    color: #555;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 4px 0;
  }

  /* ── Grid ── */
  .cal-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
    flex: 1;
  }
  .cal-cell {
    aspect-ratio: 1;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 6px 4px 4px;
    cursor: pointer;
    border: 0.5px solid transparent;
    transition: background 0.12s, border-color 0.12s;
    position: relative;
  }
  .cal-cell:hover { background: #1e1e24; border-color: #2a2a30; }
  .cal-cell.today {
    background: #e8b84b18;
    border-color: #e8b84b55;
  }
  .cal-cell.today .cal-day-num { color: #e8b84b; font-weight: 700; }
  .cal-cell.empty { cursor: default; pointer-events: none; }

  .cal-day-num { font-size: 12px; color: #777; line-height: 1; }
  .cal-cell:not(.empty):hover .cal-day-num { color: white; }

  .cal-dots {
    display: flex;
    gap: 2px;
    margin-top: auto;
    padding-bottom: 2px;
  }
  .cal-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #e8b84b;
  }
  .cal-cell.today .cal-dot { background: #e8b84b; }

  /* ── Modal overlay ── */
  #cal-modal-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
    justify-content: center;
    align-items: center;
    z-index: 200;
    backdrop-filter: blur(2px);
  }
  #cal-modal-overlay.open { display: flex; }

  /* ── Modal ── */
  #cal-modal {
    background: #16161a;
    border: 0.5px solid #2a2a30;
    border-radius: 14px;
    padding: 24px;
    width: 380px;
    max-width: 92vw;
    max-height: 85vh;
    overflow-y: auto;
    box-shadow: 0 24px 60px rgba(0,0,0,0.5);
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .cal-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  .cal-modal-header h3 {
    font-size: 14px;
    font-weight: 500;
    color: #e8b84b;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    margin: 0;
  }
  #cal-modal-close {
    background: none;
    border: none;
    color: #555;
    font-size: 20px;
    cursor: pointer;
    padding: 0;
    line-height: 1;
    transition: color 0.15s;
  }
  #cal-modal-close:hover { color: white; }

  /* ── Event list ── */
  #cal-event-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .cal-no-events { font-size: 13px; color: #555; text-align: center; padding: 8px 0; margin: 0; }

  .cal-event-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    background: #0f0f11;
    border: 0.5px solid #2a2a30;
    border-left: 2px solid #e8b84b;
    border-radius: 8px;
    padding: 10px 12px;
    gap: 10px;
  }
  .cal-event-info { display: flex; flex-direction: column; gap: 2px; flex: 1; }
  .cal-event-info strong { font-size: 13px; color: white; }
  .cal-event-time { font-size: 11px; color: #e8b84b; font-weight: 500; margin-top: 1px; }
  .cal-event-desc { font-size: 12px; color: #666; margin: 2px 0 0; }
  .cal-delete-btn {
    background: none;
    border: none;
    color: #444;
    font-size: 14px;
    cursor: pointer;
    padding: 0 2px;
    flex-shrink: 0;
    transition: color 0.15s;
  }
  .cal-delete-btn:hover { color: #e05; }

  /* ── Add form ── */
  #cal-event-form {
    display: flex;
    flex-direction: column;
    gap: 8px;
    border-top: 0.5px solid #2a2a30;
    padding-top: 14px;
  }
  #cal-event-form input,
  #cal-event-form textarea {
    font-family: inherit;
    font-size: 13px;
    padding: 8px 10px;
    border: 0.5px solid #2a2a30;
    border-radius: 6px;
    background: #0f0f11;
    color: white;
    outline: none;
    resize: none;
    transition: border-color 0.2s;
  }
  #cal-event-form input:focus,
  #cal-event-form textarea:focus { border-color: #e8b84b; }
  #cal-event-form input::placeholder,
  #cal-event-form textarea::placeholder { color: #444; }

  #cal-add-event-btn {
    background: #e8b84b;
    color: #0f0f11;
    border: none;
    border-radius: 6px;
    padding: 9px;
    font-size: 13px;
    font-weight: 700;
    font-family: inherit;
    cursor: pointer;
    letter-spacing: 0.04em;
    transition: background 0.15s;
  }
  #cal-add-event-btn:hover { background: #d4a43a; }

  @keyframes cal-shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
  .cal-shake {
    animation: cal-shake 0.3s ease;
    border-color: #e05 !important;
  }
`;

// 2. ISOLATED HTML
const calendarHTML = `
  <div class="cal-container">
    <div class="cal-nav">
      <h2 id="cal-month-year"></h2>
      <div class="cal-nav-btns">
        <button class="cal-nav-btn" id="cal-prev">&#8249;</button>
        <button class="cal-nav-btn" id="cal-next">&#8250;</button>
      </div>
    </div>
    <div class="cal-days-row">
      <span>Sun</span><span>Mon</span><span>Tue</span>
      <span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
    </div>
    <div class="cal-grid" id="cal-grid"></div>
  </div>

  <!-- Modal (appended to body so it overlays everything) -->
  <div id="cal-modal-overlay">
    <div id="cal-modal">
      <div class="cal-modal-header">
        <h3 id="cal-modal-date-title"></h3>
        <button id="cal-modal-close">&times;</button>
      </div>
      <div id="cal-event-list"></div>
      <div id="cal-event-form">
        <input type="text" id="cal-event-title" placeholder="Event title" maxlength="60" />
        <input type="time" id="cal-event-time" />
        <textarea id="cal-event-desc" placeholder="Description (optional)" rows="2"></textarea>
        <button id="cal-add-event-btn">Add Event</button>
      </div>
    </div>
  </div>
`;

// 3. INIT FUNCTION
export function initCalendar(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Inject CSS
  const style = document.createElement('style');
  style.innerHTML = calendarCSS;
  document.head.appendChild(style);

  // Inject HTML into container (calendar UI only)
  container.innerHTML = calendarHTML.split('<!-- Modal')[0];

  // Append modal to body so it overlays the full page
  const modalWrapper = document.createElement('div');
  modalWrapper.innerHTML = calendarHTML.split('<!-- Modal (appended to body so it overlays everything) -->')[1];
  document.body.appendChild(modalWrapper.firstElementChild);

  // ── State ──
  let date = new Date();
  let selectedDateKey = null;

  // ── DOM refs ──
  const monthYearEl   = document.getElementById('cal-month-year');
  const grid          = document.getElementById('cal-grid');
  const prevBtn       = document.getElementById('cal-prev');
  const nextBtn       = document.getElementById('cal-next');
  const modalOverlay  = document.getElementById('cal-modal-overlay');
  const modalDateTitle= document.getElementById('cal-modal-date-title');
  const eventList     = document.getElementById('cal-event-list');
  const eventTitleInput = document.getElementById('cal-event-title');
  const eventTimeInput  = document.getElementById('cal-event-time');
  const eventDescInput  = document.getElementById('cal-event-desc');
  const addEventBtn   = document.getElementById('cal-add-event-btn');
  const modalClose    = document.getElementById('cal-modal-close');

  // ── Storage helpers ──
  function loadEvents() {
    return JSON.parse(localStorage.getItem('TaskLU_calendarEvents') || '{}');
  }
  function saveEvents(events) {
    localStorage.setItem('TaskLU_calendarEvents', JSON.stringify(events));
  }
  function dateKey(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  // ── Calendar render ──
  function renderCalendar() {
    const year = date.getFullYear();
    const month = date.getMonth();
    const events = loadEvents();
    const today = new Date();

    monthYearEl.textContent = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    grid.innerHTML = '';

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement('div');
      empty.classList.add('cal-cell', 'empty');
      grid.appendChild(empty);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const cell = document.createElement('div');
      cell.classList.add('cal-cell');

      const num = document.createElement('span');
      num.classList.add('cal-day-num');
      num.textContent = d;
      cell.appendChild(num);

      const key = dateKey(year, month, d);
      const dayEvents = events[key] || [];
      if (dayEvents.length > 0) {
        const dots = document.createElement('div');
        dots.classList.add('cal-dots');
        const max = Math.min(dayEvents.length, 3);
        for (let i = 0; i < max; i++) {
          const dot = document.createElement('span');
          dot.classList.add('cal-dot');
          dots.appendChild(dot);
        }
        cell.appendChild(dots);
      }

      if (
        d === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear()
      ) {
        cell.classList.add('today');
      }

      cell.addEventListener('click', () => openModal(year, month, d));
      grid.appendChild(cell);
    }
  }

  // ── Modal ──
  function openModal(year, month, day) {
    selectedDateKey = dateKey(year, month, day);
    const label = new Date(year, month, day).toLocaleDateString('default', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
    });
    modalDateTitle.textContent = label;
    renderEventList();
    modalOverlay.classList.add('open');
    eventTitleInput.focus();
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    selectedDateKey = null;
    eventTitleInput.value = '';
    eventTimeInput.value = '';
    eventDescInput.value = '';
  }

  function renderEventList() {
    const events = loadEvents();
    const dayEvents = events[selectedDateKey] || [];
    eventList.innerHTML = '';

    if (dayEvents.length === 0) {
      eventList.innerHTML = '<p class="cal-no-events">No events yet.</p>';
      return;
    }

    dayEvents.forEach((ev, idx) => {
      const item = document.createElement('div');
      item.classList.add('cal-event-item');

      const info = document.createElement('div');
      info.classList.add('cal-event-info');

      const titleEl = document.createElement('strong');
      titleEl.textContent = ev.title;
      info.appendChild(titleEl);

      if (ev.time) {
        const timeEl = document.createElement('span');
        timeEl.classList.add('cal-event-time');
        timeEl.textContent = formatTime(ev.time);
        info.appendChild(timeEl);
      }
      if (ev.desc) {
        const descEl = document.createElement('p');
        descEl.classList.add('cal-event-desc');
        descEl.textContent = ev.desc;
        info.appendChild(descEl);
      }

      const delBtn = document.createElement('button');
      delBtn.classList.add('cal-delete-btn');
      delBtn.textContent = '✕';
      delBtn.title = 'Delete event';
      delBtn.addEventListener('click', () => deleteEvent(idx));

      item.appendChild(info);
      item.appendChild(delBtn);
      eventList.appendChild(item);
    });
  }

  function formatTime(timeStr) {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
  }

  function addEvent() {
    const title = eventTitleInput.value.trim();
    if (!title) {
      eventTitleInput.focus();
      eventTitleInput.classList.add('cal-shake');
      setTimeout(() => eventTitleInput.classList.remove('cal-shake'), 400);
      return;
    }
    const events = loadEvents();
    if (!events[selectedDateKey]) events[selectedDateKey] = [];
    events[selectedDateKey].push({
      title,
      time: eventTimeInput.value,
      desc: eventDescInput.value.trim()
    });
    events[selectedDateKey].sort((a, b) =>
      (a.time || '99:99').localeCompare(b.time || '99:99')
    );
    saveEvents(events);
    eventTitleInput.value = '';
    eventTimeInput.value = '';
    eventDescInput.value = '';
    renderEventList();
    renderCalendar();
  }

  function deleteEvent(idx) {
    const events = loadEvents();
    events[selectedDateKey].splice(idx, 1);
    if (events[selectedDateKey].length === 0) delete events[selectedDateKey];
    saveEvents(events);
    renderEventList();
    renderCalendar();
  }

  // ── Event listeners ──
  addEventBtn.addEventListener('click', addEvent);
  eventTitleInput.addEventListener('keydown', e => { if (e.key === 'Enter') addEvent(); });
  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
  prevBtn.addEventListener('click', () => { date.setMonth(date.getMonth() - 1); renderCalendar(); });
  nextBtn.addEventListener('click', () => { date.setMonth(date.getMonth() + 1); renderCalendar(); });

  renderCalendar();
}

// Auto-init if the container exists on this page
initCalendar('feature-calendar');
