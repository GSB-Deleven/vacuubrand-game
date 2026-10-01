'use strict';
// Touch-Steuerung für Tablet und Handy. Erscheint automatisch beim ersten Antippen.
// Die Knöpfe erzeugen virtuelle "Touch…"-Tasten, genau wie Tastatur und Gamepad.
const Touch = {
  el: null,
  active: false,
  pointers: new Map(),   // pointerId -> Liste der gedrückten Codes
  fsTried: false,
  logoT: null,

  init() {
    const el = this.el = document.createElement('div');
    el.id = 'touch';
    el.className = 'hidden';
    el.innerHTML =
      '<div class="t-dpad" data-dpad>' +
      '<div class="t-key t-up">▲</div><div class="t-key t-left">◀</div>' +
      '<div class="t-key t-right">▶</div><div class="t-key t-down">▼</div></div>' +
      '<div class="t-btn t-suck" data-code="TouchSuck">SAUGEN</div>' +
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

  // Steuerkreuz: welche Richtung(en) liegen unter dem Finger?
  // Hoch = springen, schräg hoch = laufen + springen, unten = ducken.
  // Schräg unten zählt nur als links/rechts, damit man beim Laufen nicht aus Versehen duckt.
  dpadCodes(e, pad) {
    const r = pad.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2), dy = (r.top + r.height / 2) - e.clientY;
    if (Math.hypot(dx, dy) < r.width * 0.12) return [];        // Mitte: nichts drücken
    const a = Math.atan2(dy, dx) * 180 / Math.PI;               // 0 = rechts, 90 = oben
    if (a > 22.5 && a < 67.5) return ['TouchRight', 'TouchJump'];
    if (a >= 67.5 && a <= 112.5) return ['TouchJump'];
    if (a > 112.5 && a < 157.5) return ['TouchLeft', 'TouchJump'];
    if (a < -60 && a > -120) return ['TouchDown'];
    return Math.abs(a) > 90 ? ['TouchLeft'] : ['TouchRight'];
  },

  press(code) {
    if (!Input.keys[code]) Input.just[code] = true;
    Input.keys[code] = true;
    Sound.init();
  },
  release(code) {
    // nur loslassen, wenn kein anderer Finger dieselbe Taste hält
    for (const p of this.pointers.values()) if (p.codes.includes(code)) return;
    Input.keys[code] = false;
  },

  down(e) {
    e.preventDefault(); e.stopPropagation();
    const pad = e.target.closest('[data-dpad]');
    const btn = e.target.closest('[data-code]');
    if (!pad && !btn) return;
    const codes = pad ? this.dpadCodes(e, pad) : [btn.dataset.code];
    try { this.el.setPointerCapture(e.pointerId); } catch (err) { /* egal */ }
    this.pointers.set(e.pointerId, pad ? { pad: true, codes } : { codes });
    codes.forEach(c => this.press(c));
    this.mark();
  },
  move(e) {
    const p = this.pointers.get(e.pointerId);
    if (!p || !p.pad) return;
    const codes = this.dpadCodes(e, this.el.querySelector('[data-dpad]'));
    const old = p.codes;
    if (codes.join() === old.join()) return;
    p.codes = codes;
    // nur wegfallende Richtungen loslassen und nur neue drücken (gehaltener Sprung bleibt gehalten)
    old.filter(c => !codes.includes(c)).forEach(c => this.release(c));
    codes.filter(c => !old.includes(c)).forEach(c => this.press(c));
    this.mark();
  },
  up(e) {
    const p = this.pointers.get(e.pointerId);
    if (!p) return;
    this.pointers.delete(e.pointerId);
    p.codes.forEach(c => this.release(c));
    this.mark();
  },
  held() {
    const h = new Set();
    for (const p of this.pointers.values()) p.codes.forEach(c => h.add(c));
    return h;
  },
  // gedrückte Knöpfe hervorheben
  mark() {
    const held = this.held();
    this.el.querySelectorAll('[data-code]').forEach(b => b.classList.toggle('on', held.has(b.dataset.code)));
    this.el.querySelector('.t-up').classList.toggle('on', held.has('TouchJump'));
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
      if (!show) { for (const c of this.held()) Input.keys[c] = false; this.pointers.clear(); this.mark(); }
    }
  }
};
