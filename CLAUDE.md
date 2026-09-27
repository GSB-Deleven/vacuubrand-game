# Hinweise für Claude (und alle, die am Spiel arbeiten)

Professor Vakuumus ist ein offline-fähiges Browsergame für VACUUBRAND-Messestände (Jump'n'Run im Pixel-Stil).
Auftraggeber ist David (Labor, kein Programmierer): Antworten und Issue-Kommentare auf **Deutsch (Schweiz, ss statt ß)**, einfach erklärt, ohne Fachjargon.

## Regeln
- **Fachlich korrekt:** Vakuumpumpen pumpen nur Gase und Dämpfe, nie Flüssigkeiten oder Feststoffe. Ausnahme: BVC professional saugt Flüssigkeiten und Dämpfe (Medienabsaugung), im Spiel darf sie alles einsaugen. Produktnamen exakt: ME 1C, BVC professional, PC 3001 VARIO select, MD 4C VARIO select, VACUU·SELECT, VACUU·PURE 10C, VACUU·LAN, VACUU·VIEW extended.
- **Keine echten Personendaten** ins Repo (Namen, E-Mails, Firmen von echten Leuten). Das Repo ist öffentlich. Beispieldaten nur mit erfundenen Personen und `@example.com`.
- **Keine Frameworks, keine Build-Schritte, keine ES-Module.** Das Spiel muss per Doppelklick auf `index.html` (file://) laufen. Neue Skripte in `index.html` in der richtigen Reihenfolge eintragen **und** in `sw.js` (FILES) ergänzen, dort `VERSION` erhöhen.
- **Spieltexte:** nur Grossbuchstaben (Pixelschrift), ca. 50 Zeichen pro Zeile, Schilder und Banner max. 2 Zeilen. Unbekannte Zeichen (z. B. ₂, ⚠) zeigt die Schrift nicht an. Textliste: `TEXTE.md`.
- **Nicht gewünscht** (von David abgelehnt): Geister, SPE-Kartuschen, Konzentrator-Röhrchen, Fässer, rote Wangen, Zittern/Blinken auf dem Startbildschirm, automatisches Umschalten der Bestenliste.
- Einstellungen gehören nach `js/config.js`, gut kommentiert.
- Zwei Betriebsarten (`CONFIG.mode`): `messe` (Anmeldung mit Lead-Erfassung, Admin) und `online` (GitHub Pages, nur Spitzname). Änderungen in beiden prüfen, dazu Tastatur, Gamepad und Touch.

## Aufbau
Siehe `TECHNIK.md` (Dateien, Mechanik, Datenformat) und das Wiki.

## Arbeitsweise bei Issues
1. Kurz im Issue bestätigen, was umgesetzt wird.
2. Auf eigenem Branch umsetzen, im Browser testen (Konsole ohne Fehler), Pull Request mit „Schliesst #Nr.“ öffnen.
3. Bei fachlichen oder Marketing-Fragen (Produktaussagen, Texte, Datenschutz) nicht raten, sondern im Issue nachfragen.
