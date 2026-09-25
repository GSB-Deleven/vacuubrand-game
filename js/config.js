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

  hitTimePenalty: 3,           // Sekunden Abzug bei Treffer
  fallTimePenalty: 3,          // Sekunden Abzug beim Runterfallen
  timeBonusPerSecond: 50,      // Punkte pro Restsekunde, wenn das Labor gerettet wurde
  finishBonus: 1000,           // Bonus fürs Erreichen des Ausgangs
  comboWindow: 1.2,            // Sekunden für Combo-Serien
  bossHp: 200,                 // wie lange (Frames) man die Dampf-Krake saugen muss

  attractSwitchSeconds: 9,     // Titelbild <-> Bestenliste wechseln
  resultAutoReturnSeconds: 25, // Ergebnis-Bildschirm schliesst automatisch
  boardAutoReturnSeconds: 20,
  registrationTimeoutSeconds: 90,
  leaderboardSize: 10,

  // Die Pumpen: 1 = Start-Pumpe, 3 = stärkste. power = maximales Gewicht, das eingesaugt werden kann.
  pumps: [
    null,
    { short: 'ME 1', title: 'MEMBRANPUMPE ME 1', slogan: 'KLEIN, ABER OHO!\nSAUGT TROPFEN, STAUB & DAMPF.', range: 46, power: 1, pull: 1.6 },
    { short: 'PC 3001', title: 'PC 3001 VARIO SELECT', slogan: 'DER BESTSELLER!\nJETZT SAUGST DU AUCH GLASWARE.', range: 72, power: 2, pull: 2.4 },
    { short: 'VACUU·PURE', title: 'VACUU·PURE', slogan: 'MAXIMALE SAUGKRAFT!\nNICHTS IST DIR ZU SCHWER.', range: 104, power: 3, pull: 3.4 }
  ],

  // Anmeldung vor dem Spiel (Lead-Erfassung)
  registration: {
    intro: 'Nur Vorname + erster Buchstabe des Nachnamens erscheinen in der Bestenliste.',
    fields: [
      { key: 'firstName', label: 'Vorname', required: true, maxLength: 40 },
      { key: 'lastName', label: 'Name', required: true, maxLength: 40 },
      { key: 'company', label: 'Firma', required: true, maxLength: 60 },
      { key: 'email', label: 'E-Mail', required: true, type: 'email', maxLength: 80 }
    ],
    consentRequired: true,
    consentText: 'Ich bin einverstanden, dass VACUUBRAND mich im Rahmen des Gewinnspiels und zu Produktinformationen kontaktiert.',
    newsletterText: 'Ja, ich möchte zusätzlich den VACUUBRAND Newsletter erhalten.',
    privacyNote: 'Die Daten werden nur lokal auf diesem Gerät gespeichert und ausschliesslich für das Gewinnspiel und die Kontaktaufnahme verwendet.'
  }
};
