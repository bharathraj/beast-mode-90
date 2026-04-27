/* ===== SETTINGS.JS ===== */

function openSettings() {
  const d = DB.get();
  document.getElementById('startDateInput').value = d.startDate || '';
  document.getElementById('currencyInput').value  = d.currency  || '₹';
  document.getElementById('newPinInput').value    = '';
  document.getElementById('settingsModal').classList.remove('hidden');
}

function closeSettings() {
  document.getElementById('settingsModal').classList.add('hidden');
}

document.getElementById('settingsBtn').addEventListener('click', openSettings);
document.getElementById('closeSettingsBtn').addEventListener('click', closeSettings);
document.getElementById('modalBackdrop').addEventListener('click', closeSettings);

document.getElementById('savePinBtn').addEventListener('click', () => {
  const val = document.getElementById('newPinInput').value.trim();
  if (!/^\d{4}$/.test(val)) {
    alert('PIN must be exactly 4 digits.'); return;
  }
  DB.set(d => { d.pin = val; });
  flashBtn('savePinBtn', 'SAVED ✓');
});

document.getElementById('saveStartDateBtn').addEventListener('click', () => {
  const val = document.getElementById('startDateInput').value;
  if (!val) return;
  DB.set(d => { d.startDate = val; });
  flashBtn('saveStartDateBtn', 'SAVED ✓');
  renderDashboard();
});

document.getElementById('saveCurrencyBtn').addEventListener('click', () => {
  const val = document.getElementById('currencyInput').value.trim() || '₹';
  DB.set(d => { d.currency = val; });
  flashBtn('saveCurrencyBtn', 'SAVED ✓');
  updateMoneySummary();
});

document.getElementById('resetDataBtn').addEventListener('click', () => {
  if (confirm('⚠ This will permanently delete ALL your data. Are you sure?')) {
    DB.reset();
    closeSettings();
    location.reload();
  }
});

/* ===== UTILITY ===== */
function flashBtn(id, text) {
  const btn = document.getElementById(id);
  const orig = btn.textContent;
  btn.textContent = text;
  btn.style.background = 'var(--green)';
  setTimeout(() => {
    btn.textContent = orig;
    btn.style.background = '';
  }, 1500);
}
