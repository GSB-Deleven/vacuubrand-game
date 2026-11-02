'use strict';
// HTML-Formulare über dem Spiel: Anmeldung und Admin-Bereich

const Overlay = {
  el: null,
  visible: false,
  init() { this.el = document.getElementById('overlay'); },
  show(html) {
    this.el.innerHTML = html;
    this.el.classList.remove('hidden');
    this.visible = true;
    Input.clear();
  },
  hide() {
    this.el.classList.add('hidden');
    this.el.innerHTML = '';
    this.visible = false;
    Input.clear();
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
  }
};

// ---------------------------------------------------------------------
class RegisterScene {
  // country = Kürzel aus der Länderwahl (CH, DE, UK, FR); die Sprache ist dann schon gesetzt
  constructor(country) { this.country = country || ''; this.allowAdmin = false; this.t = 0; this.idle = 0; this.demo = new DemoStrip(); }

  enter() {
    if (CONFIG.mode === 'online') { this.enterOnline(); return; }
    const cfg = CONFIG.registration;
    const fields = cfg.fields.map(f =>
      '<label class="field"><span>' + escapeHtml(L('reg.' + f.key)) + (f.required ? ' *' : '') + '</span>' +
      '<input name="' + escapeHtml(f.key) + '" type="' + (f.type === 'email' ? 'email' : 'text') + '" maxlength="' + (f.maxLength || 60) +
      '" autocomplete="off" spellcheck="false"></label>').join('');
    Overlay.show(
      '<form class="panel reg" novalidate lang="' + I18N.lang + '">' +
      '<div class="logo"><img src="assets/vacuubrand-logo.png" alt="VACUUBRAND"></div>' +
      '<h1>' + escapeHtml(L('reg.title')) + '</h1>' +
      '<p class="hint">' + escapeHtml(L('reg.intro')) + '</p>' +
      '<div class="fields">' + fields + '</div>' +
      '<label class="check"><input type="checkbox" name="consent"><span>' + escapeHtml(L('reg.consent')) + (cfg.consentRequired ? ' *' : '') + '</span></label>' +
      (cfg.newsletter !== false ? '<label class="check"><input type="checkbox" name="newsletter"><span>' + escapeHtml(L('reg.newsletter')) + '</span></label>' : '') +
      '<div class="err" aria-live="polite"></div>' +
      '<div class="buttons"><button type="button" class="btn ghost" data-act="cancel">' + escapeHtml(L('reg.back')) + '</button>' +
      '<button type="submit" class="btn">' + escapeHtml(L('reg.go')) + '</button></div>' +
      '<p class="small">' + escapeHtml(L('reg.privacy')) + '</p>' +
      '</form>');
    Overlay.el.classList.add('top');
    const form = this.form = Overlay.el.querySelector('form');
    form.addEventListener('submit', e => { e.preventDefault(); this.submit(); });
    form.querySelector('[data-act=cancel]').addEventListener('click', () => this.cancel());
    form.addEventListener('input', () => { this.idle = 0; });
    this.onKey = e => {
      this.idle = 0;
      if (e.key === 'Escape') { e.preventDefault(); this.cancel(); }
      else if (e.key === 'Enter' && e.target && e.target.type === 'checkbox') { e.preventDefault(); this.submit(); }
    };
    window.addEventListener('keydown', this.onKey);
    if (!Input.touch) setTimeout(() => { const i = form.querySelector('input'); if (i) i.focus(); }, 30);
  }

  // Online-Demo: nur ein Spitzname, keine Kontaktdaten
  enterOnline() {
    let last = '';
    try { last = window.localStorage.getItem('vakuumprof_nick') || ''; } catch (e) { /* egal */ }
    Overlay.show(
      '<form class="panel reg online" novalidate lang="' + I18N.lang + '">' +
      '<div class="logo"><img src="assets/vacuubrand-logo.png" alt="VACUUBRAND"></div>' +
      '<h1>' + escapeHtml(L('on.title')) + '</h1>' +
      '<p class="hint">' + escapeHtml(L('on.hint')) + '</p>' +
      '<label class="field"><span>' + escapeHtml(L('on.nick')) + '</span><input name="nick" type="text" maxlength="12" autocomplete="off" spellcheck="false" placeholder="' + escapeHtml(L('on.guest')) + '" value="' + escapeHtml(last) + '"></label>' +
      '<div class="buttons"><button type="button" class="btn ghost" data-act="cancel">' + escapeHtml(L('on.back')) + '</button>' +
      '<button type="submit" class="btn">' + escapeHtml(L('on.go')) + '</button></div>' +
      '<p class="small">' + escapeHtml(L('on.privacy')) + '</p>' +
      '</form>');
    Overlay.el.classList.add('top');
    const form = this.form = Overlay.el.querySelector('form');
    form.addEventListener('submit', e => {
      e.preventDefault();
      const nick = (form.elements.nick.value.trim() || L('on.guest')).slice(0, 12);
      try { window.localStorage.setItem('vakuumprof_nick', nick); } catch (err) { /* egal */ }
      const lead = Store.upsertLead({ firstName: nick, lastName: '', company: '', email: 'online:' + nick.toLowerCase(), consent: false, newsletter: false, isOnline: true, country: this.country, lang: I18N.lang });
      Sound.sfx('select');
      Game.go(new PlayScene(lead));
    });
    form.querySelector('[data-act=cancel]').addEventListener('click', () => this.cancel());
    form.addEventListener('input', () => { this.idle = 0; });
    this.onKey = e => { this.idle = 0; if (e.key === 'Escape') { e.preventDefault(); this.cancel(); } };
    window.addEventListener('keydown', this.onKey);
    if (!Input.touch) setTimeout(() => { const i = form.querySelector('input'); if (i) i.focus(); }, 30);
  }

  exit() {
    window.removeEventListener('keydown', this.onKey);
    Overlay.el.classList.remove('top');
    Overlay.hide();
  }

  submit() {
    const cfg = CONFIG.registration, form = this.form;
    const data = {}, errors = [];
    form.querySelectorAll('input').forEach(i => i.classList.remove('bad'));
    for (const f of cfg.fields) {
      const input = form.elements[f.key];
      const v = input.value.trim();
      data[f.key] = v;
      const label = L('reg.' + f.key);
      if (f.required && !v) { errors.push(label); input.classList.add('bad'); }
      else if (f.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { errors.push(L('reg.err.invalid', label)); input.classList.add('bad'); }
    }
    data.consent = form.elements.consent.checked;
    data.newsletter = !!(form.elements.newsletter && form.elements.newsletter.checked);
    data.country = this.country;
    data.lang = I18N.lang;
    let msg = '';
    if (errors.length) msg = L('reg.err.fill', errors.join(', '));
    else if (cfg.consentRequired && !data.consent) msg = L('reg.err.consent');
    if (msg) {
      form.querySelector('.err').textContent = msg;
      const bad = form.querySelector('.bad') || (!data.consent ? form.elements.consent : null);
      if (bad) bad.focus();
      Sound.sfx('heavy');
      return;
    }
    const lead = Store.upsertLead(data);
    Sound.sfx('select');
    Game.go(new PlayScene(lead));
  }

  // Zurück zur Länderwahl; nach langer Pause ohne Eingabe zum Titel
  cancel() { Game.go(new CountryScene()); }

  update() {
    this.t++;
    this.demo.update();
    if (++this.idle > CONFIG.registrationTimeoutSeconds * 60) Game.go(new TitleScene());
  }
  draw(ctx) {
    drawMenuBackground(ctx, this.t);
    this.demo.draw(ctx);
  }
}

// ---------------------------------------------------------------------
const PAD_SETUP_STEPS = [
  { key: 'jump' },
  { key: 'suck' },
  { key: 'sprint' },
  { key: 'start' }
];
const padStepLabel = s => LA('adm.step.' + s.key);

// Admin-Bereich fürs Standpersonal. Texte in der Admin-Sprache (Deutsch oder Englisch, siehe LA in i18n.js)
class AdminScene {
  constructor() { this.allowAdmin = false; this.t = 0; this.unlocked = false; }

  enter() {
    Sound.music(null);
    this.onKey = e => { if (e.key === 'Escape') { e.preventDefault(); this.close(); } };
    window.addEventListener('keydown', this.onKey);
    this.showPin();
  }
  exit() {
    window.removeEventListener('keydown', this.onKey);
    Overlay.hide();
  }
  close() { Game.go(new TitleScene()); }

  showPin() {
    Overlay.show(
      '<form class="panel" style="width:40%" novalidate lang="' + I18N.adminLang + '"><h1>ADMIN</h1>' +
      '<label class="field"><span>' + LA('adm.pin') + '</span><input name="pin" type="password" autocomplete="off"></label>' +
      '<div class="err"></div>' +
      '<div class="buttons"><button type="button" class="btn ghost" data-act="close">' + LA('adm.back') + '</button><button class="btn" type="submit">' + LA('adm.open') + '</button></div></form>');
    const form = Overlay.el.querySelector('form');
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (form.elements.pin.value === String(CONFIG.adminPin)) { this.unlocked = true; this.render(); }
      else { form.querySelector('.err').textContent = LA('adm.wrongPin'); form.elements.pin.select(); }
    });
    form.querySelector('[data-act=close]').addEventListener('click', () => this.close());
    setTimeout(() => form.elements.pin.focus(), 30);
  }

  personRow(e) {
    const l = e.lead || {};
    return '<li><b>' + escapeHtml(l.firstName) + ' ' + escapeHtml(l.lastName) + '</b> · ' + escapeHtml(l.company) +
      ' · ' + escapeHtml(l.email) + ' — <b>' + e.score + '</b></li>';
  }

  // Auswahlfeld für Sprachen
  langSelect(name, value, langs) {
    return '<select name="' + name + '">' + langs.map(c =>
      '<option value="' + c + '"' + (c === value ? ' selected' : '') + '>' + escapeHtml(I18N.names[c]) + '</option>').join('') + '</select>';
  }

  render(note) {
    const st = Store.stats();
    const today = Store.board(todayKey()).slice(0, 3), all = Store.board(null).slice(0, 3);
    const leads = Store.leadMap();
    const recent = Store.rounds().slice().sort((a, b) => b.ts - a.ts).slice(0, 40);
    const rows = recent.map(r => {
      const l = leads[r.leadId] || {};
      return '<tr><td>' + formatDateTime(r.ts) + '</td><td>' + escapeHtml(l.firstName) + ' ' + escapeHtml(l.lastName) +
        '</td><td>' + escapeHtml(l.company) + '</td><td>' + escapeHtml(l.email) + '</td><td>' + escapeHtml(r.country || l.country || '') +
        '</td><td>' + escapeHtml(r.lang || l.lang || '') + '</td><td>' + r.score +
        '</td><td><button class="btn small danger" data-del="' + escapeHtml(r.id) + '">✕</button></td></tr>';
    }).join('');
    Overlay.show(
      '<div class="panel admin" lang="' + I18N.adminLang + '"><h1>' + LA('adm.title') + '</h1>' +
      '<p class="version">' + LA('adm.version', escapeHtml(CONFIG.version || '')) + '</p>' +
      (Store.available ? '' : '<div class="warn">' + LA('adm.noStorage') + '</div>') +
      (note ? '<p class="ok">' + escapeHtml(note) + '</p>' : '') +
      '<h2>' + LA('adm.overview') + '</h2><p>' + LA('adm.stats', st.playersToday, st.roundsToday, st.leads, st.rounds) + '</p>' +
      '<div class="cols"><div><h3>' + LA('adm.top3day') + '</h3><ol>' + (today.map(e => this.personRow(e)).join('') || '<li>–</li>') + '</ol></div>' +
      '<div><h3>' + LA('adm.top3all') + '</h3><ol>' + (all.map(e => this.personRow(e)).join('') || '<li>–</li>') + '</ol></div></div>' +
      '<h2>' + LA('adm.export') + '</h2><div class="row">' +
      '<button class="btn" data-act="csvLeads">' + LA('adm.csvLeads') + '</button>' +
      '<button class="btn" data-act="csvRounds">' + LA('adm.csvRounds') + '</button>' +
      '<button class="btn ghost" data-act="backup">' + LA('adm.backup') + '</button>' +
      '<button class="btn ghost" data-act="restore">' + LA('adm.restore') + '</button>' +
      (typeof REFERENCE_DATA !== 'undefined' ? '<button class="btn ghost" data-act="reference">' + LA('adm.reference') + '</button>' : '') +
      '<input type="file" accept=".json,application/json" class="hidden" data-file></div>' +
      '<p>' + LA('adm.exportHint') + '</p>' +
      (this.exported ? '<div class="export"><p><b>' + escapeHtml(this.exported.filename) + '</b> – ' + LA('adm.exportFallback') + '</p>' +
        '<textarea readonly data-export>' + escapeHtml(this.exported.text.replace(/^﻿/, '')) + '</textarea>' +
        '<div class="row"><button class="btn" data-act="copy">' + LA('adm.copy') + '</button><button class="btn ghost" data-act="hideExport">' + LA('adm.hide') + '</button></div></div>' : '') +
      '<h2>' + LA('adm.settings') + '</h2><form class="row" data-settings>' +
      '<label>' + LA('adm.eventName') + '<input type="text" name="eventName" maxlength="30" value="' + escapeHtml(CONFIG.eventName) + '"></label>' +
      '<label>' + LA('adm.roundSeconds') + '<input type="number" name="roundSeconds" min="30" max="600" value="' + CONFIG.roundSeconds + '"></label>' +
      '<label>' + LA('adm.adminPin') + '<input type="text" name="adminPin" maxlength="12" value="' + escapeHtml(CONFIG.adminPin) + '"></label>' +
      '<label>' + LA('adm.prizeDay') + '<input type="text" name="prizeDay" maxlength="17" placeholder="' + LA('adm.prizeEmpty') + '" value="' + escapeHtml(CONFIG.prizeDay || '') + '"></label>' +
      '<label>' + LA('adm.prizeMain') + '<input type="text" name="prizeMain" maxlength="17" placeholder="' + LA('adm.prizeEmpty') + '" value="' + escapeHtml(CONFIG.prizeMain || '') + '"></label>' +
      '<label>' + LA('adm.defaultLang') + this.langSelect('defaultLang', CONFIG.defaultLang, I18N.langs) + '</label>' +
      '<label>' + LA('adm.adminLang') + this.langSelect('adminLang', I18N.adminLang, ['de', 'en']) + '</label>' +
      '<button class="btn" type="submit">' + LA('adm.save') + '</button></form>' +
      '<h2>' + LA('adm.recent') + '</h2><table><tr><th>' + LA('adm.colTime') + '</th><th>' + LA('adm.colName') + '</th><th>' + LA('adm.colCompany') +
      '</th><th>' + LA('adm.colEmail') + '</th><th>' + LA('adm.colCountry') + '</th><th>' + LA('adm.colLang') + '</th><th>' + LA('adm.colScore') + '</th><th></th></tr>' +
      (rows || '<tr><td colspan="8">' + LA('adm.noRounds') + '</td></tr>') + '</table>' +
      '<h2>' + LA('adm.pad') + '</h2>' + this.padHtml() +
      '<h2>' + LA('adm.danger') + '</h2><div class="row"><label>' + LA('adm.wipeLabel') + '<input type="text" data-wipe autocomplete="off"></label>' +
      '<button class="btn danger" data-act="wipe">' + LA('adm.wipe') + '</button></div>' +
      '<div class="buttons" style="margin-top:1em"><button class="btn ghost" data-act="fullscreen">' + LA('adm.fullscreen') + '</button>' +
      '<button class="btn ghost" data-act="mute">' + LA(Sound.muted ? 'adm.soundOn' : 'adm.soundOff') + '</button>' +
      '<button class="btn" data-act="close">' + LA('adm.close') + '</button></div></div>');

    const root = Overlay.el;
    root.querySelectorAll('[data-act]').forEach(b => b.addEventListener('click', () => this.action(b.dataset.act)));
    // Löschen ohne Browser-Dialog (die sind in der Online-Vorschau gesperrt): zweimal klicken
    root.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => {
      if (b.dataset.sure) { Store.deleteRound(b.dataset.del); this.render(LA('adm.n.roundDeleted')); return; }
      b.dataset.sure = '1';
      b.textContent = LA('adm.sure');
    }));
    root.querySelector('[data-settings]').addEventListener('submit', e => {
      e.preventDefault();
      const f = e.target;
      const s = {
        eventName: f.elements.eventName.value.trim().toUpperCase() || CONFIG.eventName,
        roundSeconds: clamp(parseInt(f.elements.roundSeconds.value, 10) || CONFIG.roundSeconds, 30, 600),
        adminPin: f.elements.adminPin.value.trim() || CONFIG.adminPin,
        prizeDay: f.elements.prizeDay.value.trim().toUpperCase(),
        prizeMain: f.elements.prizeMain.value.trim().toUpperCase(),
        defaultLang: f.elements.defaultLang.value,
        adminLang: f.elements.adminLang.value
      };
      Object.assign(CONFIG, s);
      I18N.adminLang = s.adminLang;
      Store.saveSettings(s);
      this.render(LA('adm.n.saved'));
    });
    root.querySelector('[data-file]').addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const res = Store.importJSON(JSON.parse(reader.result));
          this.render(LA('adm.n.restored', res.leads, res.rounds));
        } catch (err) { this.render(LA('adm.n.error', err.message)); }
      };
      reader.readAsText(file);
    });
  }

  // ---- Controller einrichten: Knöpfe der Reihe nach drücken lassen ----
  firstPad() {
    const list = navigator.getGamepads ? navigator.getGamepads() : [];
    for (const gp of list || []) if (gp && gp.connected) return gp;
    return null;
  }
  padHtml() {
    const gp = this.firstPad();
    if (!gp) return '<p>' + LA('adm.padNone') + ' <button class="btn small ghost" data-act="padRefresh">' + LA('adm.padRefresh') + '</button></p>';
    const custom = Input.padMap(gp.id);
    const steps = PAD_SETUP_STEPS;
    let html = '<p>' + LA('adm.padFound', escapeHtml(gp.id.slice(0, 60)), LA(custom ? 'adm.padCustom' : 'adm.padDefault')) + '</p>';
    if (this.padStep != null) {
      html += '<div class="export"><b>' + LA('adm.padPress', padStepLabel(steps[this.padStep])) + '</b> ' + LA('adm.padOf', this.padStep + 1, steps.length) +
        ' <button class="btn small ghost" data-act="padCancel">' + LA('adm.padCancel') + '</button></div>';
    } else {
      html += '<div class="row"><button class="btn" data-act="padSetup">' + LA('adm.padSetup') + '</button>' +
        (custom ? '<button class="btn ghost" data-act="padReset">' + LA('adm.padReset') + '</button>' : '') + '</div>' +
        '<p class="small" style="text-align:left">' + LA('adm.padHelp') + '</p>';
    }
    return html;
  }
  // wird jedes Bild aufgerufen, solange die Einrichtung läuft
  padSetupTick() {
    if (this.padStep == null) return;
    const gp = this.firstPad();
    if (!gp) return;
    const pressed = gp.buttons.map(b => !!b && (b.pressed || b.value > 0.5));
    if (!this.padPrev) { this.padPrev = pressed; return; }
    const idx = pressed.findIndex((p, i) => p && !this.padPrev[i]);
    this.padPrev = pressed;
    if (idx < 0) return;
    this.padNew[PAD_SETUP_STEPS[this.padStep].key] = idx;
    Sound.sfx('select');
    this.padStep++;
    if (this.padStep >= PAD_SETUP_STEPS.length) {
      Input.savePadMap(gp.id, this.padNew);
      this.padStep = null;
      this.render(LA('adm.n.padSaved', PAD_SETUP_STEPS.map(s => padStepLabel(s) + ' = ' + LA('adm.padButton', this.padNew[s.key] + 1)).join(', ')));
    } else this.render();
  }

  action(a) {
    switch (a) {
      case 'padRefresh': this.render(); break;
      case 'padSetup': this.padStep = 0; this.padNew = {}; this.padPrev = null; this.render(); break;
      case 'padCancel': this.padStep = null; this.render(LA('adm.n.padCancel')); break;
      case 'padReset': { const gp = this.firstPad(); if (gp) Input.savePadMap(gp.id, null); this.render(LA('adm.n.padReset')); break; }
      case 'close': this.close(); break;
      case 'csvLeads': this.exported = Store.exportLeadsCSV(); this.render(LA('adm.n.leads')); break;
      case 'csvRounds': this.exported = Store.exportRoundsCSV(); this.render(LA('adm.n.rounds')); break;
      case 'backup': this.exported = Store.exportJSON(); this.render(LA('adm.n.backup')); break;
      case 'reference': {
        const res = Store.importJSON(REFERENCE_DATA);
        this.render(LA('adm.n.reference', res.leads, res.rounds));
        break;
      }
      case 'hideExport': this.exported = null; this.render(); break;
      case 'copy': {
        const ta = Overlay.el.querySelector('[data-export]');
        ta.focus(); ta.select();
        let ok = false;
        try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
        if (!ok && navigator.clipboard) navigator.clipboard.writeText(ta.value).catch(() => {});
        const btn = Overlay.el.querySelector('[data-act=copy]');
        if (btn) btn.textContent = LA('adm.copied');
        break;
      }
      case 'restore': Overlay.el.querySelector('[data-file]').click(); break;
      case 'fullscreen': toggleFullscreen(); break;
      case 'mute': Sound.toggleMute(); this.render(); break;
      case 'wipe': {
        const v = Overlay.el.querySelector('[data-wipe]').value.trim().toUpperCase();
        // LÖSCHEN oder DELETE, egal in welcher Admin-Sprache
        if (v === I18N.de['adm.wipeWord'] || v === I18N.en['adm.wipeWord']) { Store.clearAll(); this.exported = null; this.render(LA('adm.n.wiped')); }
        else this.render(LA('adm.n.notWiped'));
        break;
      }
    }
  }

  update() { this.t++; this.padSetupTick(); }
  draw(ctx) {
    drawMenuBackground(ctx, this.t);
    ctx.fillStyle = 'rgba(11,15,31,0.7)';
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  }
}
