/* ===== MONEY.JS ===== */

function renderMoneyScreen() {
  const today = todayKey();
  document.getElementById('moneyDate').textContent = formatDate(today);

  const d = DB.get();
  const todayLog = d.money[today] || {};

  document.getElementById('earnedInput').value  = todayLog.earned || '';
  document.getElementById('spentInput').value   = todayLog.spent  || '';
  document.getElementById('spendingNotes').value = todayLog.notes || '';

  updateMoneySummary();
  renderMoneyLogList();
}

document.getElementById('saveMoneyBtn').addEventListener('click', () => {
  const today = todayKey();
  const earned = parseFloat(document.getElementById('earnedInput').value) || 0;
  const spent  = parseFloat(document.getElementById('spentInput').value)  || 0;
  const notes  = document.getElementById('spendingNotes').value.trim();

  DB.set(d => {
    d.money[today] = { earned, spent, notes, ts: Date.now() };
  });

  flashBtn('saveMoneyBtn', 'SAVED ✓');
  updateMoneySummary();
  renderMoneyLogList();
});

function updateMoneySummary() {
  const d = DB.get();
  const cur = d.currency || '₹';
  let totalEarned = 0, totalSpent = 0;

  Object.values(d.money).forEach(v => {
    totalEarned += v.earned || 0;
    totalSpent  += v.spent  || 0;
  });

  const saved = totalEarned - totalSpent;
  document.getElementById('totalEarned').textContent = `${cur}${totalEarned.toLocaleString('en-IN')}`;
  document.getElementById('totalSpent').textContent  = `${cur}${totalSpent.toLocaleString('en-IN')}`;
  document.getElementById('totalSaved').textContent  = `${cur}${saved.toLocaleString('en-IN')}`;
}

function renderMoneyLogList() {
  const d = DB.get();
  const cur = d.currency || '₹';
  const list = document.getElementById('moneyLogList');
  list.innerHTML = '';

  const entries = Object.entries(d.money)
    .sort(([a],[b]) => b.localeCompare(a))
    .slice(0, 15);

  if (!entries.length) {
    list.innerHTML = '<p style="color:var(--text3);font-size:13px;padding:0 16px">No money logs yet.</p>';
    return;
  }

  entries.forEach(([key, val]) => {
    const el = document.createElement('div');
    el.className = 'log-item';
    const net = (val.earned || 0) - (val.spent || 0);
    const netColor = net >= 0 ? 'var(--green)' : 'var(--red-bright)';
    el.innerHTML = `
      <div class="log-item-date">${formatDate(key)}</div>
      <div class="log-item-body">
        <span style="color:var(--green)">+${cur}${(val.earned||0).toLocaleString()}</span>
        &nbsp;
        <span style="color:var(--red-bright)">-${cur}${(val.spent||0).toLocaleString()}</span>
        &nbsp;
        <span style="color:${netColor};font-weight:700">Net: ${cur}${net.toLocaleString()}</span>
        ${val.notes ? `<br><span style="color:var(--text3)">${val.notes}</span>` : ''}
      </div>
    `;
    list.appendChild(el);
  });
}
