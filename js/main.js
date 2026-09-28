'use strict';
// Start: Spielschleife mit festem Takt (60 Bilder pro Sekunde)
const Game = {
  scene: null,
  t: 0,
  go(scene) {
    if (this.scene && this.scene.exit) this.scene.exit();
    this.scene = scene;
    Input.clear();
    if (scene.enter) scene.enter();
  },
  requestAdmin() {
    if (CONFIG.mode === 'online') return; // Online-Demo hat keinen Admin-Bereich
    if (this.scene && this.scene.allowAdmin) this.go(new AdminScene());
  },
  // Schnellstart ohne Anmeldung (Strg + Shift + Enter): Spieler "ADMIN", Runde wird nicht gespeichert
  quickStart() {
    if (!this.scene || !(this.scene.allowAdmin || this.scene instanceof RegisterScene)) return;
    Sound.sfx('select');
    this.go(new PlayScene({ id: 'ADMIN', firstName: 'ADMIN', lastName: '', isTest: true }));
  },
  update() {
    this.t++;
    Input.pollPads();
    Touch.update();
    if (Input.padToast > 0) Input.padToast--;
    if (Input.pressed('mute')) Sound.toggleMute();
    this.scene.update();
    Sound.update();
  },
  draw(ctx) {
    this.scene.draw(ctx);
    if (Input.padToast > 0 && !Overlay.visible) {
      const txt = 'CONTROLLER VERBUNDEN';
      const w = Font.width(txt) + 10;
      drawPanel(ctx, 160 - w / 2, 163, w, 11);
      Font.draw(ctx, txt, 160, 165, { color: '#7be07b', align: 'center' });
    }
  }
};

// iPhone/iPad in Safari: Vollbild gibt es nur als App vom Home-Bildschirm. Einmalig darauf hinweisen.
function showHomeScreenHint() {
  const ios = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const standalone = navigator.standalone || (window.matchMedia && window.matchMedia('(display-mode: fullscreen), (display-mode: standalone)').matches);
  if (!ios || standalone || location.protocol !== 'https:') return;
  try { if (window.localStorage.getItem('vakuumprof_a2hs')) return; } catch (e) { /* egal */ }
  const el = document.createElement('div');
  el.id = 'a2hs';
  el.innerHTML = '📲 Für Vollbild: unten auf <b>Teilen</b> tippen und <b>„Zum Home-Bildschirm“</b> wählen.<button aria-label="Schliessen">✕</button>';
  el.querySelector('button').addEventListener('click', () => {
    el.remove();
    try { window.localStorage.setItem('vakuumprof_a2hs', '1'); } catch (e) { /* egal */ }
  });
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 15000);
}

(function start() {
  const canvas = document.getElementById('game');
  const wrap = document.getElementById('wrap');
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  Object.assign(CONFIG, Store.loadSettings());
  if (CONFIG.mode === 'online') CONFIG.eventName = 'ONLINE-DEMO';
  document.body.classList.add('mode-' + CONFIG.mode);
  Store.check();
  buildSprites();
  Overlay.init();
  Input.init();
  Touch.init();

  function resize() {
    // visualViewport liefert auf iPhone/iPad die wirklich sichtbare Fläche (ohne Safari-Leisten)
    const vv = window.visualViewport;
    const w = vv ? vv.width : window.innerWidth, h = vv ? vv.height : window.innerHeight;
    const s = Math.min(w / VIEW_W, h / VIEW_H);
    wrap.style.width = Math.floor(VIEW_W * s) + 'px';
    wrap.style.height = Math.floor(VIEW_H * s) + 'px';
    Overlay.el.style.fontSize = Math.max(11, Math.round(s * 4)) + 'px';
    QRView.layout();
  }
  window.addEventListener('resize', resize);
  window.addEventListener('orientationchange', () => setTimeout(resize, 300));
  if (window.visualViewport) window.visualViewport.addEventListener('resize', resize);
  showHomeScreenHint();
  canvas.addEventListener('click', e => {
    const r = canvas.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width * VIEW_W, y = (e.clientY - r.top) / r.height * VIEW_H;
    if (Game.scene && Game.scene.click) Game.scene.click(x, y);
  });
  resize();

  Game.go(new TitleScene());

  const STEP = 1000 / 60;
  let last = performance.now(), acc = 0;
  function frame(now) {
    acc += Math.min(now - last, 250);
    last = now;
    while (acc >= STEP) {
      Game.update();
      Input.endFrame();
      acc -= STEP;
    }
    Game.draw(ctx);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  window.__game = Game; // für Tests
  // Offline-Fähigkeit (PWA) nur auf GitHub Pages
  if ('serviceWorker' in navigator && /\.github\.io$/i.test(location.hostname)) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
})();
