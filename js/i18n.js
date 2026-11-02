'use strict';
// =====================================================================
//  ALLE TEXTE DES SPIELS in Deutsch (de), Englisch (en) und Französisch (fr).
//  Jeder Text hat einen Schlüssel. {0}, {1} ... sind Platzhalter (z. B. Punkte, Sekunden).
//  \n = neue Zeile. Spieltexte nur in GROSSBUCHSTABEN (Pixelschrift), ca. 50 Zeichen pro Zeile.
//  Fehlt ein Text in Englisch oder Französisch, erscheint automatisch der deutsche.
//  Neue Texte immer in allen 3 Sprachen eintragen UND in TEXTE.md (mit Nummer).
//  Deutsch ist freigegeben bzw. beim Marketing. Englisch und Französisch sind Entwürfe.
//  Admin-Texte (Schlüssel "adm.") gibt es nur auf Deutsch und Englisch.
// =====================================================================
const I18N = {
  lang: 'de',          // aktuelle Spielsprache
  adminLang: 'de',     // Sprache des Admin-Bereichs (de oder en)
  langs: ['de', 'en', 'fr'],
  // Namen der Sprachen in der Sprachzeile der Länderwahl (immer in der eigenen Sprache)
  names: { de: 'DEUTSCH', en: 'ENGLISH', fr: 'FRANÇAIS' },

  // -------------------------------------------------------------------
  de: {
    // Titel und Bestenliste
    'title.sub': 'SAUG DAS LABOR-CHAOS WEG!',
    'title.start': 'ENTER = START', 'title.start.touch': 'TIPPEN = START',
    'title.board': 'B = BESTENLISTE', 'title.board.touch': 'BESTENLISTE',
    'title.leader': 'HEUTE FÜHRT:',
    'title.prize': 'ZU GEWINNEN: {0}',
    'board.title': 'BESTENLISTE',
    'board.today': 'HEUTE',
    'board.all': 'GESAMT · {0}',
    'board.prize': 'PREIS: {0}',
    'board.empty': 'NOCH KEINE EINTRÄGE.\nSEI DER ERSTE!',
    'board.back': 'B / ESC = ZURÜCK    ENTER = START', 'board.back.touch': 'TIPPEN = ZURÜCK',
    'board.thanks': 'DANKE FÜRS SPIELEN!  ENTER = WEITER', 'board.thanks.touch': 'DANKE FÜRS SPIELEN!  TIPPEN = WEITER',
    'player': 'SPIELER',

    // Länderwahl (neu)
    'country.title': 'LAND UND SPRACHE',
    'country.hint': '← → LAND   ↑ ↓ SPRACHE   ENTER = OK',
    'country.hint.touch': 'SPRACHE WÄHLEN, DANN FLAGGE ANTIPPEN',

    // Anleitung vor der Runde
    'howto.title': 'SO GEHT\'S',
    'howto.walk': 'LAUFEN', 'howto.jump': 'SPRINGEN', 'howto.duck': 'DUCKEN',
    'howto.suck': 'SAUGEN', 'howto.hold': 'HALTEN', 'howto.pause': 'PAUSE',
    'howto.sprint': 'SPRINTEN', 'howto.pad': 'GEHT AUCH',
    'key.space': 'LEERTASTE', 'key.shift': 'SHIFT/CTRL', 'key.pad': 'CONTROLLER',
    'howto.limits': 'SOG + SPRINT SIND BEGRENZT: LEISTEN BEACHTEN!',
    'howto.blocks': 'KOLBEN-BLÖCKE VON UNTEN ANSPRINGEN:',
    'howto.pumps': 'PUMPEN',
    'howto.ppe': 'SCHUTZAUSRÜSTUNG',
    'howto.goal': 'SAUG IN {0} SEK SO VIEL CHAOS WIE MÖGLICH EIN!',
    'howto.start': 'ENTER = START', 'howto.start.touch': 'TIPPEN = START',

    // Touch-Knöpfe
    'touch.jump': 'SPRUNG', 'touch.suck': 'SAUGEN',
    'touch.rotate': 'BITTE GERÄT QUER HALTEN',
    'pad.connected': 'CONTROLLER VERBUNDEN',
    'a2hs': '📲 Für Vollbild: unten auf <b>Teilen</b> tippen und <b>„Zum Home-Bildschirm“</b> wählen.',

    // Anzeige oben
    'hud.points': 'PUNKTE {0}',
    'hud.time': 'ZEIT {0}',
    'hud.noPump': 'KEINE PUMPE',
    'hud.bvc': 'BVC PROFESSIONAL',
    'hud.sec': '{0} S',
    'hud.sog': 'SOG', 'hud.heat': 'HEISS', 'hud.sprint': 'SPRINT',
    'combo': 'COMBO', 'combo.lost': 'VORBEI',
    'boss': 'DAMPF-KRAKE',
    'exit': 'EXIT',

    // Ablauf der Runde
    'go': 'LOS!',
    'timeup': 'ZEIT ABGELAUFEN!',
    'finish': 'GESCHAFFT!',
    'finish.bonus': 'RESTZEIT {0} SEK = BONUS!',
    'pause': 'PAUSE',
    'pause.hint': 'ESC / START = WEITERSPIELEN\nENTER = RUNDE ABBRECHEN', 'pause.hint.touch': 'TIPPEN = WEITERSPIELEN',
    'plusSec': '+{0} SEK', 'minusSec': '-{0} SEK',
    'ouch': 'AUTSCH!',

    // Meldungen im Boden
    'msg.zone': 'ZONE {0}: {1}',
    'msg.locked': 'ERST DIE DAMPF-KRAKE EINSAUGEN!',
    'msg.bvcLeave': 'DIE BVC BLEIBT IM ZELLKULTUR-LABOR - WEITER MIT DER PUMPE!',
    'msg.bvcLeave0': 'DIE BVC BLEIBT IM ZELLKULTUR-LABOR!',
    'msg.noPump': 'KEINE PUMPE! SPRING GEGEN DEN KOLBEN-BLOCK!',
    'msg.overheat': 'ÜBERHITZT! KURZ ABKÜHLEN LASSEN...',
    'msg.heavy': 'ZU SCHWER! DU BRAUCHST EINE STÄRKERE PUMPE!',
    'msg.almost': 'GLEICH HAST DU SIE!',
    'msg.krakeStrong': 'DIE KRAKE IST ZU STARK! HOL DIR DIE VACUU·PURE 10C!',
    'msg.shoes': 'MIT SICHERHEITSSCHUHEN KÖNNTEST DU SIE ZERTRETEN!',
    'msg.pumpLost': 'OH NEIN, DIE PUMPE IST WEG! NÄCHSTER KOLBEN-BLOCK...',
    'msg.boss': 'DIE DAMPF-KRAKE! SAUG SIE WEG!',

    // Zonen und Auffangwannen
    'zone.0': 'FILTRATIONSLABOR', 'zone.1': 'ZELLKULTUR-LABOR', 'zone.2': 'VERDAMPFER-LABOR',
    'zone.3': 'CHEMIELABOR', 'zone.4': 'HOCHVAKUUM-TECHNIKUM',
    'pit.0': 'IN DIE FILTRAT-WANNE GEFALLEN!',
    'pit.1': 'INS DESINFEKTIONSBAD GEFALLEN!',
    'pit.2': 'IN DIE LÖSEMITTEL-AUFFANGWANNE GEFALLEN!',
    'pit.3': 'IN DIE SÄURE-AUFFANGWANNE GEFALLEN!',
    'pit.4': 'IN DEN FLÜSSIGSTICKSTOFF GEFALLEN!',

    // Schilder im Level (max. 2 Zeilen)
    'sign.1': 'SPRING VON UNTEN GEGEN\nDEN KOLBEN-BLOCK!',
    'sign.2': 'LEERTASTE HALTEN\n= SAUGEN!', 'sign.2.touch': 'KNOPF SAUGEN HALTEN\n= SAUGEN!',
    'sign.3': 'ME 1C: IDEAL FÜR\nDIE FILTRATION',
    'sign.4': 'ZELLKULTUR-LABOR:\nHOL DIR DIE BVC!',
    'sign.5': 'PC 3001 VARIO SELECT:\nIDEAL FÜR DEN ROTAVAP',
    'sign.6': 'CHEMIELABOR:\nMD 4C VARIO SELECT',
    'sign.7': 'VACUU·PURE 10C:\nIDEAL FÜR ÖLFREIE TROCKNUNG',
    'sign.8': 'ACHTUNG:\nDAMPF-KRAKE!',

    // Banner im Boden (Titel + max. 2 Zeilen)
    'pump.1.title': 'MEMBRANPUMPE ME 1C', 'pump.1.slogan': 'IDEAL FÜR DIE FILTRATION',
    'pump.2.title': 'PC 3001 VARIO SELECT', 'pump.2.slogan': 'ROTAVAP · VAKUUM-KONZENTRATOR · TROCKENSCHRANK\nMEHR SOG: JETZT AUCH RUNDKOLBEN!',
    'pump.3.title': 'MD 4C VARIO SELECT', 'pump.3.slogan': 'CHEMIEFEST: DESTILLATION · TROCKNUNG\nVACUU·SELECT REGELT AUTOMATISCH!',
    'pump.4.title': 'VACUU·PURE 10C', 'pump.4.slogan': 'ÖLFREI: GEFRIERTROCKNUNG · SCHLENK · TURBO\nMAXIMALER SOG!',
    'banner.bvc.title': 'PUMPE BVC PROFESSIONAL', 'banner.bvc.sub': 'MIT VHC: MEDIENABSAUGUNG\nPUNKTE ×2',
    'banner.view.title': 'VACUU·VIEW EXTENDED', 'banner.view.sub': 'ZEITVAKUUM: +{0} SEKUNDEN!',
    'banner.full.title': 'VOLLSCHUTZ!', 'banner.full.sub': 'KOMPLETTE SCHUTZAUSRÜSTUNG:\nNICHTS KANN DIR MEHR SCHADEN!',
    'banner.saved.title': 'LABOR GERETTET!', 'banner.saved.sub': 'SCHNELL ZUM AUSGANG →\nRESTZEIT GIBT BONUSPUNKTE!',
    'ppe.goggles.name': 'SCHUTZBRILLE', 'ppe.goggles.text': 'TREFFER KOSTEN NUR NOCH 1 SEKUNDE.',
    'ppe.gloves.name': 'HANDSCHUHE', 'ppe.gloves.text': 'SOG-LEISTE LÄDT DOPPELT SO SCHNELL.',
    'ppe.helmet.name': 'SCHUTZHELM', 'ppe.helmet.text': 'GEGNER VON UNTEN WEGKÖPFEN!',
    'ppe.shoes.name': 'SICHERHEITSSCHUHE', 'ppe.shoes.text': 'AUF GEGNER SPRINGEN ZERSTÖRT SIE!',

    // Namen in den Punkte-Einblendungen (nur Moleküle)
    'enemy.H2O': 'H2O', 'enemy.O2': 'O2', 'enemy.N2': 'N2', 'enemy.H2O2': 'H2O2',
    'enemy.MEOH': 'METHANOL', 'enemy.ETOH': 'ETHANOL',

    // Ergebnis und Medaillen
    'res.saved': 'LABOR GERETTET!', 'res.timeup': 'ZEIT ABGELAUFEN!',
    'res.captures': 'EINGESAUGT', 'res.pump': 'PUMPE', 'res.ppe': 'SCHUTZ', 'res.combo': 'BESTE COMBO',
    'res.points': 'PUNKTE', 'res.timebonus': 'ZEITBONUS', 'res.medals': 'MEDAILLEN', 'res.total': 'GESAMT',
    'res.test': 'TESTRUNDE - NICHT IN DER BESTENLISTE',
    'res.rank': 'PLATZ {0} HEUTE  ·  PLATZ {1} GESAMT',
    'res.best': 'DEIN BESTWERT: {0}',
    'res.dayBest': '★ TAGESBESTWERT! ★',
    'res.next': 'ENTER = BESTENLISTE', 'res.next.touch': 'TIPPEN = BESTENLISTE',
    'medal.boss': 'KRAKE BEZWUNGEN', 'medal.ppe': 'VOLLSCHUTZ', 'medal.nohit': 'UNVERLETZT',
    'medal.pump': 'TOP-PUMPE', 'medal.combo': 'COMBO-PROFI', 'medal.view': 'ZEITMEISTER',

    // Kontakt-Seite mit QR-Code
    'contact.title': 'KONTAKT',
    'contact.aim': 'HANDY-KAMERA AUF\nDEN CODE RICHTEN:',
    'contact.line': 'DEIN DIREKTER DRAHT\nZU VACUUBRAND.',
    'contact.next': 'ENTER = WEITER', 'contact.next.touch': 'TIPPEN = WEITER',

    // Anmeldung (HTML, normale Schreibweise)
    'reg.title': 'SPIELER-ANMELDUNG',
    'reg.intro': 'Nur Vorname + erster Buchstabe des Nachnamens erscheinen in der Bestenliste.',
    'reg.firstName': 'Vorname', 'reg.lastName': 'Name', 'reg.company': 'Firma', 'reg.email': 'E-Mail',
    // Einwilligung und Datenschutz: rechtlich relevant, nur nach Freigabe ändern (siehe TEXTE.md)
    'reg.consent': 'Ich bin einverstanden, dass VACUUBRAND mich im Rahmen des Gewinnspiels und zu Produktinformationen kontaktiert.',
    'reg.newsletter': 'Ja, ich möchte zusätzlich den VACUUBRAND Newsletter erhalten.',
    'reg.privacy': 'Die Daten werden nur lokal auf diesem Gerät gespeichert und ausschliesslich für das Gewinnspiel und die Kontaktaufnahme verwendet.',
    'reg.back': 'ESC · ZURÜCK', 'reg.go': 'ENTER · LOS GEHT\'S!',
    'reg.err.fill': 'Bitte ausfüllen: {0}',
    'reg.err.invalid': '{0} (ungültig)',
    'reg.err.consent': 'Bitte die Einwilligung ankreuzen, um am Gewinnspiel teilzunehmen.',
    'on.title': 'ONLINE-DEMO',
    'on.hint': 'Keine Anmeldung nötig. Wie sollen wir dich in der Bestenliste nennen?',
    'on.nick': 'Spitzname', 'on.guest': 'GAST',
    'on.back': 'ZURÜCK', 'on.go': 'LOS GEHT\'S!',
    'on.privacy': 'Deine Punkte werden nur auf diesem Gerät gespeichert. Es werden keine Daten übertragen.',

    // ---------------- Admin-Bereich (nur de und en) ----------------
    'adm.title': 'ADMIN · PROFESSOR VACUUMUS',
    'adm.pin': 'PIN', 'adm.open': 'ÖFFNEN', 'adm.back': 'ESC · ZURÜCK', 'adm.wrongPin': 'Falsche PIN.',
    'adm.noStorage': 'Achtung: Der Browser-Speicher ist nicht verfügbar – Daten gehen beim Schliessen verloren! Bitte regelmässig exportieren.',
    'adm.overview': 'Übersicht',
    'adm.stats': 'Heute: <b>{0}</b> Spieler, <b>{1}</b> Runden · Gesamt: <b>{2}</b> Leads, <b>{3}</b> Runden',
    'adm.top3day': 'Top 3 heute (Tagespreis)', 'adm.top3all': 'Top 3 gesamte Messe',
    'adm.export': 'Export &amp; Sicherung',
    'adm.csvLeads': 'Leads (CSV/Excel)', 'adm.csvRounds': 'Alle Runden (CSV/Excel)',
    'adm.backup': 'Sicherung speichern (JSON)', 'adm.restore': 'Sicherung laden', 'adm.reference': 'Referenzdaten laden (Test)',
    'adm.exportHint': 'Dateien landen im Download-Ordner. Tipp: am Ende jedes Messetags exportieren.',
    'adm.exportFallback': 'falls kein Download gestartet ist (z.B. in der Online-Vorschau): Inhalt kopieren und in Excel bzw. eine Textdatei einfügen.',
    'adm.copy': 'Inhalt kopieren', 'adm.copied': 'Kopiert (sonst markieren + Strg+C)', 'adm.hide': 'Ausblenden',
    'adm.settings': 'Einstellungen', 'adm.version': 'Version {0}',
    'adm.eventName': 'Messename', 'adm.roundSeconds': 'Rundenzeit (Sek.)', 'adm.adminPin': 'Admin-PIN',
    'adm.prizeDay': 'Tagespreis', 'adm.prizeMain': 'Hauptpreis (ganze Messe)', 'adm.prizeEmpty': 'leer = keine Anzeige',
    'adm.defaultLang': 'Gerätesprache (Vorwahl Land und Sprache)', 'adm.adminLang': 'Admin-Sprache',
    'adm.save': 'Speichern',
    'adm.recent': 'Letzte Runden',
    'adm.colTime': 'Zeit', 'adm.colName': 'Name', 'adm.colCompany': 'Firma', 'adm.colEmail': 'E-Mail', 'adm.colScore': 'Punkte',
    'adm.colCountry': 'Land', 'adm.colLang': 'Sprache',
    'adm.noRounds': 'Noch keine Runden.',
    'adm.pad': 'Controller / Joystick',
    'adm.danger': 'Gefahrenzone', 'adm.wipeLabel': 'Zum Löschen LÖSCHEN eintippen', 'adm.wipeWord': 'LÖSCHEN', 'adm.wipe': 'Alle Daten löschen',
    'adm.fullscreen': 'Vollbild an/aus', 'adm.soundOn': 'Ton an', 'adm.soundOff': 'Ton aus', 'adm.close': 'Schliessen (ESC)',
    'adm.sure': 'Sicher? Nochmals klicken',
    'adm.n.roundDeleted': 'Runde gelöscht.', 'adm.n.saved': 'Einstellungen gespeichert.',
    'adm.n.restored': 'Sicherung geladen: {0} neue Leads, {1} neue Runden.', 'adm.n.error': 'Fehler: {0}',
    'adm.n.leads': 'Leads exportiert.', 'adm.n.rounds': 'Runden exportiert.', 'adm.n.backup': 'Sicherung erstellt.',
    'adm.n.reference': 'Referenzdaten geladen: {0} neue Leads, {1} neue Runden. Vor der Messe mit «Alle Daten löschen» entfernen!',
    'adm.n.wiped': 'Alle Daten gelöscht.', 'adm.n.notWiped': 'Nicht gelöscht: Bitte zuerst LÖSCHEN in das Feld eintippen.',
    'adm.n.padSaved': 'Controller gespeichert: {0}', 'adm.n.padCancel': 'Einrichtung abgebrochen.', 'adm.n.padReset': 'Standard-Belegung wiederhergestellt.',
    'adm.padNone': 'Kein Controller erkannt. Einstecken und eine Taste drücken, dann', 'adm.padRefresh': 'Neu suchen',
    'adm.padFound': 'Erkannt: <b>{0}</b> · Belegung: {1}', 'adm.padCustom': 'eigene', 'adm.padDefault': 'Standard',
    'adm.padPress': 'Drücke jetzt am Controller: {0}', 'adm.padOf': '({0} von {1})', 'adm.padCancel': 'Abbrechen',
    'adm.padSetup': 'Controller einrichten', 'adm.padReset': 'Standard wiederherstellen',
    'adm.padHelp': 'Nötig, wenn Springen/Saugen auf falschen Knöpfen liegen (z. B. bei Arcade-Automaten). Laufen geht immer mit Stick bzw. Steuerkreuz.',
    'adm.padButton': 'Knopf {0}',
    'adm.step.jump': 'SPRINGEN', 'adm.step.suck': 'SAUGEN', 'adm.step.sprint': 'SPRINTEN', 'adm.step.start': 'START / PAUSE',
    'adm.badBackup': 'Keine gültige Sicherungsdatei.',
    // CSV-Export (Spaltennamen)
    'csv.dateTime': 'Datum/Zeit', 'csv.day': 'Tag', 'csv.event': 'Messe', 'csv.firstName': 'Vorname', 'csv.lastName': 'Name',
    'csv.company': 'Firma', 'csv.email': 'E-Mail', 'csv.consent': 'Einwilligung', 'csv.newsletter': 'Newsletter',
    'csv.country': 'Land', 'csv.lang': 'Sprache',
    'csv.score': 'Punkte', 'csv.base': 'Grundpunkte', 'csv.timeBonus': 'Zeitbonus', 'csv.medalBonus': 'Medaillenbonus',
    'csv.medals': 'Medaillen', 'csv.finished': 'Labor gerettet', 'csv.captures': 'Eingesaugt', 'csv.pump': 'Beste Pumpe',
    'csv.best': 'Bester Score', 'csv.rankAll': 'Platz gesamt', 'csv.rounds': 'Anzahl Runden', 'csv.first': 'Erstmals',
    'csv.yes': 'ja', 'csv.no': 'nein'
  },

  // -------------------------------------------------------------------
  // ENGLISCH: Entwurf, vom Marketing zu prüfen
  en: {
    'title.sub': 'SUCK UP THE LAB CHAOS!',
    'title.start': 'ENTER = START', 'title.start.touch': 'TAP = START',
    'title.board': 'B = HIGH SCORES', 'title.board.touch': 'HIGH SCORES',
    'title.leader': 'TODAY\'S LEADER:',
    'title.prize': 'TO WIN: {0}',
    'board.title': 'HIGH SCORES',
    'board.today': 'TODAY',
    'board.all': 'OVERALL · {0}',
    'board.prize': 'PRIZE: {0}',
    'board.empty': 'NO ENTRIES YET.\nBE THE FIRST!',
    'board.back': 'B / ESC = BACK    ENTER = START', 'board.back.touch': 'TAP = BACK',
    'board.thanks': 'THANKS FOR PLAYING!  ENTER = NEXT', 'board.thanks.touch': 'THANKS FOR PLAYING!  TAP = NEXT',
    'player': 'PLAYER',

    'country.title': 'COUNTRY AND LANGUAGE',
    'country.hint': '← → COUNTRY   ↑ ↓ LANGUAGE   ENTER = OK',
    'country.hint.touch': 'CHOOSE LANGUAGE, THEN TAP A FLAG',

    'howto.title': 'HOW TO PLAY',
    'howto.walk': 'WALK', 'howto.jump': 'JUMP', 'howto.duck': 'DUCK',
    'howto.suck': 'SUCK', 'howto.hold': 'HOLD', 'howto.pause': 'PAUSE',
    'howto.sprint': 'SPRINT', 'howto.pad': 'WORKS TOO',
    'key.space': 'SPACE', 'key.shift': 'SHIFT/CTRL', 'key.pad': 'CONTROLLER',
    'howto.limits': 'SUCTION + SPRINT ARE LIMITED: WATCH THE BARS!',
    'howto.blocks': 'JUMP UP AGAINST THE FLASK BLOCKS:',
    'howto.pumps': 'PUMPS',
    'howto.ppe': 'SAFETY GEAR',
    'howto.goal': 'SUCK UP AS MUCH CHAOS AS YOU CAN IN {0} SEC!',
    'howto.start': 'ENTER = START', 'howto.start.touch': 'TAP = START',

    'touch.jump': 'JUMP', 'touch.suck': 'SUCK',
    'touch.rotate': 'PLEASE TURN YOUR DEVICE SIDEWAYS',
    'pad.connected': 'CONTROLLER CONNECTED',
    'a2hs': '📲 For full screen: tap <b>Share</b> below and choose <b>“Add to Home Screen”</b>.',

    'hud.points': 'SCORE {0}',
    'hud.time': 'TIME {0}',
    'hud.noPump': 'NO PUMP',
    'hud.bvc': 'BVC PROFESSIONAL',
    'hud.sec': '{0} S',
    'hud.sog': 'VAC', 'hud.heat': 'HOT', 'hud.sprint': 'SPRINT',
    'combo': 'COMBO', 'combo.lost': 'OVER',
    'boss': 'STEAM KRAKEN',
    'exit': 'EXIT',

    'go': 'GO!',
    'timeup': 'TIME\'S UP!',
    'finish': 'WELL DONE!',
    'finish.bonus': 'TIME LEFT {0} SEC = BONUS!',
    'pause': 'PAUSE',
    'pause.hint': 'ESC / START = CONTINUE\nENTER = END ROUND', 'pause.hint.touch': 'TAP = CONTINUE',
    'plusSec': '+{0} SEC', 'minusSec': '-{0} SEC',
    'ouch': 'OUCH!',

    'msg.zone': 'ZONE {0}: {1}',
    'msg.locked': 'SUCK UP THE STEAM KRAKEN FIRST!',
    'msg.bvcLeave': 'THE BVC STAYS IN THE CELL CULTURE LAB - CARRY ON WITH THE PUMP!',
    'msg.bvcLeave0': 'THE BVC STAYS IN THE CELL CULTURE LAB!',
    'msg.noPump': 'NO PUMP! JUMP UP AGAINST THE FLASK BLOCK!',
    'msg.overheat': 'OVERHEATED! LET IT COOL DOWN...',
    'msg.heavy': 'TOO HEAVY! YOU NEED A STRONGER PUMP!',
    'msg.almost': 'ALMOST GOT IT!',
    'msg.krakeStrong': 'THE KRAKEN IS TOO STRONG! GET THE VACUU·PURE 10C!',
    'msg.shoes': 'WITH SAFETY SHOES YOU COULD STOMP THEM!',
    'msg.pumpLost': 'OH NO, THE PUMP IS GONE! NEXT FLASK BLOCK...',
    'msg.boss': 'THE STEAM KRAKEN! SUCK IT UP!',

    'zone.0': 'FILTRATION LAB', 'zone.1': 'CELL CULTURE LAB', 'zone.2': 'EVAPORATION LAB',
    'zone.3': 'CHEMISTRY LAB', 'zone.4': 'HIGH VACUUM PILOT PLANT',
    'pit.0': 'YOU FELL INTO THE FILTRATE TRAY!',
    'pit.1': 'YOU FELL INTO THE DISINFECTANT BATH!',
    'pit.2': 'YOU FELL INTO THE SOLVENT DRIP TRAY!',
    'pit.3': 'YOU FELL INTO THE ACID DRIP TRAY!',
    'pit.4': 'YOU FELL INTO THE LIQUID NITROGEN!',

    'sign.1': 'JUMP UP AGAINST\nTHE FLASK BLOCK!',
    'sign.2': 'HOLD SPACE\n= SUCK!', 'sign.2.touch': 'HOLD THE SUCK BUTTON\n= SUCK!',
    'sign.3': 'ME 1C: IDEAL FOR\nFILTRATION',
    'sign.4': 'CELL CULTURE LAB:\nGRAB THE BVC!',
    'sign.5': 'PC 3001 VARIO SELECT:\nIDEAL FOR THE ROTAVAP',
    'sign.6': 'CHEMISTRY LAB:\nMD 4C VARIO SELECT',
    'sign.7': 'VACUU·PURE 10C:\nIDEAL FOR OIL-FREE DRYING',
    'sign.8': 'WARNING:\nSTEAM KRAKEN!',

    'pump.1.title': 'DIAPHRAGM PUMP ME 1C', 'pump.1.slogan': 'IDEAL FOR FILTRATION',
    'pump.2.title': 'PC 3001 VARIO SELECT', 'pump.2.slogan': 'ROTAVAP · VACUUM CONCENTRATOR · DRYING OVEN\nMORE SUCTION: NOW ROUND FLASKS TOO!',
    'pump.3.title': 'MD 4C VARIO SELECT', 'pump.3.slogan': 'CHEMISTRY-PROOF: DISTILLATION · DRYING\nVACUU·SELECT CONTROLS AUTOMATICALLY!',
    'pump.4.title': 'VACUU·PURE 10C', 'pump.4.slogan': 'OIL-FREE: FREEZE DRYING · SCHLENK · TURBO\nMAXIMUM SUCTION!',
    'banner.bvc.title': 'BVC PROFESSIONAL PUMP', 'banner.bvc.sub': 'WITH VHC: LIQUID ASPIRATION\nPOINTS ×2',
    'banner.view.title': 'VACUU·VIEW EXTENDED', 'banner.view.sub': 'TIME VACUUM: +{0} SECONDS!',
    'banner.full.title': 'FULL PROTECTION!', 'banner.full.sub': 'COMPLETE SAFETY GEAR:\nNOTHING CAN HURT YOU NOW!',
    'banner.saved.title': 'LAB SAVED!', 'banner.saved.sub': 'QUICK, TO THE EXIT →\nTIME LEFT GIVES BONUS POINTS!',
    'ppe.goggles.name': 'SAFETY GOGGLES', 'ppe.goggles.text': 'HITS NOW ONLY COST 1 SECOND.',
    'ppe.gloves.name': 'GLOVES', 'ppe.gloves.text': 'SUCTION BAR RECHARGES TWICE AS FAST.',
    'ppe.helmet.name': 'SAFETY HELMET', 'ppe.helmet.text': 'HEADBUTT ENEMIES FROM BELOW!',
    'ppe.shoes.name': 'SAFETY SHOES', 'ppe.shoes.text': 'JUMPING ON ENEMIES DESTROYS THEM!',

    'enemy.MEOH': 'METHANOL', 'enemy.ETOH': 'ETHANOL',

    'res.saved': 'LAB SAVED!', 'res.timeup': 'TIME\'S UP!',
    'res.captures': 'SUCKED UP', 'res.pump': 'PUMP', 'res.ppe': 'SAFETY', 'res.combo': 'BEST COMBO',
    'res.points': 'POINTS', 'res.timebonus': 'TIME BONUS', 'res.medals': 'MEDALS', 'res.total': 'TOTAL',
    'res.test': 'TEST ROUND - NOT ON THE HIGH SCORES',
    'res.rank': 'RANK {0} TODAY  ·  RANK {1} OVERALL',
    'res.best': 'YOUR BEST: {0}',
    'res.dayBest': '★ BEST SCORE TODAY! ★',
    'res.next': 'ENTER = HIGH SCORES', 'res.next.touch': 'TAP = HIGH SCORES',
    'medal.boss': 'KRAKEN BEATEN', 'medal.ppe': 'FULL PROTECTION', 'medal.nohit': 'UNHARMED',
    'medal.pump': 'TOP PUMP', 'medal.combo': 'COMBO PRO', 'medal.view': 'TIME MASTER',

    'contact.title': 'CONTACT',
    'contact.aim': 'POINT YOUR PHONE\nCAMERA AT THE CODE:',
    'contact.line': 'YOUR DIRECT LINE\nTO VACUUBRAND.',
    'contact.next': 'ENTER = NEXT', 'contact.next.touch': 'TAP = NEXT',

    'reg.title': 'PLAYER REGISTRATION',
    'reg.intro': 'Only your first name and the first letter of your last name appear on the high score list.',
    'reg.firstName': 'First name', 'reg.lastName': 'Last name', 'reg.company': 'Company', 'reg.email': 'Email',
    // Legal text: draft, to be checked by legal / data protection for the UK and Ireland
    'reg.consent': 'I agree that VACUUBRAND may contact me in connection with the prize draw and with product information.',
    'reg.newsletter': 'Yes, I would also like to receive the VACUUBRAND newsletter.',
    'reg.privacy': 'Your data is stored only locally on this device and used exclusively for the prize draw and to contact you.',
    'reg.back': 'ESC · BACK', 'reg.go': 'ENTER · LET\'S GO!',
    'reg.err.fill': 'Please fill in: {0}',
    'reg.err.invalid': '{0} (invalid)',
    'reg.err.consent': 'Please tick the consent box to take part in the prize draw.',
    'on.title': 'ONLINE DEMO',
    'on.hint': 'No registration needed. What name should we show on the high score list?',
    'on.nick': 'Nickname', 'on.guest': 'GUEST',
    'on.back': 'BACK', 'on.go': 'LET\'S GO!',
    'on.privacy': 'Your points are stored only on this device. No data is transmitted.',

    'adm.title': 'ADMIN · PROFESSOR VACUUMUS',
    'adm.pin': 'PIN', 'adm.open': 'OPEN', 'adm.back': 'ESC · BACK', 'adm.wrongPin': 'Wrong PIN.',
    'adm.noStorage': 'Warning: browser storage is not available – data will be lost when closing! Please export regularly.',
    'adm.overview': 'Overview',
    'adm.stats': 'Today: <b>{0}</b> players, <b>{1}</b> rounds · Total: <b>{2}</b> leads, <b>{3}</b> rounds',
    'adm.top3day': 'Top 3 today (daily prize)', 'adm.top3all': 'Top 3 whole show',
    'adm.export': 'Export &amp; backup',
    'adm.csvLeads': 'Leads (CSV/Excel)', 'adm.csvRounds': 'All rounds (CSV/Excel)',
    'adm.backup': 'Save backup (JSON)', 'adm.restore': 'Load backup', 'adm.reference': 'Load reference data (test)',
    'adm.exportHint': 'Files go to the Downloads folder. Tip: export at the end of every show day.',
    'adm.exportFallback': 'if no download started (e.g. in the online preview): copy the content and paste it into Excel or a text file.',
    'adm.copy': 'Copy content', 'adm.copied': 'Copied (otherwise select + Ctrl+C)', 'adm.hide': 'Hide',
    'adm.settings': 'Settings', 'adm.version': 'Version {0}',
    'adm.eventName': 'Show name', 'adm.roundSeconds': 'Round time (sec.)', 'adm.adminPin': 'Admin PIN',
    'adm.prizeDay': 'Daily prize', 'adm.prizeMain': 'Main prize (whole show)', 'adm.prizeEmpty': 'empty = not shown',
    'adm.defaultLang': 'Device language (preselects country and language)', 'adm.adminLang': 'Admin language',
    'adm.save': 'Save',
    'adm.recent': 'Latest rounds',
    'adm.colTime': 'Time', 'adm.colName': 'Name', 'adm.colCompany': 'Company', 'adm.colEmail': 'Email', 'adm.colScore': 'Score',
    'adm.colCountry': 'Country', 'adm.colLang': 'Language',
    'adm.noRounds': 'No rounds yet.',
    'adm.pad': 'Controller / joystick',
    'adm.danger': 'Danger zone', 'adm.wipeLabel': 'Type DELETE to delete', 'adm.wipeWord': 'DELETE', 'adm.wipe': 'Delete all data',
    'adm.fullscreen': 'Full screen on/off', 'adm.soundOn': 'Sound on', 'adm.soundOff': 'Sound off', 'adm.close': 'Close (ESC)',
    'adm.sure': 'Sure? Click again',
    'adm.n.roundDeleted': 'Round deleted.', 'adm.n.saved': 'Settings saved.',
    'adm.n.restored': 'Backup loaded: {0} new leads, {1} new rounds.', 'adm.n.error': 'Error: {0}',
    'adm.n.leads': 'Leads exported.', 'adm.n.rounds': 'Rounds exported.', 'adm.n.backup': 'Backup created.',
    'adm.n.reference': 'Reference data loaded: {0} new leads, {1} new rounds. Remove with “Delete all data” before the show!',
    'adm.n.wiped': 'All data deleted.', 'adm.n.notWiped': 'Not deleted: please type DELETE into the field first.',
    'adm.n.padSaved': 'Controller saved: {0}', 'adm.n.padCancel': 'Setup cancelled.', 'adm.n.padReset': 'Default mapping restored.',
    'adm.padNone': 'No controller found. Plug it in and press a button, then', 'adm.padRefresh': 'Search again',
    'adm.padFound': 'Found: <b>{0}</b> · Mapping: {1}', 'adm.padCustom': 'custom', 'adm.padDefault': 'default',
    'adm.padPress': 'Now press on the controller: {0}', 'adm.padOf': '({0} of {1})', 'adm.padCancel': 'Cancel',
    'adm.padSetup': 'Set up controller', 'adm.padReset': 'Restore default',
    'adm.padHelp': 'Needed if jump/suck are on the wrong buttons (e.g. on arcade machines). Walking always works with the stick or D-pad.',
    'adm.padButton': 'button {0}',
    'adm.step.jump': 'JUMP', 'adm.step.suck': 'SUCK', 'adm.step.sprint': 'SPRINT', 'adm.step.start': 'START / PAUSE',
    'adm.badBackup': 'Not a valid backup file.',
    'csv.dateTime': 'Date/time', 'csv.day': 'Day', 'csv.event': 'Show', 'csv.firstName': 'First name', 'csv.lastName': 'Last name',
    'csv.company': 'Company', 'csv.email': 'Email', 'csv.consent': 'Consent', 'csv.newsletter': 'Newsletter',
    'csv.country': 'Country', 'csv.lang': 'Language',
    'csv.score': 'Score', 'csv.base': 'Base points', 'csv.timeBonus': 'Time bonus', 'csv.medalBonus': 'Medal bonus',
    'csv.medals': 'Medals', 'csv.finished': 'Lab saved', 'csv.captures': 'Sucked up', 'csv.pump': 'Best pump',
    'csv.best': 'Best score', 'csv.rankAll': 'Overall rank', 'csv.rounds': 'Number of rounds', 'csv.first': 'First played',
    'csv.yes': 'yes', 'csv.no': 'no'
  },

  // -------------------------------------------------------------------
  // FRANZÖSISCH: Entwurf, vom Marketing zu prüfen (Admin-Bereich bleibt Deutsch/Englisch)
  fr: {
    'title.sub': 'ASPIRE LE CHAOS DU LABO!',
    'title.start': 'ENTRÉE = JOUER', 'title.start.touch': 'TOUCHER = JOUER',
    'title.board': 'B = CLASSEMENT', 'title.board.touch': 'CLASSEMENT',
    'title.leader': 'EN TÊTE AUJOURD\'HUI:',
    'title.prize': 'À GAGNER: {0}',
    'board.title': 'CLASSEMENT',
    'board.today': 'AUJOURD\'HUI',
    'board.all': 'TOTAL · {0}',
    'board.prize': 'PRIX: {0}',
    'board.empty': 'PAS ENCORE DE SCORES.\nSOIS LE PREMIER!',
    'board.back': 'B / ÉCHAP = RETOUR    ENTRÉE = JOUER', 'board.back.touch': 'TOUCHER = RETOUR',
    'board.thanks': 'MERCI D\'AVOIR JOUÉ!  ENTRÉE = SUITE', 'board.thanks.touch': 'MERCI D\'AVOIR JOUÉ!  TOUCHER = SUITE',
    'player': 'JOUEUR',

    'country.title': 'PAYS ET LANGUE',
    'country.hint': '← → PAYS   ↑ ↓ LANGUE   ENTRÉE = OK',
    'country.hint.touch': 'CHOISIS LA LANGUE, PUIS TOUCHE UN DRAPEAU',

    'howto.title': 'COMMENT JOUER',
    'howto.walk': 'MARCHER', 'howto.jump': 'SAUTER', 'howto.duck': 'SE BAISSER',
    'howto.suck': 'ASPIRER', 'howto.hold': 'MAINTENIR', 'howto.pause': 'PAUSE',
    'howto.sprint': 'SPRINTER', 'howto.pad': 'COMPATIBLE',
    'key.space': 'ESPACE', 'key.shift': 'MAJ/CTRL', 'key.pad': 'MANETTE',
    'howto.limits': 'ASPI + SPRINT LIMITÉS: SURVEILLE LES JAUGES!',
    'howto.blocks': 'SAUTE SOUS LES BLOCS BALLONS:',
    'howto.pumps': 'POMPES',
    'howto.ppe': 'PROTECTIONS',
    'howto.goal': 'ASPIRE UN MAX DE CHAOS EN {0} SEC!',
    'howto.start': 'ENTRÉE = JOUER', 'howto.start.touch': 'TOUCHER = JOUER',

    'touch.jump': 'SAUT', 'touch.suck': 'ASPIRER',
    'touch.rotate': 'TOURNE L\'APPAREIL À L\'HORIZONTALE',
    'pad.connected': 'MANETTE CONNECTÉE',
    'a2hs': '📲 Pour le plein écran: touche <b>Partager</b> en bas et choisis <b>« Sur l’écran d’accueil »</b>.',

    'hud.points': 'POINTS {0}',
    'hud.time': 'TEMPS {0}',
    'hud.noPump': 'PAS DE POMPE',
    'hud.bvc': 'BVC PROFESSIONAL',
    'hud.sec': '{0} S',
    'hud.sog': 'ASPI', 'hud.heat': 'CHAUD', 'hud.sprint': 'SPRINT',
    'combo': 'COMBO', 'combo.lost': 'FINI',
    'boss': 'PIEUVRE À VAPEUR',
    'exit': 'SORTIE',

    'go': 'PARTEZ!',
    'timeup': 'TEMPS ÉCOULÉ!',
    'finish': 'RÉUSSI!',
    'finish.bonus': 'TEMPS RESTANT {0} SEC = BONUS!',
    'pause': 'PAUSE',
    'pause.hint': 'ÉCHAP / START = CONTINUER\nENTRÉE = ARRÊTER LA PARTIE', 'pause.hint.touch': 'TOUCHER = CONTINUER',
    'plusSec': '+{0} SEC', 'minusSec': '-{0} SEC',
    'ouch': 'AÏE!',

    'msg.zone': 'ZONE {0}: {1}',
    'msg.locked': 'ASPIRE D\'ABORD LA PIEUVRE À VAPEUR!',
    'msg.bvcLeave': 'LA BVC RESTE AU LABO DE CULTURE CELLULAIRE - CONTINUE AVEC LA POMPE!',
    'msg.bvcLeave0': 'LA BVC RESTE AU LABO DE CULTURE CELLULAIRE!',
    'msg.noPump': 'PAS DE POMPE! SAUTE SOUS LE BLOC BALLON!',
    'msg.overheat': 'SURCHAUFFE! LAISSE REFROIDIR UN PEU...',
    'msg.heavy': 'TROP LOURD! IL TE FAUT UNE POMPE PLUS PUISSANTE!',
    'msg.almost': 'TU Y ES PRESQUE!',
    'msg.krakeStrong': 'LA PIEUVRE EST TROP FORTE! PRENDS LA VACUU·PURE 10C!',
    'msg.shoes': 'AVEC DES CHAUSSURES DE SÉCURITÉ, TU POURRAIS LES ÉCRASER!',
    'msg.pumpLost': 'OH NON, LA POMPE A DISPARU! PROCHAIN BLOC BALLON...',
    'msg.boss': 'LA PIEUVRE À VAPEUR! ASPIRE-LA!',

    'zone.0': 'LABO DE FILTRATION', 'zone.1': 'LABO DE CULTURE CELLULAIRE', 'zone.2': 'LABO D\'ÉVAPORATION',
    'zone.3': 'LABO DE CHIMIE', 'zone.4': 'HALL DE VIDE POUSSÉ',
    'pit.0': 'TOMBÉ DANS LE BAC À FILTRAT!',
    'pit.1': 'TOMBÉ DANS LE BAIN DÉSINFECTANT!',
    'pit.2': 'TOMBÉ DANS LE BAC DE RÉTENTION À SOLVANTS!',
    'pit.3': 'TOMBÉ DANS LE BAC DE RÉTENTION À ACIDES!',
    'pit.4': 'TOMBÉ DANS L\'AZOTE LIQUIDE!',

    'sign.1': 'SAUTE SOUS\nLE BLOC BALLON!',
    'sign.2': 'MAINTIENS ESPACE\n= ASPIRER!', 'sign.2.touch': 'MAINTIENS LE BOUTON\nASPIRER!',
    'sign.3': 'ME 1C: IDÉALE POUR\nLA FILTRATION',
    'sign.4': 'LABO DE CULTURE CELLULAIRE:\nPRENDS LA BVC!',
    'sign.5': 'PC 3001 VARIO SELECT:\nIDÉAL POUR LE ROTAVAP',
    'sign.6': 'LABO DE CHIMIE:\nMD 4C VARIO SELECT',
    'sign.7': 'VACUU·PURE 10C:\nIDÉALE POUR LE SÉCHAGE SANS HUILE',
    'sign.8': 'ATTENTION:\nPIEUVRE À VAPEUR!',

    'pump.1.title': 'POMPE À MEMBRANE ME 1C', 'pump.1.slogan': 'IDÉALE POUR LA FILTRATION',
    'pump.2.title': 'PC 3001 VARIO SELECT', 'pump.2.slogan': 'ROTAVAP · CONCENTRATEUR SOUS VIDE · ÉTUVE\nPLUS D\'ASPIRATION: MÊME LES BALLONS!',
    'pump.3.title': 'MD 4C VARIO SELECT', 'pump.3.slogan': 'RÉSISTANTE À LA CHIMIE: DISTILLATION · SÉCHAGE\nVACUU·SELECT RÈGLE TOUT SEUL!',
    'pump.4.title': 'VACUU·PURE 10C', 'pump.4.slogan': 'SANS HUILE: LYOPHILISATION · SCHLENK · TURBO\nASPIRATION MAXIMALE!',
    'banner.bvc.title': 'POMPE BVC PROFESSIONAL', 'banner.bvc.sub': 'AVEC VHC: ASPIRATION DE LIQUIDES\nPOINTS ×2',
    'banner.view.title': 'VACUU·VIEW EXTENDED', 'banner.view.sub': 'VIDE TEMPOREL: +{0} SECONDES!',
    'banner.full.title': 'PROTECTION TOTALE!', 'banner.full.sub': 'ÉQUIPEMENT DE PROTECTION COMPLET:\nPLUS RIEN NE PEUT T\'ARRIVER!',
    'banner.saved.title': 'LABO SAUVÉ!', 'banner.saved.sub': 'VITE, VERS LA SORTIE →\nLE TEMPS RESTANT DONNE DES BONUS!',
    'ppe.goggles.name': 'LUNETTES DE PROTECTION', 'ppe.goggles.text': 'UN CHOC NE COÛTE PLUS QUE 1 SECONDE.',
    'ppe.gloves.name': 'GANTS', 'ppe.gloves.text': 'LA JAUGE D\'ASPIRATION SE RECHARGE 2× PLUS VITE.',
    'ppe.helmet.name': 'CASQUE', 'ppe.helmet.text': 'ÉLIMINE LES ENNEMIS PAR EN DESSOUS!',
    'ppe.shoes.name': 'CHAUSSURES DE SÉCURITÉ', 'ppe.shoes.text': 'SAUTER SUR LES ENNEMIS LES DÉTRUIT!',

    'enemy.MEOH': 'MÉTHANOL', 'enemy.ETOH': 'ÉTHANOL',

    'res.saved': 'LABO SAUVÉ!', 'res.timeup': 'TEMPS ÉCOULÉ!',
    'res.captures': 'ASPIRÉS', 'res.pump': 'POMPE', 'res.ppe': 'PROTECTION', 'res.combo': 'MEILLEUR COMBO',
    'res.points': 'POINTS', 'res.timebonus': 'BONUS TEMPS', 'res.medals': 'MÉDAILLES', 'res.total': 'TOTAL',
    'res.test': 'PARTIE TEST - PAS DANS LE CLASSEMENT',
    'res.rank': '{0}E AUJOURD\'HUI  ·  {1}E AU TOTAL',
    'res.best': 'TON RECORD: {0}',
    'res.dayBest': '★ RECORD DU JOUR! ★',
    'res.next': 'ENTRÉE = CLASSEMENT', 'res.next.touch': 'TOUCHER = CLASSEMENT',
    'medal.boss': 'PIEUVRE VAINCUE', 'medal.ppe': 'PROTECTION MAX', 'medal.nohit': 'INDEMNE',
    'medal.pump': 'POMPE ULTIME', 'medal.combo': 'PRO DU COMBO', 'medal.view': 'MAÎTRE DU TEMPS',

    'contact.title': 'CONTACT',
    'contact.aim': 'VISE LE CODE AVEC\nL\'APPAREIL PHOTO:',
    'contact.line': 'TA LIGNE DIRECTE\nVERS VACUUBRAND.',
    'contact.next': 'ENTRÉE = SUITE', 'contact.next.touch': 'TOUCHER = SUITE',

    'reg.title': 'INSCRIPTION DU JOUEUR',
    'reg.intro': 'Seuls le prénom et la première lettre du nom apparaissent dans le classement.',
    'reg.firstName': 'Prénom', 'reg.lastName': 'Nom', 'reg.company': 'Entreprise', 'reg.email': 'E-mail',
    // Texte juridique : projet, à faire vérifier par le service juridique / la protection des données pour la France
    'reg.consent': 'J\'accepte que VACUUBRAND me contacte dans le cadre du jeu-concours et pour des informations sur les produits.',
    'reg.newsletter': 'Oui, je souhaite aussi recevoir la newsletter VACUUBRAND.',
    'reg.privacy': 'Les données sont enregistrées uniquement sur cet appareil et utilisées exclusivement pour le jeu-concours et la prise de contact.',
    'reg.back': 'ÉCHAP · RETOUR', 'reg.go': 'ENTRÉE · C\'EST PARTI!',
    'reg.err.fill': 'Merci de remplir: {0}',
    'reg.err.invalid': '{0} (non valide)',
    'reg.err.consent': 'Merci de cocher le consentement pour participer au jeu-concours.',
    'on.title': 'DÉMO EN LIGNE',
    'on.hint': 'Pas d\'inscription nécessaire. Quel nom afficher dans le classement?',
    'on.nick': 'Pseudo', 'on.guest': 'INVITÉ',
    'on.back': 'RETOUR', 'on.go': 'C\'EST PARTI!',
    'on.privacy': 'Tes points sont enregistrés uniquement sur cet appareil. Aucune donnée n\'est transmise.'
  }
};

// Text in der aktuellen Spielsprache. Fehlt er, kommt Deutsch. Platzhalter {0}, {1} ... werden ersetzt.
function L(key, ...args) { return fmtText(textIn(I18N.lang, key), args); }
// Text in der Admin-Sprache (nur de/en)
function LA(key, ...args) { return fmtText(textIn(I18N.adminLang, key), args); }
// Gibt es diesen Schlüssel?
function hasL(key) { return key in I18N.de || key in (I18N[I18N.lang] || {}); }
// Touch-Variante (Schlüssel + ".touch"), falls vorhanden und Touch aktiv
function LT(key, ...args) { return L(Input.touch && hasL(key + '.touch') ? key + '.touch' : key, ...args); }

function textIn(lang, key) {
  const d = I18N[lang];
  if (d && key in d) return d[key];
  if (key in I18N.de) return I18N.de[key];
  return key;
}
function fmtText(s, args) {
  return args.length ? String(s).replace(/\{(\d+)\}/g, (m, i) => (args[i] !== undefined ? args[i] : m)) : s;
}

// Spielsprache umschalten (de / en / fr)
function setLang(code) {
  if (!I18N.langs.includes(code)) code = 'de';
  const changed = I18N.lang !== code;
  I18N.lang = code;
  document.documentElement.lang = code;
  if (changed && typeof Touch !== 'undefined' && Touch.relabel) Touch.relabel();
}

// Gerätesprache: Messe = Einstellung im Admin (defaultLang). Online = Sprache des Browsers, falls de/en/fr.
function deviceLang() {
  if (CONFIG.mode === 'online') {
    const list = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || ''];
    for (const l of list) {
      const c = String(l).slice(0, 2).toLowerCase();
      if (I18N.langs.includes(c)) return c;
    }
  }
  return I18N.langs.includes(CONFIG.defaultLang) ? CONFIG.defaultLang : 'de';
}

// Land nach Schlüssel (CH, DE, UK, FR); null, wenn unbekannt
function countryByKey(key) { return (CONFIG.countries || []).find(c => c.key === key) || null; }
// Link für den QR-Code: Link des Landes, sonst der allgemeine contactUrl
function contactUrlFor(key) {
  const c = countryByKey(key);
  return (c && c.contactUrl) || CONFIG.contactUrl;
}
