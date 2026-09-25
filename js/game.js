'use strict';
// Die eigentliche Spielrunde
const CAM_Y = 12; // die obersten 12 Pixel des Levels liegen unter der Anzeige

class PlayScene {
  constructor(lead) {
    this.lead = lead;
    this.allowAdmin = false;
    this.level = Level.build();
    const ps = this.level.playerStart;
    this.player = new Player(ps.x * T + 8, (ps.y + 1) * T);
    this.enemies = [];
    this.boss = null;
    for (const s of this.level.spawns) {
      const x = s.x * T + 8, y = (s.y + 1) * T;
      if (s.type === 'K') this.boss = new Boss(x, y);
      else this.enemies.push(new Enemy(s.type, x, y));
    }
    this.items = []; this.parts = []; this.popups = []; this.bumps = [];
    this.score = 0; this.time = CONFIG.roundSeconds; this.lastSec = Math.ceil(this.time);
    this.combo = 0; this.comboT = 0; this.captures = 0; this.bestPump = 0;
    this.state = 'howto'; this.stateT = 0; this.t = 0;
    this.freeze = 0; this.banner = null; this.msg = null; this.heavyT = 0; this.noPumpT = 0; this.lockedT = 0;
    this.camX = 0; this.exitOpen = false; this.zone = 0; this.paused = false;
  }

  enter() { Sound.music(null); }
  exit() { Sound.suckStop(); }

  showMsg(text, dur, color) { this.msg = { text, t: dur || 100, color: color || '#ffffff' }; }
  popup(x, y, text, color) { this.popups.push({ x, y, text, color: color || '#ffffff', t: 50 }); }
  burst(x, y, colors, n) {
    for (let i = 0; i < (n || 8); i++) {
      const a = Math.random() * Math.PI * 2, s = 0.5 + Math.random() * 1.8;
      this.parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 0.6, g: 0.06, t: 25 + Math.random() * 15, c: colors[i % colors.length], s: 2 });
    }
  }

  // ------------------------------------------------------------------
  update() {
    this.t++;
    this.stateT++;
    if (this.paused) {
      if (Input.pressed('start')) { Sound.music(null); Game.go(new TitleScene()); }
      else if (Input.pressed('back')) this.paused = false;
      return;
    }
    switch (this.state) {
      case 'howto':
        if ((this.stateT > 30 && Input.pressed('start')) || this.stateT > 60 * 15) this.setState('count');
        if (Input.pressed('back')) Game.go(new TitleScene());
        return;
      case 'count':
        if (this.stateT % 60 === 1 && this.stateT < 180) Sound.sfx('count');
        this.updateEffects();
        if (this.stateT >= 180) { this.setState('play'); Sound.sfx('go'); Sound.music('game'); }
        return;
      case 'play':
        if (Input.pressed('back')) { this.paused = true; Sound.suckStop(); this.player.sucking = false; return; }
        this.updateWorld();
        return;
      case 'finish':
      case 'timeup':
        this.updateEffects();
        if (this.state === 'finish' && this.stateT < 60) { this.player.x += 0.6; this.player.walkT++; }
        if (this.stateT > 170) this.end(this.state === 'finish');
        return;
    }
  }

  setState(s) { this.state = s; this.stateT = 0; }

  end(finished) {
    const timeLeft = finished ? Math.ceil(this.time) : 0;
    const timeBonus = finished ? timeLeft * CONFIG.timeBonusPerSecond + CONFIG.finishBonus : 0;
    Game.go(new ResultScene({
      lead: this.lead, score: this.score, timeBonus, total: this.score + timeBonus,
      finished, timeLeft, pump: Math.max(this.bestPump, this.player.pump), captures: this.captures
    }));
  }

  updateWorld() {
    if (this.freeze > 0) { this.freeze--; this.updateEffects(); return; }
    const p = this.player;
    this.time -= 1 / 60;
    const sec = Math.ceil(this.time);
    if (sec !== this.lastSec) {
      this.lastSec = sec;
      if (sec <= 10 && sec > 0) Sound.sfx('beep');
      if (sec === 10) Sound.fast = true;
    }
    if (this.time <= 0) {
      this.time = 0;
      Sound.suckStop(); p.sucking = false;
      Sound.music(null); Sound.sfx('timeup');
      this.setState('timeup');
      return;
    }
    if (this.comboT > 0 && --this.comboT === 0) this.combo = 0;
    if (this.heavyT > 0) this.heavyT--;
    if (this.noPumpT > 0) this.noPumpT--;
    if (this.lockedT > 0) this.lockedT--;

    this.updatePlayer();
    this.updateSuction();
    const camRight = this.camX + VIEW_W + 24;
    for (const e of this.enemies) {
      if (!e.active && e.x - e.w < camRight) e.active = true;
      if (e.active && e.alive) e.update(this);
    }
    if (this.boss && this.boss.alive) this.boss.update(this);
    for (const it of this.items) it.update(this);
    this.checkCollisions();
    this.enemies = this.enemies.filter(e => e.alive);
    this.items = this.items.filter(i => i.alive);
    this.updateEffects();

    // Kamera
    const target = clamp(p.x - 140 + p.face * 10, 0, this.level.W * T - VIEW_W);
    this.camX += (target - this.camX) * 0.15;

    // Zonen-Wechsel
    const z = zoneOf(p.x);
    if (z > this.zone) {
      this.zone = z;
      this.showMsg('ZONE ' + (z + 1) + ': ' + ZONE_STYLE[z].name, 120, '#ffe066');
    }

    // Ausgang
    const door = { x: this.level.exitX * T + 8, y: 10 * T, w: 12, h: 30 };
    if (overlap(p, door)) {
      if (this.exitOpen) {
        Sound.suckStop(); p.sucking = false;
        Sound.music(null); Sound.sfx('fanfare');
        this.setState('finish');
      } else if (this.lockedT <= 0) {
        this.lockedT = 150;
        this.showMsg('ERST DIE DAMPF-KRAKE EINSAUGEN!', 120, '#ff8f8f');
      }
    }
  }

  updatePlayer() {
    const p = this.player, lv = this.level;
    p.walkT++;
    let dir = 0;
    if (p.stun > 0) {
      p.stun--;
      p.vx *= 0.92;
    } else {
      dir = (Input.down('left') ? -1 : 0) + (Input.down('right') ? 1 : 0);
      const sucking = Input.down('suck') && p.pump > 0;
      const maxV = sucking ? 0.9 : 1.6;
      if (dir) {
        p.face = dir;
        p.vx += dir * 0.18;
        p.vx = clamp(p.vx, -maxV, maxV);
      } else {
        p.vx *= p.onGround ? 0.72 : 0.94;
        if (Math.abs(p.vx) < 0.05) p.vx = 0;
      }
      if (Math.abs(p.vx) > maxV) p.vx *= 0.9;
      if (Input.pressed('jump')) p.jumpBuf = 7;
      if (p.jumpBuf > 0 && (p.onGround || p.coyote > 0)) {
        p.vy = -5.8; p.onGround = false; p.coyote = 0; p.jumpBuf = 0;
        Sound.sfx('jump');
      }
      if (!Input.down('jump') && p.vy < -2.2) p.vy = -2.2;
    }
    if (p.jumpBuf > 0) p.jumpBuf--;
    p.vy = Math.min(p.vy + 0.3, 6);
    moveBody(p, lv);
    if (p.onGround) {
      p.coyote = 6;
      const lt = Math.floor((p.x - p.w / 2) / T), rt = Math.floor((p.x + p.w / 2 - 0.01) / T), ft = Math.floor(p.y / T);
      if (isSolid(lv, lt, ft) && isSolid(lv, rt, ft) && isSolid(lv, lt - 1, ft) && isSolid(lv, rt + 1, ft)) p.safe = { x: p.x, y: p.y };
    } else if (p.coyote > 0) p.coyote--;
    if (p.bump) this.bumpBlock(p.bump.tx, p.bump.ty);
    if (p.inv > 0) p.inv--;
    if (p.y > lv.H * T + 24) {
      this.time -= CONFIG.fallTimePenalty;
      p.x = p.safe.x; p.y = p.safe.y; p.vx = 0; p.vy = 0; p.inv = 90;
      this.popup(p.x, p.y - 20, '-' + CONFIG.fallTimePenalty + ' SEK', '#ff8f8f');
      Sound.sfx('hurt');
      this.combo = 0;
    }
  }

  bumpBlock(tx, ty) {
    const lv = this.level, c = lv.tiles[ty][tx];
    const p = this.player;
    if (c === '1' || c === '2' || c === '3' || c === '?') {
      lv.tiles[ty][tx] = 'U';
      this.bumps.push({ tx, ty, t: 0 });
      const tier = c === '?' ? 0 : Number(c);
      if (tier > p.pump && !this.items.some(i => i.tier >= tier)) {
        this.items.push(new Item(tier, tx, ty));
        Sound.sfx('bump');
      } else {
        this.addScore(200);
        this.popup(tx * T + 8, ty * T - 8, '+200', '#ffe066');
        this.parts.push({ x: tx * T + 8, y: ty * T - 6, vx: 0, vy: -3, g: 0.2, t: 26, spr: 'coin' });
        Sound.sfx('coin');
      }
    } else {
      this.bumps.push({ tx, ty, t: 0 });
      Sound.sfx('bump');
    }
    // Gegner, die auf dem Block stehen, fliegen weg
    for (const e of this.enemies) {
      if (!e.captured && e.def.stomp && Math.abs(e.x - (tx * T + 8)) < 12 && Math.abs(e.y - ty * T) < 3) {
        e.alive = false;
        this.addScore(50);
        this.burst(e.x, e.y - 4, ['#ffffff', '#c8f2ff'], 6);
      }
    }
  }

  addScore(n) { this.score += n; }

  inCone(nz, face, range, cx, cy) {
    const along = (cx - nz.x) * face;
    if (along < -6 || along > range) return false;
    return Math.abs(cy - nz.y) <= 10 + Math.max(0, along) * 0.5;
  }

  updateSuction() {
    const p = this.player;
    const wants = Input.down('suck') && p.stun <= 0;
    if (wants && p.pump === 0) {
      if (Input.pressed('suck')) Sound.sfx('puff');
      if (this.noPumpT <= 0) {
        this.noPumpT = 150;
        this.showMsg('KEINE PUMPE! SPRING GEGEN DEN ?-BLOCK!', 130, '#ffe066');
      }
    }
    const sucking = wants && p.pump > 0;
    if (sucking && !p.sucking) Sound.suckStart(p.pump);
    if (!sucking && p.sucking) Sound.suckStop();
    p.sucking = sucking;
    if (!sucking) return;

    const cfg = CONFIG.pumps[p.pump];
    const nz = p.nozzle();
    // Saug-Streifen
    for (let i = 0; i < p.pump + 1; i++) {
      const along = 8 + Math.random() * cfg.range;
      const off = (Math.random() * 2 - 1) * (8 + along * 0.45);
      const sx = nz.x + p.face * along, sy = Math.min(nz.y + off, p.y - 2);
      const dx = nz.x - sx, dy = nz.y - sy, len = Math.hypot(dx, dy) || 1;
      const sp = 2.2 + p.pump * 0.8;
      this.parts.push({ x: sx, y: sy, vx: dx / len * sp, vy: dy / len * sp, g: 0, t: Math.floor(len / sp), c: i % 2 ? '#ffffff' : '#c8f2ff', s: 1, streak: true });
    }
    for (const e of this.enemies) {
      if (!e.active || !e.alive || e.captured) continue;
      if (!this.inCone(nz, p.face, cfg.range, e.x, e.y - e.h / 2)) continue;
      if (e.def.weight <= cfg.power) {
        e.pulledNow = true;
        e.pullV = Math.min(e.pullV + 0.09 * cfg.pull, 0.8 + cfg.pull * 1.2);
        const dx = nz.x - e.x, dy = nz.y - (e.y - e.h / 2), len = Math.hypot(dx, dy) || 1;
        e.x += dx / len * Math.min(e.pullV, len);
        e.y += dy / len * Math.min(e.pullV, len);
        if (len < 8) this.capture(e);
      } else {
        e.shake = 6;
        if (this.heavyT <= 0) {
          this.heavyT = 150;
          this.showMsg('ZU SCHWER! DU BRAUCHST EINE STÄRKERE PUMPE!', 130, '#ff8f8f');
          Sound.sfx('heavy');
        }
      }
    }
    const b = this.boss;
    if (b && b.active && b.alive && !b.captured && this.inCone(nz, p.face, cfg.range + 10, b.x, b.y - b.h / 2)) {
      if (cfg.power >= 3) {
        b.suckedNow = true;
        b.shake = 4;
        if (b.hp > 0) {
          b.hp--;
          b.x += Math.sign(nz.x - b.x) * 0.15;
          if (b.hp <= 0) this.showMsg('GLEICH HAST DU SIE!', 80, '#7be07b');
        } else {
          b.pullV = Math.min(b.pullV + 0.05, 2.5);
          const dx = nz.x - b.x, dy = nz.y - (b.y - b.h / 2), len = Math.hypot(dx, dy) || 1;
          b.x += dx / len * b.pullV; b.y += dy / len * b.pullV;
          if (len < 12) {
            b.captured = true; b.capT = 40;
            this.addScore(3000); this.captures++;
            this.popup(nz.x, nz.y - 24, '+3000!', '#ffe066');
            this.burst(nz.x, nz.y, ['#e6dcff', '#c7b5f5', '#ffffff', '#ffe066'], 24);
            this.exitOpen = true;
            this.banner = { title: 'LABOR GERETTET!', sub: 'SCHNELL ZUM AUSGANG →\nRESTZEIT GIBT BONUSPUNKTE!', t: 200 };
            Sound.sfx('boss');
          }
        }
      } else if (this.heavyT <= 0) {
        this.heavyT = 150;
        this.showMsg('DIE KRAKE IST ZU STARK! HOL DIR DIE VACUU·PURE!', 130, '#ff8f8f');
        Sound.sfx('heavy');
      }
    }
  }

  capture(e) {
    e.captured = true;
    e.capT = 12;
    this.combo = this.comboT > 0 ? this.combo + 1 : 1;
    this.comboT = Math.round(CONFIG.comboWindow * 60);
    const mult = Math.min(this.combo, 5);
    const pts = e.def.points * mult;
    this.addScore(pts);
    this.captures++;
    this.popup(e.x, e.y - e.h - 4, '+' + pts + (mult > 1 ? ' ×' + mult : ''), mult > 1 ? '#ffe066' : '#ffffff');
    this.burst(e.x, e.y - e.h / 2, ['#ffffff', '#c8f2ff', '#6fcbe8'], 6);
    Sound.sfx('capture', e.def.weight);
  }

  checkCollisions() {
    const p = this.player;
    for (const it of this.items) {
      if (it.t > 20 && overlap(p, it)) {
        it.alive = false;
        if (it.tier > p.pump) {
          p.pump = it.tier;
          this.bestPump = Math.max(this.bestPump, p.pump);
          const cfg = CONFIG.pumps[p.pump];
          this.banner = { title: cfg.title, sub: cfg.slogan, t: 210, pump: p.pump };
          this.freeze = 40;
          this.addScore(500);
          this.popup(p.x, p.y - 26, '+500', '#ffe066');
          if (p.sucking) Sound.suckStart(p.pump);
        }
        Sound.sfx('powerup');
        this.burst(p.x, p.y - 10, ['#ffe066', '#ffffff', '#7be07b'], 12);
      }
    }
    for (const e of this.enemies) {
      if (!e.alive || !e.active || e.captured || e.wasPulled || !e.def.harm) continue;
      if (!overlap(p, e)) continue;
      if (e.def.stomp && p.vy > 0 && p.y - p.vy <= e.y - e.h + 4) {
        e.alive = false;
        p.vy = Input.down('jump') ? -5 : -3.6;
        this.addScore(50);
        this.popup(e.x, e.y - e.h - 2, '+50', '#ffffff');
        this.burst(e.x, e.y - 3, ['#ffffff', '#a7b3c4'], 6);
        Sound.sfx('stomp');
      } else this.hurt(e.x);
    }
    const b = this.boss;
    if (b && b.active && b.alive && !b.captured && b.hp > 0 && overlap(p, b)) this.hurt(b.x);
  }

  hurt(fromX) {
    const p = this.player;
    if (p.inv > 0) return;
    this.time -= CONFIG.hitTimePenalty;
    p.stun = 30; p.inv = 100;
    p.vx = (p.x < fromX ? -1 : 1) * 2; p.vy = -2.5;
    this.combo = 0; this.comboT = 0;
    Sound.suckStop(); p.sucking = false;
    this.popup(p.x, p.y - 24, '-' + CONFIG.hitTimePenalty + ' SEK', '#ff8f8f');
    Sound.sfx('hurt');
  }

  updateEffects() {
    for (const q of this.parts) { q.x += q.vx; q.y += q.vy; q.vy += q.g; q.t--; }
    this.parts = this.parts.filter(q => q.t > 0);
    for (const q of this.popups) { q.y -= 0.4; q.t--; }
    this.popups = this.popups.filter(q => q.t > 0);
    for (const b of this.bumps) b.t++;
    this.bumps = this.bumps.filter(b => b.t < 8);
    if (this.banner && --this.banner.t <= 0) this.banner = null;
    if (this.msg && --this.msg.t <= 0) this.msg = null;
  }

  // ------------------------------------------------------------------
  draw(ctx) {
    const camX = Math.round(this.camX);
    drawBackground(ctx, camX);
    ctx.save();
    ctx.translate(0, -CAM_Y);
    for (const s of this.level.signs) drawSign(ctx, s, camX);
    this.drawDoor(ctx, camX);
    for (const it of this.items) it.draw(ctx, camX);
    drawTiles(ctx, this.level, camX, this.bumps, this.t);
    for (const e of this.enemies) if (e.def.beh === 'static' && e.active) e.draw(ctx, camX);
    if (this.boss && this.boss.alive && this.boss.active) this.boss.draw(ctx, camX, this.t);
    for (const e of this.enemies) if (e.def.beh !== 'static' && e.active) e.draw(ctx, camX);
    if (!(this.state === 'finish' && this.stateT > 50)) this.player.draw(ctx, camX, this.t);
    for (const q of this.parts) {
      if (q.spr) { ctx.drawImage(SPR[q.spr], Math.round(q.x - camX - 5), Math.round(q.y - 6)); continue; }
      ctx.fillStyle = q.c;
      if (q.streak) ctx.fillRect(Math.round(q.x - camX), Math.round(q.y), 2, 1);
      else ctx.fillRect(Math.round(q.x - camX), Math.round(q.y), q.s, q.s);
    }
    for (const q of this.popups) Font.draw(ctx, q.text, Math.round(q.x - camX), Math.round(q.y), { color: q.color, align: 'center', outline: '#1a1c2c' });
    ctx.restore();
    this.drawHud(ctx);
    this.drawOverlays(ctx);
  }

  drawDoor(ctx, camX) {
    const x = this.level.exitX * T + 8 - camX;
    if (x < -20 || x > VIEW_W + 20) return;
    const spr = this.exitOpen ? SPR.doorOpen : SPR.doorLocked;
    ctx.drawImage(spr, x - 10, 10 * T - spr.height);
    ctx.fillStyle = '#1a1c2c'; ctx.fillRect(x - 14, 10 * T - 46, 28, 10);
    Font.draw(ctx, 'EXIT', x, 10 * T - 44, { color: this.exitOpen ? '#7be07b' : '#ff8f8f', align: 'center' });
  }

  drawHud(ctx) {
    const p = this.player;
    ctx.fillStyle = 'rgba(16,24,48,0.88)';
    ctx.fillRect(0, 0, VIEW_W, 12);
    Font.draw(ctx, 'PUNKTE ' + pad(this.score, 6), 4, 3, { color: '#ffffff' });
    const pumpName = p.pump ? CONFIG.pumps[p.pump].short : 'KEINE PUMPE';
    Font.draw(ctx, pumpName, 160, 3, { color: p.pump ? '#7be07b' : '#a7b3c4', align: 'center' });
    const sec = Math.max(0, Math.ceil(this.time));
    const low = sec <= 10;
    if (!low || this.t % 30 < 20) Font.draw(ctx, 'ZEIT ' + pad(sec, 3), 316, 3, { color: low ? '#ff6b6b' : '#ffffff', align: 'right' });
    if (this.combo > 1 && this.comboT > 0) Font.draw(ctx, 'COMBO ×' + Math.min(this.combo, 5), 4, 15, { color: '#ffe066', outline: '#1a1c2c' });
    const b = this.boss;
    if (b && b.active && b.alive && !b.captured) {
      Font.draw(ctx, 'DAMPF-KRAKE', 160, 16, { color: '#e6dcff', align: 'center', outline: '#1a1c2c' });
      ctx.fillStyle = '#1a1c2c'; ctx.fillRect(109, 25, 102, 5);
      ctx.fillStyle = '#7b5fb8'; ctx.fillRect(110, 26, Math.round(100 * b.hp / b.maxHp), 3);
    }
  }

  drawOverlays(ctx) {
    if (this.msg) Font.draw(ctx, this.msg.text, 160, this.boss && this.boss.active && this.boss.alive ? 36 : 22, { color: this.msg.color, align: 'center', outline: '#1a1c2c' });
    if (this.banner) {
      const b = this.banner;
      const lines = b.sub.split('\n').length;
      const h = 24 + lines * 9, y = 44;
      drawPanel(ctx, 40, y, 240, h);
      let tx = 160;
      if (b.pump) {
        const spr = SPR['pump' + b.pump];
        ctx.drawImage(spr, 50, y + Math.round((h - spr.height * 2) / 2), spr.width * 2, spr.height * 2);
        tx = 176;
      }
      Font.draw(ctx, b.title, tx, y + 6, { color: '#ffe066', align: 'center' });
      Font.draw(ctx, b.sub, tx, y + 18, { color: '#ffffff', align: 'center' });
    }
    if (this.state === 'howto') this.drawHowto(ctx);
    if (this.state === 'count') {
      const n = 3 - Math.floor(this.stateT / 60);
      Font.draw(ctx, String(n), 160, 70, { color: '#ffe066', scale: 4, align: 'center', outline: '#1a1c2c' });
    }
    if (this.state === 'play' && this.stateT < 50) Font.draw(ctx, 'LOS!', 160, 70, { color: '#7be07b', scale: 4, align: 'center', outline: '#1a1c2c' });
    if (this.state === 'timeup') {
      drawPanel(ctx, 70, 64, 180, 34);
      Font.draw(ctx, 'ZEIT ABGELAUFEN!', 160, 76, { color: '#ffe066', align: 'center' });
    }
    if (this.state === 'finish') {
      drawPanel(ctx, 60, 60, 200, 44);
      Font.draw(ctx, 'GESCHAFFT!', 160, 67, { color: '#7be07b', scale: 2, align: 'center' });
      Font.draw(ctx, 'RESTZEIT ' + Math.ceil(this.time) + ' SEK = BONUS!', 160, 88, { color: '#ffffff', align: 'center' });
    }
    if (this.paused) {
      drawPanel(ctx, 60, 55, 200, 60);
      Font.draw(ctx, 'PAUSE', 160, 62, { color: '#ffe066', scale: 2, align: 'center' });
      Font.draw(ctx, 'ESC = WEITERSPIELEN\nENTER = RUNDE ABBRECHEN', 160, 84, { color: '#ffffff', align: 'center' });
    }
  }

  drawHowto(ctx) {
    drawPanel(ctx, 24, 18, 272, 150);
    Font.draw(ctx, 'SO GEHT\'S', 160, 24, { color: '#ffe066', scale: 2, align: 'center' });
    const rows = [
      ['← →', 'LAUFEN'],
      ['LEERTASTE', 'SPRINGEN'],
      ['X HALTEN', 'SAUGEN']
    ];
    rows.forEach((r, i) => {
      const y = 46 + i * 12;
      drawKey(ctx, 118, y - 2, r[0]);
      Font.draw(ctx, r[1], 128, y, { color: '#ffffff' });
    });
    Font.draw(ctx, '?-BLÖCKE VON UNTEN ANSPRINGEN\n= BESSERE PUMPE = MEHR SAUGKRAFT!', 160, 88, { color: '#c8f2ff', align: 'center' });
    const pumps = [1, 2, 3];
    pumps.forEach((n, i) => {
      const x = 92 + i * 56;
      const spr = SPR['pump' + n];
      ctx.drawImage(spr, x - spr.width / 2, 122 - spr.height);
      Font.draw(ctx, CONFIG.pumps[n].short, x, 125, { color: '#ffffff', align: 'center' });
      if (i < 2) Font.draw(ctx, '→', x + 28, 112, { color: '#ffe066', align: 'center' });
    });
    Font.draw(ctx, 'SAUG IN ' + CONFIG.roundSeconds + ' SEKUNDEN SO VIEL WIE MÖGLICH EIN!', 160, 140, { color: '#ffffff', align: 'center' });
    if (this.t % 50 < 35) Font.draw(ctx, 'ENTER = START', 160, 155, { color: '#ffe066', align: 'center' });
  }
}

// ---------------------------------------------------------------------
// Zeichenhilfen (auch vom Titelbildschirm genutzt)
function drawPanel(ctx, x, y, w, h) {
  ctx.fillStyle = '#1a1c2c'; ctx.fillRect(x - 2, y - 2, w + 4, h + 4);
  ctx.fillStyle = '#ffffff'; ctx.fillRect(x - 1, y - 1, w + 2, h + 2);
  ctx.fillStyle = '#10204a'; ctx.fillRect(x, y, w, h);
}

function drawKey(ctx, rightX, y, label) {
  const w = Font.width(label) + 6;
  const x = rightX - w;
  ctx.fillStyle = '#1a1c2c'; ctx.fillRect(x - 1, y - 1, w + 2, 12);
  ctx.fillStyle = '#e8eef5'; ctx.fillRect(x, y, w, 10);
  ctx.fillStyle = '#a7b3c4'; ctx.fillRect(x, y + 9, w, 1);
  Font.draw(ctx, label, x + 3, y + 2, { color: '#1a1c2c' });
}

function drawSign(ctx, s, camX) {
  const lines = s.text.split('\n');
  const w = Math.max(...lines.map(l => l.length)) * 6 + 7;
  const h = lines.length * 9 + 5;
  const cx = s.x * T + 8 - camX;
  if (cx + w / 2 < 0 || cx - w / 2 > VIEW_W) return;
  const bx = Math.round(cx - w / 2), by = 36;
  ctx.fillStyle = '#6b3f22'; ctx.fillRect(cx - 1, by + h, 3, 160 - by - h);
  ctx.fillStyle = '#1a1c2c'; ctx.fillRect(bx - 1, by - 1, w + 2, h + 2);
  ctx.fillStyle = '#fff6d5'; ctx.fillRect(bx, by, w, h);
  Font.draw(ctx, s.text, bx + 4, by + 3, { color: '#1a1c2c' });
}

function drawBackground(ctx, camX) {
  // Wandfarbe je Zone
  for (let i = 0; i < 3; i++) {
    const x0 = Level.ZONE_STARTS[i] * T - camX;
    const x1 = (i < 2 ? Level.ZONE_STARTS[i + 1] * T : Level.WIDTH * T) - camX;
    if (x1 < 0 || x0 > VIEW_W) continue;
    const z = ZONE_STYLE[i];
    ctx.fillStyle = z.wall; ctx.fillRect(x0, 0, x1 - x0, VIEW_H);
    ctx.fillStyle = z.base; ctx.fillRect(x0, 106, x1 - x0, 42);
    ctx.fillStyle = z.wall2; ctx.fillRect(x0, 105, x1 - x0, 2);
  }
  // Fliesenraster (Parallax)
  const px = Math.round(camX * 0.5);
  for (let x = -(px % 16); x < VIEW_W; x += 16) {
    ctx.fillStyle = ZONE_STYLE[zoneOf(camX + x)].wall2;
    ctx.fillRect(x, 12, 1, 93);
  }
  for (let y = 12; y < 105; y += 16) {
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    ctx.fillRect(0, y, VIEW_W, 1);
  }
  // Deko (Parallax)
  const step = 88;
  const n0 = Math.floor(px / step) - 1;
  for (let n = n0; n < n0 + 6; n++) {
    const sx = n * step - px;
    const z = zoneOf(camX + sx + 20);
    drawDecor(ctx, sx, n, z);
  }
}

function drawDecor(ctx, x, n, zone) {
  const kind = Math.floor(hash(n + 11) * 5);
  const k = '#1a1c2c';
  if (kind === 0) { // Fenster
    ctx.fillStyle = k; ctx.fillRect(x, 26, 44, 40);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(x + 1, 27, 42, 38);
    ctx.fillStyle = zone === 2 ? '#bfe8f0' : '#9fd8f5'; ctx.fillRect(x + 3, 29, 38, 34);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(x + 8, 36, 12, 4); ctx.fillRect(x + 12, 33, 6, 3);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(x + 21, 29, 2, 34); ctx.fillRect(x + 3, 45, 38, 2);
  } else if (kind === 1) { // Regal mit Flaschen
    const cols = ['#7be07b', '#3aa0e8', '#ffa53a', '#e04848', '#c8f2ff', '#b4f7d4'];
    for (const sy of [58, 86]) {
      ctx.fillStyle = '#6b3f22'; ctx.fillRect(x, sy, 56, 3);
      for (let i = 0; i < 6; i++) {
        const c = cols[Math.floor(hash(n * 13 + i + sy) * cols.length)];
        const bh = 8 + Math.floor(hash(n * 7 + i + sy) * 6);
        const bx = x + 3 + i * 9;
        ctx.fillStyle = k; ctx.fillRect(bx - 1, sy - bh - 1, 7, bh + 1);
        ctx.fillStyle = c; ctx.fillRect(bx, sy - bh + 3, 5, bh - 3);
        ctx.fillStyle = '#e8eef5'; ctx.fillRect(bx + 1, sy - bh, 3, 3);
      }
    }
  } else if (kind === 2) { // Poster
    ctx.fillStyle = k; ctx.fillRect(x, 40, 66, 24);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(x + 1, 41, 64, 22);
    Font.draw(ctx, 'VACUUBRAND', x + 4, 44, { color: '#1f5fa8' });
    ctx.fillStyle = '#3aa0e8'; ctx.fillRect(x + 4, 54, 58, 2);
    ctx.fillStyle = '#a7b3c4'; ctx.fillRect(x + 4, 58, 40, 2);
  } else if (kind === 3) { // Rohre
    ctx.fillStyle = '#8795a8'; ctx.fillRect(x + 10, 12, 6, 94);
    ctx.fillStyle = '#b8c4d4'; ctx.fillRect(x + 11, 12, 2, 94);
    ctx.fillStyle = '#8795a8'; ctx.fillRect(x + 10, 70, 60, 6);
    ctx.fillStyle = '#b8c4d4'; ctx.fillRect(x + 10, 71, 60, 2);
    ctx.fillStyle = '#5d6b80'; ctx.fillRect(x + 8, 40, 10, 4); ctx.fillRect(x + 40, 68, 4, 10);
    ctx.fillStyle = '#e04848'; ctx.fillRect(x + 20, 64, 8, 3); ctx.fillRect(x + 23, 67, 2, 3);
  } else { // Periodensystem
    ctx.fillStyle = k; ctx.fillRect(x, 34, 58, 34);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(x + 1, 35, 56, 32);
    const cols = ['#ffb3b3', '#b3d9ff', '#c8f2c8', '#fff0a8'];
    for (let r = 0; r < 5; r++) for (let c = 0; c < 9; c++) {
      if (r === 0 && c > 0 && c < 8) continue;
      if (r === 1 && c > 1 && c < 6) continue;
      ctx.fillStyle = cols[(r + c) % 4]; ctx.fillRect(x + 3 + c * 6, 38 + r * 6, 5, 5);
    }
  }
}

function drawTiles(ctx, level, camX, bumps, t) {
  const tx0 = Math.floor(camX / T), tx1 = tx0 + Math.ceil(VIEW_W / T) + 1;
  const qf = [0, 1, 2, 1][Math.floor(t / 10) % 4];
  for (let ty = 0; ty < level.H; ty++) {
    for (let tx = tx0; tx <= tx1; tx++) {
      if (tx < 0 || tx >= level.W) continue;
      const c = level.tiles[ty][tx];
      if (c === ' ') continue;
      const z = zoneOf(tx * T);
      let spr;
      if (c === '#') spr = isSolid(level, tx, ty - 1) ? SPR['ground' + z] : SPR['groundTop' + z];
      else if (c === 'B') spr = SPR['brick' + z];
      else if (c === '-') spr = SPR.platform;
      else if (c === 'U') spr = SPR.used;
      else spr = SPR['q' + qf];
      let oy = 0;
      for (const b of bumps) if (b.tx === tx && b.ty === ty) oy = -[0, 3, 5, 6, 5, 3, 1, 0][b.t] || 0;
      ctx.drawImage(spr, tx * T - camX, ty * T + oy);
    }
  }
}
