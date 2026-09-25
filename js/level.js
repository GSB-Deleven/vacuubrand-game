'use strict';
// Das Level: 280 Kacheln breit, 12 hoch. Boden liegt in Zeile 10–11.
// Kacheln:  # Boden   B Wandblock   - VACUU·LAN-Leitung (von unten durchspringbar)
//           1/2/3 Kolben-Block mit Pumpe   ? Kolben-Block mit Schutzausrüstung
//           V Kolben-Block mit BVC professional   U leerer Block
// Gegner:   Zone 1 Filtration: d Filtrat-Tropfen  f Schmutzpartikel  p Filterpapier
//           Zone 2 Zellkultur: n Nährmedium  e Petrischalen-Schleim  w Wellplatte
//           Zone 3 Verdampfer: c Lösemitteldampf  g Lösemittel-Geist  r Konzentrator-Röhrchen
//                              k Rundkolben  h Trockenschrank-Hitze  m Messbecher
//           Zone 4 Hochvakuum: i Eiskristall  l Schlenk-Kolben  z Argon-Flasche  b Siedeblase
//           K Dampf-Krake (Boss)   v VACUU·VIEW extended (+10 s)
const Level = {
  WIDTH: 280,
  ROWS: 12,
  ZONE_STARTS: [0, 80, 120, 200],

  build() {
    const W = this.WIDTH, H = this.ROWS;
    const tiles = [];
    for (let y = 0; y < H; y++) tiles.push(new Array(W).fill(' '));
    const spawns = [], signs = [];
    const set = (x, y, c) => { if (x >= 0 && x < W && y >= 0 && y < H) tiles[y][x] = c; };
    const ground = (a, b) => { for (let x = a; x <= b; x++) { set(x, 10, '#'); set(x, 11, '#'); } };
    const pit = (a, b) => { for (let x = a; x <= b; x++) { set(x, 10, ' '); set(x, 11, ' '); } };
    const lan = (x, y, w) => { for (let i = 0; i < w; i++) set(x + i, y, '-'); };
    const brick = (x, y, w, h) => { for (let i = 0; i < (w || 1); i++) for (let j = 0; j < (h || 1); j++) set(x + i, y + j, 'B'); };
    const q = (x, y, c) => set(x, y, c);
    const e = (type, x, y) => spawns.push({ type, x, y: y === undefined ? 9 : y });
    const sign = (x, text) => signs.push({ x, text });

    ground(0, W - 1);

    // ---------------- Zone 1: FILTRATIONSLABOR (ME 1C) ----------------
    sign(4, 'SPRING VON UNTEN GEGEN\nDEN KOLBEN-BLOCK!');
    brick(7, 6); q(8, 6, '1'); brick(9, 6);
    sign(14, 'LEERTASTE HALTEN\n= SAUGEN!');
    e('d', 18); e('d', 20); e('f', 24);
    q(26, 6, '?');
    e('p', 29, 6); q(31, 6, '1'); e('f', 33);
    lan(35, 7, 5); e('d', 36, 6); e('f', 38, 6);
    q(37, 3, '?');
    pit(43, 44);
    sign(47, 'ME 1C: IDEAL FÜR\nDIE FILTRATION');
    e('f', 49); e('d', 51); e('d', 53); e('p', 55, 5); e('p', 58, 6);
    brick(61, 9); brick(62, 8, 1, 2);
    e('v', 62, 3);
    e('d', 66); e('f', 69); e('d', 73); e('p', 76, 6);

    // ---------------- Zone 2: ZELLKULTUR-LABOR (BVC professional) ----------------
    sign(82, 'ZELLKULTUR-LABOR:\nHOL DIR DIE BVC!');
    brick(85, 6); q(86, 6, 'V'); brick(87, 6);
    e('n', 90); e('e', 93); e('w', 96); e('n', 99);
    lan(101, 7, 4); e('e', 102, 6); q(103, 3, '?');
    e('n', 105, 9); e('w', 107); e('n', 110); e('d', 112); e('e', 114); e('w', 116);
    brick(115, 6); q(116, 6, '2'); brick(117, 6);
    e('e', 118);

    // ---------------- Zone 3: VERDAMPFER-LABOR (PC 3001 VARIO select) ----------------
    sign(122, 'PC 3001 VARIO SELECT:\nIDEAL FÜR DEN ROTAVAP');
    q(125, 6, '2');
    e('k', 128); e('c', 131, 6); e('r', 134); e('g', 138, 6);
    lan(141, 7, 4); e('r', 142, 6); lan(146, 5, 4); e('h', 147, 3); q(148, 2, '?');
    e('k', 152); e('m', 155);
    pit(158, 159);
    e('g', 162, 5); e('r', 165); e('c', 168, 6);
    e('c', 172, 6);
    brick(174, 9); brick(175, 8, 1, 2); brick(176, 7, 1, 3);
    e('v', 176, 2);
    e('h', 180, 6); e('k', 183); brick(185, 6); q(186, 6, '?'); brick(187, 6);
    e('m', 189); brick(192, 6); q(193, 6, '3'); brick(194, 6);
    e('r', 196); e('c', 198, 6);

    // ---------------- Zone 4: HOCHVAKUUM-TECHNIKUM (VACUU·PURE 10C) ----------------
    sign(202, 'VACUU·PURE 10C:\nIDEAL FÜR ÖLFREIE TROCKNUNG');
    q(205, 6, '3');
    e('i', 208, 6); e('z', 211); e('l', 214);
    lan(217, 7, 3); lan(221, 5, 3); e('i', 222, 3); q(222, 2, '?');
    e('b', 226, 7); e('l', 229); e('i', 232, 5);
    pit(235, 236);
    e('z', 239); e('b', 241, 6); e('d', 243); e('l', 246); e('i', 249, 6);
    sign(251, 'ACHTUNG:\nDAMPF-KRAKE!');
    q(255, 6, '3');
    e('v', 259, 5);
    e('K', 267, 7);
    brick(279, 0, 1, 10);

    return {
      W, H, tiles, spawns, signs,
      playerStart: { x: 2, y: 9 },
      exitX: 276,
      bossArenaX: 254
    };
  }
};

function zoneOf(worldX) {
  const tx = worldX / T, zs = Level.ZONE_STARTS;
  for (let i = zs.length - 1; i >= 0; i--) if (tx >= zs[i]) return i;
  return 0;
}
