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

class TitleScene {
  constructor() {
    this.allowAdmin = true;
    this.t = 0; this.mode = 'title'; this.modeT = 0;
    this.demo = []; this.pops = [];
  }
  enter() { Sound.music('title'); }
  update() {
    this.t++; this.modeT++;
    if (this.mode === 'board' && (Input.pressed('board') || Input.pressed('back'))) { this.toggleBoard(); return; }
    if (this.mode === 'title' && Input.pressed('board')) { this.toggleBoard(); return; }
    if (Input.pressed('start')) { this.startGame(); return; }
    if (Input.pressed('fullscreen')) toggleFullscreen();
    this.updateDemo();
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
  updateDemo() {
    // kleine Demo: der Professor saugt Laborchaos ein
    const nz = { x: 102, y: 134 };
    if (this.t % 45 === 0) {
      const types = ['drop', 'paper', 'medium', 'cloud', 'flask', 'ghost', 'tube', 'ice'];
      const spr = types[Math.floor(hash(this.t) * types.length)];
      this.demo.push({ x: 340, y: 104 + hash(this.t + 3) * 44, spr, v: 0.8, t: 0 });
    }
    for (const d of this.demo) {
      d.t++;
      const dx = nz.x - d.x, dy = nz.y - d.y, len = Math.hypot(dx, dy) || 1;
      if (d.x < 200) d.v = Math.min(d.v + 0.12, 4);
      d.x += dx / len * d.v; d.y += dy / len * d.v * (d.x < 200 ? 1 : 0.3);
      if (len < 6) {
        d.dead = true;
        this.pops.push({ x: nz.x + 6, y: nz.y - 16, t: 40, text: '+' + [100, 150, 250, 300][Math.floor(hash(d.t + this.t) * 4)] });
      }
    }
    this.demo = this.demo.filter(d => !d.dead);
    for (const p of this.pops) { p.t--; p.y -= 0.4; }
    this.pops = this.pops.filter(p => p.t > 0);
  }
  draw(ctx) {
    drawMenuBackground(ctx, this.t);
    if (this.mode === 'board') {
      drawBoards(ctx, this.t, null);
      Font.draw(ctx, 'B / ESC = ZURÜCK    ENTER = START', 160, 170, { color: THEME.gold, align: 'center', outline: '#1a1c2c' });
      return;
    }
    // Demo
    const sucking = true;
    if (this.t % 2 === 0) {
      for (let i = 0; i < 3; i++) {
        const along = hash(this.t * 3 + i) * 110, off = (hash(this.t * 5 + i) * 2 - 1) * (8 + along * 0.4);
        ctx.fillStyle = i % 2 ? '#ffffff' : '#6fcbe8';
        ctx.fillRect(Math.round(104 + along), Math.round(134 + off), 2, 1);
      }
    }
    for (const d of this.demo) {
      const spr = SPR[d.spr];
      ctx.drawImage(spr, Math.round(d.x - spr.width / 2), Math.round(d.y - spr.height / 2));
    }
    ctx.save();
    ctx.translate(-66, -148);
    ctx.scale(2, 2);
    drawProfessor(ctx, 70, 148, { face: 1, pump: 2, pose: 'idle', shake: 0, sucking, ppe: {} });
    ctx.restore();
    for (const p of this.pops) Font.draw(ctx, p.text, p.x, p.y, { color: THEME.gold, align: 'center', outline: '#1a1c2c' });

    ctx.fillStyle = 'rgba(207,227,239,0.75)';
    ctx.fillRect(0, 0, VIEW_W, 88);
    Font.drawLogo(ctx, 160, 5, 1, PAL.k);
    const bob = Math.round(Math.sin(this.t * 0.05) * 2);
    Font.draw(ctx, 'VAKUUM', 160, 18 + bob, { color: THEME.gold, scale: 4, align: 'center', outline: PAL.k });
    Font.draw(ctx, 'PROFESSOR', 160, 50 + bob, { color: '#ffffff', scale: 3, align: 'center', outline: THEME.navy });
    Font.draw(ctx, 'SAUG DAS LABOR-CHAOS WEG!', 160, 77, { color: '#1a1c2c', align: 'center' });
    const [sx, sy, sw, sh] = TITLE_BTN_START, [bx, by, bw, bh] = TITLE_BTN_BOARD;
    drawPanel(ctx, sx, sy, sw, sh);
    Font.draw(ctx, 'ENTER = START', sx + sw / 2, sy + 4, { color: this.t % 60 < 42 ? THEME.gold : '#ffffff', align: 'center' });
    drawPanel(ctx, bx, by, bw, bh);
    Font.draw(ctx, 'B = BESTENLISTE', bx + bw / 2, by + 4, { color: '#c8f2ff', align: 'center' });
    const top = Store.board(todayKey())[0];
    if (top) {
      Font.draw(ctx, 'HEUTE FÜHRT:', 233, 136, { color: '#1a1c2c', align: 'center' });
      Font.draw(ctx, top.name + '  ' + top.score, 233, 146, { color: '#d1621a', align: 'center' });
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
    Store.addRound({
      leadId: res.lead.id, score: res.total, base: res.score, timeBonus: res.timeBonus,
      finished: res.finished, timeLeft: res.timeLeft, pump: res.pump, captures: res.captures, ppe: res.ppe, views: res.views
    });
    this.best = Store.bestOf(res.lead.id);
    this.rankDay = Store.rank(res.lead.id, todayKey());
    this.rankAll = Store.rank(res.lead.id, null);
    this.newBest = this.best === res.total;
  }
  enter() { Sound.music(null); }
  update() {
    this.t++;
    if ((this.t > 60 && Input.pressed('start')) || this.t > CONFIG.resultAutoReturnSeconds * 60) {
      Sound.sfx('select');
      Game.go(new BoardScene(this.res.lead.id));
    }
  }
  draw(ctx) {
    const r = this.res;
    drawMenuBackground(ctx, this.t);
    drawPanel(ctx, 36, 10, 248, 160);
    Font.draw(ctx, r.finished ? 'LABOR GERETTET!' : 'ZEIT ABGELAUFEN!', 160, 17, { color: r.finished ? '#7be07b' : THEME.gold, scale: 2, align: 'center' });
    Font.draw(ctx, displayName(r.lead), 160, 38, { color: '#c8f2ff', align: 'center' });
    const k = Math.min(1, this.t / 70);
    const rows = [
      ['EINGESAUGT', String(r.captures)],
      ['BESTE PUMPE', r.pump ? CONFIG.pumps[r.pump].short : '-'],
      ['PUNKTE', String(Math.round(r.score * k))],
      ['SCHUTZAUSRÜSTUNG', (r.ppe || 0) + '/4'],
      ['ZEITBONUS', r.finished ? String(Math.round(r.timeBonus * k)) : '-']
    ];
    rows.forEach((row, i) => {
      const y = 49 + i * 10;
      Font.draw(ctx, row[0], 50, y, { color: '#ffffff' });
      Font.draw(ctx, row[1], 270, y, { color: '#ffffff', align: 'right' });
    });
    ctx.fillStyle = '#3aa0e8'; ctx.fillRect(50, 99, 220, 1);
    Font.draw(ctx, 'GESAMT', 50, 105, { color: THEME.gold, scale: 2 });
    Font.draw(ctx, String(Math.round(r.total * k)), 270, 105, { color: THEME.gold, scale: 2, align: 'right' });
    if (this.t > 70) {
      const rankTxt = 'PLATZ ' + (this.rankDay || '-') + ' HEUTE  ·  PLATZ ' + (this.rankAll || '-') + ' GESAMT';
      Font.draw(ctx, rankTxt, 160, 128, { color: '#ffffff', align: 'center' });
      if (!this.newBest) Font.draw(ctx, 'DEIN BESTWERT: ' + this.best, 160, 139, { color: '#c8f2ff', align: 'center' });
      else if (this.rankDay === 1 && this.t % 30 < 20) Font.draw(ctx, '★ TAGESBESTWERT! ★', 160, 139, { color: '#ffd23f', align: 'center' });
    }
    if (this.t > 60 && this.t % 50 < 35) Font.draw(ctx, 'ENTER = BESTENLISTE', 160, 156, { color: THEME.gold, align: 'center' });
  }
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
