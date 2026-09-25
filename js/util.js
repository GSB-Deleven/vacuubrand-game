'use strict';
const T = 16;          // Kachelgrösse in Pixeln
const VIEW_W = 320;    // interne Auflösung
const VIEW_H = 180;

function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
function lerp(a, b, t) { return a + (b - a) * t; }
function hash(n) {
  n = Math.imul(n ^ 0x5bd1e995, 0x27d4eb2d);
  n ^= n >>> 15;
  n = Math.imul(n, 0x165667b1);
  n ^= n >>> 13;
  return (n >>> 0) / 4294967296;
}
function pad(n, len, ch) { return String(n).padStart(len, ch || '0'); }

// Boxen: x = Mitte, y = Unterkante
function overlap(a, b) {
  return a.x - a.w / 2 < b.x + b.w / 2 && a.x + a.w / 2 > b.x - b.w / 2 &&
         a.y - a.h < b.y && a.y > b.y - b.h;
}

function todayKey(d) {
  d = d || new Date();
  return d.getFullYear() + '-' + pad(d.getMonth() + 1, 2) + '-' + pad(d.getDate(), 2);
}
function formatDateTime(ts) {
  const d = new Date(ts);
  return pad(d.getDate(), 2) + '.' + pad(d.getMonth() + 1, 2) + '.' + d.getFullYear() + ' ' +
         pad(d.getHours(), 2) + ':' + pad(d.getMinutes(), 2);
}
function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function displayName(lead) {
  if (!lead) return '???';
  const f = String(lead.firstName || '').trim().toUpperCase().slice(0, 9);
  const l = String(lead.lastName || '').trim().toUpperCase();
  return (f + (l ? ' ' + l[0] + '.' : '')).trim() || 'SPIELER';
}
function toggleFullscreen() {
  try {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen();
  } catch (e) { /* ignorieren */ }
}
