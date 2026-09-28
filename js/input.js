'use strict';
// Tastatur. Bewusst nur Pfeiltasten + Leertaste + Shift/Ctrl, damit Ctrl + Buchstabe
// keine Browser-Funktionen (z.B. Fenster schliessen) auslösen kann.
// Dazu Gamepads (Xbox & Co.) und USB-Joysticks: sie erzeugen virtuelle "Pad…"-Tasten.
const PAD_CODES = ['PadLeft', 'PadRight', 'PadUp', 'PadDown', 'PadJump', 'PadSuck', 'PadSprint', 'PadStart', 'PadBack', 'PadA', 'PadY'];
const Input = {
  keys: {},
  just: {},
  map: {
    left: ['ArrowLeft', 'PadLeft', 'TouchLeft'],
    right: ['ArrowRight', 'PadRight', 'TouchRight'],
    jump: ['ArrowUp', 'PadUp', 'PadJump', 'TouchJump'],
    down: ['ArrowDown', 'PadDown', 'TouchDown'],
    suck: ['Space', 'PadSuck', 'TouchSuck'],
    sprint: ['ShiftLeft', 'ShiftRight', 'ControlLeft', 'ControlRight', 'PadSprint', 'TouchSprint'],
    start: ['Enter', 'NumpadEnter', 'Space', 'PadStart', 'PadA', 'Digit1', 'Digit5'], // 1 und 5 = Start/Münze bei Arcade-Tastatur-Encodern
    back: ['Escape', 'PadBack'],
    pause: ['Escape', 'PadStart', 'PadBack', 'TouchPause'],   // Pause ein/aus
    abort: ['Enter', 'NumpadEnter'],            // Runde abbrechen (nur Tastatur, fürs Standpersonal)
    mute: ['KeyM'],
    fullscreen: ['KeyF'],
    board: ['KeyB', 'PadY']
  },
  padPrev: {},
  padName: '',
  padToast: 0,
  padMaps: null,
  padRest: {},        // eigene Tastenbelegung pro Controller-Modell (Admin → Controller einrichten)
  touch: false,
  gameKeys: new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space', 'Enter', 'Tab', 'Backspace']),

  init() {
    window.addEventListener('keydown', e => {
      Sound.init();
      if (e.ctrlKey && e.shiftKey && e.code === 'KeyA') {
        e.preventDefault();
        Game.requestAdmin();
        return;
      }
      if (e.ctrlKey && e.shiftKey && (e.code === 'Enter' || e.code === 'NumpadEnter')) {
        e.preventDefault();
        Game.quickStart();
        return;
      }
      if (Overlay.visible) return;
      if (!e.repeat && !this.keys[e.code]) this.just[e.code] = true;
      this.keys[e.code] = true;
      if (this.gameKeys.has(e.code) || e.ctrlKey) e.preventDefault();
    });
    window.addEventListener('keyup', e => { this.keys[e.code] = false; });
    window.addEventListener('blur', () => this.clear());
    window.addEventListener('mousedown', () => Sound.init());
    // iPhone/iPad: Ton darf erst nach einer echten Berührung starten
    window.addEventListener('touchend', () => Sound.init(), { passive: true });
    window.addEventListener('pointerup', () => Sound.init());
    window.addEventListener('contextmenu', e => e.preventDefault());
    window.addEventListener('gamepadconnected', e => { this.padName = e.gamepad.id; this.padToast = 180; });
  },
  // Einmal pro Bild: Gamepads/Joysticks abfragen und in virtuelle Tasten übersetzen
  pollPads() {
    const list = navigator.getGamepads ? navigator.getGamepads() : [];
    const now = {};
    let any = false;
    for (const gp of list || []) {
      if (!gp || !gp.connected) continue;
      if (!this.padName) { this.padName = gp.id; this.padToast = 180; }
      const b = i => !!gp.buttons[i] && (gp.buttons[i].pressed || gp.buttons[i].value > 0.5);
      const on = (i, ...codes) => { if (b(i)) { codes.forEach(c => { now[c] = true; }); any = true; } };
      const ax = gp.axes[0] || 0, ay = gp.axes[1] || 0;
      if (ax < -0.35) now.PadLeft = true;
      if (ax > 0.35) now.PadRight = true;
      if (ay < -0.6) now.PadUp = true;
      if (ay > 0.6) now.PadDown = true;
      if (gp.mapping !== 'standard') {
        // Viele Arcade-Encoder melden das Steuerkreuz als "Hat": Achsen 6/7 oder Achse 9 mit Stufenwerten
        // Ruhewerte merken, damit z. B. ein Schubregler, der auf -1 steht, nicht dauernd "links" bedeutet
        if (!this.padRest[gp.index] || this.padRest[gp.index].id !== gp.id) this.padRest[gp.index] = { id: gp.id, axes: gp.axes.slice() };
        const rest = this.padRest[gp.index].axes;
        const hx = (gp.axes[6] || 0) - (rest[6] || 0), hy = (gp.axes[7] || 0) - (rest[7] || 0);
        if (gp.axes.length > 7) {
          if (hx < -0.5) now.PadLeft = true;
          if (hx > 0.5) now.PadRight = true;
          if (hy < -0.5) now.PadUp = true;
          if (hy > 0.5) now.PadDown = true;
        }
        const hat = gp.axes[9];
        if (typeof hat === 'number' && hat >= -1.05 && hat <= 1.05) {
          const d = Math.round((hat + 1) * 3.5) % 8; // 0 hoch, 1 hoch-rechts, 2 rechts … 7 hoch-links
          if (d === 7 || d <= 1) now.PadUp = true;
          if (d >= 1 && d <= 3) now.PadRight = true;
          if (d >= 3 && d <= 5) now.PadDown = true;
          if (d >= 5 && d <= 7) now.PadLeft = true;
        }
      }
      const custom = this.padMap(gp.id);
      if (custom) {
        // eigene Belegung aus dem Admin-Bereich
        on(custom.jump, 'PadJump', 'PadA'); on(custom.suck, 'PadSuck'); on(custom.sprint, 'PadSprint'); on(custom.start, 'PadStart');
      } else if (gp.mapping === 'standard') {
        // Xbox-Layout: A springt, B/X saugt, Y springt, Schultertasten sprinten
        on(0, 'PadJump', 'PadA'); on(1, 'PadSuck'); on(2, 'PadSuck'); on(3, 'PadJump', 'PadY');
        for (let i = 4; i <= 7; i++) on(i, 'PadSprint');
        on(8, 'PadBack'); on(9, 'PadStart');
        on(12, 'PadUp'); on(13, 'PadDown'); on(14, 'PadLeft'); on(15, 'PadRight');
      } else {
        // einfacher USB-Joystick: Feuerknopf saugt, Knopf 2/3 springen, weitere sprinten
        on(0, 'PadSuck', 'PadA'); on(1, 'PadJump'); on(2, 'PadJump');
        for (let i = 3; i <= 7; i++) on(i, 'PadSprint');
        on(8, 'PadBack'); on(9, 'PadStart');
      }
    }
    if (any) Sound.init();
    if (typeof Overlay !== 'undefined' && Overlay.visible) { for (const c of PAD_CODES) this.keys[c] = false; this.padPrev = now; return; }
    for (const c of PAD_CODES) {
      if (now[c] && !this.padPrev[c]) this.just[c] = true;
      this.keys[c] = !!now[c];
    }
    this.padPrev = now;
  },
  padMap(id) {
    if (!this.padMaps) this.padMaps = Store.load('vakuumprof_padmap_v1', {});
    return this.padMaps[id] || null;
  },
  savePadMap(id, map) {
    this.padMaps = Store.load('vakuumprof_padmap_v1', {});
    if (map) this.padMaps[id] = map; else delete this.padMaps[id];
    Store.save('vakuumprof_padmap_v1', this.padMaps);
  },
  down(a) { return this.map[a].some(c => this.keys[c]); },
  pressed(a) { return this.map[a].some(c => this.just[c]); },
  endFrame() { this.just = {}; },
  clear() { this.keys = {}; this.just = {}; }
};
