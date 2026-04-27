/* ===== HABITS.JS ===== */

function renderHabits() {
  const today = todayKey();
  const d = DB.get();
  const todayHabits = d.habits[today] || {};
  const score = HABITS.filter(h => todayHabits[h.id]).length;
  const xp = score * 10;

  document.getElementById('habitsDate').textContent = formatDate(today);
  document.getElementById('habitScore').textContent = score;
  document.getElementById('habitScoreLabel').textContent = getScoreLabel(score);
  document.getElementById('habitXpBadge').textContent = `+${xp} XP today`;

  const list = document.getElementById('habitsList');
  list.innerHTML = '';

  HABITS.forEach((h, i) => {
    const done = !!todayHabits[h.id];
    const item = document.createElement('div');
    item.className = `habit-item${done ? ' done' : ''}`;
    item.style.animationDelay = `${i * 40}ms`;
    item.innerHTML = `
      <span class="habit-item-icon">${h.icon}</span>
      <div style="flex:1">
        <div class="habit-item-name">${h.name}</div>
        <div class="habit-item-sub">${h.sub}</div>
      </div>
      <div class="habit-toggle">${done ? '✓' : ''}</div>
    `;
    item.addEventListener('click', () => toggleHabit(h.id, item));
    list.appendChild(item);
  });
}

function toggleHabit(habitId, el) {
  const today = todayKey();
  DB.set(d => {
    if (!d.habits[today]) d.habits[today] = {};
    d.habits[today][habitId] = !d.habits[today][habitId];
  });
  const done = DB.get().habits[today][habitId];
  el.classList.toggle('done', done);
  el.classList.add('just-done');
  el.querySelector('.habit-toggle').textContent = done ? '✓' : '';
  setTimeout(() => el.classList.remove('just-done'), 300);

  if (done) showXpFloat(el, '+10 XP');

  // Update score
  const today2 = todayKey();
  const todayH = DB.get().habits[today2] || {};
  const score = HABITS.filter(h => todayH[h.id]).length;
  document.getElementById('habitScore').textContent = score;
  document.getElementById('habitScoreLabel').textContent = getScoreLabel(score);
  document.getElementById('habitXpBadge').textContent = `+${score * 10} XP today`;

  // Refresh dashboard ring too
  updateDashboardRing();
}

function getScoreLabel(score) {
  if (score === 10) return '🏆 Perfect Day! BEAST!';
  if (score >= 8) return '🔥 Crushing it!';
  if (score >= 6) return '⚡ Good momentum';
  if (score >= 4) return '💪 Keep pushing';
  if (score >= 2) return '🎯 Stay focused';
  return '🌅 Get started!';
}

function showXpFloat(el, text) {
  const rect = el.getBoundingClientRect();
  const div = document.createElement('div');
  div.className = 'xp-float';
  div.textContent = text;
  div.style.left = rect.left + rect.width / 2 + 'px';
  div.style.top = rect.top + 'px';
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 900);
}

function renderHabitPreview() {
  const today = todayKey();
  const d = DB.get();
  const todayH = d.habits[today] || {};
  const preview = document.getElementById('habitPreview');
  preview.innerHTML = '';
  HABITS.slice(0, 5).forEach(h => {
    const done = !!todayH[h.id];
    const el = document.createElement('div');
    el.className = 'habit-prev-item';
    el.innerHTML = `
      <span class="habit-prev-icon">${h.icon}</span>
      <span class="habit-prev-name">${h.name}</span>
      <div class="habit-prev-check${done ? ' done' : ''}">${done ? '✓' : ''}</div>
    `;
    preview.appendChild(el);
  });
}
