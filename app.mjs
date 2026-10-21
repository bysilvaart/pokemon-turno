import { STORAGE_KEY, restoreState, updateState } from './state.mjs';

const $ = selector => document.querySelector(selector);
const labels = { stadium: 'Estadio', supporter: 'Partidario', energy: 'Energía del turno', active: 'Habilidad del Pokémon activo', ...Object.fromEntries([1, 2, 3, 4, 5].map(n => [`bench-${n}`, `Habilidad de banca ${n}`])) };
let state;
try { state = restoreState(localStorage.getItem(STORAGE_KEY)); } catch { state = restoreState(null); }
function announce(message) { $('#announcement').textContent = message; }
function persist() {
  let saved = false;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); saved = true; } catch {}
  $('#storage-warning').hidden = saved;
}
function render() {
  document.querySelectorAll('[data-marker]').forEach(button => {
    const key = button.dataset.marker;
    const used = state.markers[key];
    const bench = key.startsWith('bench-');
    const usedLabel = ['stadium', 'supporter'].includes(key) ? 'usado' : 'usada';
    button.setAttribute('aria-pressed', String(used));
    const cardIcon = button.querySelector('.card-art use');
    if (cardIcon) cardIcon.setAttribute('href', used ? '#i-card-check' : '#i-brand');
    button.setAttribute('aria-label', `${labels[key]}: ${used ? usedLabel : 'disponible'}`);
    const status = button.querySelector('.marker-status');
    status.hidden = button.classList.contains('action-marker') && !used;
    status.textContent = bench ? (used ? 'Usada' : 'Lista') : (used ? usedLabel[0].toUpperCase() + usedLabel.slice(1) : 'Disponible');
  });
}
function dispatch(action, message) {
  state = updateState(state, action);
  persist(); render();
  if (message) announce(message);
}
document.querySelectorAll('[data-marker]').forEach(button => button.addEventListener('click', () => {
  const key = button.dataset.marker;
  dispatch({ type: 'toggle', key });
  announce(`${labels[key]}: ${state.markers[key] ? 'uso marcado' : 'marca eliminada'}.`);
}));
$('#new-turn').addEventListener('click', () => {
  dispatch({ type: 'reset' }, 'Nuevo turno. Todos los marcadores están disponibles.');
});
// Follow the system by default; a manual change lasts until page reload.
const systemTheme = matchMedia('(prefers-color-scheme: dark)');
let themeOverride = null;
function applyTheme() {
  const theme = themeOverride ?? (systemTheme.matches ? 'dark' : 'light');
  document.documentElement.dataset.theme = theme;
  $('#theme-icon').setAttribute('href', theme === 'dark' ? '#i-sun' : '#i-moon');
  $('#theme-toggle').setAttribute('aria-label', theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro');
  $('meta[name="theme-color"]').content = theme === 'dark' ? '#0d1220' : '#f3f5fb';
}
$('#theme-toggle').addEventListener('click', () => {
  themeOverride = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme();
});
systemTheme.addEventListener('change', () => { if (themeOverride === null) applyTheme(); });
window.addEventListener('storage', event => {
  if (event.key === STORAGE_KEY || event.key === null) {
    state = restoreState(event.newValue); render(); announce('Marcas actualizadas desde otra pestaña.');
  }
});
render(); applyTheme(); persist();
if ('serviceWorker' in navigator && window.isSecureContext) {
  navigator.serviceWorker.register('./sw.js', { scope: './' }).catch(() => {
    // Offline caching is optional; the tracker remains usable if it fails.
  });
}
