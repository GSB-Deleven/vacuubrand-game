'use strict';
// Spielfiguren: Professor, Gegner/Objekte, Pumpen-Items, Boss + Tile-Kollision

const SOLID_TILES = new Set(['#', 'B', '1', '2', '3', '?', 'U']);

function tileAt(level, tx, ty) {
  if (tx < 0 || tx >= level.W) return 'B';
  if (ty < 0 || ty >= level.H) return ' ';
  return level.tiles[ty][tx];
}
function isSolid(level, tx, ty) { return SOLID_TILES.has(tileAt(level, tx, ty)); }
function isOneWay(level, tx, ty) { return tileAt(level, tx, ty) === '-'; }

// Bewegt einen Körper (x = Mitte, y = Unterkante) mit Kachel-Kollision.
function moveBody(b, level) {
  b.hitWall = 0;
  b.bump = null;
  if (b.vx !== 0) {
    b.x += b.vx;
    const ty0 = Math.floor((b.y - b.h) / T), ty1 = Math.floor((b.y - 0.01) / T);
    if (b.vx > 0) {
      const tx = Math.floor((b.x + b.w / 2 - 0.01) / T);
      for (let ty = ty0; ty <= ty1; ty++) if (isSolid(level, tx, ty)) { b.x = tx * T - b.w / 2; b.hitWall = 1; break; }
    } else {
      const tx = Math.floor((b.x - b.w / 2) / T);
      for (let ty = ty0; ty <= ty1; ty++) if (isSolid(level, tx, ty)) { b.x = (tx + 1) * T + b.w / 2; b.hitWall = -1; break; }
    }
    if (b.hitWall) b.vx = 0;
  }
  const prevY = b.y;
  b.y += b.vy;
  b.onGround = false;
  const tx0 = Math.floor((b.x - b.w / 2) / T), tx1 = Math.floor((b.x + b.w / 2 - 0.01) / T);
  if (b.vy >= 0) {
    const ty = Math.floor(b.y / T);
    for (let tx = tx0; tx <= tx1; tx++) {
      if (isSolid(level, tx, ty) || (isOneWay(level, tx, ty) && prevY <= ty * T + 0.5)) {
        b.y = ty * T;
        b.vy = 0;
        b.onGround = true;
        break;
      }
    }
  } else {
    const ty = Math.floor((b.y - b.h) / T);
    let hit = null;
    for (let tx = tx0; tx <= tx1; tx++) {
      if (isSolid(level, tx, ty) && (!hit || Math.abs(tx * T + 8 - b.x) < Math.abs(hit.tx * T + 8 - b.x))) hit = { tx, ty };
    }
    if (hit) {
      b.y = (ty + 1) * T + b.h;
      b.vy = 0;
      b.bump = hit;
    }
  }
}

// ---------------------------------------------------------------------
class Player {
  constructor(x, y) {
    this.x = x; this.y = y; this.w = 10; this.h = 14;
    this.vx = 0; this.vy = 0; this.face = 1;
    this.onGround = false; this.pump = 0;
    this.stun = 0; this.inv = 0; this.coyote = 0; this.jumpBuf = 0;
    this.sucking = false; this.walkT = 0;
    this.safe = { x, y };
  }
  nozzle() { return { x: this.x + this.face * 14, y: this.y - 7 }; }

  draw(ctx, camX, t) {
    if (this.inv > 0 && Math.floor(this.inv / 3) % 2 === 0 && this.stun <= 0) return;
    const f = this.face;
    const shake = this.sucking ? ((t >> 1) % 2) : 0;
    const x = Math.round(this.x - camX), y = Math.round(this.y);
    drawProfessor(ctx, x, y, f, this.pump, this.pose(), shake, this.sucking);
  }
  pose() {
    if (!this.onGround) return 'jump';
    if (Math.abs(this.vx) > 0.2) return Math.floor(this.walkT / 7) % 2 ? 'walk1' : 'walk2';
    return 'idle';
  }
}

// Professor inklusive Pumpe auf dem Rücken, Schlauch und Saugpistole.
// x = Mitte, y = Unterkante (Bildschirmkoordinaten)
function drawProfessor(ctx, x, y, face, pump, pose, shake, sucking) {
  const spr = SPR['prof_' + pose + (face < 0 ? '_L' : '')];
  const bx = x - 8, by = y - 18 + (shake ? 1 : 0);
  // Pumpe auf dem Rücken
  let pumpSpr = null, px = 0, py = 0;
  if (pump > 0) {
    pumpSpr = SPR['pump' + pump];
    px = face > 0 ? x - 6 - pumpSpr.width : x + 6;
    py = y - 5 - pumpSpr.height;
    ctx.drawImage(pumpSpr, px, py);
  }
  // Schlauch
  if (pumpSpr) {
    const sx = face > 0 ? px + pumpSpr.width - 3 : px + 3, sy = py + 3;
    const ex = x + face * 4, ey = y - 6;
    const cx = (sx + ex) / 2, cy = Math.max(sy, ey) + 6;
    for (let i = 0; i <= 14; i++) {
      const tt = i / 14;
      const hx = (1 - tt) * (1 - tt) * sx + 2 * (1 - tt) * tt * cx + tt * tt * ex;
      const hy = (1 - tt) * (1 - tt) * sy + 2 * (1 - tt) * tt * cy + tt * tt * ey;
      ctx.fillStyle = '#1a1c2c'; ctx.fillRect(Math.round(hx), Math.round(hy), 2, 2);
      ctx.fillStyle = '#3aa0e8'; ctx.fillRect(Math.round(hx), Math.round(hy), 1, 1);
    }
  }
  ctx.drawImage(spr, bx, by);
  // Saugpistole
  const gy = by + 11;
  const gx0 = face > 0 ? x + 2 : x - 12;
  ctx.fillStyle = '#1a1c2c'; ctx.fillRect(gx0 - 1, gy - 1, 12, 5);
  ctx.fillStyle = '#a7b3c4'; ctx.fillRect(gx0, gy, 10, 3);
  ctx.fillStyle = pump === 3 ? '#ffa53a' : pump === 2 ? '#7be07b' : pump === 1 ? '#3aa0e8' : '#5d6b80';
  ctx.fillRect(gx0 + 3, gy, 2, 3);
  const nx = face > 0 ? x + 12 : x - 14;
  const flare = sucking ? 1 : 0;
  ctx.fillStyle = '#1a1c2c'; ctx.fillRect(nx - 1, gy - 3 - flare, 4, 9 + flare * 2);
  ctx.fillStyle = '#d5dde8'; ctx.fillRect(nx, gy - 2 - flare, 2, 7 + flare * 2);
  // Handgriff
  ctx.fillStyle = '#1a1c2c'; ctx.fillRect(face > 0 ? x + 4 : x - 6, gy + 3, 3, 3);
}

// ---------------------------------------------------------------------
const ENEMY_DEFS = {
  d: { name: 'TROPFEN', w: 8, h: 9, weight: 1, points: 100, beh: 'hopper', speed: 0.9, harm: true, stomp: true, spr: 'drop' },
  f: { name: 'STAUB', w: 10, h: 8, weight: 1, points: 100, beh: 'walker', speed: 0.4, harm: true, stomp: true, spr: 'dust', frames: true },
  c: { name: 'DAMPF', w: 12, h: 9, weight: 1, points: 150, beh: 'floater', speed: 0.3, harm: true, stomp: false, spr: 'cloud' },
  k: { name: 'KOLBEN', w: 10, h: 12, weight: 2, points: 250, beh: 'walker', speed: 0.45, harm: true, stomp: true, spr: 'flask', frames: true },
  g: { name: 'GEIST', w: 11, h: 11, weight: 2, points: 300, beh: 'ghost', speed: 0.35, harm: true, stomp: false, spr: 'ghost' },
  m: { name: 'BECHER', w: 10, h: 10, weight: 2, points: 250, beh: 'walker', speed: 0.6, harm: true, stomp: true, spr: 'beaker', frames: true },
  z: { name: 'GASFLASCHE', w: 8, h: 17, weight: 3, points: 500, beh: 'static', harm: false, stomp: false, spr: 'cylinder' },
  o: { name: 'FASS', w: 12, h: 15, weight: 3, points: 500, beh: 'static', harm: false, stomp: false, spr: 'barrel' }
};

class Enemy {
  constructor(type, x, y) {
    const d = ENEMY_DEFS[type];
    this.type = type; this.def = d;
    this.x = x; this.y = y; this.w = d.w; this.h = d.h;
    this.vx = 0; this.vy = 0; this.dir = -1;
    this.alive = true; this.active = false; this.captured = false; this.capT = 0;
    this.pulledNow = false; this.wasPulled = false; this.pullV = 0; this.shake = 0;
    this.t = Math.floor(hash(Math.floor(x) * 7 + Math.floor(y)) * 100);
    this.baseX = x; this.baseY = y; this.onGround = false;
  }

  update(scene) {
    this.t++;
    if (this.shake > 0) this.shake--;
    if (this.captured) {
      const nz = scene.player.nozzle();
      this.x += (nz.x - this.x) * 0.4;
      this.y += (nz.y + this.h / 2 - this.y) * 0.4;
      if (--this.capT <= 0) this.alive = false;
      return;
    }
    if (this.pulledNow) { this.pulledNow = false; this.wasPulled = true; return; }
    if (this.wasPulled) {
      this.wasPulled = false; this.pullV = 0; this.vx = 0; this.vy = 0;
      this.baseX = this.x; this.baseY = this.y;
    }
    const d = this.def, lv = scene.level, p = scene.player;
    switch (d.beh) {
      case 'walker': {
        this.vx = this.dir * d.speed;
        this.vy = Math.min(this.vy + 0.3, 5);
        moveBody(this, lv);
        if (this.hitWall) this.dir *= -1;
        else if (this.onGround) {
          const ax = this.x + this.dir * (this.w / 2 + 1);
          const tx = Math.floor(ax / T), ty = Math.floor((this.y + 1) / T);
          if (!isSolid(lv, tx, ty) && !isOneWay(lv, tx, ty)) this.dir *= -1;
        }
        break;
      }
      case 'hopper': {
        this.vy = Math.min(this.vy + 0.3, 5);
        if (this.onGround) {
          this.vx = 0;
          if (this.t % 70 === 0) {
            this.dir = p.x < this.x ? -1 : 1;
            this.vy = -3.2;
            this.vx = this.dir * d.speed;
          }
        }
        moveBody(this, lv);
        if (this.hitWall) this.dir *= -1;
        break;
      }
      case 'floater':
        this.x = this.baseX + Math.sin(this.t * 0.02) * 24;
        this.y = this.baseY + Math.sin(this.t * 0.06) * 6;
        break;
      case 'ghost': {
        const dx = p.x - this.x;
        if (Math.abs(dx) < 150) {
          this.x += Math.sign(dx) * d.speed;
          this.baseY += clamp(p.y - 2 - this.baseY, -0.2, 0.2);
        }
        this.y = this.baseY + Math.sin(this.t * 0.05) * 8;
        break;
      }
      case 'static':
        this.vy = Math.min(this.vy + 0.3, 5);
        moveBody(this, lv);
        break;
    }
    if (this.y > lv.H * T + 32) this.alive = false;
  }

  draw(ctx, camX) {
    const d = this.def;
    let spr = SPR[d.spr];
    if (d.frames && Math.floor(this.t / 12) % 2) spr = SPR[d.spr + '2'];
    if (this.captured) {
      const k = Math.max(0.1, this.capT / 12);
      const w = Math.max(1, Math.round(spr.width * k)), h = Math.max(1, Math.round(spr.height * k));
      ctx.drawImage(spr, Math.round(this.x - camX - w / 2), Math.round(this.y - this.h / 2 - h / 2), w, h);
      return;
    }
    let ox = 0, oy = 0;
    if (this.shake) ox = this.shake % 2 ? 1 : -1;
    if (this.wasPulled) { ox += (this.t % 2) ? 1 : 0; oy = (this.t % 3) - 1; }
    ctx.drawImage(spr, Math.round(this.x - camX - spr.width / 2) + ox, Math.round(this.y - spr.height) + oy);
  }
}

// ---------------------------------------------------------------------
class Item {
  constructor(tier, tx, ty) {
    this.tier = tier;
    this.x = tx * T + 8; this.y = (ty + 1) * T;
    this.targetY = ty * T - 1;
    this.w = 14; this.h = 14; this.t = 0; this.alive = true;
  }
  update(scene) {
    this.t++;
    if (this.y > this.targetY && this.t < 40) { this.y = Math.max(this.targetY, this.y - 1); return; }
    if (this.t < 45) return;
    // schwebt zum Professor, damit das Item nie verloren geht
    const p = scene.player;
    const dx = p.x - this.x, dy = (p.y - 4) - this.y;
    const len = Math.hypot(dx, dy) || 1;
    const sp = Math.min(1.6, 0.4 + this.t * 0.01);
    this.x += dx / len * sp;
    this.y += dy / len * sp;
  }
  draw(ctx, camX) {
    const spr = SPR['pump' + this.tier];
    const bob = this.t > 40 ? Math.round(Math.sin(this.t * 0.15) * 2) : 0;
    const x = Math.round(this.x - camX - spr.width / 2), y = Math.round(this.y - spr.height) + bob;
    if (this.t % 20 < 10) {
      ctx.fillStyle = '#fff3b0';
      ctx.fillRect(x - 2, y + 2, 1, 1); ctx.fillRect(x + spr.width + 1, y + 5, 1, 1);
      ctx.fillRect(x + 4, y - 3, 1, 1);
    }
    ctx.drawImage(spr, x, y);
  }
}

// ---------------------------------------------------------------------
class Boss {
  constructor(x, y) {
    this.x = x; this.y = y; this.homeX = x; this.homeY = y;
    this.w = 28; this.h = 24;
    this.maxHp = CONFIG.bossHp; this.hp = this.maxHp;
    this.active = false; this.alive = true; this.t = 0;
    this.shootT = 90; this.shake = 0; this.suckedNow = false;
    this.pullV = 0; this.captured = false; this.capT = 0; this.defeated = false;
  }
  update(scene) {
    const p = scene.player;
    if (!this.active) {
      if (p.x > (scene.level.bossArenaX) * T) {
        this.active = true;
        scene.showMsg('DIE DAMPF-KRAKE! SAUG SIE WEG!', 150, '#e6dcff');
        Sound.sfx('bossappear');
      }
      return;
    }
    this.t++;
    if (this.shake > 0) this.shake--;
    if (this.captured) {
      const nz = p.nozzle();
      this.x += (nz.x - this.x) * 0.25;
      this.y += (nz.y + this.h / 2 - this.y) * 0.25;
      if (--this.capT <= 0) this.alive = false;
      return;
    }
    if (this.hp <= 0) return; // wird eingesaugt (Bewegung im Saug-Code)
    if (!this.suckedNow) {
      const tx = this.homeX + Math.sin(this.t * 0.013) * 48;
      const ty = this.homeY + Math.sin(this.t * 0.031) * 22;
      this.x += (tx - this.x) * 0.04;
      this.y += (ty - this.y) * 0.04;
      if (--this.shootT <= 0) {
        this.shootT = 110;
        const alive = scene.enemies.filter(e => e.fromBoss && e.alive).length;
        if (alive < 3) {
          const d = new Enemy('d', this.x, this.y - 6);
          d.fromBoss = true; d.active = true;
          d.vx = p.x < this.x ? -1.2 : 1.2; d.vy = -2.5; d.dir = Math.sign(d.vx);
          scene.enemies.push(d);
          Sound.sfx('spit');
        }
      }
    }
    this.suckedNow = false;
  }
  draw(ctx, camX, t) {
    const spr = SPR['boss' + (Math.floor(this.t / 15) % 2)];
    if (this.captured) {
      const k = Math.max(0.1, this.capT / 40);
      const w = Math.round(spr.width * k), h = Math.round(spr.height * k);
      ctx.drawImage(spr, Math.round(this.x - camX - w / 2), Math.round(this.y - this.h / 2 - h / 2), w, h);
      return;
    }
    const ox = this.shake ? (this.shake % 2 ? 1 : -1) : 0;
    ctx.drawImage(spr, Math.round(this.x - camX - spr.width / 2) + ox, Math.round(this.y - spr.height + 6));
  }
}
