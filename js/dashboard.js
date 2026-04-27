/* ===== DASHBOARD.JS ===== */

function renderDashboard() {
  const d = DB.get();
  const today = todayKey();
  const todayH = d.habits[today] || {};
  const score = HABITS.filter(h => todayH[h.id]).length;
  const pct = Math.round((score / 10) * 100);
  const xp = calcXP();
  const level = getLevel(xp);
  const streak = calcStreak();
  const bestStreak = calcBestStreak();
  const avgScore = calcAvgScore();
  const daysLogged = Object.keys(d.habits).length;
  const totalScore = Object.values(d.habits).reduce((s, dh) => s + HABITS.filter(h => dh[h.id]).length, 0);

  // Day number
  document.getElementById('dayNumber').textContent = getDayNumber();

  // Ring
  updateDashboardRing(pct);

  // Stats
  document.getElementById('statStreak').innerHTML = streak > 0
    ? `${streak} <span class="flame-icon">🔥</span>` : streak;
  document.getElementById('statXP').textContent = xp;
  document.getElementById('statLevel').textContent = level.icon;

  // Quote
  const q = getDailyQuote();
  document.getElementById('quoteText').textContent = `"${q.text}"`;
  document.getElementById('quoteAuthor').textContent = `— ${q.author}`;

  // Weekly chart
  renderWeeklyChart();

  // Habit preview
  renderHabitPreview();

  // Quick stats
  document.getElementById('qsTotalScore').textContent = totalScore;
  document.getElementById('qsBestStreak').textContent = bestStreak;
  document.getElementById('qsDaysLogged').textContent = daysLogged;
  document.getElementById('qsAvgScore').textContent = avgScore + '%';
}

function updateDashboardRing(pct) {
  if (pct === undefined) {
    const today = todayKey();
    const d = DB.get();
    const todayH = d.habits[today] || {};
    const score = HABITS.filter(h => todayH[h.id]).length;
    pct = Math.round((score / 10) * 100);
  }
  const circumference = 326.7;
  const offset = circumference - (pct / 100) * circumference;
  const ring = document.getElementById('ringFill');
  const pctEl = document.getElementById('ringPct');
  if (ring) {
    ring.style.strokeDashoffset = offset;
    if (pct === 100) ring.classList.add('full');
    else ring.classList.remove('full');
  }
  if (pctEl) pctEl.textContent = pct + '%';
}

function renderWeeklyChart() {
  const days = getLast7Days();
  const d = DB.get();
  const chart = document.getElementById('weeklyChart');
  chart.innerHTML = '';
  const DAY_LABELS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  days.forEach(key => {
    const dayH = d.habits[key] || {};
    const score = HABITS.filter(h => dayH[h.id]).length;
    const pct = (score / 10) * 100;
    const dt = new Date(key + 'T00:00:00');
    const label = DAY_LABELS[dt.getDay()];

    const wrap = document.createElement('div');
    wrap.className = 'wc-bar-wrap';
    wrap.innerHTML = `
      <div class="wc-bar-bg">
        <div class="wc-bar-fill" style="height:${pct}%"></div>
      </div>
      <span class="wc-day">${label}</span>
    `;
    chart.appendChild(wrap);
  });
}
