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
  update() {
    this.t++;
    if (Input.pressed('mute')) Sound.toggleMute();
    this.scene.update();
    Sound.update();
  },
  draw(ctx) { this.scene.draw(ctx); }
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
