'use strict';
// Das Level: 280 Kacheln breit, 12 hoch. Boden liegt in Zeile 10–11.
// Kacheln:  # Boden   B Wandblock   - VACUU·LAN-Leitung (von unten durchspringbar)
//           1/2/3 Kolben-Block mit Pumpe   ? Kolben-Block mit Schutzausrüstung
//           V Kolben-Block mit BVC professional   U leerer Block
// Gegner:   Zone 1 Filtration: d Filtrat-Tropfen  f Schmutzpartikel  p Filterpapier  t Reagenzglas
//           Zone 2 Zellkultur: n Nährmedium  e Petrischalen-Schleim  w Wellplatte
//           Zone 3 Verdampfer: c Lösemitteldampf  y Eppi
//                              k Rundkolben  h Trockenschrank-Hitze  m Messbecher
//           Zone 4 Hochvakuum: i Eiskristall  l Schlenk-Kolben  z Argon-Flasche  b Siedeblase
//           Moleküle: H2O  O2  N2  H2O2  MEOH (Methanol)  ETOH (Ethanol)
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
    e('d', 18); e('t', 20); e('f', 24);
    q(26, 6, '?');
    e('p', 29, 6); q(31, 6, '1'); e('f', 33);
    lan(32, 8, 2); lan(35, 7, 5); e('d', 36, 6); e('f', 38, 6);
    q(37, 3, '?');
    e('H2O', 40, 4);
    pit(43, 44);
    sign(47, 'ME 1C: IDEAL FÜR\nDIE FILTRATION');
    e('f', 49); e('t', 51); e('d', 53); e('p', 55, 5); e('p', 58, 6);
    brick(61, 9); brick(62, 8, 1, 2);
    e('v', 62, 3);
    e('d', 66); e('t', 69); e('d', 73); e('H2O', 71, 5); e('p', 76, 6);

    // ---------------- Zone 2: ZELLKULTUR-LABOR (BVC professional) ----------------
    sign(82, 'ZELLKULTUR-LABOR:\nHOL DIR DIE BVC!');
    brick(85, 6); q(86, 6, 'V'); brick(87, 6);
    e('n', 90); e('e', 93); e('H2O2', 95, 5); e('w', 96); e('n', 99);
    lan(98, 8, 2); lan(101, 7, 4); e('e', 102, 6); q(103, 3, '?');
    e('n', 105, 9); e('w', 107); e('n', 110); e('d', 112); e('e', 114); e('H2O2', 111, 5); e('w', 116);
    brick(115, 6); q(116, 6, '2'); brick(117, 6);
    e('e', 118);

    // ---------------- Zone 3: VERDAMPFER-LABOR (PC 3001 VARIO select) ----------------
    sign(122, 'PC 3001 VARIO SELECT:\nIDEAL FÜR DEN ROTAVAP');
    q(125, 6, '2');
    e('k', 128); e('c', 131, 6); e('y', 134); e('h', 138, 6);
    lan(138, 8, 2); lan(141, 7, 4); e('k', 142, 6); lan(146, 5, 4); e('h', 147, 3); q(148, 2, '?');
    e('k', 152); e('y', 155);
    pit(158, 159);
    e('MEOH', 157, 5); e('c', 162, 5); e('m', 165); e('ETOH', 167, 4); e('c', 168, 6);
    e('c', 172, 6);
    brick(174, 9); brick(175, 8, 1, 2); brick(176, 7, 1, 3);
    e('v', 176, 2);
    e('h', 180, 6); e('ETOH', 190, 5); e('MEOH', 184, 4); e('k', 183); brick(185, 6); q(186, 6, '?'); brick(187, 6);
    e('y', 189); brick(192, 6); q(193, 6, '3'); brick(194, 6);
    e('k', 196); e('c', 198, 6);

    // ---------------- Zone 4: HOCHVAKUUM-TECHNIKUM (VACUU·PURE 10C) ----------------
    sign(202, 'VACUU·PURE 10C:\nIDEAL FÜR ÖLFREIE TROCKNUNG');
    q(205, 6, '3');
    e('i', 208, 6); e('N2', 210, 4); e('z', 211); e('l', 214);
    lan(214, 8, 2); lan(217, 7, 3); lan(221, 5, 3); e('i', 222, 3); q(222, 2, '?');
    e('b', 226, 7); e('O2', 228, 4); e('l', 229); e('i', 232, 5);
    pit(235, 236);
    e('z', 239); e('N2', 240, 5); e('b', 241, 6); e('O2', 245, 4); e('H2O', 249, 3); e('d', 243); e('l', 246); e('i', 249, 6);
    sign(251, 'ACHTUNG:\nDAMPF-KRAKE!');
    q(255, 6, '3');
    e('v', 259, 5);
    e('K', 267, 7);
    brick(279, 0, 1, 10);

    fixReach(tiles, spawns);

    return {
      W, H, tiles, spawns, signs,
      playerStart: { x: 2, y: 9 },
      exitX: 276,
      bossArenaX: 254
    };
  }
};

// Sorgt dafür, dass alles erreichbar bleibt – auch wenn man oben Positionen ändert:
// Schwebende Gegner höchstens 2 Kacheln, VACUU·VIEW höchstens 3 Kacheln über der nächsten Standfläche.
function standRow(tiles, x, fromRow) {
  let best = null;
  for (const dx of [0, -1, 1]) {
    if (dx !== 0 && best !== null) break; // Nachbarspalten nur, wenn direkt darunter nichts ist (Grube)
    const xx = x + dx;
    if (xx < 0 || xx >= tiles[0].length) continue;
    for (let y = fromRow + 1; y < tiles.length; y++) {
      if (tiles[y][xx] !== ' ') { if (best === null || y < best) best = y; break; }
    }
  }
  return best;
}
function fixReach(tiles, spawns) {
  for (const s of spawns) {
    const def = typeof ENEMY_DEFS !== 'undefined' ? ENEMY_DEFS[s.type] : null;
    const maxGap = s.type === 'v' ? 3 : def && def.beh === 'floater' ? 2 : null;
    if (maxGap === null) continue;
    const surf = standRow(tiles, s.x, s.y);
    if (surf === null) continue;
    while (surf - s.y - 1 > maxGap && tiles[s.y + 1][s.x] === ' ') s.y++;
  }
}

function zoneOf(worldX) {
  const tx = worldX / T, zs = Level.ZONE_STARTS;
  for (let i = zs.length - 1; i >= 0; i--) if (tx >= zs[i]) return i;
  return 0;
}
