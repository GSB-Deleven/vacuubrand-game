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

(function start() {
  const canvas = document.getElementById('game');
  const wrap = document.getElementById('wrap');
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  Object.assign(CONFIG, Store.loadSettings());
  Store.check();
  buildSprites();
  Overlay.init();
  Input.init();

  function resize() {
    const s = Math.min(window.innerWidth / VIEW_W, window.innerHeight / VIEW_H);
    wrap.style.width = Math.floor(VIEW_W * s) + 'px';
    wrap.style.height = Math.floor(VIEW_H * s) + 'px';
    Overlay.el.style.fontSize = Math.max(11, Math.round(s * 4)) + 'px';
  }
  window.addEventListener('resize', resize);
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
})();
