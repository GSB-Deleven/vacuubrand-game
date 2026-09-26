'use strict';
// 8-Bit-Sound, komplett im Browser erzeugt (keine Audiodateien nötig)
function noteFreq(n) {
  const m = /^([A-G])(#?)(\d)$/.exec(n);
  if (!m) return 440;
  const semi = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[m[1]] + (m[2] ? 1 : 0);
  const midi = (Number(m[3]) + 1) * 12 + semi;
  return 440 * Math.pow(2, (midi - 69) / 12);
}

const _ = null;
// Kurzschreibweise für Melodien: Noten mit Leerzeichen getrennt, '.' = Pause
const seq = str => str.trim().split(/\s+/).map(n => n === '.' ? null : n);
const SONGS = {
  // Zone 1: Filtrationslabor – flott, Dur
  zone0: {
    step: 0.15, leadType: 'square', drums: true,
    lead: ['C5', _, 'E5', 'G5', _, 'E5', 'C5', _, 'D5', _, 'F5', 'A5', _, 'F5', 'D5', _,
           'E5', _, 'G5', 'C6', _, 'G5', 'E5', _, 'F5', 'E5', 'D5', 'C5', _, 'G4', _, _,
           'A4', _, 'C5', 'E5', _, 'C5', 'A4', _, 'B4', _, 'D5', 'G5', _, 'D5', 'B4', _,
           'C5', 'E5', 'G5', 'E5', 'F5', 'D5', 'B4', 'G4', 'C5', _, 'G5', _, 'C6', _, _, _],
    bass: ['C3', _, 'C3', _, 'G2', _, 'G2', _, 'D3', _, 'D3', _, 'A2', _, 'A2', _,
           'C3', _, 'C3', _, 'E3', _, 'E3', _, 'F3', _, 'G3', _, 'C3', _, 'G2', _,
           'A2', _, 'A2', _, 'E2', _, 'E2', _, 'G2', _, 'G2', _, 'D3', _, 'D3', _,
           'C3', _, 'E3', _, 'F3', _, 'G3', _, 'C3', _, 'G2', _, 'C3', _, _, _]
  },
  // Zone 2: Zellkultur-Labor – ruhiger, weich
  zone1: {
    step: 0.19, leadType: 'triangle', drums: false,
    lead: seq(`E5 . G5 . A5 . . . G5 . E5 . D5 . . .   C5 . D5 . E5 . G5 . A5 . . . . . . .
               A5 . C6 . B5 . A5 . G5 . E5 . D5 . . .   E5 . D5 . C5 . D5 . E5 . . . . . . .`),
    bass: seq(`A2 . . . E3 . . . F2 . . . C3 . . .   A2 . . . E3 . . . G2 . . . D3 . . .
               F2 . . . C3 . . . G2 . . . D3 . . .   A2 . . . E3 . . . A2 . . . . . . .`)
  },
  // Zone 3: Verdampfer-Labor – treibend
  zone2: {
    step: 0.13, leadType: 'square', drums: true,
    lead: seq(`D5 . D5 F5 . A5 . F5   G5 . F5 E5 . D5 . .   C5 . C5 E5 . G5 . E5   F5 . E5 D5 . C5 . .
               D5 F5 A5 D6 . A5 F5 .   A#4 D5 F5 A#5 . F5 D5 .   C5 E5 G5 C6 . G5 E5 .   A4 C#5 E5 A5 . E5 C#5 .`),
    bass: seq(`D3 . D3 D3 . D3 . .   A#2 . A#2 A#2 . A#2 . .   C3 . C3 C3 . C3 . .   A2 . A2 A2 . A2 . .
               D3 . D3 D3 . D3 . .   A#2 . A#2 A#2 . A#2 . .   C3 . C3 C3 . C3 . .   A2 . A2 A2 . C#3 . .`)
  },
  // Zone 4: Hochvakuum-Technikum – etwas mystisch
  zone3: {
    step: 0.17, leadType: 'triangle', drums: true,
    lead: seq(`E5 . B4 . G5 . F#5 .   E5 . . . B4 . . .   D5 . A4 . F#5 . E5 .   D5 . . . A4 . . .
               C5 . G5 . E5 . C6 .   B5 . . . G5 . . .   A5 . F#5 . D#5 . B4 .   E5 . . . . . . .`),
    bass: seq(`E2 . . . E3 . . .   E2 . . . E3 . . .   D2 . . . D3 . . .   D2 . . . D3 . . .
               C2 . . . C3 . . .   G2 . . . G2 . . .   B2 . . . B2 . . .   E2 . . . E3 . . .`)
  },
  // Boss: Dampf-Krake
  boss: {
    step: 0.115, leadType: 'square', drums: true,
    lead: seq(`E5 . E5 . D#5 . E5 .   G5 . F#5 . E5 . B4 .   C5 . C5 . B4 . C5 .   E5 . D#5 . C5 . A4 .
               E5 F#5 G5 . F#5 G5 A5 .   B5 . A5 . G5 . F#5 .   G5 F#5 E5 . D#5 E5 F#5 .   E5 . . . B4 . . .`),
    bass: seq(`E2 E3 E2 E3 E2 E3 E2 E3   E2 E3 E2 E3 E2 E3 E2 E3   C2 C3 C2 C3 C2 C3 C2 C3   A1 A2 A1 A2 B1 B2 B1 B2
               E2 E3 E2 E3 E2 E3 E2 E3   G2 G3 G2 G3 G2 G3 G2 G3   C2 C3 C2 C3 B1 B2 B1 B2   E2 E3 E2 E3 E2 . . .`)
  },
  title: {
    step: 0.2, leadType: 'triangle', drums: false,
    lead: ['E5', _, 'G5', _, 'C6', _, 'G5', _, 'A5', _, 'F5', _, 'D5', _, _, _,
           'E5', _, 'C5', _, 'D5', _, 'G4', _, 'C5', _, _, _, _, _, _, _],
    bass: ['C3', _, _, _, 'G2', _, _, _, 'F2', _, _, _, 'G2', _, _, _,
           'A2', _, _, _, 'F2', _, _, _, 'C3', _, 'G2', _, 'C3', _, _, _]
  }
};

const Sound = {
  ctx: null, master: null, sfxBus: null, musicBus: null, noiseBuf: null,
  muted: false, suck: null, song: null, step: 0, nextTime: 0, fast: false,

  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try {
      const c = this.ctx = new AC();
      this.master = c.createGain();
      this.master.gain.value = this.muted ? 0 : 0.6;
      this.master.connect(c.destination);
      this.sfxBus = c.createGain(); this.sfxBus.gain.value = 0.5; this.sfxBus.connect(this.master);
      this.musicBus = c.createGain(); this.musicBus.gain.value = 0.16; this.musicBus.connect(this.master);
      const len = c.sampleRate;
      this.noiseBuf = c.createBuffer(1, len, c.sampleRate);
      const d = this.noiseBuf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      this.nextTime = c.currentTime + 0.1;
    } catch (e) { this.ctx = null; }
  },

  toggleMute() {
    this.muted = !this.muted;
    if (this.master) this.master.gain.value = this.muted ? 0 : 0.6;
  },

  tone(freq, dur, o) {
    o = o || {};
    if (!this.ctx) return;
    const c = this.ctx;
    const t = (o.at !== undefined ? o.at : c.currentTime) + (o.delay || 0);
    const osc = c.createOscillator(), g = c.createGain();
    osc.type = o.type || 'square';
    osc.frequency.setValueAtTime(freq, t);
    if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t + dur);
    const v = o.vol === undefined ? 0.25 : o.vol;
    g.gain.setValueAtTime(v, t);
    g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
    osc.connect(g); g.connect(o.bus || this.sfxBus);
    osc.start(t); osc.stop(t + dur + 0.05);
  },

  noise(dur, o) {
    o = o || {};
    if (!this.ctx) return;
    const c = this.ctx;
    const t = (o.at !== undefined ? o.at : c.currentTime) + (o.delay || 0);
    const src = c.createBufferSource(); src.buffer = this.noiseBuf;
    const f = c.createBiquadFilter();
    f.type = o.filter || 'bandpass';
    f.frequency.setValueAtTime(o.freq || 1000, t);
    if (o.to) f.frequency.exponentialRampToValueAtTime(o.to, t + dur);
    f.Q.value = o.q || 1;
    const g = c.createGain();
    g.gain.setValueAtTime(o.vol === undefined ? 0.3 : o.vol, t);
    g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
    src.connect(f); f.connect(g); g.connect(o.bus || this.sfxBus);
    src.start(t); src.stop(t + dur + 0.05);
  },

  sfx(name, arg, arg2) {
    if (!this.ctx) return;
    switch (name) {
      case 'jump': this.tone(260, 0.16, { to: 620, vol: 0.16 }); break;
      case 'bump': this.tone(140, 0.08, { type: 'triangle', vol: 0.35 }); this.noise(0.06, { freq: 400, vol: 0.2 }); break;
      case 'coin': this.tone(988, 0.07, { vol: 0.16 }); this.tone(1319, 0.25, { delay: 0.07, vol: 0.16 }); break;
      case 'capture': {
        // Tonhöhe steigt mit der Combo-Stufe (arg2)
        const base = (520 + (arg || 1) * 120) * Math.pow(2, Math.min((arg2 || 1) - 1, 7) / 12);
        this.tone(base, 0.06, { vol: 0.2 });
        this.tone(base * 1.5, 0.12, { delay: 0.05, vol: 0.2 });
        this.noise(0.08, { freq: 3000, vol: 0.15 });
        break;
      }
      case 'stomp': this.tone(220, 0.12, { to: 80, type: 'triangle', vol: 0.4 }); break;
      case 'hurt': this.tone(400, 0.3, { to: 90, type: 'sawtooth', vol: 0.2 }); break;
      case 'ouch': {
        // comichaftes "Au-tsch": Vokal "au" (Sägezahn durch gleitenden Formant-Filter) + gezischtes "tsch"
        const c = this.ctx, t = c.currentTime;
        const osc = c.createOscillator(); osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(420, t); osc.frequency.exponentialRampToValueAtTime(220, t + 0.2);
        const f = c.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 4;
        f.frequency.setValueAtTime(900, t); f.frequency.exponentialRampToValueAtTime(480, t + 0.2);
        const g = c.createGain();
        g.gain.setValueAtTime(0.0008, t); g.gain.exponentialRampToValueAtTime(0.9, t + 0.02);
        g.gain.setValueAtTime(0.9, t + 0.14); g.gain.exponentialRampToValueAtTime(0.0008, t + 0.21);
        osc.connect(f); f.connect(g); g.connect(this.sfxBus);
        osc.start(t); osc.stop(t + 0.25);
        this.noise(0.13, { delay: 0.2, freq: 4500, q: 1.2, vol: 0.35, filter: 'bandpass' });
        break;
      }
      case 'powerup': [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) => this.tone(f, 0.09, { delay: i * 0.07, vol: 0.16 })); break;
      case 'puff': this.noise(0.25, { freq: 600, to: 200, vol: 0.25 }); break;
      case 'heavy': this.tone(110, 0.15, { vol: 0.14 }); this.tone(98, 0.15, { delay: 0.15, vol: 0.14 }); break;
      case 'beep': this.tone(880, 0.08, { vol: 0.2 }); break;
      case 'count': this.tone(440, 0.15, { vol: 0.22 }); break;
      case 'go': this.tone(880, 0.35, { vol: 0.22 }); break;
      case 'select': this.tone(660, 0.06, { vol: 0.2 }); this.tone(990, 0.1, { delay: 0.06, vol: 0.2 }); break;
      case 'timeup': [784, 659, 523, 392].forEach((f, i) => this.tone(f, 0.22, { delay: i * 0.16, vol: 0.22, type: 'triangle' })); break;
      case 'splash': {
        this.noise(0.35, { freq: 900, to: 250, vol: 0.35 });
        this.tone(300, 0.15, { to: 120, type: 'sine', vol: 0.3 });
        [0.12, 0.2, 0.3].forEach((d, i) => this.tone(900 + i * 250, 0.05, { delay: d, type: 'sine', vol: 0.12 }));
        break;
      }
      case 'combo': {
        const top = arg >= 8;
        (top ? [784, 988, 1175, 1568, 1976] : [659, 784, 988, 1319]).forEach((f, i) => this.tone(f, 0.08, { delay: i * 0.05, vol: 0.15 }));
        this.noise(0.2, { delay: 0.1, freq: 6000, vol: 0.08, filter: 'highpass' });
        break;
      }
      case 'upgrade': {
        // kurze Fanfare beim Pumpen-Upgrade
        [[523, 0], [659, 0.08], [784, 0.16], [1047, 0.24], [784, 0.4], [1047, 0.48]].forEach(([f, d], i) => this.tone(f, i === 5 ? 0.4 : 0.09, { delay: d, vol: 0.17 }));
        this.tone(262, 0.6, { delay: 0.24, type: 'triangle', vol: 0.3 });
        break;
      }
      case 'fanfare': {
        const d = [0, 0.12, 0.24, 0.36, 0.52, 0.68, 0.8, 0.96];
        [523, 523, 523, 659, 784, 659, 784, 1047].forEach((f, i) => this.tone(f, i === 7 ? 0.6 : 0.12, { delay: d[i], vol: 0.18 }));
        break;
      }
      case 'boss': this.noise(0.8, { freq: 200, to: 2000, vol: 0.35 }); [196, 262, 330, 392, 523].forEach((f, i) => this.tone(f, 0.2, { delay: 0.3 + i * 0.1, vol: 0.18 })); break;
      case 'bossappear': this.tone(110, 0.6, { type: 'sawtooth', to: 55, vol: 0.18 }); this.tone(116, 0.6, { type: 'sawtooth', to: 58, vol: 0.18 }); break;
      case 'door': [392, 523, 659, 784].forEach((f, i) => this.tone(f, 0.1, { delay: i * 0.08, vol: 0.18 })); break;
      case 'spit': this.noise(0.15, { freq: 1200, to: 400, vol: 0.2 }); break;
      case 'sprout': [262, 330, 392, 523].forEach((f, i) => this.tone(f, 0.08, { delay: i * 0.05, vol: 0.14, type: 'triangle' })); break;
      case 'overheat': this.noise(0.5, { freq: 3000, to: 500, vol: 0.25 }); this.tone(300, 0.4, { to: 120, vol: 0.12 }); break;
      case 'boing': this.tone(180, 0.15, { to: 420, type: 'triangle', vol: 0.3 }); break;
      case 'timebonus': [659, 784, 988, 1319, 1568].forEach((f, i) => this.tone(f, 0.1, { delay: i * 0.06, vol: 0.16 })); break;
    }
  },

  suckStart(level) {
    if (!this.ctx) return;
    this.suckStop();
    const c = this.ctx, t = c.currentTime;
    const src = c.createBufferSource(); src.buffer = this.noiseBuf; src.loop = true;
    const f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 500 + level * 350; f.Q.value = 0.8;
    const g = c.createGain();
    g.gain.setValueAtTime(0.0008, t);
    g.gain.exponentialRampToValueAtTime(0.12 + level * 0.04, t + 0.15);
    const osc = c.createOscillator(); osc.type = 'sawtooth'; osc.frequency.value = 50 + level * 25;
    const og = c.createGain(); og.gain.value = 0.05;
    src.connect(f); f.connect(g); osc.connect(og); og.connect(g); g.connect(this.sfxBus);
    src.start(); osc.start();
    this.suck = { src, osc, g };
  },

  suckStop() {
    if (!this.suck || !this.ctx) { this.suck = null; return; }
    const { src, osc, g } = this.suck;
    const t = this.ctx.currentTime;
    g.gain.cancelScheduledValues(t);
    g.gain.setValueAtTime(Math.max(g.gain.value, 0.001), t);
    g.gain.exponentialRampToValueAtTime(0.0008, t + 0.1);
    src.stop(t + 0.12); osc.stop(t + 0.12);
    this.suck = null;
  },

  music(name) {
    const song = name ? SONGS[name] : null;
    if (song === this.song) return;
    this.song = song;
    this.step = 0;
    this.fast = false;
    if (this.ctx) this.nextTime = this.ctx.currentTime + 0.1;
  },

  update() {
    if (!this.ctx || !this.song) return;
    const c = this.ctx, song = this.song;
    if (this.nextTime < c.currentTime - 0.3) this.nextTime = c.currentTime + 0.05;
    const stepDur = song.step * (this.fast ? 0.72 : 1);
    while (this.nextTime < c.currentTime + 0.2) {
      const i = this.step % song.lead.length, t = this.nextTime;
      const ln = song.lead[i], bn = song.bass[i % song.bass.length];
      if (ln) this.tone(noteFreq(ln), stepDur * 0.9, { at: t, type: song.leadType, vol: 0.2, bus: this.musicBus });
      if (bn) this.tone(noteFreq(bn), stepDur * 1.6, { at: t, type: 'triangle', vol: 0.45, bus: this.musicBus });
      if (song.drums) {
        if (i % 2 === 1) this.noise(0.04, { at: t, freq: 7000, vol: 0.1, bus: this.musicBus, filter: 'highpass' });
        if (i % 8 === 0) this.tone(120, 0.1, { at: t, to: 50, type: 'sine', vol: 0.6, bus: this.musicBus });
      }
      this.nextTime += stepDur;
      this.step++;
    }
  }
};
