'use strict';
// Speicherung im Browser (localStorage) – bleibt auf diesem Laptop, auch nach Neustart.
const Store = {
  K_LEADS: 'vakuumprof_leads_v1',
  K_ROUNDS: 'vakuumprof_rounds_v1',
  K_SETTINGS: 'vakuumprof_settings_v1',
  mem: {},
  available: true,

  load(key, def) {
    try {
      const s = window.localStorage.getItem(key);
      if (s) return JSON.parse(s);
    } catch (e) {
      this.available = false;
    }
    return key in this.mem ? this.mem[key] : def;
  },
  save(key, val) {
    this.mem[key] = val;
    try { window.localStorage.setItem(key, JSON.stringify(val)); } catch (e) { this.available = false; }
  },
  check() {
    try {
      window.localStorage.setItem('vakuumprof_test', '1');
      window.localStorage.removeItem('vakuumprof_test');
    } catch (e) { this.available = false; }
  },

  uid(prefix) { return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); },
  leads() { return this.load(this.K_LEADS, []); },
  rounds() { return this.load(this.K_ROUNDS, []); },
  leadMap() {
    const m = {};
    this.leads().forEach(l => { m[l.id] = l; });
    return m;
  },

  upsertLead(data) {
    const leads = this.leads();
    const email = String(data.email || '').trim().toLowerCase();
    const now = Date.now();
    let lead = leads.find(l => l.email === email);
    if (lead) {
      Object.assign(lead, data, { email, updated: now });
    } else {
      lead = Object.assign({ id: this.uid('L') }, data, { email, created: now, updated: now });
      leads.push(lead);
    }
    this.save(this.K_LEADS, leads);
    return lead;
  },

  addRound(r) {
    const rounds = this.rounds();
    const rec = Object.assign({ id: this.uid('R'), ts: Date.now(), day: todayKey(), eventName: CONFIG.eventName }, r);
    rounds.push(rec);
    this.save(this.K_ROUNDS, rounds);
    return rec;
  },

  // Bestenliste: pro Person nur der beste Wert. day = 'YYYY-MM-DD' oder null für die ganze Messe
  board(day) {
    const leads = this.leadMap();
    const best = new Map();
    for (const r of this.rounds()) {
      if (day && r.day !== day) continue;
      if (!leads[r.leadId]) continue;
      const cur = best.get(r.leadId);
      if (!cur || r.score > cur.score || (r.score === cur.score && r.ts < cur.ts)) best.set(r.leadId, r);
    }
    return [...best.values()]
      .sort((a, b) => b.score - a.score || a.ts - b.ts)
      .map(r => ({ leadId: r.leadId, score: r.score, ts: r.ts, day: r.day, lead: leads[r.leadId], name: displayName(leads[r.leadId]) }));
  },
  rank(leadId, day) {
    const i = this.board(day).findIndex(e => e.leadId === leadId);
    return i < 0 ? null : i + 1;
  },
  bestOf(leadId) {
    let best = 0;
    for (const r of this.rounds()) if (r.leadId === leadId && r.score > best) best = r.score;
    return best;
  },
  stats() {
    const day = todayKey();
    const rounds = this.rounds();
    const today = rounds.filter(r => r.day === day);
    return {
      leads: this.leads().length,
      rounds: rounds.length,
      roundsToday: today.length,
      playersToday: new Set(today.map(r => r.leadId)).size
    };
  },

  deleteRound(id) { this.save(this.K_ROUNDS, this.rounds().filter(r => r.id !== id)); },
  clearAll() {
    this.save(this.K_LEADS, []);
    this.save(this.K_ROUNDS, []);
  },

  loadSettings() { return this.load(this.K_SETTINGS, {}); },
  saveSettings(s) { this.save(this.K_SETTINGS, s); },

  // ---------------- Export ----------------
  csv(headers, rows) {
    const esc = v => {
      v = v == null ? '' : String(v);
      if (/^[=+\-@\t\r]/.test(v)) v = "'" + v;               // Schutz vor Excel-Formeln
      if (/[";\n\r]/.test(v)) v = '"' + v.replace(/"/g, '""') + '"';
      return v;
    };
    const lines = [headers.map(h => esc(h[0])).join(';')];
    for (const r of rows) lines.push(headers.map(h => esc(h[1](r))).join(';'));
    return '﻿' + lines.join('\r\n');
  },
  download(filename, text, type) {
    const blob = new Blob([text], { type: type || 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000);
    return { filename, text };
  },
  fileStamp() {
    const d = new Date();
    return todayKey(d) + '_' + pad(d.getHours(), 2) + pad(d.getMinutes(), 2);
  },
  exportRoundsCSV() {
    const leads = this.leadMap();
    const rows = this.rounds().slice().sort((a, b) => a.ts - b.ts).map(r => Object.assign({}, r, { lead: leads[r.leadId] || {} }));
    const yn = v => (v ? 'ja' : 'nein');
    const text = this.csv([
      ['Datum/Zeit', r => formatDateTime(r.ts)], ['Tag', r => r.day], ['Messe', r => r.eventName],
      ['Vorname', r => r.lead.firstName], ['Name', r => r.lead.lastName], ['Firma', r => r.lead.company],
      ['E-Mail', r => r.lead.email], ['Einwilligung', r => yn(r.lead.consent)], ['Newsletter', r => yn(r.lead.newsletter)],
      ['Punkte', r => r.score], ['Grundpunkte', r => r.base], ['Zeitbonus', r => r.timeBonus],
      ['Labor gerettet', r => yn(r.finished)], ['Eingesaugt', r => r.captures], ['Beste Pumpe', r => (CONFIG.pumps[r.pump] || {}).short || '-']
    ], rows);
    return this.download('vakuum-professor_runden_' + this.fileStamp() + '.csv', text);
  },
  exportLeadsCSV() {
    const rounds = this.rounds();
    const yn = v => (v ? 'ja' : 'nein');
    const rows = this.leads().map(l => {
      const mine = rounds.filter(r => r.leadId === l.id);
      return Object.assign({}, l, {
        n: mine.length,
        best: mine.reduce((m, r) => Math.max(m, r.score), 0),
        rankAll: this.rank(l.id, null) || '-'
      });
    }).sort((a, b) => b.best - a.best);
    const text = this.csv([
      ['Vorname', r => r.firstName], ['Name', r => r.lastName], ['Firma', r => r.company], ['E-Mail', r => r.email],
      ['Einwilligung', r => yn(r.consent)], ['Newsletter', r => yn(r.newsletter)],
      ['Bester Score', r => r.best], ['Platz gesamt', r => r.rankAll], ['Anzahl Runden', r => r.n],
      ['Erstmals', r => formatDateTime(r.created)]
    ], rows);
    return this.download('vakuum-professor_leads_' + this.fileStamp() + '.csv', text);
  },
  exportJSON() {
    const data = { app: 'vakuum-professor', version: 1, exported: Date.now(), leads: this.leads(), rounds: this.rounds() };
    return this.download('vakuum-professor_backup_' + this.fileStamp() + '.json', JSON.stringify(data, null, 1), 'application/json');
  },
  importJSON(data) {
    if (!data || data.app !== 'vakuum-professor') throw new Error('Keine gültige Sicherungsdatei.');
    const leads = this.leads(), rounds = this.rounds();
    const leadIds = new Set(leads.map(l => l.id)), roundIds = new Set(rounds.map(r => r.id));
    let nl = 0, nr = 0;
    for (const l of data.leads || []) if (!leadIds.has(l.id)) { leads.push(l); nl++; }
    for (const r of data.rounds || []) if (!roundIds.has(r.id)) { rounds.push(r); nr++; }
    this.save(this.K_LEADS, leads);
    this.save(this.K_ROUNDS, rounds);
    return { leads: nl, rounds: nr };
  }
};
