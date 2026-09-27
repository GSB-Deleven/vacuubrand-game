'use strict';
// Das Level: 330 Kacheln breit, 12 hoch. Boden liegt in Zeile 10–11.
// Kacheln:  # Boden   B Wandblock   - VACUU·LAN-Leitung (von unten durchspringbar)
//           1/2/3/4 Kolben-Block mit Pumpe   ? Kolben-Block mit Schutzausrüstung
//           V Kolben-Block mit BVC professional   U leerer Block
// Gegner:   Zone 1 Filtration: d Filtrat-Tropfen  f Schmutzpartikel  p Filterpapier  t Reagenzglas
//           Zone 2 Zellkultur: n Nährmedium  e Petrischalen-Schleim  w Wellplatte
//           Zone 3 Verdampfer: c Lösemitteldampf  y Eppi
//                              k Rundkolben  h Trockenschrank-Hitze  m Messbecher
//           Zone 4 Chemie: a Säuredampf  g Scheidetrichter
//           Zone 5 Hochvakuum: i Eiskristall  l Schlenk-Kolben  z Argon-Flasche  b Siedeblase
//           Moleküle: H2O  O2  N2  H2O2  MEOH (Methanol)  ETOH (Ethanol)
//           K Dampf-Krake (Boss)   v VACUU·VIEW extended (+10 s)
const Level = {
  WIDTH: 330,
  ROWS: 12,
  ZONE_STARTS: [0, 80, 120, 200, 250],

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

    // ---------------- Zone 4: CHEMIELABOR (MD 4C VARIO select) ----------------
    sign(202, 'CHEMIELABOR:\nMD 4C VARIO SELECT');
    q(205, 6, '3');
    e('a', 208, 6); e('g', 210); e('c', 213, 6); e('MEOH', 215, 5);
    lan(215, 8, 2); lan(218, 7, 4); e('g', 219, 6); q(220, 3, '?');
    e('a', 224, 6); e('k', 226);
    pit(229, 230);
    e('ETOH', 232, 5); e('g', 234); e('a', 237, 6); e('y', 239);
    brick(241, 9); brick(242, 8, 1, 2);
    e('a', 244, 5); e('g', 246); e('c', 248, 6);

    // ---------------- Zone 5: HOCHVAKUUM-TECHNIKUM (VACUU·PURE 10C) ----------------
    sign(252, 'VACUU·PURE 10C:\nIDEAL FÜR ÖLFREIE TROCKNUNG');
    q(255, 6, '4');
    e('i', 258, 6); e('N2', 260, 4); e('z', 261); e('l', 264);
    lan(264, 8, 2); lan(267, 7, 3); lan(271, 5, 3); e('i', 272, 3); q(272, 2, '?');
    e('b', 276, 7); e('O2', 278, 4); e('l', 279); e('i', 282, 5);
    pit(285, 286);
    e('z', 289); e('N2', 290, 5); e('b', 291, 6); e('O2', 295, 4); e('H2O', 299, 3); e('d', 293); e('l', 296); e('i', 299, 6);
    sign(301, 'ACHTUNG:\nDAMPF-KRAKE!');
    q(305, 6, '4');
    e('v', 309, 5);
    e('K', 317, 7);
    brick(329, 0, 1, 10);

    fixReach(tiles, spawns);

    return {
      W, H, tiles, spawns, signs,
      playerStart: { x: 2, y: 9 },
      exitX: 326,
      bossArenaX: 304
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
