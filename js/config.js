'use strict';
// =====================================================================
//  EINSTELLUNGEN – hier kann man das Spiel anpassen, ohne Programmierwissen.
//  Texte in Anführungszeichen ändern, Zahlen anpassen, Datei speichern,
//  Browser neu laden (F5). Messename, Rundenzeit und PIN gehen auch im
//  Admin-Bereich (Strg + Shift + A).
// =====================================================================
const CONFIG = {
  eventName: 'MESSE 2026',     // erscheint auf dem Titelbildschirm
  roundSeconds: 120,           // Länge einer Spielrunde in Sekunden
  adminPin: '1234',            // PIN für den Admin-Bereich – bitte ändern!
  prizeDay: '',                // Tagespreis, wird auf Startbildschirm und Bestenliste angezeigt (leer = keine Anzeige)
  prizeMain: '',               // Hauptpreis der ganzen Messe (leer = keine Anzeige)
  // Produkt-Einblendungen unten im Bild beim Einsammeln einer Pumpe, der BVC oder von VACUU·VIEW
  // (Produktname + Werbetext). Aus, bis das Marketing die Texte freigegeben hat (siehe TEXTE.md).
  // true = einschalten. Schutzausrüstung und "LABOR GERETTET!" erscheinen immer.
  productBanners: false,
  // Allgemeiner Link für den QR-Code am Ende der Runde, wenn kein Land gewählt wurde (z. B. beim Schnellstart
  // ohne Länderwahl) oder ein Land keinen eigenen Link hat. Zeigt die Ansprechpartner weltweit (alle Länder,
  // Seite auf Englisch). Bild zum Weiterschicken: qr/QR_ALLE.png (nach einer Änderung neu erzeugen, siehe TECHNIK.md).
  contactUrl: 'https://www.vacuubrand.com/service-advice/contact/contacts-worldwide',

  // Gerätesprache: 'de', 'en' oder 'fr'. Auch im Admin einstellbar. Sie bestimmt, welches Land und welche
  // Sprache in der Länderwahl vorgewählt sind, und gilt beim Schnellstart.
  // Online gilt die Sprache des Browsers (falls Deutsch, Englisch oder Französisch). Alle Texte: js/i18n.js.
  defaultLang: 'de',
  // Sprache des Startbildschirms (mit Bestenliste vom Titel aus). 'en' = Englisch für alle, damit der Titel
  // an jeder Messe passt. Leer ('') = Gerätesprache. Ab der Länderwahl gilt die Sprache des Spielers.
  titleLang: 'en',
  adminLang: 'de',             // Sprache des Admin-Bereichs: 'de' oder 'en' (auch im Admin einstellbar)

  // Länder für die Wahl vor jeder Runde (Flaggen in dieser Reihenfolge).
  //  key        = Kürzel (steht auch im Export)
  //  name       = Anzeige unter der Flagge (Grossbuchstaben; " / " wird zu zwei Zeilen)
  //  lang       = Sprache, die beim Antippen der Flagge vorgewählt wird
  //  contactUrl = Link im QR-Code am Ende der Runde (Ansprechpartner dieses Landes). Hier austauschen.
  //  Prüfen: qr/index.html zeigt alle QR-Codes mit Link.
  countries: [
    { key: 'CH', name: 'SCHWEIZ / SUISSE', lang: 'de',
      contactUrl: 'https://www.vacuubrand.com/ch/de/service-beratung/kontakt/ansprechpartner-weltweit/ch' },
    { key: 'DE', name: 'DEUTSCHLAND', lang: 'de',
      contactUrl: 'https://www.vacuubrand.com/ch/de/service-beratung/kontakt/ansprechpartner-weltweit/de' },
    // UK: Kürzel /gb (nicht /uk). Englische Seite, zeigt die Ansprechpartner für UK und Irland
    { key: 'UK', name: 'UK / IRELAND', lang: 'en',
      contactUrl: 'https://www.vacuubrand.com/ch/en/service-advice/contact/contacts-worldwide/gb' },
    { key: 'FR', name: 'FRANCE', lang: 'fr',
      contactUrl: 'https://www.vacuubrand.com/ch/fr/services-et-conseils/contact/contacts-dans-le-monde-entier/fr' }
  ],
  countrySelectSeconds: 60,    // ohne Eingabe zurück zum Titel

  hitTimePenalty: 3,           // Sekunden Abzug bei Treffer
  hitTimePenaltyGoggles: 1,    // ... mit Schutzbrille
  fallTimePenalty: 3,          // Sekunden Abzug beim Runterfallen
  timeBonusPerSecond: 50,      // Punkte pro Restsekunde, wenn das Labor gerettet wurde
  finishBonus: 1000,           // Bonus fürs Erreichen des Ausgangs
  comboWindow: 2.0,            // Sekunden für Combo-Serien (so lange hat man Zeit fürs nächste Einsaugen)
  comboMax: 8,                 // höchster Combo-Multiplikator
  bossHp: 200,                 // wie lange (Frames) man die Dampf-Krake saugen muss

  // Saug-Energie und Sprint-Ausdauer
  suckRegenSeconds: 2.5,       // so lange dauert es, bis die Saug-Energie wieder voll ist
  overheatResume: 0.3,         // nach Überhitzen erst ab 30 % wieder saugen
  sprintSeconds: 2.0,          // so lange kann man am Stück sprinten
  sprintRegenSeconds: 2.5,

  // Items
  ppeTimeBonus: 2,             // Sekunden für jedes neue Schutzausrüstungs-Teil
  ppeDuplicateTimeBonus: 1,    // Sekunden, wenn man schon alles hat
  viewTimeBonus: 10,           // VACUU·VIEW extended = "Zeitvakuum"
  bvcSeconds: 8,               // BVC gilt im ganzen Zellkultur-Labor; nur falls man sie ausserhalb erwischt: so viele Sekunden

  resultAutoReturnSeconds: 25, // Ergebnis-Bildschirm schliesst automatisch
  // Die Kontakt-Seite mit dem QR-Code bleibt stehen, bis jemand Enter drückt, tippt oder einen Knopf drückt.
  boardAutoReturnSeconds: 20,
  registrationTimeoutSeconds: 90,
  leaderboardSize: 10,

  // Medaillen am Ende der Runde (Bonuspunkte kommen zum Gesamtergebnis dazu). Namen: js/i18n.js ("medal.…")
  medals: [
    { key: 'boss', bonus: 2000 },
    { key: 'ppe', bonus: 1000 },
    { key: 'nohit', bonus: 1500 },
    { key: 'pump', bonus: 1000 },
    { key: 'combo', bonus: 1000 },
    { key: 'view', bonus: 500 }
  ],
  comboMedal: 5,               // ab dieser Combo-Stufe gibt es die Medaille COMBO-PROFI

  // Die Pumpen: 1 = Start-Pumpe, 4 = stärkste (nur sie schafft die Dampf-Krake).
  // power = maximales Gewicht, das eingesaugt werden kann; tank = Sekunden Dauersaugen
  // Titel und Slogans der Banner: js/i18n.js ("pump.1.title" usw.)
  pumps: [
    null,
    { short: 'ME 1C', range: 46, power: 1, pull: 1.6, tank: 3 },
    { short: 'PC 3001 VARIO SELECT', range: 72, power: 2, pull: 2.4, tank: 3.5 },
    { short: 'MD 4C VARIO SELECT', range: 88, power: 2, pull: 2.9, tank: 5 },
    { short: 'VACUU·PURE 10C', range: 104, power: 3, pull: 3.4, tank: 4 }
  ],

  // Schutzausrüstung aus den Kolben-Blöcken (in dieser Reihenfolge). Texte: js/i18n.js ("ppe.goggles.name" usw.)
  ppe: [
    { key: 'goggles' },
    { key: 'gloves' },
    { key: 'helmet' },
    { key: 'shoes' }
  ],

  // Anmeldung vor dem Spiel (Lead-Erfassung). Beschriftungen, Einwilligung und Datenschutz-Hinweis
  // stehen in js/i18n.js ("reg.…"), weil sie je nach Sprache anders lauten.
  registration: {
    fields: [
      { key: 'firstName', required: true, maxLength: 40 },
      { key: 'lastName', required: true, maxLength: 40 },
      { key: 'company', required: true, maxLength: 60 },
      { key: 'email', required: true, type: 'email', maxLength: 80 }
    ],
    consentRequired: true,
    newsletter: true             // Kästchen für den Newsletter anzeigen
  }
};

// Betriebsart, wird aus der Adresse erkannt:
//  'messe'  = Stand-Version mit Anmeldung, Admin und Export (Laptop per Doppelklick, oder online mit ?messe)
//  'online' = öffentliche Demo auf GitHub Pages: nur Spitzname, kein Admin, keine Kontaktdaten
CONFIG.mode = (function () {
  const q = location.search;
  if (/[?&]messe\b/i.test(q)) return 'messe';
  if (/[?&]online\b/i.test(q)) return 'online';
  return /\.github\.io$/i.test(location.hostname) ? 'online' : 'messe';
})();
