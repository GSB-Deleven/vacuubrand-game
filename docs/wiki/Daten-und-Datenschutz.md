# 🔒 Daten und Datenschutz

- Alle Daten bleiben **lokal im Browser** des Geräts (localStorage). Es wird nichts ins Internet übertragen, es gibt keinen Server.
- **Messe-Version:** Vorname, Name, Firma, E-Mail, Einwilligung (Pflicht), Newsletter (freiwillig), dazu die Spielrunden.
- **Online-Demo:** nur ein Spitzname, bleibt auf dem Gerät des Spielers.
- **Messe-Version mit Schalter „Nur Spitzname“** (Admin, für Anlässe ohne Leads): nur ein Spitzname, keine Kontaktdaten, keine Einwilligung. Spitznamen erscheinen nicht im Leads-Export.
- Öffentlich angezeigt wird nur „Vorname N.“.
- Nach der Messe: Admin → **Alle Daten löschen**.
- Die Texte der Einwilligung stehen in `js/i18n.js` (Deutsch, Englisch, Französisch) und werden mit dem Datenschutz abgestimmt; Englisch und Französisch brauchen die Freigabe für UK/Irland und Frankreich (siehe Issue „Einwilligung und Datenschutzhinweis“).
- Das Repository ist öffentlich: **keine echten Personendaten** hochladen, Beispieldaten nur mit erfundenen Namen.

Datenmodell und CSV-Spalten: [TECHNIK.md](https://github.com/GSB-Deleven/vacuubrand-game/blob/main/TECHNIK.md#-daten-bestenliste-und-export)
