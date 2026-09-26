'use strict';
// Die eigentliche Spielrunde
const CAM_Y = 12; // die obersten 12 Pixel des Levels liegen unter der Anzeige
const HUD_H = 24;
const BVC_ZONE = 1; // Zellkultur-Labor

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
  popup(x, y, text, color) { this.popups.push({ x, y, text, color: color || '#ffffff', t: 36 }); }
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
      Sound.sfx('ouch');
      this.popup(p.x, p.y - 30, 'AUTSCH!', '#ffffff');
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
      // Im Zellkultur-Labor bleibt die BVC dauerhaft, sonst läuft die Zeit ab
      if (p.bvcZone) { if (zoneOf(p.x) !== BVC_ZONE) p.bvcT = 0; }
      else p.bvcT--;
      if (p.bvcT <= 0) {
        p.bvcT = 0; p.bvcZone = false;
        this.showMsg(p.pump ? 'DIE BVC BLEIBT IM ZELLKULTUR-LABOR - WEITER MIT DER PUMPE!' : 'DIE BVC BLEIBT IM ZELLKULTUR-LABOR!', 130, '#ff8fb8');
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
    // Items (Pumpen, Schutzausrüstung, BVC, VACUU·VIEW) lassen sich ebenfalls einsaugen
    for (const it of this.items) {
      if (!it.alive || it.rising > 0) continue;
      if (!this.inCone(nz, p.face, range, it.x, it.y - it.h / 2)) continue;
      it.pulled = 2;
      it.pullV = Math.min((it.pullV || 0) + 0.3, 5);
      const dx = nz.x - it.x, dy = nz.y - (it.y - it.h / 2), len = Math.hypot(dx, dy) || 1;
      it.x += dx / len * Math.min(it.pullV, len);
      it.y += dy / len * Math.min(it.pullV, len);
      if (len < 8) this.collect(it);
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
        this.showMsg('DIE KRAKE IST ZU STARK! HOL DIR DIE VACUU·PURE 10C!', 130, '#ff8f8f');
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
    this.popup(e.x, e.y - e.h - 4, '+' + pts + (mult > 1 ? ' ×' + mult : '') + (e.def.showName ? ' ' + e.def.name : ''), mult > 1 ? THEME.gold : '#ffffff');
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
      p.bvcZone = zoneOf(p.x) === BVC_ZONE;
      p.bvcT = p.bvcZone ? 1 : CONFIG.bvcSeconds * 60;
      this.banner = { title: 'PUMPE BVC PROFESSIONAL', sub: 'MIT VHC: MEDIENABSAUGUNG\nPUNKTE ×2', t: 220, icon: 'bvc' };
      this.addScore(300);
      if (p.sucking) Sound.suckStart(2);
      Sound.sfx('powerup');
    } else if (it.kind === 'view') {
      this.views++;
      this.addTime(CONFIG.viewTimeBonus, p.x, p.y - 26);
      this.banner = { title: 'VACUU·VIEW EXTENDED', sub: 'ZEITVAKUUM: +' + CONFIG.viewTimeBonus + ' SEKUNDEN!', t: 180, icon: 'view' };
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
    Sound.sfx('ouch');
    this.popup(p.x, p.y - 32, 'AUTSCH!', '#ffffff');
  }

  updateEffects() {
    for (const q of this.parts) { q.x += q.vx; q.y += q.vy; q.vy += q.g; q.t--; }
    this.parts = this.parts.filter(q => q.t > 0);
    for (const q of this.popups) { if (q.t > 26) q.y -= 0.5; q.t--; }
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
    ctx.fillStyle = 'rgba(52,80,122,0.94)';
    ctx.fillRect(0, 0, VIEW_W, HUD_H);
    ctx.fillStyle = THEME.gold; ctx.fillRect(0, HUD_H, VIEW_W, 1);
    Font.draw(ctx, 'PUNKTE ' + pad(this.score, 6), 4, 3, { color: '#ffffff' });
    if (p.bvcT > 0) {
      Font.draw(ctx, 'BVC PROFESSIONAL' + (p.bvcZone ? '' : ' ' + Math.ceil(p.bvcT / 60) + ' S'), 160, 3, { color: '#ff8fb8', align: 'center' });
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
    // Schutzausrüstung (bei Vollschutz goldener Rahmen)
    if (p.fullPPE()) {
      ctx.fillStyle = THEME.gold; ctx.fillRect(240, 11, 76, 12);
      ctx.fillStyle = THEME.navyDark; ctx.fillRect(241, 12, 74, 10);
    }
    CONFIG.ppe.forEach((q, i) => {
      const spr = SPR['ppe_' + q.key];
      const x = 244 + i * 18, y = 13 + Math.round((10 - spr.height) / 2);
      ctx.globalAlpha = p.ppe[q.key] ? 1 : 0.25;
      ctx.drawImage(spr, x, y);
      ctx.globalAlpha = 1;
    });
    if (this.combo > 1 && this.comboT > 0) Font.draw(ctx, 'COMBO ×' + Math.min(this.combo, 5), 4, HUD_H + 4, { color: THEME.gold, outline: PAL.k });
    const b = this.boss;
    if (b && b.active && b.alive && !b.captured) {
      Font.draw(ctx, 'DAMPF-KRAKE', 160, HUD_H + 4, { color: '#e6dcff', align: 'center', outline: PAL.k });
      ctx.fillStyle = PAL.k; ctx.fillRect(109, HUD_H + 13, 102, 5);
      ctx.fillStyle = '#7b5fb8'; ctx.fillRect(110, HUD_H + 14, Math.round(100 * b.hp / b.maxHp), 3);
    }
  }

  drawOverlays(ctx) {
    // Einblendungen unten im Boden, damit das Spielfeld frei bleibt
    if (this.banner || this.msg) this.drawFloorBar(ctx);
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

  drawFloorBar(ctx) {
    const camX = Math.round(this.camX), y0 = 10 * T - CAM_Y + 2, h = VIEW_H - y0;
    // Hintergrund nur über Boden, Gruben bleiben sichtbar
    ctx.fillStyle = 'rgba(52,80,122,0.88)';
    for (let sx = -(camX % T); sx < VIEW_W; sx += T) {
      const tx = Math.floor((camX + sx) / T);
      if (tileAt(this.level, tx, 10) !== ' ') ctx.fillRect(sx, y0, T, h);
    }
    ctx.fillStyle = THEME.gold; ctx.fillRect(0, y0 - 1, VIEW_W, 1);
    const b = this.banner;
    if (b) {
      let tx = 6;
      if (b.icon) {
        const spr = SPR[b.icon];
        ctx.drawImage(spr, 6, y0 + Math.round((h - spr.height) / 2));
        tx = 12 + spr.width;
      }
      Font.draw(ctx, b.title, tx, y0 + 2, { color: THEME.gold });
      Font.draw(ctx, b.sub.split('\n').slice(0, 2).join('\n'), tx, y0 + 11, { color: '#ffffff' });
    } else if (this.msg) {
      Font.draw(ctx, this.msg.text, 160, y0 + Math.round((h - 7) / 2), { color: this.msg.color, align: 'center' });
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
    const icons = ['pump1', 'pump2', 'pump3', 'bvc', 'ppe_goggles', 'ppe_gloves', 'ppe_helmet', 'ppe_shoes', 'view'];
    icons.forEach((n, i) => {
      const spr = SPR[n];
      const x = 62 + i * 26;
      ctx.drawImage(spr, Math.round(x - spr.width / 2), 120 - spr.height);
    });
    ctx.fillStyle = '#5d6b80'; ctx.fillRect(153, 100, 1, 32); ctx.fillRect(257, 100, 1, 32);
    Font.draw(ctx, 'PUMPEN', 101, 124, { color: '#ffffff', align: 'center' });
    Font.draw(ctx, 'SCHUTZAUSRÜSTUNG', 205, 124, { color: '#ffffff', align: 'center' });
    Font.draw(ctx, '+10 S', 272, 124, { color: '#7be07b', align: 'center' });
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
  const bx = Math.round(cx - w / 2), by = 52;
  ctx.fillStyle = '#6b3f22'; ctx.fillRect(cx - 1, by + h, 3, 160 - by - h);
  ctx.fillStyle = PAL.k; ctx.fillRect(bx - 1, by - 1, w + 2, h + 2);
  ctx.fillStyle = '#fff6d5'; ctx.fillRect(bx, by, w, h);
  Font.draw(ctx, s.text, bx + 4, by + 3, { color: PAL.k });
}

function drawBackground(ctx, camX) {
  const zs = Level.ZONE_STARTS, BENCH = 124;
  for (let i = 0; i < zs.length; i++) {
    const x0 = zs[i] * T - camX;
    const x1 = (i < zs.length - 1 ? zs[i + 1] * T : Level.WIDTH * T) - camX;
    if (x1 < 0 || x0 > VIEW_W) continue;
    const z = ZONE_STYLE[i];
    ctx.fillStyle = z.wall; ctx.fillRect(x0, 0, x1 - x0, VIEW_H);
    ctx.fillStyle = z.base; ctx.fillRect(x0, BENCH + 2, x1 - x0, 148 - BENCH - 2);
    ctx.fillStyle = z.wall2; ctx.fillRect(x0, BENCH, x1 - x0, 2);
  }
  // 16-Bit-Verlauf mit Dithering: oben heller, unten dunkler
  const dp = ditherPatterns(ctx);
  ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.fillRect(0, 12, VIEW_W, 22);
  ctx.fillStyle = dp.light; ctx.fillRect(0, 34, VIEW_W, 16);
  ctx.fillStyle = dp.dark1; ctx.fillRect(0, 92, VIEW_W, 16);
  ctx.fillStyle = dp.dark2; ctx.fillRect(0, 108, VIEW_W, 16);
  // Unterschränke unter dem Labortisch (bewegen sich mit 1×)
  for (let x = -(camX % 32) - 32; x < VIEW_W + 32; x += 32) {
    const z = ZONE_STYLE[zoneOf(camX + x + 16)];
    const dk = tint(z.base, 0.86), lt = tint(z.base, 1.08);
    ctx.fillStyle = dk; ctx.fillRect(x, BENCH + 2, 1, 22); ctx.fillRect(x + 16, BENCH + 9, 1, 15); ctx.fillRect(x + 1, BENCH + 8, 31, 1);
    ctx.fillStyle = lt; ctx.fillRect(x + 1, BENCH + 2, 1, 22); ctx.fillRect(x + 1, BENCH + 9, 31, 1);
    ctx.fillStyle = '#a9b3be'; ctx.fillRect(x + 13, BENCH + 4, 6, 1); ctx.fillRect(x + 13, BENCH + 14, 1, 4); ctx.fillRect(x + 19, BENCH + 14, 1, 4);
  }
  ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.fillRect(0, BENCH + 2, VIEW_W, 1);
  ctx.fillStyle = dp.dark1; ctx.fillRect(0, 140, VIEW_W, 8);
  // Ebene 1 (ganz hinten, 0.2×): Fliesen, Deckenleuchten und Fenster
  const p1 = Math.round(camX * 0.2);
  for (let x = -(p1 % 8); x < VIEW_W; x += 8) {
    ctx.fillStyle = ZONE_STYLE[zoneOf(camX + x)].wall2;
    ctx.fillRect(x, 12, 1, BENCH - 12);
  }
  ctx.fillStyle = 'rgba(0,0,0,0.04)';
  for (let y = 12; y < BENCH; y += 8) ctx.fillRect(0, y, VIEW_W, 1);
  for (let n = Math.floor(p1 / 70) - 1; n < Math.floor(p1 / 70) + 6; n++) {
    const lx = n * 70 - p1 + 20;
    ctx.drawImage(SPR.deco_lamp, lx, 13);
  }
  ctx.globalAlpha = 0.35;
  const w1 = 90;
  for (let n = Math.floor(p1 / w1) - 1; n < Math.floor(p1 / w1) + 5; n++) {
    const wx = n * w1 - p1 + 30;
    ctx.drawImage(SPR.deco_window, wx, 40);
    ctx.save(); ctx.globalAlpha = 0.12; ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.moveTo(wx + 1, 61); ctx.lineTo(wx + 22, 61); ctx.lineTo(wx + 44, BENCH); ctx.lineTo(wx + 23, BENCH); ctx.closePath(); ctx.fill();
    ctx.restore(); ctx.globalAlpha = 0.35;
  }
  // Ebene 2 (0.45×): Wand-Deko; Poster zeigt immer die Pumpe des aktuellen Abschnitts
  const p2 = Math.round(camX * 0.45), w2 = 52, here = zoneOf(camX + VIEW_W / 2);
  ctx.globalAlpha = 0.45;
  for (let n = Math.floor(p2 / w2) - 1; n < Math.floor(p2 / w2) + 8; n++) {
    const sx = n * w2 - p2;
    let name;
    if (((n % 6) + 6) % 6 === 0) name = 'poster' + here;
    else {
      const list = ZONE_STYLE[zoneOf(camX + sx + 20)].wall_;
      name = list[((n % list.length) + list.length) % list.length];
    }
    const spr = SPR['deco_' + name];
    const wy = { vacuulan: 98, schlenk: 90, shelf: 70, signs: 76, clock: 66, periodic: 72 }[name] || 36;
    ctx.drawImage(spr, sx, wy);
    if (n % 3 === 0) ctx.drawImage(SPR.deco_outlets, sx + 26, 110);
  }
  // Ebene 3 (0.7×): Laborgeräte auf dem Labortisch
  const p3 = Math.round(camX * 0.7), w3 = 46;
  ctx.globalAlpha = 0.6;
  for (let n = Math.floor(p3 / w3) - 1; n < Math.floor(p3 / w3) + 9; n++) {
    const sx = n * w3 - p3;
    const list = ZONE_STYLE[zoneOf(camX + sx + 23)].bench;
    const spr = SPR['deco_' + list[((n % list.length) + list.length) % list.length]];
    ctx.drawImage(spr, sx + 23 - Math.round(spr.width / 2), BENCH - spr.height);
    if (n % 3 === 1) ctx.drawImage(SPR.deco_glassware, sx - 2, BENCH - SPR.deco_glassware.height);
  }
  ctx.globalAlpha = 1;
}

// Dither-Muster (einmal erzeugt) für SNES-typische Farbverläufe
let DITHER = null;
function ditherPatterns(ctx) {
  if (DITHER) return DITHER;
  const mk = (fn) => { const c = makeCanvas(4, 4), g = c.getContext('2d'); fn(g); return ctx.createPattern(c, 'repeat'); };
  DITHER = {
    light: mk(g => { g.fillStyle = 'rgba(255,255,255,0.22)'; g.fillRect(0, 0, 1, 1); g.fillRect(2, 2, 1, 1); }),
    dark1: mk(g => { g.fillStyle = 'rgba(20,30,50,0.10)'; g.fillRect(0, 0, 1, 1); g.fillRect(2, 2, 1, 1); g.fillRect(2, 0, 1, 1); g.fillRect(0, 2, 1, 1); }),
    dark2: mk(g => { g.fillStyle = 'rgba(20,30,50,0.10)'; for (let y = 0; y < 4; y++) for (let x = (y % 2); x < 4; x += 2) g.fillRect(x, y, 1, 1); })
  };
  return DITHER;
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
