'use strict';
// Pixelart: Figuren als Zeichen-Raster, Gegenstände und Kacheln per Code gemalt.
const PAL = {
  k: '#1a1c2c', w: '#ffffff', W: '#d6dde8', g: '#a7b3c4', G: '#5d6b80',
  s: '#ffcfa6', S: '#e8a47c', a: '#ffcfa6', l: '#c8f2ff', L: '#6fcbe8', e: '#1a1c2c',
  r: '#ff8f8f', m: '#8a2a3a', c: '#ffffff', C: '#c3cedd', p: '#34507a',
  h: '#6b3f22', b: '#3aa0e8', B: '#1f5fa8', n: '#7be07b', N: '#2f9e4f', o: '#ffa53a',
  O: '#d1621a', v: '#7b5fb8', V: '#e6dcff', q: '#b4f7d4', Q: '#3fae7c', y: '#f9b000',
  Y: '#c9921e', R: '#e04848', u: '#f7a531', U: '#d4711c'
};
// Farben aus dem VACUUBRAND-Maskottchen (Pin "Pressure Control")
// Firmenfarben wie auf vacuubrand.com: Stahlblau, Gelb, Hellgrau, Hellblau
const THEME = { navy: '#46648c', navyDark: '#34507a', gold: '#f9b000', light: '#e9edf2', sky: '#7b9cc0', blue: '#4f8fcf', ink: '#1a1c2c' };

const SPR = {};
const ENEMY_SPRITE_NAMES = new Set(['drop', 'dust', 'cloud', 'hotcloud', 'flask', 'beaker', 'paper', 'medium', 'petri', 'plate', 'ice', 'schlenk', 'bubble', 'cylinder', 'testtube', 'eppi', 'mol_h2o', 'mol_o2', 'mol_n2', 'mol_h2o2', 'mol_meoh', 'mol_etoh']);

function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  c.getContext('2d', { willReadFrequently: true }); // Sprites werden beim Start einmal nachbearbeitet
  return c;
}

function spriteFromGrid(rows, name, over) {
  const w = Math.max(...rows.map(r => r.length));
  rows.forEach((r, i) => { if (r.length !== w) console.warn('Sprite ' + name + ' Zeile ' + i + ' hat Länge ' + r.length + ' statt ' + w); });
  const c = makeCanvas(w, rows.length);
  const g = c.getContext('2d');
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const col = (over && over[row[x]]) || PAL[row[x]];
      if (!col) continue;
      g.fillStyle = col;
      g.fillRect(x, y, 1, 1);
    }
  });
  return c;
}

function flipCanvas(c) {
  const f = makeCanvas(c.width, c.height);
  const g = f.getContext('2d');
  g.translate(c.width, 0);
  g.scale(-1, 1);
  g.drawImage(c, 0, 0);
  return f;
}

function paint(w, h, fn) {
  const c = makeCanvas(w, h);
  const g = c.getContext('2d');
  const P = {
    g,
    px(x, y, col) { g.fillStyle = col; g.fillRect(Math.floor(x), Math.floor(y), 1, 1); },
    rect(x, y, rw, rh, col) { g.fillStyle = col; g.fillRect(x, y, rw, rh); },
    ell(cx, cy, rx, ry, col) {
      g.fillStyle = col;
      for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) {
        for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
          const dx = (x + 0.5 - cx) / rx, dy = (y + 0.5 - cy) / ry;
          if (dx * dx + dy * dy <= 1) g.fillRect(x, y, 1, 1);
        }
      }
    }
  };
  fn(P);
  return c;
}

function addOutline(c, col) {
  const w = c.width, h = c.height;
  const g = c.getContext('2d');
  const d = g.getImageData(0, 0, w, h).data;
  const on = (x, y) => x >= 0 && y >= 0 && x < w && y < h && d[(y * w + x) * 4 + 3] > 0;
  g.fillStyle = col;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!on(x, y) && (on(x - 1, y) || on(x + 1, y) || on(x, y - 1) || on(x, y + 1))) g.fillRect(x, y, 1, 1);
    }
  }
  return c;
}
const outlined = (w, h, fn, col) => addOutline(paint(w, h, fn), col || PAL.k);

// Farbe aufhellen/abdunkeln (f > 1 heller, f < 1 dunkler)
function tint(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(v => Math.round(f >= 1 ? v + (255 - v) * (f - 1) : v * f));
  return '#' + ch.map(v => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')).join('');
}

// 16-Bit-Look (SNES): Licht von oben links, Schatten unten rechts und farbige Konturen statt Schwarz
function shade16(c) {
  const w = c.width, h = c.height, g = c.getContext('2d');
  const img = g.getImageData(0, 0, w, h), d = img.data, src = new Uint8ClampedArray(d);
  const at = (x, y) => (y * w + x) * 4;
  const solid = (x, y) => x >= 0 && y >= 0 && x < w && y < h && src[at(x, y) + 3] > 0;
  const ink = (x, y) => { const i = at(x, y); return src[i] < 50 && src[i + 1] < 50 && src[i + 2] < 60; };
  const edge = (x, y) => !solid(x, y) || ink(x, y);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!solid(x, y)) continue;
      const i = at(x, y);
      if (ink(x, y)) {
        // Kontur: dunkle Version der angrenzenden Farbe
        for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
          if (solid(nx, ny) && !ink(nx, ny)) {
            const j = at(nx, ny);
            d[i] = src[j] * 0.3 + 12; d[i + 1] = src[j + 1] * 0.3 + 12; d[i + 2] = src[j + 2] * 0.3 + 22;
            break;
          }
        }
        continue;
      }
      let f = 1;
      if (edge(x, y - 1) || edge(x - 1, y)) f = 1.18;
      else if (edge(x, y + 1) || edge(x + 1, y)) f = 0.78;
      else if (edge(x + 1, y + 1)) f = 0.9;
      if (f !== 1) for (let k = 0; k < 3; k++) d[i + k] = f > 1 ? src[i + k] + (255 - src[i + k]) * (f - 1) : src[i + k] * f;
    }
  }
  g.putImageData(img, 0, 0);
  return c;
}

function addPair(name, c) {
  SPR[name] = c;
  SPR[name + '_L'] = flipCanvas(c);
}

// ---------------------------------------------------------------------
// Professor: oranges Wuschelhaar, runde Brille, weisser Kittel (wie das Maskottchen)
const PROF_HEAD = [
  '....u..uu.u.u...',
  '..uuuuuuuuuuuu..',
  '.uuUuuuuuuuUuuu.',
  'uuU' + 'k'.repeat(10) + 'uuu',
  'uuk' + 's'.repeat(10) + 'kUu',
  '.uksskkssskkskU.',
  'uuksklekkklekkUu',
  '.uksskkssskkskU.',
  '.uksssssssssSSk.',
  '..kssmmmmmsssk..',
  '...' + 'k'.repeat(10) + '...'
];
const PROF_BODY = [
  '....kcCcccCck...',
  '...kcccyycccck..',
  '..kCccccccccaak.',
  '..kCccccccccck..',
  '...kCccccccCk...'
];
const PROF_POSES = {
  idle: PROF_HEAD.concat(PROF_BODY, ['....kppk.kppk...', '...khhhk.khhhk..']),
  walk1: PROF_HEAD.concat(PROF_BODY, ['...kppk...kppk..', '..khhhk...khhhk.']),
  walk2: PROF_HEAD.concat(PROF_BODY, ['.....kppppk.....', '.....khhhhhk....']),
  jump: PROF_HEAD.concat(PROF_BODY, ['...kppk..kppk...', '..khhk....khhk..']),
  duck: PROF_HEAD.concat(['....kcCcccCck...', '..kCccccccccaak.', '..khhhkk.khhhk..'])
};

const ENEMY_GRIDS = {
  drop: [
    '...kk...',
    '..kbbk..',
    '..kbbk..',
    '.kblbbk.',
    'kbllbbbk',
    'kbebbebk',
    'kbbbbbbk',
    '.kbbbbk.',
    '..kkkk..'
  ],
  dust: [
    '.G..G..G..',
    'GgGGgGGgG.',
    'GggggggggG',
    'GgwkggwkgG',
    'GggggggggG',
    'GgggmmgggG',
    '.GggggggG.',
    '..G.G.G.G.'
  ],
  dust2: [
    '..G..G..G.',
    '.GgGGgGGgG',
    'GggggggggG',
    'GgwkggwkgG',
    'GggggggggG',
    'GgggmmgggG',
    '.GggggggG.',
    '.G.G.G.G..'
  ],
  cloud: [
    '....vvv.......',
    '..vvVVVvvv....',
    '.vVVVVVVVVvv..',
    'vVVwkVVVwkVVv.',
    'vVVVVVVVVVVVVv',
    'vVVVVVmmVVVVVv',
    '.vVVVVVVVVVVv.',
    '..vvVvvVvvVv..',
    '....v..v..v...'
  ],
  flask: [
    '...kkkk...',
    '...kllk...',
    '...kllk...',
    '..kllllk..',
    '.kllllllk.',
    'kllllllllk',
    'knnnnnnnnk',
    'knwennwenk',
    'knnnnnnnnk',
    '.knnmmnnk.',
    '..kkkkkk..',
    '..k....k..'
  ],
  flask2: [
    '...kkkk...',
    '...kllk...',
    '...kllk...',
    '..kllllk..',
    '.kllllllk.',
    'kllllllllk',
    'knnnnnnnnk',
    'knwennwenk',
    'knnnnnnnnk',
    '.knnmmnnk.',
    '..kkkkkk..',
    '...k..k...'
  ],
  beaker: [
    'kkkkkkkkkk',
    '.klllllllk',
    '.klllllllk',
    '.koooooook',
    '.koweoweok',
    '.koooooook',
    '.koommoook',
    '.koooooook',
    '..kkkkkkk.',
    '..k.....k.'
  ],
  beaker2: [
    'kkkkkkkkkk',
    '.klllllllk',
    '.klllllllk',
    '.koooooook',
    '.koweoweok',
    '.koooooook',
    '.koommoook',
    '.koooooook',
    '..kkkkkkk.',
    '...k...k..'
  ]
};

// Zonen: Anwendungen der Pumpen
const ZONE_STYLE = [
  { name: 'FILTRATIONSLABOR', wall: '#e9edf2', wall2: '#d5dde6', base: '#b7c6d6', floorTop: '#6d87ab', floor: '#46648c', line: '#34507a', brick: '#f2f5f8', mortar: '#b9c6d4',
    bench: ['buchner', 'me1c', 'buchner', 'window2'], wall_: ['vacuulan', 'periodic'] },
  { name: 'ZELLKULTUR-LABOR', wall: '#e9f3ea', wall2: '#d4e8d6', base: '#b5d1b8', floorTop: '#7fa38a', floor: '#5c7d66', line: '#44604d', brick: '#f4faf5', mortar: '#b9cfbd',
    bench: ['hood', 'incubator', 'plates'], wall_: ['vacuulan', 'periodic'] },
  { name: 'VERDAMPFER-LABOR', wall: '#efe3cf', wall2: '#e2d2b7', base: '#c7ae88', floorTop: '#8a6a45', floor: '#6b5033', line: '#523b24', brick: '#f5efe4', mortar: '#cbb893',
    bench: ['rotavap', 'concentrator', 'oven', 'rotavap'], wall_: ['vacuulan', 'periodic'] },
  { name: 'HOCHVAKUUM-TECHNIKUM', wall: '#d9dfea', wall2: '#c5cedd', base: '#8f9bb3', floorTop: '#5a6478', floor: '#3e4658', line: '#2b3140', brick: '#e8ecf2', mortar: '#a9b4c5',
    bench: ['freezedryer', 'distill', 'turbo'], wall_: ['schlenk', 'vacuulan'] }
];

function buildSprites() {
  const k = PAL.k;
  // Professor: je Pose 4 Varianten (Schuhe / Handschuhe)
  for (const pose of Object.keys(PROF_POSES)) {
    for (const shoes of [0, 1]) {
      for (const gloves of [0, 1]) {
        const over = {};
        if (shoes) over.h = '#26283a';
        if (gloves) over.a = '#3aa0e8';
        addPair('prof_' + pose + '_' + shoes + gloves, spriteFromGrid(PROF_POSES[pose], 'prof_' + pose, over));
      }
    }
  }
  // Gegner aus Rastern
  for (const key of Object.keys(ENEMY_GRIDS)) SPR[key] = spriteFromGrid(ENEMY_GRIDS[key], key);
  SPR.hotcloud = spriteFromGrid(ENEMY_GRIDS.cloud, 'hotcloud', { v: '#c0392b', V: '#ffc2a0' });

  // Gegner per Code
  for (let f = 0; f < 2; f++) {
    const sfx = f ? '2' : '';
    SPR['paper' + sfx] = outlined(16, 13, P => {
      P.ell(8, 6.5, 6.5, f ? 4.5 : 5.5, '#ffffff');
      P.rect(8, 2, 1, 9, '#d6dde8'); P.rect(2, 6, 13, 1, '#d6dde8');
      P.px(4, 9, '#8b93a6'); P.px(11, 4, '#8b93a6'); P.px(12, 8, '#8b93a6');
      P.px(6, 5, k); P.px(10, 5, k); P.rect(7, 8, 3, 1, PAL.m);
    }, '#5d6b80');
    SPR['medium' + sfx] = outlined(18, 9, P => {
      P.ell(9, 5, f ? 7.5 : 8, f ? 3 : 2.6, '#ff8fb8');
      P.rect(4, 4, 3, 1, '#ffd0e2');
      P.px(7, 4, k); P.px(11, 4, k);
    }, '#b8386e');
    SPR['petri' + sfx] = outlined(18, 11, P => {
      P.rect(1, 7, 16, 3, '#e8f6ff');
      P.rect(1, 7, 16, 1, '#ffffff');
      P.ell(9 + (f ? 1 : 0), 6, 4.5, 3.5, '#7be07b');
      P.px(8 + f, 5, k); P.px(11 + f, 5, k);
    });
    SPR['plate' + sfx] = outlined(18, 11, P => {
      P.rect(1, 2, 16, 6, '#f4f7fb');
      for (let i = 0; i < 5; i++) for (let j = 0; j < 2; j++) P.px(2 + i * 3, 3 + j * 3, '#ff8fb8');
      P.px(5, 3, k); P.px(11, 3, k);
      if (f) { P.rect(3, 8, 1, 2, k); P.rect(14, 8, 1, 2, k); } else { P.rect(2, 8, 1, 2, k); P.rect(15, 8, 1, 2, k); }
    });
    // Reagenzglas: Randwulst oben, runder Boden, farbige Flüssigkeit
    SPR['testtube' + sfx] = outlined(11, 19, P => {
      P.rect(2, 1, 7, 1, '#ffffff');
      P.rect(3, 2, 5, 10, '#e6f6ff');
      P.ell(5.5, 12, 2.5, 3, '#e6f6ff');
      P.rect(3, 8, 5, 4, '#3d9bd8'); P.ell(5.5, 12, 2.5, 3, '#3d9bd8'); P.rect(3, 8, 5, 1, '#8fcbf0');
      P.rect(4, 3, 1, 4, '#ffffff');
      P.px(4, 5, k); P.px(7, 5, k);
      if (f) { P.px(3, 16, k); P.px(7, 16, k); } else { P.px(4, 16, k); P.px(6, 16, k); }
    });
    // Eppi: konische Spitze, Snap-Cap seitlich aufgeklappt
    SPR['eppi' + sfx] = outlined(15, 16, P => {
      P.rect(3, 3, 6, 1, '#f4f7fa');
      P.rect(4, 4, 4, 5, '#f4f7fa');
      P.rect(5, 9, 2, 2, '#f4f7fa'); P.px(5, 11, '#f4f7fa');
      P.rect(4, 7, 4, 2, '#f9b000'); P.rect(5, 9, 2, 1, '#f9b000');
      P.rect(9, 2, 1, 2, '#dfe5ec');
      P.rect(10, f ? 0 : 1, 3, 3, '#dfe5ec');
      P.px(5, 5, k); P.px(7, 5, k);
    });
    SPR['ice' + sfx] = outlined(15, 15, P => {
      const c1 = '#e6fbff', c2 = '#8fd8f0';
      P.rect(7, 1, 1, 13, c2); P.rect(1, 7, 13, 1, c2);
      for (let i = 2; i < 13; i++) { P.px(i, i, c2); P.px(14 - i, i, c2); }
      P.ell(7.5, 7.5, f ? 3.5 : 4, f ? 3.5 : 4, c1);
      P.px(6, 7, k); P.px(9, 7, k);
    }, '#3a8fb8');
    SPR['schlenk' + sfx] = outlined(16, 18, P => {
      P.rect(6, 1, 3, 6, '#e6dcff');
      P.rect(9, 3, 5, 2, '#e6dcff');
      P.rect(12, 2, 2, 1, '#3aa0e8');
      P.ell(7.5, 11, 5.5, 5, '#e6dcff');
      P.rect(3, 11, 9, 4, '#9b6fd6');
      P.px(6, 9, k); P.px(9, 9, k);
      if (f) { P.px(5, 16, k); P.px(9, 16, k); } else { P.px(4, 16, k); P.px(10, 16, k); }
    });
    SPR['bubble' + sfx] = outlined(15, 15, P => {
      P.ell(7.5, 7.5, f ? 5.5 : 6, f ? 6 : 5.5, '#bfefff');
      P.rect(4, 4, 2, 1, '#ffffff'); P.px(4, 5, '#ffffff');
      P.px(6, 7, k); P.px(9, 7, k); P.rect(7, 10, 2, 1, PAL.m);
    }, '#3a8fb8');
  }

  // Gasflasche (Argon) und Lösemittelfass
  SPR.cylinder = outlined(10, 19, P => {
    P.rect(4, 1, 2, 2, '#5d6b80'); P.rect(3, 3, 4, 1, '#5d6b80');
    P.ell(5, 6.5, 3, 2.5, '#a7b3c4'); P.rect(2, 6, 6, 12, '#a7b3c4');
    P.rect(2, 6, 6, 2, '#2f6e4f');
    P.rect(3, 9, 1, 7, '#e8eef5');
    P.px(4, 11, k); P.px(6, 11, k); P.rect(4, 13, 3, 1, PAL.m);
  });
  SPR.barrel = outlined(14, 17, P => {
    P.rect(1, 2, 12, 14, '#1f5fa8'); P.rect(1, 2, 12, 1, '#3aa0e8');
    P.rect(1, 5, 12, 1, '#174a85'); P.rect(1, 13, 12, 1, '#174a85');
    P.rect(2, 3, 1, 12, '#5fb6f0'); P.rect(5, 7, 4, 4, '#ffa53a');
    P.px(6, 8, k); P.px(8, 8, k); P.rect(6, 10, 3, 1, PAL.m);
  });

  // Boss: Dampf-Krake (2 Frames)
  for (let f = 0; f < 2; f++) {
    SPR['boss' + f] = outlined(38, 36, P => {
      const V = '#e6dcff', V2 = '#c7b5f5';
      for (let i = 0; i < 5; i++) {
        const tx = 7 + i * 5;
        for (let j = 0; j < 10; j++) {
          const off = Math.round(Math.sin((j + f * 2 + i * 1.7) * 0.8) * 1.5);
          P.rect(tx + off, 21 + j, j > 6 ? 2 : 3, 1, V2);
        }
      }
      P.ell(19, 14, 15, 10, V2); P.ell(11, 10, 7, 6, V); P.ell(27, 9, 8, 6, V);
      P.ell(19, 7, 8, 5, V); P.ell(19, 16, 13, 7, V);
      P.ell(14, 13, 3, 3.5, '#ffffff'); P.ell(24, 13, 3, 3.5, '#ffffff');
      P.rect(14 + f, 13, 2, 2, k); P.rect(24 + f, 13, 2, 2, k);
      [[10, 8], [11, 8], [12, 9], [13, 9], [14, 10], [28, 8], [27, 8], [26, 9], [25, 9], [24, 10]].forEach(([x, y]) => P.px(x, y, k));
      P.rect(15, 19, 9, 3, PAL.m);
      P.px(16, 19, '#ffffff'); P.px(19, 19, '#ffffff'); P.px(22, 19, '#ffffff');
    }, '#7b5fb8');
  }

  // Pumpen
  const blue = '#3d9bd8', blueD = '#2a78b5', alu = '#dfe5ec', rib = '#b7c2cd', grey = '#c9d3dc', greyD = '#8e98a4', glass = '#e6f6ff';
  // ME 1C: Aluminium-Mittelteil mit blauen Endkappen
  SPR.pump1 = outlined(19, 12, P => {
    P.rect(4, 3, 10, 6, alu); P.rect(4, 5, 10, 1, rib); P.rect(4, 7, 10, 1, rib);
    P.rect(4, 2, 10, 1, blue);
    P.rect(1, 2, 3, 8, blue); P.rect(14, 2, 3, 8, blue);
    P.rect(1, 9, 3, 1, blueD); P.rect(14, 9, 3, 1, blueD);
    P.rect(8, 1, 2, 1, k);
    P.rect(15, 4, 1, 3, '#ffffff');
    P.rect(17, 3, 1, 2, '#e8eef5');
    P.rect(2, 10, 2, 1, k); P.rect(14, 10, 2, 1, k);
  });
  // PC 3001 VARIO select: blaues Oberteil, graues Gehäuse, Touchscreen, Kühler und zwei Rundkolben
  SPR.pump2 = outlined(23, 21, P => {
    P.rect(2, 1, 8, 1, blueD);
    P.rect(2, 2, 8, 8, blue); P.rect(7, 3, 1, 6, '#ffffff');
    P.rect(1, 10, 10, 8, grey);
    P.rect(2, 11, 6, 5, k); P.rect(3, 12, 4, 3, '#8fd0f0'); P.px(5, 13, '#ffffff');
    P.rect(1, 18, 17, 1, '#b8c3cd');
    P.rect(12, 1, 4, 8, '#b8c3cd'); P.rect(12, 1, 1, 8, '#eef2f6');
    P.rect(11, 9, 5, 2, greyD);
    P.rect(13, 11, 1, 2, glass); P.ell(13.5, 15, 2.5, 2.5, glass); P.px(12, 14, '#ffffff');
    P.rect(16, 9, 3, 1, greyD); P.rect(19, 10, 1, 2, glass); P.ell(19.5, 14, 2.3, 2.3, glass); P.px(18, 13, '#ffffff');
  });
  // VACUU·PURE 10C: weisse Front, graue Seite, schwarzer Flansch oben
  SPR.pump3 = outlined(18, 17, P => {
    P.rect(1, 2, 15, 2, '#e9edf1');
    P.rect(1, 4, 10, 11, '#f7f9fb');
    P.rect(11, 4, 5, 11, greyD); P.rect(11, 4, 1, 11, '#a9b3be');
    P.rect(12, 11, 3, 1, '#5d6b80'); P.rect(12, 13, 3, 1, '#5d6b80');
    P.rect(2, 1, 2, 3, k);
    P.rect(6, 2, 4, 2, k); P.px(7, 2, blue);
    P.rect(3, 7, 6, 2, '#b8c3cd');
    P.rect(7, 11, 2, 2, k);
    P.rect(2, 13, 5, 1, '#c9d3dc');
    P.rect(2, 15, 2, 1, k); P.rect(13, 15, 2, 1, k);
  });
  // BVC professional: weisser Sockel mit Bedienfeld, grosse Sammelflasche, blaues Pumpenmodul
  SPR.bvc = outlined(18, 21, P => {
    P.rect(6, 1, 1, 1, '#c8d4e0');
    P.rect(3, 2, 7, 2, '#ffffff');
    P.rect(2, 4, 9, 11, '#f4f7fa'); P.rect(3, 5, 1, 8, '#ffffff');
    P.rect(3, 10, 7, 4, '#ffb3cf');
    P.rect(11, 4, 5, 1, blueD); P.rect(11, 5, 5, 12, blue);
    P.rect(12, 7, 4, 1, grey); P.rect(12, 9, 4, 1, grey); P.rect(12, 11, 4, 1, grey); P.rect(12, 13, 4, 1, grey);
    P.rect(1, 15, 16, 4, '#eef1f4');
    P.rect(2, 15, 5, 3, '#2b2f3a'); P.px(3, 16, blue); P.px(5, 16, blue);
    P.px(8, 17, blue);
  });
  // VACUU·VIEW extended (Vakuum-Messgerät)
  SPR.view = outlined(12, 17, P => {
    P.rect(5, 1, 2, 3, '#a7b3c4');
    P.rect(2, 4, 8, 11, '#2b3a55');
    P.rect(3, 6, 6, 4, '#c8f2ff');
    P.rect(4, 7, 1, 2, k); P.rect(6, 7, 1, 2, k); P.px(7, 8, k);
    P.rect(4, 12, 4, 1, '#7be07b');
  });
  // Schutzausrüstung
  SPR.ppe_goggles = outlined(14, 8, P => {
    P.rect(1, 1, 12, 6, '#5d6b80');
    P.rect(2, 2, 4, 4, '#dff4fb'); P.rect(8, 2, 4, 4, '#dff4fb');
    P.rect(2, 2, 2, 1, '#ffffff'); P.rect(8, 2, 2, 1, '#ffffff'); P.px(2, 3, '#ffffff'); P.px(8, 3, '#ffffff');
    P.rect(4, 5, 2, 1, '#b7e3f2'); P.rect(10, 5, 2, 1, '#b7e3f2');
    P.rect(6, 3, 2, 2, '#8795a8');
  });
  SPR.ppe_gloves = outlined(11, 12, P => {
    P.rect(2, 4, 6, 6, '#3aa0e8');
    P.rect(2, 1, 1, 3, '#3aa0e8'); P.rect(4, 1, 1, 3, '#3aa0e8'); P.rect(6, 1, 1, 3, '#3aa0e8');
    P.rect(8, 5, 1, 2, '#3aa0e8');
    P.rect(2, 9, 6, 1, '#1f5fa8');
  });
  SPR.ppe_helmet = outlined(14, 10, P => {
    P.ell(7, 6, 5, 4.5, '#ffd23f');
    P.rect(1, 6, 12, 2, '#e0a000');
    P.rect(4, 3, 2, 1, '#fff3b0');
    P.rect(6, 2, 2, 4, '#e0a000');
  });
  SPR.ppe_shoes = outlined(13, 9, P => {
    P.rect(1, 2, 5, 4, '#26283a');
    P.rect(6, 4, 5, 2, '#26283a');
    P.rect(9, 4, 2, 2, '#a7b3c4');
    P.rect(1, 6, 11, 1, '#e0a000');
  });

  // Ausgangstür
  const door = (open) => paint(20, 34, P => {
    P.rect(0, 2, 20, 32, '#5d6b80'); P.rect(1, 3, 18, 31, '#8795a8');
    if (open) {
      P.rect(3, 6, 14, 28, k); P.rect(3, 6, 3, 28, '#2f9e4f'); P.rect(8, 0, 4, 2, '#7be07b');
    } else {
      P.rect(3, 6, 14, 28, THEME.navy); P.rect(6, 9, 8, 7, '#c8f2ff'); P.rect(6, 12, 8, 1, '#6fcbe8');
      P.rect(14, 21, 2, 3, THEME.gold); P.rect(8, 0, 4, 2, '#e04848');
    }
  });
  SPR.doorLocked = door(false);
  SPR.doorOpen = door(true);

  // Kacheln je Zone
  ZONE_STYLE.forEach((z, i) => {
    // Laborboden: glänzende Kante oben, darunter Fliesen mit Fugen, Glanzlichtern und Dither-Schatten
    SPR['groundTop' + i] = paint(16, 16, P => {
      P.rect(0, 0, 16, 16, z.floor);
      P.rect(0, 0, 16, 4, z.floorTop); P.rect(0, 0, 16, 1, '#ffffff'); P.rect(0, 1, 16, 1, tint(z.floorTop, 1.35));
      P.rect(0, 4, 16, 1, z.line);
      P.rect(0, 5, 16, 1, tint(z.floor, 1.15));
      P.rect(7, 5, 1, 11, z.line); P.rect(15, 5, 1, 11, z.line);
      P.rect(1, 6, 3, 1, tint(z.floor, 1.25)); P.rect(9, 6, 2, 1, tint(z.floor, 1.25));
      for (let y = 11; y < 16; y++) for (let x = (y % 2); x < 16; x += 2) if (y > 12 || x % 4 === 0) P.px(x, y, tint(z.floor, 0.88));
    });
    SPR['ground' + i] = paint(16, 16, P => {
      P.rect(0, 0, 16, 16, tint(z.floor, 0.9));
      P.rect(7, 0, 1, 16, z.line); P.rect(15, 0, 1, 16, z.line); P.rect(0, 15, 16, 1, z.line);
      for (let y = 0; y < 16; y++) for (let x = (y % 2); x < 16; x += 2) if (y > 9) P.px(x, y, tint(z.floor, 0.8));
    });
    // Laborpaneel: gebürstetes Metall mit Fase, Schrauben und Glanz
    SPR['brick' + i] = paint(16, 16, P => {
      P.rect(0, 0, 16, 16, tint(z.mortar, 0.75));
      P.rect(1, 1, 14, 14, z.brick);
      for (let x = 2; x < 14; x += 3) P.rect(x, 3, 1, 10, tint(z.brick, 0.96));
      P.rect(1, 1, 14, 1, '#ffffff'); P.rect(1, 2, 1, 12, '#ffffff');
      P.rect(1, 14, 14, 1, z.mortar); P.rect(14, 2, 1, 12, tint(z.brick, 0.9));
      P.rect(3, 3, 4, 1, '#ffffff'); P.px(3, 4, '#ffffff');
      [[2, 2], [13, 2], [2, 13], [13, 13]].forEach(([x, y]) => { P.px(x, y, tint(z.mortar, 0.6)); P.px(x - 1 + (x > 8 ? 0 : 1), y - 1 + (y > 8 ? 0 : 1), '#ffffff'); });
    });
  });

  // Rundkolben-Block (statt Fragezeichen)
  const FLASK = ['...XX...', '...XX...', '...XX...', '..XXXX..', '.XXXXXX.', 'XXLLLLXX', 'XLLLLLLX', '.XLLLLX.', '..XXXX..'];
  const shades = ['#ffffff', '#e8f6ff', '#c8f2ff'];
  const liquids = ['#3aa0e8', '#5fb6f0', '#3aa0e8'];
  shades.forEach((sh, f) => {
    SPR['q' + f] = paint(16, 16, P => {
      P.rect(0, 0, 16, 16, k);
      P.rect(1, 1, 14, 14, THEME.gold);
      P.rect(1, 1, 14, 1, '#ffd466'); P.rect(1, 1, 1, 14, '#ffd466');
      P.rect(1, 14, 14, 1, '#b87f00'); P.rect(14, 1, 1, 14, '#b87f00');
      [[2, 2], [13, 2], [2, 13], [13, 13]].forEach(([x, y]) => P.px(x, y, '#b86a00'));
      FLASK.forEach((row, y) => { for (let x = 0; x < 8; x++) if (row[x] !== '.') P.px(5 + x, 4 + y, '#b86a00'); });
      FLASK.forEach((row, y) => {
        for (let x = 0; x < 8; x++) {
          if (row[x] === 'X') P.px(4 + x, 3 + y, sh);
          else if (row[x] === 'L') P.px(4 + x, 3 + y, liquids[f]);
        }
      });
    });
  });
  SPR.used = paint(16, 16, P => {
    P.rect(0, 0, 16, 16, '#6d7a89'); P.rect(1, 1, 14, 14, '#c3ccd6');
    P.rect(1, 1, 14, 1, '#eef2f6'); P.rect(1, 14, 14, 1, '#9aa6b3');
    [[2, 2], [13, 2], [2, 13], [13, 13]].forEach(([x, y]) => P.px(x, y, '#8e98a4'));
  });

  // VACUU·LAN-Leitung als Plattform (mit und ohne Ventilmodul)
  [0, 1].forEach(v => {
    SPR['platform' + v] = paint(16, 16, P => {
      P.rect(0, 0, 16, 6, k);
      P.rect(0, 1, 16, 4, '#d5dde8');
      P.rect(0, 1, 16, 1, '#ffffff');
      P.rect(15, 0, 1, 6, '#8795a8');
      if (v) {
        P.rect(4, 5, 8, 7, k);
        P.rect(5, 6, 6, 5, '#e8eef5');
        P.rect(6, 7, 4, 1, THEME.navy);
        P.rect(7, 11, 2, 3, k); P.rect(6, 13, 4, 2, '#3aa0e8');
      }
    });
  });

  buildMolecules();
  // 16-Bit-Schattierung auf alle Figuren, Gegner und Items
  for (const key of Object.keys(SPR)) {
    if (/^(prof_|boss|pump|bvc|view|ppe_|coin)/.test(key) || ENEMY_SPRITE_NAMES.has(key.replace(/2$/, ''))) shade16(SPR[key]);
  }
  buildDecor();
}

// Molekül-Monster als Kugel-Stab-Modelle wie im Chemieunterricht
// O rot, H weiss, N blau, C dunkelgrau. Augen auf dem Hauptatom.
const MOLECULES = {
  mol_h2o: { w: 18, h: 15, eye: 0, atoms: [['O', 9, 6, 4], ['H', 3, 11, 2.5], ['H', 15, 11, 2.5]], bonds: [[0, 1, 1], [0, 2, 1]] },
  mol_o2: { w: 21, h: 12, eye: 0, atoms: [['O', 5, 6, 3.8], ['O', 15, 6, 3.8]], bonds: [[0, 1, 2]] },
  mol_n2: { w: 21, h: 12, eye: 0, atoms: [['N', 5, 6, 3.8], ['N', 15, 6, 3.8]], bonds: [[0, 1, 3]] },
  mol_h2o2: { w: 25, h: 15, eye: 1, atoms: [['H', 3, 4, 2.5], ['O', 9, 8, 3.6], ['O', 16, 6, 3.6], ['H', 21, 11, 2.5]], bonds: [[0, 1, 1], [1, 2, 1], [2, 3, 1]] },
  mol_meoh: { w: 23, h: 19, eye: 0, atoms: [['C', 8, 10, 3.8], ['O', 15, 10, 3.6], ['H', 3, 6, 2.2], ['H', 3, 14, 2.2], ['H', 8, 3, 2.2], ['H', 19, 15, 2.2]], bonds: [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1], [1, 5, 1]] },
  mol_etoh: { w: 29, h: 19, eye: 1, atoms: [['C', 7, 10, 3.6], ['C', 14, 8, 3.6], ['O', 21, 10, 3.4], ['H', 3, 6, 2.1], ['H', 3, 14, 2.1], ['H', 14, 2, 2.1], ['H', 13, 15, 2.1], ['H', 25, 15, 2.1]], bonds: [[0, 1, 1], [1, 2, 1], [0, 3, 1], [0, 4, 1], [1, 5, 1], [1, 6, 1], [2, 7, 1]] }
};
const ATOM_COL = { O: ['#e04848', '#ff8a8a'], H: ['#f4f7fa', '#ffffff'], N: ['#3d7bd8', '#8fb8f0'], C: ['#4a5160', '#8a93a3'] };

function buildMolecules() {
  for (const [name, m] of Object.entries(MOLECULES)) {
    for (let f = 0; f < 2; f++) {
      SPR[name + (f ? '2' : '')] = outlined(m.w, m.h, P => {
        const pos = m.atoms.map(([el, x, y, r]) => [x, y + (f && el === 'H' ? (x < m.w / 2 ? -1 : 1) : 0)]);
        // Stäbe (Bindungen)
        for (const [i, j, n] of m.bonds) {
          const [x1, y1] = pos[i], [x2, y2] = pos[j];
          const steps = Math.ceil(Math.hypot(x2 - x1, y2 - y1));
          const nx = -(y2 - y1) / (steps || 1), ny = (x2 - x1) / (steps || 1);
          for (let b = 0; b < n; b++) {
            const off = (b - (n - 1) / 2) * 2;
            for (let s = 0; s <= steps; s++) {
              const t = s / steps;
              P.px(x1 + (x2 - x1) * t + nx * off, y1 + (y2 - y1) * t + ny * off, '#a7b3c4');
            }
          }
        }
        // Kugeln (Atome) mit Glanzpunkt
        m.atoms.forEach(([el, , , r], i) => {
          const [x, y] = pos[i];
          const [c, hl] = ATOM_COL[el];
          P.ell(x, y, r, r, c);
          P.px(x - r / 2, y - r / 2, hl);
        });
        // Augen auf dem Hauptatom
        const [ex, ey] = pos[m.eye];
        P.rect(Math.round(ex - 2), Math.round(ey - 1), 1, 2, '#ffffff'); P.rect(Math.round(ex + 1), Math.round(ey - 1), 1, 2, '#ffffff');
        P.px(Math.round(ex - 2), Math.round(ey), PAL.k); P.px(Math.round(ex + 1), Math.round(ey), PAL.k);
      });
    }
  }
}

// ---------------------------------------------------------------------
// Hintergrund-Geräte (einmal vorgezeichnet)
function buildDecor() {
  const k = PAL.k, glass = '#dff4fb', glass2 = '#b7e3f2', metal = '#a7b3c4', white = '#f4f7fb';
  const D = {};
  // Filtration: Büchnertrichter auf Saugflasche
  D.buchner = outlined(32, 46, P => {
    for (let y = 22; y < 44; y++) { const hw = 3 + (y - 22) * 0.55; P.rect(Math.round(15 - hw), y, Math.round(hw * 2), 1, glass); }
    P.rect(5, 38, 21, 6, '#fff3b0');
    P.rect(12, 14, 6, 9, glass);
    P.rect(18, 17, 9, 2, glass); P.rect(26, 17, 3, 12, '#3b4658');
    P.rect(5, 5, 20, 8, white); P.rect(5, 5, 20, 1, '#ffffff'); P.rect(7, 7, 16, 1, '#d6dde8');
    P.rect(13, 13, 4, 3, white);
    P.rect(8, 3, 14, 2, '#a88d66');
  });
  // Zellkultur: Sterilwerkbank, Brutschrank, Platten
  D.hood = outlined(72, 62, P => {
    P.rect(0, 0, 72, 60, '#e8eef5'); P.rect(0, 0, 72, 8, '#c3cedd');
    P.rect(4, 12, 64, 40, '#cfeaf5'); P.rect(4, 12, 64, 2, '#8fd8f0');
    P.rect(8, 9, 56, 2, '#9b8cff');
    P.ell(24, 44, 5, 5, glass); P.rect(22, 34, 4, 6, glass);
    P.rect(40, 44, 16, 4, white); for (let i = 0; i < 5; i++) P.px(42 + i * 3, 45, '#ff8fb8');
    P.rect(4, 52, 64, 3, '#8795a8');
    P.rect(4, 26, 64, 1, '#ffffff');
  });
  D.incubator = outlined(42, 52, P => {
    P.rect(0, 0, 42, 52, '#e8eef5'); P.rect(2, 2, 38, 48, '#f4f7fb');
    P.rect(26, 6, 12, 7, '#1a1c2c');
    Font.draw(P.g, '37', 27, 6, { color: '#7be07b' });
    P.rect(4, 14, 34, 1, '#c3cedd'); P.rect(34, 24, 2, 10, '#8795a8');
    Font.draw(P.g, 'CO2', 5, 5, { color: '#5d6b80' });
  });
  D.plates = outlined(56, 40, P => {
    P.rect(0, 12, 56, 3, '#6b3f22'); P.rect(0, 36, 56, 3, '#6b3f22');
    for (let s = 0; s < 3; s++) { P.rect(3, 26 - s * 5, 22, 4, white); for (let i = 0; i < 6; i++) P.px(5 + i * 3, 27 - s * 5, '#ff8fb8'); }
    for (let s = 0; s < 2; s++) { P.rect(32, 32 - s * 4, 18, 3, '#e8f6ff'); P.rect(36, 33 - s * 4, 10, 1, s ? '#7be07b' : '#ff8fb8'); }
    for (let i = 0; i < 4; i++) { P.rect(4 + i * 12, 2, 6, 10, glass); P.rect(4 + i * 12, 7, 6, 5, '#ff8fb8'); P.rect(4 + i * 12, 1, 6, 2, '#3aa0e8'); }
  });
  // Verdampfer: Rotationsverdampfer, Konzentrator, Trockenschrank
  D.rotavap = outlined(64, 54, P => {
    P.rect(2, 40, 32, 12, '#8795a8'); P.rect(4, 40, 28, 3, '#ffa53a');
    P.ell(20, 36, 8, 7, glass); P.rect(13, 36, 15, 5, '#ffe7a8');
    for (let i = 0; i < 14; i++) P.rect(25 + i, 30 - i, 3, 3, glass);
    P.rect(40, 4, 10, 30, glass);
    for (let y = 6; y < 32; y += 3) P.rect(41, y, 8, 1, '#3aa0e8');
    P.rect(56, 0, 3, 52, '#5d6b80');
    P.ell(45, 43, 5, 5, glass); P.rect(42, 44, 7, 3, '#c8f2ff'); P.rect(44, 34, 2, 5, glass);
  });
  D.concentrator = outlined(46, 30, P => {
    P.rect(0, 8, 46, 22, '#e8eef5'); P.ell(23, 8, 18, 6, '#c3cedd'); P.ell(23, 8, 14, 4, '#8fd8f0');
    P.rect(4, 16, 12, 6, k); Font.draw(P.g, '40', 5, 16, { color: '#7be07b' });
    P.rect(30, 18, 10, 3, THEME.navy);
  });
  D.oven = outlined(42, 56, P => {
    P.rect(0, 0, 42, 56, '#c3cedd'); P.rect(2, 2, 38, 52, '#e8eef5');
    P.rect(6, 10, 30, 30, '#ffb38a'); P.rect(8, 12, 26, 26, '#ff8a4a');
    P.rect(8, 20, 26, 1, '#8795a8'); P.rect(8, 29, 26, 1, '#8795a8');
    P.rect(14, 16, 4, 4, '#fff3b0'); P.rect(22, 25, 6, 4, '#fff3b0');
    P.rect(24, 44, 12, 6, k); Font.draw(P.g, '80', 25, 44, { color: '#ffa53a' });
    P.rect(36, 18, 2, 12, '#5d6b80');
  });
  // Hochvakuum: Gefriertrockner, Destillation, Turbopumpe, Schlenk-Line
  D.freezedryer = outlined(52, 58, P => {
    P.rect(4, 30, 44, 28, '#e8eef5'); P.rect(4, 30, 44, 2, THEME.navy);
    P.rect(9, 38, 20, 8, k); Font.draw(P.g, '-55', 10, 38, { color: '#8fd8f0' });
    P.rect(12, 4, 28, 26, '#dff4fb'); P.rect(12, 2, 28, 3, metal);
    for (let y = 10; y < 30; y += 7) P.rect(14, y, 24, 1, '#8795a8');
    P.ell(6, 16, 4, 4, glass); P.ell(46, 16, 4, 4, glass); P.rect(9, 15, 3, 2, metal); P.rect(40, 15, 3, 2, metal);
  });
  D.distill = outlined(64, 56, P => {
    P.ell(12, 48, 10, 6, '#8a6a45');
    P.ell(12, 40, 7, 7, glass); P.rect(7, 40, 11, 5, '#ffe7a8');
    P.rect(10, 12, 4, 24, glass);
    for (let y = 14; y < 34; y += 3) P.rect(10, y, 4, 1, '#b7e3f2');
    for (let i = 0; i < 30; i++) P.rect(14 + i, 12 + Math.round(i * 0.7), 3, 3, glass);
    for (let i = 4; i < 26; i += 4) P.rect(14 + i, 11 + Math.round(i * 0.7), 3, 5, '#6fcbe8');
    P.ell(52, 48, 6, 6, glass); P.rect(47, 49, 11, 4, '#c8f2ff');
    P.rect(2, 2, 2, 50, '#5d6b80');
  });
  D.turbo = outlined(30, 34, P => {
    P.rect(2, 0, 26, 4, metal); P.rect(5, 4, 20, 22, '#c9d2de'); P.rect(7, 6, 2, 18, '#ffffff');
    P.rect(2, 26, 26, 4, metal); P.rect(20, 12, 8, 6, '#8795a8');
    Font.draw(P.g, 'TMP', 7, 13, { color: '#5d6b80' });
  });
  D.schlenk = outlined(92, 30, P => {
    P.rect(0, 4, 92, 5, glass); P.rect(0, 12, 92, 5, glass);
    P.rect(0, 5, 92, 1, '#ffffff'); P.rect(0, 13, 92, 1, '#ffffff');
    for (let i = 0; i < 4; i++) {
      const x = 12 + i * 22;
      P.rect(x, 9, 3, 3, glass); P.rect(x - 2, 17, 7, 3, '#3aa0e8'); P.rect(x, 20, 3, 8, glass);
    }
  });
  // Wand: Fenster, Poster, VACUU·LAN, Periodensystem
  D.window = paint(46, 42, P => {
    P.rect(0, 0, 46, 42, k); P.rect(1, 1, 44, 40, '#ffffff'); P.rect(3, 3, 40, 36, '#9fd8f5');
    P.rect(8, 10, 12, 4, '#ffffff'); P.rect(12, 7, 6, 3, '#ffffff');
    P.rect(22, 3, 2, 36, '#ffffff'); P.rect(3, 20, 40, 2, '#ffffff');
  });
  D.periodic = paint(60, 36, P => {
    P.rect(0, 0, 60, 36, k); P.rect(1, 1, 58, 34, '#ffffff');
    const cols = ['#ffb3b3', '#b3d9ff', '#c8f2c8', '#fff0a8'];
    for (let r = 0; r < 5; r++) for (let c = 0; c < 9; c++) {
      if (r === 0 && c > 0 && c < 8) continue;
      if (r === 1 && c > 1 && c < 6) continue;
      P.rect(3 + c * 6, 4 + r * 6, 5, 5, cols[(r + c) % 4]);
    }
  });
  D.vacuulan = paint(92, 22, P => {
    P.rect(0, 2, 92, 6, k); P.rect(0, 3, 92, 4, '#d5dde8'); P.rect(0, 3, 92, 1, '#ffffff');
    for (let i = 0; i < 3; i++) {
      const x = 10 + i * 30;
      P.rect(x, 7, 10, 9, k); P.rect(x + 1, 8, 8, 7, '#e8eef5'); P.rect(x + 2, 9, 6, 1, THEME.navy);
      P.rect(x + 4, 16, 2, 3, k); P.rect(x + 3, 18, 4, 2, '#3aa0e8');
    }
    Font.draw(P.g, 'VACUU·LAN', 30, 0, { color: '#5d6b80' });
  });
  const posterText = ['ME 1C', 'BVC PROFESSIONAL', 'PC 3001 VARIO SELECT', 'VACUU·PURE 10C'];
  posterText.forEach((t, i) => {
    const pw = Math.max(80, Font.width(t) + 10);
    D['poster' + i] = paint(pw, 28, P => {
      P.rect(0, 0, pw, 28, k); P.rect(1, 1, pw - 2, 26, '#ffffff');
      Font.drawLogo(P.g, pw / 2, 4, 1, k);
      P.rect(4, 13, pw - 8, 1, THEME.gold);
      Font.draw(P.g, t, pw / 2, 17, { color: THEME.navy, align: 'center' });
    });
  });
  // ME 1C als Gerät auf dem Labortisch (doppelt so gross)
  D.me1c = makeCanvas(SPR.pump1.width * 2, SPR.pump1.height * 2);
  { const g = D.me1c.getContext('2d'); g.imageSmoothingEnabled = false; g.drawImage(SPR.pump1, 0, 0, D.me1c.width, D.me1c.height); }
  // Chemikalienschrank
  D.window2 = outlined(40, 44, P => {
    P.rect(0, 0, 40, 44, '#e8eef5'); P.rect(2, 2, 36, 40, '#f4f7fb');
    P.rect(19, 2, 2, 40, '#c3cedd');
    P.rect(15, 18, 2, 6, '#5d6b80'); P.rect(23, 18, 2, 6, '#5d6b80');
    P.rect(6, 6, 8, 6, '#ffd23f'); P.rect(8, 7, 4, 4, '#e04848');
  });
  for (const name of Object.keys(D)) SPR['deco_' + name] = D[name];
}
