'use strict';
// Speicherung im Browser (localStorage) – bleibt auf diesem Laptop, auch nach Neustart.
const Store = {
  // Schlüssel behalten absichtlich den alten Namen "vakuumprof_" (vor der Umbenennung in Vacuumus),
  // sonst wären Bestenliste und Leads auf bestehenden Geräten weg. Exportnamen vakuum-professor_* ebenso.
  K_LEADS: 'vakuumprof_leads_v1',
  K_ROUNDS: 'vakuumprof_rounds_v1',
  K_SETTINGS: 'vakuumprof_settings_v1',
  mem: {},
  available: true,

  // Gelesene Daten werden zwischengespeichert: Titel und Bestenliste lesen sie in jedem Bild,
  // und das Entschlüsseln von hunderten Runden 60-mal pro Sekunde bremst schwache Geräte (Raspberry Pi).
  load(key, def) {
    if (key in this.mem) return this.mem[key];
    try {
      const s = window.localStorage.getItem(key);
      if (s) return (this.mem[key] = JSON.parse(s));
    } catch (e) {
      this.available = false;
    }
    return def;
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
  // Echte Leads (mit Anmeldung), ohne Spitzname-Spieler (online oder Messe mit "Nur Spitzname")
  realLeads() { return this.leads().filter(l => !isNickLead(l)); },
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
      leads: this.realLeads().length,
      nicks: this.leads().length - this.realLeads().length,
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
    // Spitzname-Runden: Spalte "Art" = Spitzname, Name in eigener Spalte, Lead-Spalten bleiben leer
    const rows = this.rounds().slice().sort((a, b) => a.ts - b.ts).map(r => {
      const l = leads[r.leadId] || {};
      return Object.assign({}, r, { nick: isNickLead(l) ? l.firstName : '', lead: isNickLead(l) ? {} : l });
    });
    const yn = v => LA(v ? 'csv.yes' : 'csv.no');
    const text = this.csv([
      [LA('csv.dateTime'), r => formatDateTime(r.ts)], [LA('csv.day'), r => r.day], [LA('csv.event'), r => r.eventName],
      [LA('csv.type'), r => LA(r.nick ? 'csv.typeNick' : 'csv.typeLead')], [LA('csv.nick'), r => r.nick],
      [LA('csv.firstName'), r => r.lead.firstName], [LA('csv.lastName'), r => r.lead.lastName], [LA('csv.company'), r => r.lead.company],
      [LA('csv.email'), r => r.lead.email], [LA('csv.consent'), r => yn(r.lead.consent)], [LA('csv.newsletter'), r => yn(r.lead.newsletter)],
      [LA('csv.country'), r => r.country || r.lead.country || ''], [LA('csv.lang'), r => r.lang || r.lead.lang || ''],
      [LA('csv.score'), r => r.score], [LA('csv.base'), r => r.base], [LA('csv.timeBonus'), r => r.timeBonus],
      [LA('csv.medalBonus'), r => r.medalBonus || 0],
      [LA('csv.medals'), r => (r.medals || []).map(k => LA('medal.' + k)).join(', ')],
      [LA('csv.finished'), r => yn(r.finished)], [LA('csv.captures'), r => r.captures], [LA('csv.pump'), r => (CONFIG.pumps[r.pump] || {}).short || '-']
    ], rows);
    return this.download('vakuum-professor_runden_' + this.fileStamp() + '.csv', text);
  },
  exportLeadsCSV() {
    const rounds = this.rounds();
    const yn = v => LA(v ? 'csv.yes' : 'csv.no');
    const rows = this.realLeads().map(l => {   // Spitzname-Spieler sind keine Leads
      const mine = rounds.filter(r => r.leadId === l.id);
      return Object.assign({}, l, {
        n: mine.length,
        best: mine.reduce((m, r) => Math.max(m, r.score), 0),
        rankAll: this.rank(l.id, null) || '-'
      });
    }).sort((a, b) => b.best - a.best);
    const text = this.csv([
      [LA('csv.firstName'), r => r.firstName], [LA('csv.lastName'), r => r.lastName], [LA('csv.company'), r => r.company], [LA('csv.email'), r => r.email],
      [LA('csv.consent'), r => yn(r.consent)], [LA('csv.newsletter'), r => yn(r.newsletter)],
      [LA('csv.country'), r => r.country || ''], [LA('csv.lang'), r => r.lang || ''],
      [LA('csv.best'), r => r.best], [LA('csv.rankAll'), r => r.rankAll], [LA('csv.rounds'), r => r.n],
      [LA('csv.first'), r => formatDateTime(r.created)]
    ], rows);
    return this.download('vakuum-professor_leads_' + this.fileStamp() + '.csv', text);
  },
  exportJSON() {
    const data = { app: 'vakuum-professor', version: 1, exported: Date.now(), leads: this.leads(), rounds: this.rounds() };
    return this.download('vakuum-professor_backup_' + this.fileStamp() + '.json', JSON.stringify(data, null, 1), 'application/json');
  },
  importJSON(data) {
    if (!data || data.app !== 'vakuum-professor') throw new Error(LA('adm.badBackup'));
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
