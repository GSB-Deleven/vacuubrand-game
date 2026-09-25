'use strict';
// Pixelart: Figuren als Zeichen-Raster, Gegenstände und Kacheln per Code gemalt.
const PAL = {
  k: '#1a1c2c', w: '#ffffff', W: '#d6dde8', g: '#a7b3c4', G: '#5d6b80',
  s: '#ffcfa6', S: '#e8a47c', l: '#c8f2ff', L: '#6fcbe8', e: '#1a1c2c',
  r: '#ff8f8f', m: '#8a2a3a', c: '#ffffff', C: '#c3cedd', p: '#2e3e66',
  h: '#6b3f22', b: '#3aa0e8', B: '#1f5fa8', n: '#7be07b', N: '#2f9e4f',
  o: '#ffa53a', O: '#d1621a', v: '#7b5fb8', V: '#e6dcff', q: '#b4f7d4',
  Q: '#3fae7c', y: '#ffe066', Y: '#e0a000', R: '#e04848'
};

const SPR = {};

function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return c;
}

function spriteFromGrid(rows, name) {
  const w = Math.max(...rows.map(r => r.length));
  rows.forEach((r, i) => { if (r.length !== w) console.warn('Sprite ' + name + ' Zeile ' + i + ' hat Länge ' + r.length + ' statt ' + w); });
  const c = makeCanvas(w, rows.length);
  const g = c.getContext('2d');
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const col = PAL[row[x]];
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

function addPair(name, c) {
  SPR[name] = c;
  SPR[name + '_L'] = flipCanvas(c);
}

// ---------------------------------------------------------------------
const PROF_HEAD = [
  '....w..ww.w.w...',
  '..wwwwwwwwwwww..',
  '.wwWwwwwwwwWwww.',
  'wwWkkkkkkkkkkwww',
  'wwksssssssssskWw',
  '.wksskkssskkskW.',
  'wwksklekkklekkWw',
  '.wksskkssskkskW.',
  '.wksrssssrssSSk.',
  '..kssmmmmmsssk..',
  '...kkkkkkkkkk...'
];
const PROF_BODY = [
  '....kcCcccCck...',
  '...kcccbbcccck..',
  '..kCccccccccssk.',
  '..kCccccccccck..',
  '...kCccccccCk...'
];
const PROF_LEGS = {
  idle: ['....kppk.kppk...', '...khhhk.khhhk..'],
  walk1: ['...kppk...kppk..', '..khhhk...khhhk.'],
  walk2: ['.....kppppk.....', '.....khhhhhk....'],
  jump: ['...kppk..kppk...', '..khhk....khhk..']
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
  ghost: [
    '....QQQQ....',
    '..QQqqqqQQ..',
    '.QqqqqqqqqQ.',
    '.QqwkqqwkqQ.',
    'QqqwkqqwkqqQ',
    'QqqqqqqqqqqQ',
    'QqqqqmmqqqqQ',
    'QqqqqqqqqqqQ',
    'QqqqqqqqqqqQ',
    'QqQqqQQqqQqQ',
    'QQ.QQ..QQ.QQ'
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

// Zonen: Labor, Lager, Reinraum
const ZONE_STYLE = [
  { name: 'LABOR', wall: '#cfe3ef', wall2: '#bcd6e6', base: '#9db8cc', floorTop: '#6a7f9f', floor: '#4a5c7c', line: '#34445f', brick: '#e9e4d6', mortar: '#b9b19c' },
  { name: 'LAGER', wall: '#e0cfae', wall2: '#d2bf99', base: '#a88d66', floorTop: '#8a6a45', floor: '#6b5033', line: '#523b24', brick: '#c07a52', mortar: '#8a4f33' },
  { name: 'REINRAUM', wall: '#eef8f8', wall2: '#dcf0f0', base: '#b3d4dc', floorTop: '#a3bccc', floor: '#7f98ab', line: '#627c90', brick: '#fafcff', mortar: '#b8d0d8' }
];

function buildSprites() {
  // Professor
  for (const key of Object.keys(PROF_LEGS)) {
    addPair('prof_' + key, spriteFromGrid(PROF_HEAD.concat(PROF_BODY, PROF_LEGS[key]), 'prof_' + key));
  }
  // Gegner
  for (const key of Object.keys(ENEMY_GRIDS)) SPR[key] = spriteFromGrid(ENEMY_GRIDS[key], key);

  // Gasflasche
  SPR.cylinder = addOutline(paint(10, 19, P => {
    P.rect(4, 1, 2, 2, '#5d6b80');
    P.rect(3, 3, 4, 1, '#5d6b80');
    P.ell(5, 6.5, 3, 2.5, '#a7b3c4');
    P.rect(2, 6, 6, 12, '#a7b3c4');
    P.rect(2, 6, 6, 2, '#7be07b');
    P.rect(3, 9, 1, 7, '#e8eef5');
    P.px(4, 11, '#1a1c2c'); P.px(6, 11, '#1a1c2c');
    P.rect(4, 13, 3, 1, '#8a2a3a');
  }), '#1a1c2c');

  // Fass
  SPR.barrel = addOutline(paint(14, 17, P => {
    P.rect(1, 2, 12, 14, '#1f5fa8');
    P.rect(1, 2, 12, 1, '#3aa0e8');
    P.rect(1, 5, 12, 1, '#174a85');
    P.rect(1, 13, 12, 1, '#174a85');
    P.rect(2, 3, 1, 12, '#5fb6f0');
    P.rect(5, 7, 4, 4, '#ffa53a');
    P.px(6, 8, '#1a1c2c'); P.px(8, 8, '#1a1c2c');
    P.rect(6, 10, 3, 1, '#8a2a3a');
  }), '#1a1c2c');

  // Boss: Dampf-Krake (2 Frames)
  for (let f = 0; f < 2; f++) {
    SPR['boss' + f] = addOutline(paint(38, 36, P => {
      const V = '#e6dcff', V2 = '#c7b5f5';
      for (let i = 0; i < 5; i++) {
        const tx = 7 + i * 5;
        for (let j = 0; j < 10; j++) {
          const off = Math.round(Math.sin((j + f * 2 + i * 1.7) * 0.8) * 1.5);
          P.rect(tx + off, 21 + j, j > 6 ? 2 : 3, 1, V2);
        }
      }
      P.ell(19, 14, 15, 10, V2);
      P.ell(11, 10, 7, 6, V);
      P.ell(27, 9, 8, 6, V);
      P.ell(19, 7, 8, 5, V);
      P.ell(19, 16, 13, 7, V);
      P.ell(14, 13, 3, 3.5, '#ffffff');
      P.ell(24, 13, 3, 3.5, '#ffffff');
      P.rect(14 + f, 13, 2, 2, '#1a1c2c');
      P.rect(24 + f, 13, 2, 2, '#1a1c2c');
      [[10, 8], [11, 8], [12, 9], [13, 9], [14, 10], [28, 8], [27, 8], [26, 9], [25, 9], [24, 10]].forEach(([x, y]) => P.px(x, y, '#1a1c2c'));
      P.rect(15, 19, 9, 3, '#8a2a3a');
      P.px(16, 19, '#ffffff'); P.px(19, 19, '#ffffff'); P.px(22, 19, '#ffffff');
    }), '#7b5fb8');
  }

  // Pumpen
  SPR.pump1 = addOutline(paint(12, 11, P => {
    P.rect(5, 1, 2, 2, '#5d6b80');
    P.rect(1, 3, 10, 6, '#d5dde8');
    P.rect(1, 3, 10, 2, '#1f5fa8');
    P.rect(3, 6, 1, 2, '#5d6b80'); P.rect(5, 6, 1, 2, '#5d6b80'); P.rect(7, 6, 1, 2, '#5d6b80');
    P.rect(2, 9, 2, 1, '#1a1c2c'); P.rect(8, 9, 2, 1, '#1a1c2c');
  }), '#1a1c2c');
  SPR.pump2 = addOutline(paint(14, 16, P => {
    P.rect(1, 7, 12, 7, '#d5dde8');
    P.rect(1, 7, 12, 1, '#1f5fa8');
    P.rect(6, 2, 6, 5, '#3b4658');
    P.rect(7, 3, 4, 2, '#7be07b');
    P.rect(3, 1, 2, 2, '#c8f2ff');
    P.ell(4, 5, 2.6, 2.6, '#c8f2ff');
    P.rect(3, 5, 3, 2, '#6fcbe8');
    P.rect(3, 10, 8, 1, '#8795a8');
    P.rect(3, 12, 8, 1, '#8795a8');
    P.rect(2, 14, 2, 1, '#1a1c2c'); P.rect(10, 14, 2, 1, '#1a1c2c');
  }), '#1a1c2c');
  SPR.pump3 = addOutline(paint(16, 17, P => {
    P.rect(1, 1, 14, 13, '#2b3a55');
    P.rect(1, 1, 14, 1, '#3aa0e8');
    P.rect(3, 3, 10, 6, '#e8eef5');
    P.rect(4, 4, 5, 3, '#1a1c2c');
    P.rect(5, 5, 3, 1, '#7be07b');
    P.px(11, 5, '#7be07b');
    P.rect(3, 10, 10, 1, '#4a5b7a');
    P.rect(3, 12, 10, 1, '#4a5b7a');
    P.rect(2, 14, 3, 1, '#1a1c2c'); P.rect(11, 14, 3, 1, '#1a1c2c');
  }), '#1a1c2c');

  // Münze / Bonus
  SPR.coin = addOutline(paint(10, 12, P => {
    P.ell(5, 6, 4, 5, '#ffe066');
    P.ell(5, 6, 2, 3.5, '#e0a000');
    P.rect(5, 3, 1, 6, '#fff3b0');
  }), '#1a1c2c');

  // Ausgangstür
  const door = (open) => paint(20, 34, P => {
    P.rect(0, 2, 20, 32, '#5d6b80');
    P.rect(1, 3, 18, 31, '#8795a8');
    if (open) {
      P.rect(3, 6, 14, 28, '#1a1c2c');
      P.rect(3, 6, 3, 28, '#2f9e4f');
      P.rect(8, 0, 4, 2, '#7be07b');
    } else {
      P.rect(3, 6, 14, 28, '#1f5fa8');
      P.rect(6, 9, 8, 7, '#c8f2ff');
      P.rect(6, 12, 8, 1, '#6fcbe8');
      P.rect(14, 21, 2, 3, '#ffe066');
      P.rect(8, 0, 4, 2, '#e04848');
    }
  });
  SPR.doorLocked = door(false);
  SPR.doorOpen = door(true);

  // Kacheln je Zone
  ZONE_STYLE.forEach((z, i) => {
    SPR['groundTop' + i] = paint(16, 16, P => {
      P.rect(0, 0, 16, 16, z.floor);
      P.rect(0, 0, 16, 4, z.floorTop);
      P.rect(0, 0, 16, 1, '#ffffff');
      P.rect(0, 4, 16, 1, z.line);
      P.rect(15, 0, 1, 16, z.line);
      P.rect(0, 10, 16, 1, z.line);
      P.rect(7, 5, 1, 5, z.line);
    });
    SPR['ground' + i] = paint(16, 16, P => {
      P.rect(0, 0, 16, 16, z.floor);
      P.rect(15, 0, 1, 16, z.line);
      P.rect(0, 7, 16, 1, z.line);
      P.rect(0, 15, 16, 1, z.line);
      P.rect(7, 0, 1, 7, z.line);
    });
    SPR['brick' + i] = paint(16, 16, P => {
      P.rect(0, 0, 16, 16, z.brick);
      P.rect(0, 7, 16, 1, z.mortar);
      P.rect(0, 15, 16, 1, z.mortar);
      P.rect(7, 0, 1, 7, z.mortar);
      P.rect(15, 0, 1, 7, z.mortar);
      P.rect(3, 8, 1, 7, z.mortar);
      P.rect(11, 8, 1, 7, z.mortar);
      P.rect(0, 0, 16, 1, '#ffffff');
    });
  });

  const QMARK = ['.XXXX.', 'XX..XX', '....XX', '...XX.', '..XX..', '..XX..', '......', '..XX..'];
  const shades = ['#ffffff', '#fff3b0', '#ffe066'];
  shades.forEach((sh, f) => {
    SPR['q' + f] = paint(16, 16, P => {
      P.rect(0, 0, 16, 16, '#1a1c2c');
      P.rect(1, 1, 14, 14, '#ffb020');
      P.rect(1, 1, 14, 1, '#ffe066');
      P.rect(1, 1, 1, 14, '#ffe066');
      P.rect(1, 14, 14, 1, '#b86a00');
      P.rect(14, 1, 1, 14, '#b86a00');
      [[2, 2], [13, 2], [2, 13], [13, 13]].forEach(([x, y]) => P.px(x, y, '#b86a00'));
      QMARK.forEach((row, y) => {
        for (let x = 0; x < 6; x++) {
          if (row[x] === 'X') { P.px(5 + x + 1, 4 + y + 1, '#b86a00'); }
        }
      });
      QMARK.forEach((row, y) => {
        for (let x = 0; x < 6; x++) if (row[x] === 'X') P.px(5 + x, 4 + y, sh);
      });
    });
  });
  SPR.used = paint(16, 16, P => {
    P.rect(0, 0, 16, 16, '#1a1c2c');
    P.rect(1, 1, 14, 14, '#8a6a45');
    P.rect(1, 1, 14, 1, '#a88d66');
    P.rect(1, 14, 14, 1, '#523b24');
    [[3, 3], [12, 3], [3, 12], [12, 12]].forEach(([x, y]) => P.px(x, y, '#523b24'));
  });
  SPR.platform = paint(16, 16, P => {
    P.rect(0, 0, 16, 5, '#1a1c2c');
    P.rect(0, 1, 16, 3, '#6a7f9f');
    P.rect(0, 1, 16, 1, '#b8c8dd');
    P.rect(2, 5, 2, 3, '#4a5c7c');
    P.rect(12, 5, 2, 3, '#4a5c7c');
  });
}
