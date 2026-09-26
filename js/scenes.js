'use strict';
// Titelbildschirm (mit Demo), Ergebnis, Bestenliste

function drawMenuBackground(ctx, t) {
  const camX = Math.round((t * 0.25) % (70 * T));
  drawBackground(ctx, camX);
  for (let x = -(camX % T); x < VIEW_W; x += T) {
    ctx.drawImage(SPR.groundTop0, x, 148);
    ctx.drawImage(SPR.ground0, x, 164);
  }
}

function drawBoards(ctx, t, highlightId) {
  ctx.fillStyle = 'rgba(16,32,74,0.55)';
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  Font.draw(ctx, 'BESTENLISTE', 160, 5, { color: THEME.gold, scale: 2, align: 'center', outline: '#1a1c2c' });
  const cols = [
    { title: 'HEUTE', list: Store.board(todayKey()), x: 8 },
    { title: 'GESAMT · ' + CONFIG.eventName, list: Store.board(null), x: 164 }
  ];
  for (const c of cols) {
    drawPanel(ctx, c.x, 26, 148, 138);
    Font.draw(ctx, c.title.slice(0, 24), c.x + 74, 31, { color: '#c8f2ff', align: 'center' });
    ctx.fillStyle = '#3aa0e8'; ctx.fillRect(c.x + 4, 41, 140, 1);
    if (!c.list.length) {
      Font.draw(ctx, 'NOCH KEINE EINTRÄGE.\nSEI DER ERSTE!', c.x + 74, 90, { color: '#ffffff', align: 'center' });
      continue;
    }
    c.list.slice(0, CONFIG.leaderboardSize).forEach((e, i) => {
      const y = 46 + i * 12;
      const hl = e.leadId === highlightId;
      if (hl && t % 40 < 20) { ctx.fillStyle = '#2d4a8f'; ctx.fillRect(c.x + 2, y - 2, 144, 11); }
      const col = hl ? THEME.gold : i === 0 ? '#ffd23f' : i < 3 ? '#ffffff' : '#c8d4e8';
      Font.draw(ctx, String(i + 1), c.x + 20, y, { color: col, align: 'right' });
      if (i === 0) Font.draw(ctx, '★', c.x + 3, y, { color: '#ffd23f' });
      Font.draw(ctx, e.name.slice(0, 12), c.x + 26, y, { color: col });
      Font.draw(ctx, String(e.score), c.x + 143, y, { color: col, align: 'right' });
    });
  }
}

// ---------------------------------------------------------------------
const TITLE_BTN_START = [158, 92, 150, 14];
const TITLE_BTN_BOARD = [158, 112, 150, 14];

// Kleine Demo: der Professor saugt Laborchaos ein (läuft während der Anmeldung)
class DemoStrip {
  constructor() { this.t = 0; this.items = []; this.pops = []; this.nz = { x: 102, y: 134 }; }
  update() {
    this.t++;
    const nz = this.nz;
    if (this.t % 45 === 0) {
      const types = DEMO_SPRITES;
      const spr = types[Math.floor(hash(this.t) * types.length)];
      this.items.push({ x: 340, y: 104 + hash(this.t + 3) * 44, spr, v: 0.8, t: 0 });
    }
    for (const d of this.items) {
      d.t++;
      const dx = nz.x - d.x, dy = nz.y - d.y, len = Math.hypot(dx, dy) || 1;
      if (d.x < 200) d.v = Math.min(d.v + 0.12, 4);
      d.x += dx / len * d.v; d.y += dy / len * d.v * (d.x < 200 ? 1 : 0.3);
      if (len < 6) {
        d.dead = true;
        this.pops.push({ x: nz.x + 6, y: nz.y - 16, t: 40, text: '+' + [100, 150, 250, 300][Math.floor(hash(d.t + this.t) * 4)] });
      }
    }
    this.items = this.items.filter(d => !d.dead);
    for (const p of this.pops) { p.t--; p.y -= 0.4; }
    this.pops = this.pops.filter(p => p.t > 0);
  }
  draw(ctx) {
    if (this.t % 2 === 0) {
      for (let i = 0; i < 3; i++) {
        const along = hash(this.t * 3 + i) * 110, off = (hash(this.t * 5 + i) * 2 - 1) * (8 + along * 0.4);
        ctx.fillStyle = i % 2 ? '#ffffff' : '#6fcbe8';
        ctx.fillRect(Math.round(104 + along), Math.round(134 + off), 2, 1);
      }
    }
    for (const d of this.items) {
      const spr = SPR[d.spr];
      ctx.drawImage(spr, Math.round(d.x - spr.width / 2), Math.round(d.y - spr.height / 2));
    }
    ctx.save();
    ctx.translate(-66, -148);
    ctx.scale(2, 2);
    drawProfessor(ctx, 70, 148, { face: 1, pump: 2, pose: 'idle', shake: 0, sucking: true, ppe: {} });
    ctx.restore();
    for (const p of this.pops) Font.draw(ctx, p.text, p.x, p.y, { color: THEME.gold, align: 'center', outline: '#1a1c2c' });
  }
}
const DEMO_SPRITES = ['drop', 'mol_h2o', 'paper', 'mol_o2', 'medium', 'mol_etoh', 'flask', 'testtube', 'mol_n2', 'eppi', 'mol_meoh', 'ice', 'mol_h2o2'];

class TitleScene {
  constructor() {
    this.allowAdmin = true;
    this.t = 0; this.mode = 'title'; this.modeT = 0;
    this.demo = new DemoStrip();
  }
  enter() { Sound.music('title'); }
  update() {
    this.t++; this.modeT++;
    this.demo.update();
    if (this.mode === 'board' && (Input.pressed('board') || Input.pressed('back'))) { this.toggleBoard(); return; }
    if (this.mode === 'title' && Input.pressed('board')) { this.toggleBoard(); return; }
    if (Input.pressed('start')) { this.startGame(); return; }
    if (Input.pressed('fullscreen')) toggleFullscreen();
  }
  startGame() { Sound.sfx('select'); Game.go(new RegisterScene()); }
  toggleBoard() {
    Sound.sfx('select');
    this.mode = this.mode === 'title' ? 'board' : 'title';
    this.modeT = 0;
  }
  // Mausklick (Koordinaten im 320x180-Spielbild)
  click(x, y) {
    if (this.mode === 'board') { this.toggleBoard(); return; }
    const inBtn = b => x >= b[0] && x <= b[0] + b[2] && y >= b[1] && y <= b[1] + b[3];
    if (inBtn(TITLE_BTN_START)) this.startGame();
    else if (inBtn(TITLE_BTN_BOARD)) this.toggleBoard();
  }
  draw(ctx) {
    drawMenuBackground(ctx, this.t);
    if (this.mode === 'board') {
      drawBoards(ctx, this.t, null);
      Font.draw(ctx, 'B / ESC = ZURÜCK    ENTER = START', 160, 170, { color: THEME.gold, align: 'center', outline: '#1a1c2c' });
      return;
    }
    // Demo: der Professor saugt Laborchaos ein
    this.demo.draw(ctx);
    ctx.fillStyle = 'rgba(233,237,242,0.75)';
    ctx.fillRect(0, 0, VIEW_W, 88);
    Font.drawLogo(ctx, 160, 5, 1, PAL.k);
    const bob = Math.round(Math.sin(this.t * 0.05) * 2);
    Font.draw(ctx, 'PROFESSOR', 160, 15 + bob, { color: '#ffffff', scale: 3, align: 'center', outline: THEME.navy });
    Font.draw(ctx, 'VAKUUMUS', 160, 40 + bob, { color: THEME.gold, scale: 4, align: 'center', outline: PAL.k });
    Font.draw(ctx, 'SAUG DAS LABOR-CHAOS WEG!', 160, 79, { color: PAL.k, align: 'center' });
    const cx = 233;
    const [sx, sy, sw, sh] = TITLE_BTN_START, [bx, by, bw, bh] = TITLE_BTN_BOARD;
    drawPanel(ctx, sx, sy, sw, sh);
    Font.draw(ctx, 'ENTER = START', sx + sw / 2, sy + 4, { color: this.t % 60 < 42 ? THEME.gold : '#ffffff', align: 'center' });
    drawPanel(ctx, bx, by, bw, bh);
    Font.draw(ctx, 'B = BESTENLISTE', bx + bw / 2, by + 4, { color: '#c8f2ff', align: 'center' });
    const top = Store.board(todayKey())[0];
    if (top) {
      const line = top.name + '  ' + top.score;
      const pw = Math.max(Font.width('HEUTE FÜHRT:'), Font.width(line)) + 10;
      // Goldenes Siegerschild, damit es sich von den blauen Knöpfen abhebt
      const px = Math.round(cx - pw / 2);
      ctx.fillStyle = PAL.k; ctx.fillRect(px - 2, 131, pw + 4, 26);
      ctx.fillStyle = '#ffffff'; ctx.fillRect(px - 1, 132, pw + 2, 24);
      ctx.fillStyle = THEME.gold; ctx.fillRect(px, 133, pw, 22);
      ctx.fillStyle = '#ffd966'; ctx.fillRect(px, 133, pw, 1);
      ctx.fillStyle = '#d27410'; ctx.fillRect(px, 154, pw, 1);
      Font.draw(ctx, 'HEUTE FÜHRT:', cx, 135, { color: THEME.navy, align: 'center' });
      Font.draw(ctx, line, cx, 145, { color: PAL.k, align: 'center' });
    }
    Font.draw(ctx, CONFIG.eventName, 316, 170, { color: '#ffffff', align: 'right' });
  }
}

// ---------------------------------------------------------------------
class ResultScene {
  constructor(res) {
    this.res = res;
    this.allowAdmin = true;
    this.t = 0;
    this.test = !!res.lead.isTest;
    if (this.test) return; // Testrunde (ADMIN): wird nicht gespeichert
    Store.addRound({
      leadId: res.lead.id, score: res.total, base: res.score, timeBonus: res.timeBonus,
      finished: res.finished, timeLeft: res.timeLeft, pump: res.pump, captures: res.captures, ppe: res.ppe, views: res.views,
      medals: res.medals || [], medalBonus: res.medalBonus || 0, maxCombo: res.maxCombo || 0
    });
    this.best = Store.bestOf(res.lead.id);
    this.rankDay = Store.rank(res.lead.id, todayKey());
    this.rankAll = Store.rank(res.lead.id, null);
    this.newBest = this.best === res.total;
  }
  enter() { Sound.music(null); this.medalShown = 0; }
  update() {
    this.t++;
    // Medaillen ploppen nacheinander auf
    const got = this.res.medals || [];
    if (this.medalShown < got.length && this.t >= 80 + this.medalShown * 14) {
      this.medalShown++;
      Sound.sfx('coin');
    }
    if ((this.t > 60 && Input.pressed('start')) || this.t > CONFIG.resultAutoReturnSeconds * 60) {
      Sound.sfx('select');
      Game.go(new BoardScene(this.res.lead.id));
    }
  }
  draw(ctx) {
    const r = this.res;
    drawMenuBackground(ctx, this.t);
    drawPanel(ctx, 8, 8, 304, 164);
    Font.draw(ctx, r.finished ? 'LABOR GERETTET!' : 'ZEIT ABGELAUFEN!', 160, 13, { color: r.finished ? '#7be07b' : THEME.gold, scale: 2, align: 'center' });
    Font.draw(ctx, displayName(r.lead), 160, 32, { color: '#c8f2ff', align: 'center' });
    const k = Math.min(1, this.t / 70);
    const got = r.medals || [];
    const rows = [
      ['EINGESAUGT', String(r.captures)],
      ['PUMPE', r.pump ? CONFIG.pumps[r.pump].short : '-'],
      ['SCHUTZ', (r.ppe || 0) + '/4'],
      ['BESTE COMBO', r.maxCombo > 1 ? '×' + r.maxCombo : '-'],
      ['PUNKTE', String(Math.round(r.score * k))],
      ['ZEITBONUS', r.finished ? String(Math.round(r.timeBonus * k)) : '-'],
      ['MEDAILLEN', r.medalBonus ? '+' + Math.round(r.medalBonus * k) : '-']
    ];
    rows.forEach((row, i) => {
      const y = 44 + i * 9;
      Font.draw(ctx, row[0], 18, y, { color: '#ffffff' });
      Font.draw(ctx, row[1], 180, y, { color: i === 6 && r.medalBonus ? THEME.gold : '#ffffff', align: 'right' });
    });
    ctx.fillStyle = '#3aa0e8'; ctx.fillRect(18, 108, 162, 1);
    Font.draw(ctx, 'GESAMT', 18, 112, { color: THEME.gold, scale: 2 });
    Font.draw(ctx, String(Math.round(r.total * k)), 180, 112, { color: THEME.gold, scale: 2, align: 'right' });
    // Medaillen-Spalte: verdiente leuchten, die anderen zeigen, was noch möglich ist
    ctx.fillStyle = '#5a7aa3'; ctx.fillRect(190, 42, 1, 84);
    Font.draw(ctx, 'MEDAILLEN', 250, 44, { color: THEME.gold, align: 'center' });
    CONFIG.medals.forEach((m, i) => {
      const y = 55 + i * 12;
      const idx = got.indexOf(m.key);
      const on = idx >= 0 && idx < (this.medalShown || 0);
      const pop = on && this.t < 80 + idx * 14 + 6;
      drawMedal(ctx, 198, y - 2 - (pop ? 1 : 0), on);
      Font.draw(ctx, m.name, 210, y, { color: on ? '#ffffff' : '#7f93b0' });
    });
    if (this.t > 70 && this.test) {
      Font.draw(ctx, 'TESTRUNDE - NICHT IN DER BESTENLISTE', 160, 134, { color: '#c8f2ff', align: 'center' });
    } else if (this.t > 70) {
      const rankTxt = 'PLATZ ' + (this.rankDay || '-') + ' HEUTE  ·  PLATZ ' + (this.rankAll || '-') + ' GESAMT';
      Font.draw(ctx, rankTxt, 160, 134, { color: '#ffffff', align: 'center' });
      if (!this.newBest) Font.draw(ctx, 'DEIN BESTWERT: ' + this.best, 160, 145, { color: '#c8f2ff', align: 'center' });
      else if (this.rankDay === 1 && this.t % 30 < 20) Font.draw(ctx, '★ TAGESBESTWERT! ★', 160, 145, { color: '#ffd23f', align: 'center' });
    }
    if (this.t > 60 && this.t % 50 < 35) Font.draw(ctx, 'ENTER = BESTENLISTE', 160, 159, { color: THEME.gold, align: 'center' });
  }
}

// Kleine Pixel-Medaille (9×10): Band oben, runde Plakette unten
function drawMedal(ctx, x, y, on) {
  const band = on ? THEME.navyDark : '#50617c', band2 = on ? '#e04848' : '#5d6b80';
  const rim = on ? '#d27410' : '#5d6b80', face = on ? THEME.gold : '#6f809b', hi = on ? '#ffe9a8' : '#8795a8';
  ctx.fillStyle = band; ctx.fillRect(x + 1, y, 3, 4); ctx.fillRect(x + 5, y, 3, 4);
  ctx.fillStyle = band2; ctx.fillRect(x + 2, y, 1, 4); ctx.fillRect(x + 6, y, 1, 4);
  ctx.fillStyle = PAL.k; ctx.fillRect(x + 2, y + 3, 5, 7); ctx.fillRect(x + 1, y + 4, 7, 5);
  ctx.fillStyle = rim; ctx.fillRect(x + 3, y + 4, 3, 5); ctx.fillRect(x + 2, y + 5, 5, 3);
  ctx.fillStyle = face; ctx.fillRect(x + 3, y + 5, 3, 3);
  ctx.fillStyle = hi; ctx.fillRect(x + 3, y + 5, 1, 1);
}

class BoardScene {
  constructor(highlightId) { this.hl = highlightId; this.t = 0; this.allowAdmin = true; }
  enter() { Sound.music('title'); }
  update() {
    this.t++;
    if ((this.t > 30 && Input.pressed('start')) || this.t > CONFIG.boardAutoReturnSeconds * 60) Game.go(new TitleScene());
  }
  draw(ctx) {
    drawMenuBackground(ctx, this.t);
    drawBoards(ctx, this.t, this.hl);
    if (this.t % 60 < 40) Font.draw(ctx, 'DANKE FÜRS SPIELEN!  ENTER = WEITER', 160, 170, { color: THEME.gold, align: 'center', outline: '#1a1c2c' });
  }
}
