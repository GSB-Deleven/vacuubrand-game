'use strict';
// Tastatur. Bewusst nur Pfeiltasten + Leertaste + Shift/Ctrl, damit Ctrl + Buchstabe
// keine Browser-Funktionen (z.B. Fenster schliessen) auslösen kann.
// Dazu Gamepads (Xbox & Co.) und USB-Joysticks: sie erzeugen virtuelle "Pad…"-Tasten.
const PAD_CODES = ['PadLeft', 'PadRight', 'PadUp', 'PadDown', 'PadJump', 'PadSuck', 'PadSprint', 'PadStart', 'PadBack', 'PadA', 'PadY'];
const Input = {
  keys: {},
  just: {},
  map: {
    left: ['ArrowLeft', 'PadLeft'],
    right: ['ArrowRight', 'PadRight'],
    jump: ['ArrowUp', 'PadUp', 'PadJump'],
    down: ['ArrowDown', 'PadDown'],
    suck: ['Space', 'PadSuck'],
    sprint: ['ShiftLeft', 'ShiftRight', 'ControlLeft', 'ControlRight', 'PadSprint'],
    start: ['Enter', 'NumpadEnter', 'Space', 'PadStart', 'PadA'],
    back: ['Escape', 'PadBack'],
    pause: ['Escape', 'PadStart', 'PadBack'],   // Pause ein/aus
    abort: ['Enter', 'NumpadEnter'],            // Runde abbrechen (nur Tastatur, fürs Standpersonal)
    mute: ['KeyM'],
    fullscreen: ['KeyF'],
    board: ['KeyB', 'PadY']
  },
  padPrev: {},
  padName: '',
  padToast: 0,
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
      if (gp.mapping === 'standard') {
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
  down(a) { return this.map[a].some(c => this.keys[c]); },
  pressed(a) { return this.map[a].some(c => this.just[c]); },
  endFrame() { this.just = {}; },
  clear() { this.keys = {}; this.just = {}; }
};
