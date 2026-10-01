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
      // Links: Laufen (◀ ▶). Rechts: Bedienfeld mit SPRUNG oben und SAUGEN unten.
      '<div class="t-panel t-move" data-zone="move">' +
      '<div class="t-key t-left">◀</div><div class="t-key t-right">▶</div></div>' +
      '<div class="t-panel t-act" data-zone="act">' +
      '<div class="t-key t-jump">SPRUNG</div><div class="t-key t-suck">SAUGEN</div></div>' +
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

  // Welche Taste(n) liegen unter dem Finger? Die Felder werden nach Position ausgewertet,
  // damit man ohne Loslassen von einer Taste zur anderen wischen kann.
  // Rechts: oben SPRUNG, unten SAUGEN; ein Daumen auf der Naht dazwischen drückt beide.
  zoneCodes(e, zone) {
    const r = zone.getBoundingClientRect();
    if (zone.dataset.zone === 'move') return [(e.clientX - r.left) / r.width < 0.5 ? 'TouchLeft' : 'TouchRight'];
    const fy = (e.clientY - r.top) / r.height;
    if (fy < 0.42) return ['TouchJump'];
    if (fy > 0.58) return ['TouchSuck'];
    return ['TouchJump', 'TouchSuck'];
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
    const zone = e.target.closest('[data-zone]');
    const btn = e.target.closest('[data-code]');
    if (!zone && !btn) return;
    const codes = zone ? this.zoneCodes(e, zone) : [btn.dataset.code];
    try { this.el.setPointerCapture(e.pointerId); } catch (err) { /* egal */ }
    this.pointers.set(e.pointerId, { zone, codes });
    codes.forEach(c => this.press(c));
    this.mark();
  },
  move(e) {
    const p = this.pointers.get(e.pointerId);
    if (!p || !p.zone) return;
    const codes = this.zoneCodes(e, p.zone);
    const old = p.codes;
    if (codes.join() === old.join()) return;
    p.codes = codes;
    // nur wegfallende Richtungen loslassen und nur neue drücken (gehaltenes Saugen bleibt gehalten)
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
    const keys = { left: 'TouchLeft', right: 'TouchRight', jump: 'TouchJump', suck: 'TouchSuck' };
    for (const k in keys) this.el.querySelector('.t-' + k).classList.toggle('on', held.has(keys[k]));
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
