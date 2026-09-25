'use strict';
// Spielfiguren: Professor, Gegner/Objekte, Items, Boss + Tile-Kollision

const SOLID_TILES = new Set(['#', 'B', '1', '2', '3', '?', 'V', 'U']);

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
    this.sucking = false; this.walkT = 0; this.ducking = false;
    this.energy = 1; this.overheat = false;
    this.stamina = 1; this.tired = false; this.sprinting = false;
    this.bvcT = 0; this.bvcZone = false;
    this.ppe = { goggles: false, gloves: false, helmet: false, shoes: false };
    this.safe = { x, y };
  }
  fullPPE() { return this.ppe.goggles && this.ppe.gloves && this.ppe.helmet && this.ppe.shoes; }
  nozzle() { return { x: this.x + this.face * 14, y: this.y - (this.ducking ? 4 : 7) }; }

  draw(ctx, camX, t) {
    if (this.inv > 0 && Math.floor(this.inv / 3) % 2 === 0 && this.stun <= 0) return;
    const shake = this.sucking ? ((t >> 1) % 2) : 0;
    drawProfessor(ctx, Math.round(this.x - camX), Math.round(this.y), {
      face: this.face, pump: this.pump, pose: this.pose(), shake, sucking: this.sucking,
      ppe: this.ppe, bvc: this.bvcT > 0, glow: this.fullPPE() && (t % 20 < 10)
    });
  }
  pose() {
    if (this.ducking) return 'duck';
    if (!this.onGround) return 'jump';
    if (Math.abs(this.vx) > 0.2) return Math.floor(this.walkT / (this.sprinting ? 4 : 7)) % 2 ? 'walk1' : 'walk2';
    return 'idle';
  }
}

// Professor inklusive Pumpe auf dem Rücken, Schlauch, Saugpistole und Schutzausrüstung.
// x = Mitte, y = Unterkante (Bildschirmkoordinaten)
function drawProfessor(ctx, x, y, o) {
  const face = o.face, ppe = o.ppe || {};
  const pose = o.pose || 'idle';
  const spr = SPR['prof_' + pose + '_' + (ppe.shoes ? 1 : 0) + (ppe.gloves ? 1 : 0) + (face < 0 ? '_L' : '')];
  const bx = x - 8, by = y - spr.height + (o.shake ? 1 : 0);
  const mx = (ox, w) => (face > 0 ? bx + ox : bx + 16 - ox - w); // gespiegelte x-Position

  // Gerät auf dem Rücken
  const backSpr = o.bvc ? SPR.bvc : (o.pump > 0 ? SPR['pump' + o.pump] : null);
  let px = 0, py = 0;
  if (backSpr) {
    px = face > 0 ? x - 6 - backSpr.width : x + 6;
    py = y - (pose === 'duck' ? 1 : 5) - backSpr.height;
    ctx.drawImage(backSpr, px, py);
    // Schlauch
    const sx = face > 0 ? px + backSpr.width - 3 : px + 3, sy = py + 3;
    const ex = x + face * 4, ey = by + 12;
    const cx = (sx + ex) / 2, cy = Math.max(sy, ey) + 6;
    for (let i = 0; i <= 14; i++) {
      const tt = i / 14;
      const hx = (1 - tt) * (1 - tt) * sx + 2 * (1 - tt) * tt * cx + tt * tt * ex;
      const hy = (1 - tt) * (1 - tt) * sy + 2 * (1 - tt) * tt * cy + tt * tt * ey;
      ctx.fillStyle = PAL.k; ctx.fillRect(Math.round(hx), Math.round(hy), 2, 2);
      ctx.fillStyle = o.bvc ? '#ff8fb8' : '#3aa0e8'; ctx.fillRect(Math.round(hx), Math.round(hy), 1, 1);
    }
  }
  if (o.glow) {
    ctx.fillStyle = 'rgba(255,230,102,0.45)';
    ctx.fillRect(bx - 2, by - 2, 20, spr.height + 4);
  }
  ctx.drawImage(spr, bx, by);

  // Schutzbrille und Helm
  if (ppe.goggles) {
    ctx.fillStyle = '#5d6b80'; ctx.fillRect(mx(3, 11), by + 5, 11, 3);
    ctx.fillStyle = 'rgba(223,244,251,0.8)'; ctx.fillRect(mx(4, 4), by + 6, 4, 1); ctx.fillRect(mx(9, 4), by + 6, 4, 1);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(mx(4, 1), by + 6, 1, 1); ctx.fillRect(mx(9, 1), by + 6, 1, 1);
  }
  if (ppe.helmet) {
    ctx.fillStyle = PAL.k; ctx.fillRect(mx(2, 12), by - 2, 12, 5); ctx.fillRect(mx(0, 16), by + 2, 16, 2);
    ctx.fillStyle = '#ffd23f'; ctx.fillRect(mx(3, 10), by - 1, 10, 4);
    ctx.fillStyle = '#e0a000'; ctx.fillRect(mx(1, 14), by + 2, 14, 1); ctx.fillRect(mx(7, 2), by - 1, 2, 3);
  }

  // Saugpistole bzw. VHC-Handstück der BVC
  const gy = by + (pose === 'duck' ? 11 : 11);
  if (o.bvc) {
    const gx0 = face > 0 ? x + 2 : x - 14;
    ctx.fillStyle = PAL.k; ctx.fillRect(gx0 - 1, gy - 1, 14, 4);
    ctx.fillStyle = '#f4f7fb'; ctx.fillRect(gx0, gy, 12, 2);
    ctx.fillStyle = '#3aa0e8'; ctx.fillRect(gx0 + 4, gy - 1, 3, 1);
    const tip = face > 0 ? x + 14 : x - 19;
    ctx.fillStyle = PAL.k; ctx.fillRect(tip, gy, 5, 2);
    ctx.fillStyle = '#c8f2ff'; ctx.fillRect(tip, gy, 5, 1);
  } else {
    const gx0 = face > 0 ? x + 2 : x - 12;
    ctx.fillStyle = PAL.k; ctx.fillRect(gx0 - 1, gy - 1, 12, 5);
    ctx.fillStyle = '#a7b3c4'; ctx.fillRect(gx0, gy, 10, 3);
    ctx.fillStyle = o.pump === 3 ? '#ffa53a' : o.pump === 2 ? '#7be07b' : o.pump === 1 ? '#3aa0e8' : '#5d6b80';
    ctx.fillRect(gx0 + 3, gy, 2, 3);
    const nx = face > 0 ? x + 12 : x - 14;
    const flare = o.sucking ? 1 : 0;
    ctx.fillStyle = PAL.k; ctx.fillRect(nx - 1, gy - 3 - flare, 4, 9 + flare * 2);
    ctx.fillStyle = '#d5dde8'; ctx.fillRect(nx, gy - 2 - flare, 2, 7 + flare * 2);
  }
  ctx.fillStyle = PAL.k; ctx.fillRect(face > 0 ? x + 4 : x - 6, gy + 3, 3, 3);
}

// ---------------------------------------------------------------------
// weight: 1 = ME 1C reicht, 2 = PC 3001 VARIO select nötig, 3 = VACUU·PURE nötig
// liquid: kann mit der BVC professional immer abgesaugt werden
const ENEMY_DEFS = {
  // Filtration
  d: { name: 'FILTRAT-TROPFEN', w: 8, h: 9, weight: 1, points: 100, beh: 'hopper', speed: 0.9, harm: true, spr: 'drop', liquid: true },
  f: { name: 'SCHMUTZPARTIKEL', w: 10, h: 8, weight: 1, points: 100, beh: 'walker', speed: 0.4, harm: true, spr: 'dust', frames: true },
  p: { name: 'FILTERPAPIER', w: 12, h: 10, weight: 1, points: 150, beh: 'floater', harm: true, spr: 'paper', frames: true },
  s: { name: 'SPE-KARTUSCHE', w: 7, h: 14, weight: 1, points: 150, beh: 'walker', speed: 0.5, harm: true, spr: 'spe', frames: true },
  // Zellkultur
  n: { name: 'NÄHRMEDIUM', w: 14, h: 6, weight: 1, points: 150, beh: 'walker', speed: 0.35, harm: true, spr: 'medium', frames: true, liquid: true },
  e: { name: 'PETRI-SCHLEIM', w: 14, h: 8, weight: 1, points: 150, beh: 'walker', speed: 0.45, harm: true, spr: 'petri', frames: true, liquid: true },
  w: { name: 'WELLPLATTE', w: 15, h: 8, weight: 2, points: 250, beh: 'hopper', speed: 0.8, harm: true, spr: 'plate', frames: true, liquid: true },
  // Verdampfer
  c: { name: 'LÖSEMITTELDAMPF', w: 12, h: 9, weight: 1, points: 150, beh: 'floater', harm: true, spr: 'cloud' },
  g: { name: 'LÖSEMITTEL-GEIST', w: 11, h: 11, weight: 2, points: 300, beh: 'ghost', speed: 0.35, harm: true, spr: 'ghost' },
  r: { name: 'KONZENTRATOR-RÖHRCHEN', w: 7, h: 14, weight: 2, points: 250, beh: 'hopper', speed: 0.8, harm: true, spr: 'tube', frames: true },
  k: { name: 'RUNDKOLBEN', w: 10, h: 12, weight: 2, points: 250, beh: 'walker', speed: 0.45, harm: true, spr: 'flask', frames: true },
  h: { name: 'HITZEDAMPF', w: 12, h: 9, weight: 2, points: 250, beh: 'floater', harm: true, spr: 'hotcloud' },
  m: { name: 'MESSBECHER', w: 10, h: 10, weight: 2, points: 250, beh: 'walker', speed: 0.6, harm: true, spr: 'beaker', frames: true },
  o: { name: 'LÖSEMITTELFASS', w: 12, h: 15, weight: 3, points: 500, beh: 'static', harm: false, spr: 'barrel' },
  // Hochvakuum
  i: { name: 'EISKRISTALL', w: 12, h: 12, weight: 2, points: 300, beh: 'floater', harm: true, spr: 'ice', frames: true },
  l: { name: 'SCHLENK-KOLBEN', w: 12, h: 16, weight: 3, points: 500, beh: 'walker', speed: 0.4, harm: true, spr: 'schlenk', frames: true },
  z: { name: 'ARGON-FLASCHE', w: 8, h: 17, weight: 3, points: 500, beh: 'static', harm: false, spr: 'cylinder' },
  b: { name: 'SIEDEBLASE', w: 12, h: 12, weight: 3, points: 500, beh: 'floater', harm: true, spr: 'bubble', frames: true }
};

class Enemy {
  constructor(type, x, y) {
    const d = ENEMY_DEFS[type];
    this.type = type; this.def = d;
    this.x = x; this.y = y; this.w = d.w; this.h = d.h;
    this.vx = 0; this.vy = 0; this.dir = -1;
    this.alive = true; this.active = false; this.captured = false; this.capT = 0;
    this.pulledNow = false; this.wasPulled = false; this.pullV = 0; this.shake = 0; this.safeT = 0;
    this.t = Math.floor(hash(Math.floor(x) * 7 + Math.floor(y)) * 100);
    this.baseX = x; this.baseY = y; this.onGround = false;
  }

  update(scene) {
    this.t++;
    if (this.shake > 0) this.shake--;
    if (this.safeT > 0) this.safeT--;
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
// Items: steigen aus dem Block und laufen dann wie die Pilze bei Mario davon.
// kind: 'pump' (tier), 'ppe' (key), 'bvc', 'view' (schwebt an Ort)
class Item {
  constructor(kind, value, x, y, fromBlock) {
    this.kind = kind; this.value = value;
    this.x = x; this.y = y;
    this.w = 12; this.h = 12;
    this.vx = 0; this.vy = 0; this.dir = 1;
    this.t = 0; this.alive = true;
    this.rising = fromBlock ? 16 : 0;
  }
  sprite() {
    if (this.kind === 'pump') return SPR['pump' + this.value];
    if (this.kind === 'ppe') return SPR['ppe_' + this.value];
    return SPR[this.kind];
  }
  update(scene) {
    this.t++;
    if (this.rising > 0) { this.rising--; this.y -= 1; return; }
    if (this.kind === 'view') return;
    this.vx = this.dir * 0.75;
    this.vy = Math.min(this.vy + 0.3, 5);
    moveBody(this, scene.level);
    if (this.hitWall) this.dir *= -1;
    if (this.y > scene.level.H * T + 20) {
      this.alive = false;
      if (this.kind === 'pump') scene.showMsg('OH NEIN, DIE PUMPE IST WEG! NÄCHSTER KOLBEN-BLOCK...', 140, '#ff8f8f');
    }
  }
  draw(ctx, camX) {
    const spr = this.sprite();
    const bob = this.kind === 'view' ? Math.round(Math.sin(this.t * 0.1) * 2) : 0;
    const x = Math.round(this.x - camX - spr.width / 2), y = Math.round(this.y - spr.height) + bob;
    if (this.t % 20 < 10) {
      ctx.fillStyle = this.kind === 'view' ? '#7be07b' : '#fff3b0';
      ctx.fillRect(x - 2, y + 2, 1, 1); ctx.fillRect(x + spr.width + 1, y + 5, 1, 1); ctx.fillRect(x + 4, y - 3, 1, 1);
    }
    if (this.kind === 'view') {
      ctx.fillStyle = 'rgba(123,224,123,0.35)';
      ctx.fillRect(x - 3, y - 3, spr.width + 6, spr.height + 6);
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
    this.pullV = 0; this.captured = false; this.capT = 0;
  }
  update(scene) {
    const p = scene.player;
    if (!this.active) {
      if (p.x > scene.level.bossArenaX * T) {
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
  draw(ctx, camX) {
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
