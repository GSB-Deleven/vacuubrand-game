'use strict';
// 5x7 Pixel-Schrift (nur Grossbuchstaben, wie auf dem Game Boy)
const FONT_GLYPHS = {
  'A': '.XXX. X...X X...X XXXXX X...X X...X X...X',
  'B': 'XXXX. X...X X...X XXXX. X...X X...X XXXX.',
  'C': '.XXX. X...X X.... X.... X.... X...X .XXX.',
  'D': 'XXXX. X...X X...X X...X X...X X...X XXXX.',
  'E': 'XXXXX X.... X.... XXXX. X.... X.... XXXXX',
  'F': 'XXXXX X.... X.... XXXX. X.... X.... X....',
  'G': '.XXX. X...X X.... X.XXX X...X X...X .XXXX',
  'H': 'X...X X...X X...X XXXXX X...X X...X X...X',
  'I': '.XXX. ..X.. ..X.. ..X.. ..X.. ..X.. .XXX.',
  'J': '..XXX ...X. ...X. ...X. ...X. X..X. .XX..',
  'K': 'X...X X..X. X.X.. XX... X.X.. X..X. X...X',
  'L': 'X.... X.... X.... X.... X.... X.... XXXXX',
  'M': 'X...X XX.XX X.X.X X.X.X X...X X...X X...X',
  'N': 'X...X X...X XX..X X.X.X X..XX X...X X...X',
  'O': '.XXX. X...X X...X X...X X...X X...X .XXX.',
  'P': 'XXXX. X...X X...X XXXX. X.... X.... X....',
  'Q': '.XXX. X...X X...X X...X X.X.X X..X. .XX.X',
  'R': 'XXXX. X...X X...X XXXX. X.X.. X..X. X...X',
  'S': '.XXXX X.... X.... .XXX. ....X ....X XXXX.',
  'T': 'XXXXX ..X.. ..X.. ..X.. ..X.. ..X.. ..X..',
  'U': 'X...X X...X X...X X...X X...X X...X .XXX.',
  'V': 'X...X X...X X...X X...X X...X .X.X. ..X..',
  'W': 'X...X X...X X...X X.X.X X.X.X X.X.X .X.X.',
  'X': 'X...X X...X .X.X. ..X.. .X.X. X...X X...X',
  'Y': 'X...X X...X .X.X. ..X.. ..X.. ..X.. ..X..',
  'Z': 'XXXXX ....X ...X. ..X.. .X... X.... XXXXX',
  'Ä': '.X.X. ..... .XXX. X...X XXXXX X...X X...X',
  'Ö': '.X.X. ..... .XXX. X...X X...X X...X .XXX.',
  'Ü': '.X.X. ..... X...X X...X X...X X...X .XXX.',
  '0': '.XXX. X...X X..XX X.X.X XX..X X...X .XXX.',
  '1': '..X.. .XX.. ..X.. ..X.. ..X.. ..X.. .XXX.',
  '2': '.XXX. X...X ....X ...X. ..X.. .X... XXXXX',
  '3': 'XXXX. ....X ....X .XXX. ....X ....X XXXX.',
  '4': '...X. ..XX. .X.X. X..X. XXXXX ...X. ...X.',
  '5': 'XXXXX X.... XXXX. ....X ....X X...X .XXX.',
  '6': '.XXX. X.... X.... XXXX. X...X X...X .XXX.',
  '7': 'XXXXX ....X ...X. ..X.. .X... .X... .X...',
  '8': '.XXX. X...X X...X .XXX. X...X X...X .XXX.',
  '9': '.XXX. X...X X...X .XXXX ....X ....X .XXX.',
  '.': '..... ..... ..... ..... ..... .XX.. .XX..',
  ',': '..... ..... ..... ..... .XX.. ..X.. .X...',
  ':': '..... .XX.. .XX.. ..... .XX.. .XX.. .....',
  '!': '..X.. ..X.. ..X.. ..X.. ..X.. ..... ..X..',
  '?': '.XXX. X...X ....X ...X. ..X.. ..... ..X..',
  '-': '..... ..... ..... .XXX. ..... ..... .....',
  '+': '..... ..X.. ..X.. XXXXX ..X.. ..X.. .....',
  '/': '....X ...X. ...X. ..X.. .X... .X... X....',
  "'": '..X.. ..X.. ..... ..... ..... ..... .....',
  '"': '.X.X. .X.X. ..... ..... ..... ..... .....',
  '(': '...X. ..X.. .X... .X... .X... ..X.. ...X.',
  ')': '.X... ..X.. ...X. ...X. ...X. ..X.. .X...',
  '%': 'XX..X XX.X. ...X. ..X.. .X... .X.XX X..XX',
  '#': '.X.X. XXXXX .X.X. .X.X. .X.X. XXXXX .X.X.',
  '<': '...X. ..X.. .X... X.... .X... ..X.. ...X.',
  '>': '.X... ..X.. ...X. ....X ...X. ..X.. .X...',
  '=': '..... ..... XXXXX ..... XXXXX ..... .....',
  '·': '..... ..... ..... ..X.. ..... ..... .....',
  '×': '..... X...X .X.X. ..X.. .X.X. X...X .....',
  '@': '.XXX. X...X X.XXX X.X.X X.XXX X.... .XXX.',
  '_': '..... ..... ..... ..... ..... ..... XXXXX',
  '&': '.XX.. X..X. X.X.. .X... X.X.X X..X. .XX.X',
  '←': '..... ..X.. .X... XXXXX .X... ..X.. .....',
  '→': '..... ..X.. ...X. XXXXX ...X. ..X.. .....',
  '↑': '..X.. .XXX. X.X.X ..X.. ..X.. ..X.. .....',
  '↓': '..... ..X.. ..X.. ..X.. X.X.X .XXX. ..X..',
  '♥': '..... .X.X. XXXXX XXXXX .XXX. ..X.. .....',
  '★': '..X.. ..X.. XXXXX .XXX. .X.X. X...X .....'
};

const Font = {
  cache: {},
  glyph(ch, color) {
    const key = ch + color;
    let c = this.cache[key];
    if (c) return c;
    let data = FONT_GLYPHS[ch];
    if (!data) {
      const base = ch.normalize('NFD')[0];
      data = FONT_GLYPHS[base] || FONT_GLYPHS['?'];
    }
    c = document.createElement('canvas');
    c.width = 5; c.height = 7;
    const g = c.getContext('2d');
    g.fillStyle = color;
    data.split(' ').forEach((row, y) => {
      for (let x = 0; x < 5; x++) if (row[x] === 'X') g.fillRect(x, y, 1, 1);
    });
    this.cache[key] = c;
    return c;
  },
  width(text, s) {
    s = s || 1;
    return Math.max(...String(text).split('\n').map(l => l.length)) * 6 * s - s;
  },
  // opt: color, scale, align ('left' | 'center' | 'right'), shadow, outline, lineHeight
  draw(ctx, text, x, y, opt) {
    opt = opt || {};
    const s = opt.scale || 1;
    const color = opt.color || '#ffffff';
    const lines = String(text).toUpperCase().split('\n');
    lines.forEach((line, li) => {
      const w = line.length * 6 * s - s;
      let lx = x;
      if (opt.align === 'center') lx = Math.round(x - w / 2);
      else if (opt.align === 'right') lx = x - w;
      const ly = y + li * (opt.lineHeight || 9) * s;
      if (opt.outline) {
        for (const [ox, oy] of [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, -1], [-1, 1], [1, 1]]) {
          this._line(ctx, line, lx + ox * s, ly + oy * s, opt.outline, s);
        }
      } else if (opt.shadow) {
        this._line(ctx, line, lx + s, ly + s, opt.shadow, s);
      }
      this._line(ctx, line, lx, ly, color, s);
    });
  },
  _line(ctx, line, x, y, color, s) {
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === ' ') continue;
      ctx.drawImage(this.glyph(ch, color), x + i * 6 * s, y, 5 * s, 7 * s);
    }
  }
};
