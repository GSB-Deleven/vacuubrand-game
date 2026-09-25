'use strict';
// Das Level: 240 Kacheln breit, 12 hoch. Boden liegt in Zeile 10–11.
// Legende Kacheln:  # Boden   B Wandblock   - Labortisch (von unten durchspringbar)
//                   1/2/3 ?-Block mit Pumpe Stufe 1/2/3   ? ?-Block mit Bonus   U leerer Block
// Gegner: d Tropfen  f Staubfussel  c Dampfwolke  k Glaskolben  g Lösemittel-Geist
//         m Messbecher  z Gasflasche  o Fass  K Dampf-Krake (Boss)
const Level = {
  WIDTH: 240,
  ROWS: 12,
  ZONE_STARTS: [0, 80, 160],

  build() {
    const W = this.WIDTH, H = this.ROWS;
    const tiles = [];
    for (let y = 0; y < H; y++) tiles.push(new Array(W).fill(' '));
    const spawns = [], signs = [];
    const set = (x, y, c) => { if (x >= 0 && x < W && y >= 0 && y < H) tiles[y][x] = c; };
    const ground = (a, b) => { for (let x = a; x <= b; x++) { set(x, 10, '#'); set(x, 11, '#'); } };
    const pit = (a, b) => { for (let x = a; x <= b; x++) { set(x, 10, ' '); set(x, 11, ' '); } };
    const plat = (x, y, w) => { for (let i = 0; i < w; i++) set(x + i, y, '-'); };
    const brick = (x, y, w, h) => { for (let i = 0; i < (w || 1); i++) for (let j = 0; j < (h || 1); j++) set(x + i, y + j, 'B'); };
    const q = (x, y, c) => set(x, y, c);
    const e = (type, x, y) => spawns.push({ type, x, y: y === undefined ? 9 : y });
    const sign = (x, text) => signs.push({ x, text });

    ground(0, W - 1);

    // ---------------- Zone 1: LABOR ----------------
    sign(4, 'SPRING VON UNTEN\nGEGEN DEN ?-BLOCK!');
    brick(7, 6); q(8, 6, '1'); brick(9, 6);
    sign(14, 'X GEDRÜCKT HALTEN\n= SAUGEN!');
    e('d', 17); e('d', 19); e('f', 23);
    q(25, 6, '?');
    q(29, 6, '1');
    e('f', 28); e('c', 31, 6);
    plat(34, 7, 5); e('d', 35, 6); e('d', 37, 6);
    q(36, 3, '?');
    pit(42, 43);
    e('f', 47); e('d', 49); e('d', 51); e('c', 54, 6); e('c', 57, 5);
    brick(60, 9); brick(61, 8, 1, 2);
    e('k', 65);
    sign(66, 'GLASWARE ZU SCHWER?\nHOL DIR DIE PC 3001!');
    brick(69, 6); q(70, 6, '2'); brick(71, 6);
    e('d', 73); e('c', 76, 6); q(77, 6, '2');

    // ---------------- Zone 2: LAGER ----------------
    e('k', 84); q(86, 6, '2'); e('m', 88);
    e('g', 92, 6); e('f', 95);
    plat(98, 7, 4); e('m', 99, 6);
    plat(103, 5, 4); e('c', 104, 3); q(105, 2, '?');
    e('k', 108); e('k', 111);
    pit(114, 115);
    e('g', 119, 5); e('m', 122); e('d', 124);
    sign(127, 'SCHWERE FÄSSER?\nDAFÜR BRAUCHT ES\nVACUU·PURE!');
    e('o', 129);
    brick(131, 9); brick(132, 8, 1, 2); brick(133, 7, 1, 3);
    e('g', 137, 6); e('m', 139); e('k', 142);
    brick(145, 6); q(146, 6, '3'); brick(147, 6);
    e('z', 150); e('f', 152); e('c', 155, 6); e('m', 157);

    // ---------------- Zone 3: REINRAUM ----------------
    q(163, 6, '3');
    e('o', 166); e('g', 169, 6); e('z', 172);
    plat(175, 7, 3); plat(179, 5, 3); e('c', 180, 3);
    e('k', 183); e('m', 185); e('g', 188, 5);
    pit(191, 192);
    e('z', 195); e('o', 197); e('d', 199); e('d', 200); e('d', 201);
    e('f', 204); e('c', 207, 6);
    sign(211, 'ACHTUNG:\nDAMPF-KRAKE!');
    q(215, 6, '3');
    e('K', 227, 7);
    brick(239, 0, 1, 10);

    return {
      W, H, tiles, spawns, signs,
      playerStart: { x: 2, y: 9 },
      exitX: 236,
      bossArenaX: 214
    };
  }
};

function zoneOf(worldX) {
  const tx = worldX / T;
  return tx < Level.ZONE_STARTS[1] ? 0 : tx < Level.ZONE_STARTS[2] ? 1 : 2;
}
