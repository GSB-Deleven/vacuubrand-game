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
  constructor() { this.allowAdmin = false; this.t = 0; this.idle = 0; this.demo = new DemoStrip(); }

  enter() {
    const cfg = CONFIG.registration;
    const fields = cfg.fields.map(f =>
      '<label class="field"><span>' + escapeHtml(f.label) + (f.required ? ' *' : '') + '</span>' +
      '<input name="' + escapeHtml(f.key) + '" type="' + (f.type === 'email' ? 'email' : 'text') + '" maxlength="' + (f.maxLength || 60) +
      '" autocomplete="off" spellcheck="false"></label>').join('');
    Overlay.show(
      '<form class="panel reg" novalidate>' +
      '<div class="logo"><img src="assets/vacuubrand-logo.png" alt="VACUUBRAND"></div>' +
      '<h1>SPIELER-ANMELDUNG</h1>' +
      '<p class="hint">' + escapeHtml(cfg.intro) + '</p>' +
      '<div class="fields">' + fields + '</div>' +
      '<label class="check"><input type="checkbox" name="consent"><span>' + escapeHtml(cfg.consentText) + (cfg.consentRequired ? ' *' : '') + '</span></label>' +
      (cfg.newsletterText ? '<label class="check"><input type="checkbox" name="newsletter"><span>' + escapeHtml(cfg.newsletterText) + '</span></label>' : '') +
      '<div class="err" aria-live="polite"></div>' +
      '<div class="buttons"><button type="button" class="btn ghost" data-act="cancel">ESC · ZURÜCK</button>' +
      '<button type="submit" class="btn">ENTER · LOS GEHT\'S!</button></div>' +
      '<p class="small">' + escapeHtml(cfg.privacyNote) + '</p>' +
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
    setTimeout(() => { const i = form.querySelector('input'); if (i) i.focus(); }, 30);
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
      if (f.required && !v) { errors.push(f.label); input.classList.add('bad'); }
      else if (f.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { errors.push(f.label + ' (ungültig)'); input.classList.add('bad'); }
    }
    data.consent = form.elements.consent.checked;
    data.newsletter = !!(form.elements.newsletter && form.elements.newsletter.checked);
    let msg = '';
    if (errors.length) msg = 'Bitte ausfüllen: ' + errors.join(', ');
    else if (cfg.consentRequired && !data.consent) msg = 'Bitte die Einwilligung ankreuzen, um am Gewinnspiel teilzunehmen.';
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

  cancel() { Game.go(new TitleScene()); }

  update() {
    this.t++;
    this.demo.update();
    if (++this.idle > CONFIG.registrationTimeoutSeconds * 60) this.cancel();
  }
  draw(ctx) {
    drawMenuBackground(ctx, this.t);
    this.demo.draw(ctx);
  }
}

// ---------------------------------------------------------------------
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
      '<form class="panel" style="width:40%" novalidate><h1>ADMIN</h1>' +
      '<label class="field"><span>PIN</span><input name="pin" type="password" autocomplete="off"></label>' +
      '<div class="err"></div>' +
      '<div class="buttons"><button type="button" class="btn ghost" data-act="close">ESC · ZURÜCK</button><button class="btn" type="submit">ÖFFNEN</button></div></form>');
    const form = Overlay.el.querySelector('form');
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (form.elements.pin.value === String(CONFIG.adminPin)) { this.unlocked = true; this.render(); }
      else { form.querySelector('.err').textContent = 'Falsche PIN.'; form.elements.pin.select(); }
    });
    form.querySelector('[data-act=close]').addEventListener('click', () => this.close());
    setTimeout(() => form.elements.pin.focus(), 30);
  }

  personRow(e) {
    const l = e.lead || {};
    return '<li><b>' + escapeHtml(l.firstName) + ' ' + escapeHtml(l.lastName) + '</b> · ' + escapeHtml(l.company) +
      ' · ' + escapeHtml(l.email) + ' — <b>' + e.score + '</b></li>';
  }

  render(note) {
    const st = Store.stats();
    const today = Store.board(todayKey()).slice(0, 3), all = Store.board(null).slice(0, 3);
    const leads = Store.leadMap();
    const recent = Store.rounds().slice().sort((a, b) => b.ts - a.ts).slice(0, 40);
    const rows = recent.map(r => {
      const l = leads[r.leadId] || {};
      return '<tr><td>' + formatDateTime(r.ts) + '</td><td>' + escapeHtml(l.firstName) + ' ' + escapeHtml(l.lastName) +
        '</td><td>' + escapeHtml(l.company) + '</td><td>' + escapeHtml(l.email) + '</td><td>' + r.score +
        '</td><td><button class="btn small danger" data-del="' + escapeHtml(r.id) + '">✕</button></td></tr>';
    }).join('');
    Overlay.show(
      '<div class="panel admin"><h1>ADMIN · PROFESSOR VAKUUMUS</h1>' +
      (Store.available ? '' : '<div class="warn">Achtung: Der Browser-Speicher ist nicht verfügbar – Daten gehen beim Schliessen verloren! Bitte regelmässig exportieren.</div>') +
      (note ? '<p class="ok">' + escapeHtml(note) + '</p>' : '') +
      '<h2>Übersicht</h2><p>Heute: <b>' + st.playersToday + '</b> Spieler, <b>' + st.roundsToday + '</b> Runden · Gesamt: <b>' +
      st.leads + '</b> Leads, <b>' + st.rounds + '</b> Runden</p>' +
      '<div class="cols"><div><h3>Top 3 heute (Tagespreis)</h3><ol>' + (today.map(e => this.personRow(e)).join('') || '<li>–</li>') + '</ol></div>' +
      '<div><h3>Top 3 gesamte Messe</h3><ol>' + (all.map(e => this.personRow(e)).join('') || '<li>–</li>') + '</ol></div></div>' +
      '<h2>Export &amp; Sicherung</h2><div class="row">' +
      '<button class="btn" data-act="csvLeads">Leads (CSV/Excel)</button>' +
      '<button class="btn" data-act="csvRounds">Alle Runden (CSV/Excel)</button>' +
      '<button class="btn ghost" data-act="backup">Sicherung speichern (JSON)</button>' +
      '<button class="btn ghost" data-act="restore">Sicherung laden</button>' +
      (typeof REFERENCE_DATA !== 'undefined' ? '<button class="btn ghost" data-act="reference">Referenzdaten laden (Test)</button>' : '') +
      '<input type="file" accept=".json,application/json" class="hidden" data-file></div>' +
      '<p>Dateien landen im Download-Ordner. Tipp: am Ende jedes Messetags exportieren.</p>' +
      (this.exported ? '<div class="export"><p><b>' + escapeHtml(this.exported.filename) + '</b> – falls kein Download gestartet ist (z.B. in der Online-Vorschau): Inhalt kopieren und in Excel bzw. eine Textdatei einfügen.</p>' +
        '<textarea readonly data-export>' + escapeHtml(this.exported.text.replace(/^\ufeff/, '')) + '</textarea>' +
        '<div class="row"><button class="btn" data-act="copy">Inhalt kopieren</button><button class="btn ghost" data-act="hideExport">Ausblenden</button></div></div>' : '') +
      '<h2>Einstellungen</h2><form class="row" data-settings>' +
      '<label>Messename<input type="text" name="eventName" maxlength="30" value="' + escapeHtml(CONFIG.eventName) + '"></label>' +
      '<label>Rundenzeit (Sek.)<input type="number" name="roundSeconds" min="30" max="600" value="' + CONFIG.roundSeconds + '"></label>' +
      '<label>Admin-PIN<input type="text" name="adminPin" maxlength="12" value="' + escapeHtml(CONFIG.adminPin) + '"></label>' +
      '<button class="btn" type="submit">Speichern</button></form>' +
      '<h2>Letzte Runden</h2><table><tr><th>Zeit</th><th>Name</th><th>Firma</th><th>E-Mail</th><th>Punkte</th><th></th></tr>' +
      (rows || '<tr><td colspan="6">Noch keine Runden.</td></tr>') + '</table>' +
      '<h2>Gefahrenzone</h2><div class="row"><label>Zum Löschen LÖSCHEN eintippen<input type="text" data-wipe autocomplete="off"></label>' +
      '<button class="btn danger" data-act="wipe">Alle Daten löschen</button></div>' +
      '<div class="buttons" style="margin-top:1em"><button class="btn ghost" data-act="fullscreen">Vollbild an/aus</button>' +
      '<button class="btn ghost" data-act="mute">Ton ' + (Sound.muted ? 'an' : 'aus') + '</button>' +
      '<button class="btn" data-act="close">Schliessen (ESC)</button></div></div>');

    const root = Overlay.el;
    root.querySelectorAll('[data-act]').forEach(b => b.addEventListener('click', () => this.action(b.dataset.act)));
    // Löschen ohne Browser-Dialog (die sind in der Online-Vorschau gesperrt): zweimal klicken
    root.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => {
      if (b.dataset.sure) { Store.deleteRound(b.dataset.del); this.render('Runde gelöscht.'); return; }
      b.dataset.sure = '1';
      b.textContent = 'Sicher? Nochmals klicken';
    }));
    root.querySelector('[data-settings]').addEventListener('submit', e => {
      e.preventDefault();
      const f = e.target;
      const s = {
        eventName: f.elements.eventName.value.trim().toUpperCase() || CONFIG.eventName,
        roundSeconds: clamp(parseInt(f.elements.roundSeconds.value, 10) || CONFIG.roundSeconds, 30, 600),
        adminPin: f.elements.adminPin.value.trim() || CONFIG.adminPin
      };
      Object.assign(CONFIG, s);
      Store.saveSettings(s);
      this.render('Einstellungen gespeichert.');
    });
    root.querySelector('[data-file]').addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const res = Store.importJSON(JSON.parse(reader.result));
          this.render('Sicherung geladen: ' + res.leads + ' neue Leads, ' + res.rounds + ' neue Runden.');
        } catch (err) { this.render('Fehler: ' + err.message); }
      };
      reader.readAsText(file);
    });
  }

  action(a) {
    switch (a) {
      case 'close': this.close(); break;
      case 'csvLeads': this.exported = Store.exportLeadsCSV(); this.render('Leads exportiert.'); break;
      case 'csvRounds': this.exported = Store.exportRoundsCSV(); this.render('Runden exportiert.'); break;
      case 'backup': this.exported = Store.exportJSON(); this.render('Sicherung erstellt.'); break;
      case 'reference': {
        const res = Store.importJSON(REFERENCE_DATA);
        this.render('Referenzdaten geladen: ' + res.leads + ' neue Leads, ' + res.rounds + ' neue Runden. Vor der Messe mit «Alle Daten löschen» entfernen!');
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
        if (btn) btn.textContent = 'Kopiert (sonst markieren + Strg+C)';
        break;
      }
      case 'restore': Overlay.el.querySelector('[data-file]').click(); break;
      case 'fullscreen': toggleFullscreen(); break;
      case 'mute': Sound.toggleMute(); this.render(); break;
      case 'wipe': {
        const v = Overlay.el.querySelector('[data-wipe]').value;
        if (v.trim().toUpperCase() === 'LÖSCHEN') { Store.clearAll(); this.exported = null; this.render('Alle Daten gelöscht.'); }
        else this.render('Nicht gelöscht: Bitte zuerst LÖSCHEN in das Feld eintippen.');
        break;
      }
    }
  }

  update() { this.t++; }
  draw(ctx) {
    drawMenuBackground(ctx, this.t);
    ctx.fillStyle = 'rgba(11,15,31,0.7)';
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  }
}
