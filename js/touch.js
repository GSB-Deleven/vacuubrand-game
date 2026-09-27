'use strict';
// Touch-Steuerung für Tablet und Handy. Erscheint automatisch beim ersten Antippen.
// Die Knöpfe erzeugen virtuelle "Touch…"-Tasten, genau wie Tastatur und Gamepad.
const Touch = {
  el: null,
  active: false,
  pointers: new Map(),   // pointerId -> Code(s)
  fsTried: false,
  logoT: null,

  init() {
    const el = this.el = document.createElement('div');
    el.id = 'touch';
    el.className = 'hidden';
    el.innerHTML =
      '<div class="t-dpad" data-dpad>' +
      '<div class="t-key t-left">←</div><div class="t-key t-down">↓</div><div class="t-key t-right">→</div></div>' +
      '<div class="t-btns">' +
      '<div class="t-btn t-sprint" data-code="TouchSprint">SPRINT</div>' +
      '<div class="t-btn t-suck" data-code="TouchSuck">SAUGEN</div>' +
      '<div class="t-btn t-jump" data-code="TouchJump">SPRUNG</div></div>' +
      '<div class="t-btn t-pause" data-code="TouchPause">II</div>';
    document.body.appendChild(el);
    const rot = document.createElement('div');
    rot.id = 'rotate';
    rot.innerHTML = '<div>📱↻<br>BITTE GERÄT QUER HALTEN</div>';
    document.body.appendChild(rot);

    // Touch erkennen (auch wenn es nie eine Maus gibt)
    window.addEventListener('pointerdown', e => { if (e.pointerType === 'touch') this.enable(); }, true);
    window.addEventListener('touchstart', () => this.enable(), { capture: true, passive: true });

    el.addEventListener('pointerdown', e => this.down(e));
    el.addEventListener('pointermove', e => this.move(e));
    for (const t of ['pointerup', 'pointercancel', 'lostpointercapture']) el.addEventListener(t, e => this.up(e));
    el.addEventListener('contextmenu', e => e.preventDefault());

    // Admin am Tablet: 3 Sekunden auf das Logo oben drücken (nur Messe-Version)
    const canvas = document.getElementById('game');
    canvas.addEventListener('pointerdown', e => {
      const r = canvas.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width * VIEW_W, y = (e.clientY - r.top) / r.height * VIEW_H;
      clearTimeout(this.logoT);
      if (y < 16 && x > 100 && x < 220) this.logoT = setTimeout(() => Game.requestAdmin(), 3000);
    });
    for (const t of ['pointerup', 'pointercancel', 'pointerleave']) canvas.addEventListener(t, () => clearTimeout(this.logoT));
  },

  enable() {
    if (!this.active) {
      this.active = true;
      Input.touch = true;
      document.body.classList.add('touch');
    }
    // Vollbild beim ersten Tippen versuchen (Android/Chrome; iPad: "Zum Home-Bildschirm")
    if (!this.fsTried) {
      this.fsTried = true;
      try {
        const d = document.documentElement;
        const req = d.requestFullscreen || d.webkitRequestFullscreen;
        if (req && !document.fullscreenElement) { const p = req.call(d); if (p && p.catch) p.catch(() => {}); }
      } catch (e) { /* nicht unterstützt */ }
    }
  },

  // Steuerkreuz: welche Richtung liegt unter dem Finger?
  dpadCode(e, pad) {
    const r = pad.getBoundingClientRect();
    const fx = (e.clientX - r.left) / r.width, fy = (e.clientY - r.top) / r.height;
    if (fy > 0.55 && fx > 0.3 && fx < 0.7) return 'TouchDown';
    return fx < 0.5 ? 'TouchLeft' : 'TouchRight';
  },

  press(code) {
    if (!Input.keys[code]) Input.just[code] = true;
    Input.keys[code] = true;
    Sound.init();
  },
  release(code) {
    // nur loslassen, wenn kein anderer Finger dieselbe Taste hält
    for (const c of this.pointers.values()) if (c === code) return;
    Input.keys[code] = false;
  },

  down(e) {
    e.preventDefault(); e.stopPropagation();
    const pad = e.target.closest('[data-dpad]');
    const btn = e.target.closest('[data-code]');
    const code = pad ? this.dpadCode(e, pad) : btn ? btn.dataset.code : null;
    if (!code) return;
    try { this.el.setPointerCapture(e.pointerId); } catch (err) { /* egal */ }
    this.pointers.set(e.pointerId, code);
    this.press(code);
    this.mark();
  },
  move(e) {
    const old = this.pointers.get(e.pointerId);
    if (!old || !['TouchLeft', 'TouchRight', 'TouchDown'].includes(old)) return;
    const pad = this.el.querySelector('[data-dpad]');
    const code = this.dpadCode(e, pad);
    if (code === old) return;
    this.pointers.set(e.pointerId, code);
    this.release(old);
    this.press(code);
    this.mark();
  },
  up(e) {
    const code = this.pointers.get(e.pointerId);
    if (!code) return;
    this.pointers.delete(e.pointerId);
    this.release(code);
    this.mark();
  },
  // gedrückte Knöpfe hervorheben
  mark() {
    const held = new Set(this.pointers.values());
    this.el.querySelectorAll('[data-code]').forEach(b => b.classList.toggle('on', held.has(b.dataset.code)));
    this.el.querySelector('.t-left').classList.toggle('on', held.has('TouchLeft'));
    this.el.querySelector('.t-right').classList.toggle('on', held.has('TouchRight'));
    this.el.querySelector('.t-down').classList.toggle('on', held.has('TouchDown'));
  },

  // Knöpfe nur während der Spielrunde zeigen
  update() {
    if (!this.active) return;
    const s = Game.scene;
    const show = s instanceof PlayScene && !s.paused && !Overlay.visible && (s.state === 'play' || s.state === 'count');
    if (show === this.el.classList.contains('hidden')) {
      this.el.classList.toggle('hidden', !show);
      if (!show) { for (const c of this.pointers.values()) Input.keys[c] = false; this.pointers.clear(); this.mark(); }
    }
  }
};
