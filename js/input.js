'use strict';
// Tastatur. Bewusst keine Shift-Taste (Windows-Einrastfunktion!) und keine Strg-Kombis.
const Input = {
  keys: {},
  just: {},
  map: {
    left: ['ArrowLeft', 'KeyA'],
    right: ['ArrowRight', 'KeyD'],
    jump: ['Space', 'ArrowUp', 'KeyW'],
    suck: ['KeyX', 'KeyC'],
    start: ['Enter', 'NumpadEnter', 'Space'],
    back: ['Escape'],
    mute: ['KeyM'],
    fullscreen: ['KeyF']
  },
  gameKeys: new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space', 'Enter', 'Tab', 'Backspace']),

  init() {
    window.addEventListener('keydown', e => {
      Sound.init();
      if (e.ctrlKey && e.shiftKey && e.code === 'KeyA') {
        e.preventDefault();
        Game.requestAdmin();
        return;
      }
      if (Overlay.visible) return;
      if (!e.repeat && !this.keys[e.code]) this.just[e.code] = true;
      this.keys[e.code] = true;
      if (this.gameKeys.has(e.code)) e.preventDefault();
    });
    window.addEventListener('keyup', e => { this.keys[e.code] = false; });
    window.addEventListener('blur', () => this.clear());
    window.addEventListener('mousedown', () => Sound.init());
    window.addEventListener('contextmenu', e => e.preventDefault());
  },
  down(a) { return this.map[a].some(c => this.keys[c]); },
  pressed(a) { return this.map[a].some(c => this.just[c]); },
  endFrame() { this.just = {}; },
  clear() { this.keys = {}; this.just = {}; }
};
