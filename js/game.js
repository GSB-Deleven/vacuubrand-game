'use strict';
// Die eigentliche Spielrunde
const CAM_Y = 12; // die obersten 12 Pixel des Levels liegen unter der Anzeige
const HUD_H = 24;

class PlayScene {
  constructor(lead) {
    this.lead = lead;
    this.allowAdmin = false;
    this.level = Level.build();
    const ps = this.level.playerStart;
    this.player = new Player(ps.x * T + 8, (ps.y + 1) * T);
    this.enemies = [];
    this.items = [];
    this.boss = null;
    for (const s of this.level.spawns) {
      const x = s.x * T + 8, y = (s.y + 1) * T;
      if (s.type === 'K') this.boss = new Boss(x, y);
      else if (s.type === 'v') this.items.push(new Item('view', 0, x, y, false));
      else this.enemies.push(new Enemy(s.type, x, y));
    }
    this.parts = []; this.popups = []; this.bumps = [];
    this.score = 0; this.time = CONFIG.roundSeconds; this.lastSec = Math.ceil(this.time);
    this.combo = 0; this.comboT = 0; this.captures = 0; this.bestPump = 0; this.views = 0;
    this.state = 'howto'; this.stateT = 0; this.t = 0;
    this.freeze = 0; this.banner = null; this.msg = null;
    this.heavyT = 0; this.noPumpT = 0; this.lockedT = 0; this.heatT = 0; this.shoeHintT = 0;
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
  addTime(sec, x, y) {
    this.time += sec;
    this.popup(x, y, '+' + sec + ' SEK', '#7be07b');
  }

  // ------------------------------------------------------------------
  update() {
    this.t++;
    this.stateT++;
    if (this.paused) {
      if (Input.pressed('start') && !Input.pressed('suck')) { Sound.music(null); Game.go(new TitleScene()); }
      else if (Input.pressed('back')) this.paused = false;
      return;
    }
    switch (this.state) {
      case 'howto':
        if ((this.stateT > 30 && Input.pressed('start')) || this.stateT > 60 * 20) this.setState('count');
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
    const p = this.player;
    const timeLeft = finished ? Math.ceil(this.time) : 0;
    const timeBonus = finished ? timeLeft * CONFIG.timeBonusPerSecond + CONFIG.finishBonus : 0;
    Game.go(new ResultScene({
      lead: this.lead, score: this.score, timeBonus, total: this.score + timeBonus,
      finished, timeLeft, pump: Math.max(this.bestPump, p.pump), captures: this.captures,
      ppe: CONFIG.ppe.filter(q => p.ppe[q.key]).length, views: this.views
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
      Sound.fast = sec <= 10;
    }
    if (this.time <= 0) {
      this.time = 0;
      Sound.suckStop(); p.sucking = false;
      Sound.music(null); Sound.sfx('timeup');
      this.setState('timeup');
      return;
    }
    for (const k of ['heavyT', 'noPumpT', 'lockedT', 'heatT', 'shoeHintT']) if (this[k] > 0) this[k]--;
    if (this.comboT > 0 && --this.comboT === 0) this.combo = 0;

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
      this.showMsg('ZONE ' + (z + 1) + ': ' + ZONE_STYLE[z].name, 130, THEME.gold);
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
      p.sprinting = false;
    } else {
      dir = (Input.down('left') ? -1 : 0) + (Input.down('right') ? 1 : 0);
      // Ducken
      if (Input.down('down') && p.onGround) p.ducking = true;
      else if (p.ducking) {
        const tx0 = Math.floor((p.x - p.w / 2) / T), tx1 = Math.floor((p.x + p.w / 2 - 0.01) / T), ty = Math.floor((p.y - 14) / T);
        let free = true;
        for (let tx = tx0; tx <= tx1; tx++) if (isSolid(lv, tx, ty)) free = false;
        if (free) p.ducking = false;
      }
      p.h = p.ducking ? 10 : 14;
      // Sprint
      const sucking = Input.down('suck') && (p.pump > 0 || p.bvcT > 0) && (!p.overheat || p.bvcT > 0);
      p.sprinting = Input.down('sprint') && dir !== 0 && !p.tired && !p.ducking && !sucking;
      const maxV = p.ducking ? 0 : sucking ? 0.9 : p.sprinting ? 2.5 : 1.5;
      if (dir) p.face = dir;
      if (dir && !p.ducking) {
        p.vx += dir * (p.sprinting ? 0.24 : 0.18);
      } else {
        p.vx *= p.onGround ? 0.72 : 0.94;
        if (Math.abs(p.vx) < 0.05) p.vx = 0;
      }
      if (Math.abs(p.vx) > maxV) p.vx = Math.sign(p.vx) * Math.max(maxV, Math.abs(p.vx) * (p.onGround ? 0.9 : 0.98));
      if (Input.pressed('jump')) p.jumpBuf = 7;
      if (p.jumpBuf > 0 && (p.onGround || p.coyote > 0) && !p.ducking) {
        p.vy = Math.abs(p.vx) > 2 ? -6.2 : -5.8;
        p.onGround = false; p.coyote = 0; p.jumpBuf = 0;
        Sound.sfx('jump');
      }
      if (!Input.down('jump') && p.vy < -2.2) p.vy = -2.2;
    }
    // Ausdauer
    if (p.sprinting && Math.abs(p.vx) > 1.6) {
      p.stamina -= 1 / (CONFIG.sprintSeconds * 60);
      if (p.stamina <= 0) { p.stamina = 0; p.tired = true; p.sprinting = false; }
    } else {
      p.stamina = Math.min(1, p.stamina + 1 / (CONFIG.sprintRegenSeconds * 60));
      if (p.tired && p.stamina >= 0.3) p.tired = false;
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

  nextPPE() {
    const p = this.player;
    const pending = new Set(this.items.filter(i => i.kind === 'ppe').map(i => i.value));
    const next = CONFIG.ppe.find(q => !p.ppe[q.key] && !pending.has(q.key));
    return next ? next.key : null;
  }

  bumpBlock(tx, ty) {
    const lv = this.level, c = lv.tiles[ty][tx];
    const p = this.player;
    const bx = tx * T + 8, by = (ty + 1) * T;
    this.bumps.push({ tx, ty, t: 0 });
    if ('123?V'.includes(c)) {
      lv.tiles[ty][tx] = 'U';
      let item = null;
      if (c === '?') {
        const key = this.nextPPE();
        if (key) item = new Item('ppe', key, bx, by, true);
      } else if (c === 'V') {
        item = new Item('bvc', 0, bx, by, true);
      } else {
        const tier = Number(c);
        if (tier > p.pump && !this.items.some(i => i.kind === 'pump' && i.value >= tier)) item = new Item('pump', tier, bx, by, true);
      }
      if (item) {
        this.items.push(item);
        Sound.sfx('sprout');
      } else {
        this.addScore(200);
        this.addTime(1, bx, ty * T - 8);
        this.burst(bx, ty * T - 4, ['#7be07b', '#ffffff'], 6);
        Sound.sfx('coin');
      }
    } else {
      Sound.sfx('bump');
    }
    // Gegner, die auf dem Block stehen, fliegen weg
    for (const e of this.enemies) {
      if (!e.captured && e.def.harm && Math.abs(e.x - bx) < 12 && Math.abs(e.y - ty * T) < 3) {
        this.destroy(e, 50);
      }
    }
  }

  addScore(n) { this.score += n; }

  destroy(e, pts) {
    e.alive = false;
    this.addScore(pts);
    this.popup(e.x, e.y - e.h - 2, '+' + pts, '#ffffff');
    this.burst(e.x, e.y - e.h / 2, ['#ffffff', '#a7b3c4'], 6);
    Sound.sfx('stomp');
  }

  inCone(nz, face, range, cx, cy) {
    const along = (cx - nz.x) * face;
    if (along < -6 || along > range) return false;
    return Math.abs(cy - nz.y) <= 10 + Math.max(0, along) * 0.5;
  }

  updateSuction() {
    const p = this.player;
    const bvc = p.bvcT > 0;
    if (bvc) {
      p.bvcT--;
      if (p.bvcT === 0) {
        this.showMsg('BVC-EINSATZ VORBEI - WEITER MIT DER PUMPE!', 110, '#ff8fb8');
        if (p.sucking) { Sound.suckStop(); p.sucking = false; }
      }
    }
    const wants = Input.down('suck') && p.stun <= 0;
    const hasTool = p.pump > 0 || bvc;
    if (wants && !hasTool) {
      if (Input.pressed('suck')) Sound.sfx('puff');
      if (this.noPumpT <= 0) {
        this.noPumpT = 150;
        this.showMsg('KEINE PUMPE! SPRING GEGEN DEN KOLBEN-BLOCK!', 130, THEME.gold);
      }
    }
    if (wants && hasTool && !bvc && p.overheat && Input.pressed('suck') && this.heatT <= 0) {
      this.heatT = 60;
      this.showMsg('ÜBERHITZT! KURZ ABKÜHLEN LASSEN...', 70, '#ff8f8f');
      Sound.sfx('heavy');
    }
    const sucking = wants && hasTool && (bvc || !p.overheat);
    const cfg = CONFIG.pumps[p.pump] || { range: 0, power: 0, pull: 1.5, tank: 3 };
    if (sucking && !bvc) {
      p.energy -= 1 / (cfg.tank * 60);
      if (p.energy <= 0) {
        p.energy = 0; p.overheat = true;
        this.heatT = 60;
        this.showMsg('ÜBERHITZT! KURZ ABKÜHLEN LASSEN...', 90, '#ff8f8f');
        Sound.sfx('overheat');
      }
    } else if (!sucking) {
      p.energy = Math.min(1, p.energy + (p.ppe.gloves ? 2 : 1) / (CONFIG.suckRegenSeconds * 60));
      if (p.overheat && p.energy >= CONFIG.overheatResume) p.overheat = false;
    }
    const active = sucking && (bvc || !p.overheat);
    if (active && !p.sucking) Sound.suckStart(bvc ? 2 : p.pump);
    if (!active && p.sucking) Sound.suckStop();
    p.sucking = active;
    if (!active) return;

    const nz = p.nozzle();
    const range = bvc ? Math.max(cfg.range, 84) : cfg.range;
    const pull = bvc ? Math.max(cfg.pull, 2.4) : cfg.pull;
    // Saug-Streifen
    const lvl = bvc ? 3 : p.pump;
    for (let i = 0; i < lvl + 1; i++) {
      const along = 8 + Math.random() * range;
      const off = (Math.random() * 2 - 1) * (8 + along * 0.45);
      const sx = nz.x + p.face * along, sy = Math.min(nz.y + off, p.y - 2);
      const dx = nz.x - sx, dy = nz.y - sy, len = Math.hypot(dx, dy) || 1;
      const sp = 2.2 + lvl * 0.8;
      const col = bvc ? (i % 2 ? '#ffffff' : '#ff8fb8') : (i % 2 ? '#ffffff' : '#c8f2ff');
      this.parts.push({ x: sx, y: sy, vx: dx / len * sp, vy: dy / len * sp, g: 0, t: Math.floor(len / sp), c: col, s: 1, streak: true });
    }
    for (const e of this.enemies) {
      if (!e.active || !e.alive || e.captured) continue;
      if (!this.inCone(nz, p.face, range, e.x, e.y - e.h / 2)) continue;
      const liquid = bvc && e.def.liquid;
      if (liquid || e.def.weight <= cfg.power) {
        e.pulledNow = true;
        e.pullV = liquid ? Math.min(e.pullV + 0.5, 6) : Math.min(e.pullV + 0.09 * pull, 0.8 + pull * 1.2);
        const dx = nz.x - e.x, dy = nz.y - (e.y - e.h / 2), len = Math.hypot(dx, dy) || 1;
        e.x += dx / len * Math.min(e.pullV, len);
        e.y += dy / len * Math.min(e.pullV, len);
        if (len < 8) this.capture(e, liquid);
      } else {
        e.shake = 6;
        if (this.heavyT <= 0) {
          this.heavyT = 150;
          if (bvc && cfg.power < e.def.weight) this.showMsg('DIE BVC SAUGT NUR FLÜSSIGKEITEN!', 120, '#ff8fb8');
          else this.showMsg('ZU SCHWER! DU BRAUCHST EINE STÄRKERE PUMPE!', 130, '#ff8f8f');
          Sound.sfx('heavy');
        }
      }
    }
    const b = this.boss;
    if (b && b.active && b.alive && !b.captured && this.inCone(nz, p.face, range + 10, b.x, b.y - b.h / 2)) {
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
            this.popup(nz.x, nz.y - 24, '+3000!', THEME.gold);
            this.burst(nz.x, nz.y, ['#e6dcff', '#c7b5f5', '#ffffff', THEME.gold], 24);
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

  capture(e, bvcBonus) {
    e.captured = true;
    e.capT = 12;
    this.combo = this.comboT > 0 ? this.combo + 1 : 1;
    this.comboT = Math.round(CONFIG.comboWindow * 60);
    const mult = Math.min(this.combo, 5) * (bvcBonus ? 2 : 1);
    const pts = e.def.points * mult;
    this.addScore(pts);
    this.captures++;
    this.popup(e.x, e.y - e.h - 4, '+' + pts + (mult > 1 ? ' ×' + mult : ''), mult > 1 ? THEME.gold : '#ffffff');
    this.burst(e.x, e.y - e.h / 2, bvcBonus ? ['#ffffff', '#ff8fb8'] : ['#ffffff', '#c8f2ff', '#6fcbe8'], 6);
    Sound.sfx('capture', e.def.weight);
  }

  collect(it) {
    const p = this.player;
    it.alive = false;
    this.burst(p.x, p.y - 10, [THEME.gold, '#ffffff', '#7be07b'], 12);
    if (it.kind === 'pump') {
      if (it.value > p.pump) {
        p.pump = it.value;
        this.bestPump = Math.max(this.bestPump, p.pump);
        p.energy = 1; p.overheat = false;
        const cfg = CONFIG.pumps[p.pump];
        this.banner = { title: cfg.title, sub: cfg.slogan, t: 220, icon: 'pump' + p.pump };
        this.freeze = 40;
        this.addScore(500);
        this.popup(p.x, p.y - 26, '+500', THEME.gold);
        if (p.sucking) Sound.suckStart(p.bvcT > 0 ? 2 : p.pump);
      }
      Sound.sfx('powerup');
    } else if (it.kind === 'ppe') {
      const q = CONFIG.ppe.find(x => x.key === it.value);
      if (!p.ppe[it.value]) {
        p.ppe[it.value] = true;
        this.addTime(CONFIG.ppeTimeBonus, p.x, p.y - 26);
        const full = p.fullPPE();
        this.banner = { title: full ? 'VOLLSCHUTZ!' : q.name, sub: full ? 'KOMPLETTE SCHUTZAUSRÜSTUNG:\nNICHTS KANN DIR MEHR SCHADEN!' : q.text, t: 190, icon: 'ppe_' + it.value };
        Sound.sfx(full ? 'fanfare' : 'powerup');
      } else {
        this.addTime(CONFIG.ppeDuplicateTimeBonus, p.x, p.y - 26);
        Sound.sfx('coin');
      }
      this.addScore(200);
    } else if (it.kind === 'bvc') {
      p.bvcT = CONFIG.bvcSeconds * 60;
      this.banner = { title: 'BVC PROFESSIONAL', sub: 'FLÜSSIGKEITSABSAUGUNG FÜR ZELLKULTUR\n' + CONFIG.bvcSeconds + ' SEK: ALLE FLÜSSIGKEITEN, DOPPELTE PUNKTE!', t: 200, icon: 'bvc' };
      this.addScore(300);
      if (p.sucking) Sound.suckStart(2);
      Sound.sfx('powerup');
    } else if (it.kind === 'view') {
      this.views++;
      this.addTime(CONFIG.viewTimeBonus, p.x, p.y - 26);
      this.banner = { title: 'VACUU·VIEW EXTENDED', sub: 'ZEITVAKUUM: +' + CONFIG.viewTimeBonus + ' SEKUNDEN!', t: 180, icon: 'view' };
      this.freeze = 30;
      this.addScore(300);
      Sound.sfx('timebonus');
    }
  }

  checkCollisions() {
    const p = this.player;
    for (const it of this.items) if (it.alive && it.rising <= 0 && overlap(p, it)) this.collect(it);
    const full = p.fullPPE();
    for (const e of this.enemies) {
      if (!e.alive || !e.active || e.captured || e.wasPulled || !e.def.harm) continue;
      if (!overlap(p, e)) continue;
      if (full) { this.destroy(e, 50); continue; }
      const fromAbove = p.vy > 0 && (p.y - p.vy) <= e.y - e.h + 4;
      const fromBelow = p.vy < 0 && (p.y - p.h - p.vy) >= e.y - 4;
      if (fromAbove) {
        if (p.ppe.shoes) {
          this.destroy(e, 50);
          p.vy = Input.down('jump') ? -5 : -3.6;
        } else {
          p.vy = -3.6;
          e.safeT = 12; e.shake = 8;
          Sound.sfx('boing');
          if (this.shoeHintT <= 0) { this.shoeHintT = 400; this.showMsg('MIT SICHERHEITSSCHUHEN KÖNNTEST DU SIE ZERTRETEN!', 120, THEME.gold); }
        }
        continue;
      }
      if (fromBelow && p.ppe.helmet) {
        this.destroy(e, 50);
        p.vy = 1;
        continue;
      }
      if (e.safeT > 0) continue;
      this.hurt(e.x);
    }
    const b = this.boss;
    if (!full && b && b.active && b.alive && !b.captured && b.hp > 0 && overlap(p, b)) this.hurt(b.x);
  }

  hurt(fromX) {
    const p = this.player;
    if (p.inv > 0) return;
    const pen = p.ppe.goggles ? CONFIG.hitTimePenaltyGoggles : CONFIG.hitTimePenalty;
    this.time -= pen;
    p.stun = 30; p.inv = 100; p.ducking = false; p.h = 14;
    p.vx = (p.x < fromX ? -1 : 1) * 2; p.vy = -2.5;
    this.combo = 0; this.comboT = 0;
    Sound.suckStop(); p.sucking = false;
    this.popup(p.x, p.y - 24, '-' + pen + ' SEK', '#ff8f8f');
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
    for (const it of this.items) if (it.rising > 0) it.draw(ctx, camX);
    drawTiles(ctx, this.level, camX, this.bumps, this.t);
    for (const it of this.items) if (it.rising <= 0) it.draw(ctx, camX);
    for (const e of this.enemies) if (e.def.beh === 'static' && e.active) e.draw(ctx, camX);
    if (this.boss && this.boss.alive && this.boss.active) this.boss.draw(ctx, camX);
    for (const e of this.enemies) if (e.def.beh !== 'static' && e.active) e.draw(ctx, camX);
    if (!(this.state === 'finish' && this.stateT > 50)) this.player.draw(ctx, camX, this.t);
    for (const q of this.parts) {
      ctx.fillStyle = q.c;
      if (q.streak) ctx.fillRect(Math.round(q.x - camX), Math.round(q.y), 2, 1);
      else ctx.fillRect(Math.round(q.x - camX), Math.round(q.y), q.s, q.s);
    }
    for (const q of this.popups) Font.draw(ctx, q.text, Math.round(q.x - camX), Math.round(q.y), { color: q.color, align: 'center', outline: PAL.k });
    ctx.restore();
    this.drawHud(ctx);
    this.drawOverlays(ctx);
  }

  drawDoor(ctx, camX) {
    const x = this.level.exitX * T + 8 - camX;
    if (x < -20 || x > VIEW_W + 20) return;
    const spr = this.exitOpen ? SPR.doorOpen : SPR.doorLocked;
    ctx.drawImage(spr, x - 10, 10 * T - spr.height);
    ctx.fillStyle = PAL.k; ctx.fillRect(x - 14, 10 * T - 46, 28, 10);
    Font.draw(ctx, 'EXIT', x, 10 * T - 44, { color: this.exitOpen ? '#7be07b' : '#ff8f8f', align: 'center' });
  }

  drawBar(ctx, x, y, w, v, col, label, labelCol) {
    Font.draw(ctx, label, x, y, { color: labelCol || '#ffffff' });
    const bx = x + Font.width(label) + 3;
    ctx.fillStyle = PAL.k; ctx.fillRect(bx, y, w + 2, 7);
    ctx.fillStyle = '#3b4658'; ctx.fillRect(bx + 1, y + 1, w, 5);
    ctx.fillStyle = col; ctx.fillRect(bx + 1, y + 1, Math.round(w * clamp(v, 0, 1)), 5);
    ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(bx + 1, y + 1, Math.round(w * clamp(v, 0, 1)), 1);
  }

  drawHud(ctx) {
    const p = this.player;
    ctx.fillStyle = 'rgba(20,40,56,0.9)';
    ctx.fillRect(0, 0, VIEW_W, HUD_H);
    ctx.fillStyle = THEME.gold; ctx.fillRect(0, HUD_H, VIEW_W, 1);
    Font.draw(ctx, 'PUNKTE ' + pad(this.score, 6), 4, 3, { color: '#ffffff' });
    if (p.bvcT > 0) {
      Font.draw(ctx, 'BVC ' + Math.ceil(p.bvcT / 60) + ' S', 160, 3, { color: '#ff8fb8', align: 'center' });
    } else {
      const pumpName = p.pump ? CONFIG.pumps[p.pump].short : 'KEINE PUMPE';
      Font.draw(ctx, pumpName, 160, 3, { color: p.pump ? '#7be07b' : '#a7b3c4', align: 'center' });
    }
    const sec = Math.max(0, Math.ceil(this.time));
    const low = sec <= 10;
    if (!low || this.t % 30 < 20) Font.draw(ctx, 'ZEIT ' + pad(sec, 3), 316, 3, { color: low ? '#ff6b6b' : '#ffffff', align: 'right' });
    // Leisten
    const heat = p.overheat && p.bvcT <= 0;
    const sogCol = p.bvcT > 0 ? '#ff8fb8' : heat ? (this.t % 20 < 10 ? '#e04848' : '#ff8f8f') : '#3aa0e8';
    this.drawBar(ctx, 4, 14, 50, p.bvcT > 0 ? 1 : p.energy, sogCol, heat ? 'HEISS' : 'SOG', heat ? '#ff8f8f' : '#ffffff');
    this.drawBar(ctx, 96, 14, 40, p.stamina, p.tired ? '#8795a8' : '#7be07b', 'SPRINT');
    // Schutzausrüstung
    CONFIG.ppe.forEach((q, i) => {
      const spr = SPR['ppe_' + q.key];
      const x = 244 + i * 18, y = 13 + Math.round((10 - spr.height) / 2);
      ctx.globalAlpha = p.ppe[q.key] ? 1 : 0.25;
      ctx.drawImage(spr, x, y);
      ctx.globalAlpha = 1;
    });
    if (p.fullPPE() && this.t % 30 < 20) Font.draw(ctx, 'VOLLSCHUTZ', 200, 14, { color: THEME.gold, align: 'center' });
    if (this.combo > 1 && this.comboT > 0) Font.draw(ctx, 'COMBO ×' + Math.min(this.combo, 5), 4, HUD_H + 4, { color: THEME.gold, outline: PAL.k });
    const b = this.boss;
    if (b && b.active && b.alive && !b.captured) {
      Font.draw(ctx, 'DAMPF-KRAKE', 160, HUD_H + 4, { color: '#e6dcff', align: 'center', outline: PAL.k });
      ctx.fillStyle = PAL.k; ctx.fillRect(109, HUD_H + 13, 102, 5);
      ctx.fillStyle = '#7b5fb8'; ctx.fillRect(110, HUD_H + 14, Math.round(100 * b.hp / b.maxHp), 3);
    }
  }

  drawOverlays(ctx) {
    const bossBar = this.boss && this.boss.active && this.boss.alive;
    if (this.msg) Font.draw(ctx, this.msg.text, 160, bossBar ? HUD_H + 24 : HUD_H + 6, { color: this.msg.color, align: 'center', outline: PAL.k });
    if (this.banner) {
      const b = this.banner;
      const lines = b.sub.split('\n').length;
      const h = 24 + lines * 9, y = 56;
      drawPanel(ctx, 24, y, 272, h);
      let tx = 160;
      if (b.icon) {
        const spr = SPR[b.icon];
        ctx.drawImage(spr, 32, y + Math.round((h - spr.height * 2) / 2), spr.width * 2, spr.height * 2);
        tx = 178;
      }
      Font.draw(ctx, b.title, tx, y + 6, { color: THEME.gold, align: 'center' });
      Font.draw(ctx, b.sub, tx, y + 18, { color: '#ffffff', align: 'center' });
    }
    if (this.state === 'howto') this.drawHowto(ctx);
    if (this.state === 'count') {
      const n = 3 - Math.floor(this.stateT / 60);
      Font.draw(ctx, String(n), 160, 70, { color: THEME.gold, scale: 4, align: 'center', outline: PAL.k });
    }
    if (this.state === 'play' && this.stateT < 50) Font.draw(ctx, 'LOS!', 160, 70, { color: '#7be07b', scale: 4, align: 'center', outline: PAL.k });
    if (this.state === 'timeup') {
      drawPanel(ctx, 70, 64, 180, 34);
      Font.draw(ctx, 'ZEIT ABGELAUFEN!', 160, 76, { color: THEME.gold, align: 'center' });
    }
    if (this.state === 'finish') {
      drawPanel(ctx, 60, 60, 200, 44);
      Font.draw(ctx, 'GESCHAFFT!', 160, 67, { color: '#7be07b', scale: 2, align: 'center' });
      Font.draw(ctx, 'RESTZEIT ' + Math.ceil(this.time) + ' SEK = BONUS!', 160, 88, { color: '#ffffff', align: 'center' });
    }
    if (this.paused) {
      drawPanel(ctx, 60, 55, 200, 60);
      Font.draw(ctx, 'PAUSE', 160, 62, { color: THEME.gold, scale: 2, align: 'center' });
      Font.draw(ctx, 'ESC = WEITERSPIELEN\nENTER = RUNDE ABBRECHEN', 160, 84, { color: '#ffffff', align: 'center' });
    }
  }

  drawHowto(ctx) {
    drawPanel(ctx, 16, 8, 288, 164);
    Font.draw(ctx, 'SO GEHT\'S', 160, 13, { color: THEME.gold, scale: 2, align: 'center' });
    const left = [['←  →', 'LAUFEN'], ['↑', 'SPRINGEN'], ['↓', 'DUCKEN']];
    const right = [['LEERTASTE', 'SAUGEN'], ['SHIFT/CTRL', 'SPRINTEN']];
    left.forEach((r, i) => { drawKey(ctx, 88, 33 + i * 13, r[0]); Font.draw(ctx, r[1], 94, 35 + i * 13, { color: '#ffffff' }); });
    right.forEach((r, i) => { drawKey(ctx, 232, 33 + i * 13, r[0]); Font.draw(ctx, r[1], 238, 35 + i * 13, { color: '#ffffff' }); });
    Font.draw(ctx, 'SOG + SPRINT SIND BEGRENZT: LEISTEN BEACHTEN!', 160, 75, { color: '#c8f2ff', align: 'center' });
    ctx.fillStyle = THEME.gold; ctx.fillRect(28, 86, 264, 1);
    Font.draw(ctx, 'KOLBEN-BLÖCKE VON UNTEN ANSPRINGEN:', 160, 91, { color: THEME.gold, align: 'center' });
    // Block + Inhalte
    ctx.drawImage(SPR.q0, 30, 104);
    const icons = ['pump1', 'pump2', 'pump3', 'ppe_goggles', 'ppe_gloves', 'ppe_helmet', 'ppe_shoes', 'bvc', 'view'];
    icons.forEach((n, i) => {
      const spr = SPR[n];
      const x = 62 + i * 26;
      ctx.drawImage(spr, Math.round(x - spr.width / 2), 120 - spr.height);
    });
    Font.draw(ctx, 'PUMPEN', 88, 124, { color: '#ffffff', align: 'center' });
    Font.draw(ctx, 'SCHUTZAUSRÜSTUNG', 179, 124, { color: '#ffffff', align: 'center' });
    Font.draw(ctx, 'BVC', 270, 124, { color: '#ff8fb8', align: 'center' });
    Font.draw(ctx, '+10S', 270, 133, { color: '#7be07b', align: 'center' });
    Font.draw(ctx, 'SAUG IN ' + CONFIG.roundSeconds + ' SEK SO VIEL CHAOS WIE MÖGLICH EIN!', 160, 146, { color: '#ffffff', align: 'center' });
    if (this.t % 50 < 35) Font.draw(ctx, 'ENTER = START', 160, 160, { color: THEME.gold, align: 'center' });
  }
}

// ---------------------------------------------------------------------
// Zeichenhilfen (auch vom Titelbildschirm genutzt)
function drawPanel(ctx, x, y, w, h) {
  ctx.fillStyle = PAL.k; ctx.fillRect(x - 2, y - 2, w + 4, h + 4);
  ctx.fillStyle = '#ffffff'; ctx.fillRect(x - 1, y - 1, w + 2, h + 2);
  ctx.fillStyle = THEME.navy; ctx.fillRect(x, y, w, h);
}

function drawKey(ctx, rightX, y, label) {
  const w = Font.width(label) + 6;
  const x = rightX - w;
  ctx.fillStyle = PAL.k; ctx.fillRect(x - 1, y - 1, w + 2, 12);
  ctx.fillStyle = '#e8eef5'; ctx.fillRect(x, y, w, 10);
  ctx.fillStyle = '#a7b3c4'; ctx.fillRect(x, y + 9, w, 1);
  Font.draw(ctx, label, x + 3, y + 2, { color: PAL.k });
}

function drawSign(ctx, s, camX) {
  const lines = s.text.split('\n');
  const w = Math.max(...lines.map(l => l.length)) * 6 + 7;
  const h = lines.length * 9 + 5;
  const cx = s.x * T + 8 - camX;
  if (cx + w / 2 < 0 || cx - w / 2 > VIEW_W) return;
  const bx = Math.round(cx - w / 2), by = 42;
  ctx.fillStyle = '#6b3f22'; ctx.fillRect(cx - 1, by + h, 3, 160 - by - h);
  ctx.fillStyle = PAL.k; ctx.fillRect(bx - 1, by - 1, w + 2, h + 2);
  ctx.fillStyle = '#fff6d5'; ctx.fillRect(bx, by, w, h);
  Font.draw(ctx, s.text, bx + 4, by + 3, { color: PAL.k });
}

function drawBackground(ctx, camX) {
  const zs = Level.ZONE_STARTS;
  for (let i = 0; i < zs.length; i++) {
    const x0 = zs[i] * T - camX;
    const x1 = (i < zs.length - 1 ? zs[i + 1] * T : Level.WIDTH * T) - camX;
    if (x1 < 0 || x0 > VIEW_W) continue;
    const z = ZONE_STYLE[i];
    ctx.fillStyle = z.wall; ctx.fillRect(x0, 0, x1 - x0, VIEW_H);
    ctx.fillStyle = z.base; ctx.fillRect(x0, 106, x1 - x0, 42);
    ctx.fillStyle = z.wall2; ctx.fillRect(x0, 104, x1 - x0, 3);
  }
  // Fliesenraster (Parallax)
  const px = Math.round(camX * 0.5);
  for (let x = -(px % 16); x < VIEW_W; x += 16) {
    ctx.fillStyle = ZONE_STYLE[zoneOf(camX + x)].wall2;
    ctx.fillRect(x, 12, 1, 92);
  }
  ctx.fillStyle = 'rgba(0,0,0,0.05)';
  for (let y = 12; y < 104; y += 16) ctx.fillRect(0, y, VIEW_W, 1);
  // Geräte und Wand-Deko (Parallax): erst Wand, dann Labortisch-Geräte davor
  const step = 80;
  const n0 = Math.floor(px / step) - 1;
  const slots = [];
  for (let n = n0; n < n0 + 6; n++) {
    const sx = n * step - px;
    slots.push({ n, sx, z: ZONE_STYLE[zoneOf(camX + sx + 40)] });
  }
  ctx.globalAlpha = 0.6;
  const wallY = { window: 28, poster0: 34, poster1: 34, poster2: 34, poster3: 34, vacuulan: 30, periodic: 30, schlenk: 30 };
  for (const s of slots) {
    if (s.n % 2) continue;
    const L = s.z.wall_.length, name = s.z.wall_[((s.n / 2) % L + L) % L];
    ctx.drawImage(SPR['deco_' + name], s.sx + 4, wallY[name] || 30);
  }
  for (const s of slots) {
    const L = s.z.bench.length, name = s.z.bench[(s.n % L + L) % L];
    const spr = SPR['deco_' + name];
    ctx.drawImage(spr, s.sx + 40 - Math.round(spr.width / 2), 105 - spr.height);
  }
  ctx.globalAlpha = 1;
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
      else if (c === '-') spr = SPR['platform' + (tx % 3 === 1 ? 1 : 0)];
      else if (c === 'U') spr = SPR.used;
      else spr = SPR['q' + qf];
      let oy = 0;
      for (const b of bumps) if (b.tx === tx && b.ty === ty) oy = -[0, 3, 5, 6, 5, 3, 1, 0][b.t] || 0;
      ctx.drawImage(spr, tx * T - camX, ty * T + oy);
    }
  }
}
