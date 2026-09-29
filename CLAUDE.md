# Hinweise für Claude (und alle, die am Spiel arbeiten)

Professor Vakuumus ist ein offline-fähiges Browsergame für VACUUBRAND-Messestände (Jump'n'Run im Pixel-Stil).
Auftraggeber ist David (VACUUBRAND Schweiz, Labor, kein Programmierer): Antworten und Issue-Kommentare auf **Deutsch (Schweiz, ss statt ß)**, einfach erklärt, ohne Fachjargon. Keine Gedankenstriche in Texten für David.

Diese Datei fasst den bisherigen Stand und alle Entscheidungen zusammen. Neue Sitzungen sollen hier einsteigen, statt den alten Chat zu brauchen.

## Regeln
- **Fachlich korrekt:** Vakuumpumpen pumpen nur Gase und Dämpfe, nie Flüssigkeiten oder Feststoffe. Ausnahme: BVC professional saugt Flüssigkeiten und Dämpfe (Medienabsaugung), im Spiel darf sie alles einsaugen. Produktnamen exakt: ME 1C, BVC professional, PC 3001 VARIO select, MD 4C VARIO select, VACUU·SELECT, VACUU·PURE 10C, VACUU·LAN, VACUU·VIEW extended.
- **Keine echten Personendaten** ins Repo (Namen, E-Mails, Firmen von echten Leuten). Das Repo ist öffentlich. Beispieldaten nur mit erfundenen Personen und `@example.com`. (Die Git-Historie wurde deswegen schon einmal bereinigt.)
- **Keine Frameworks, keine Build-Schritte, keine ES-Module.** Das Spiel muss per Doppelklick auf `index.html` (file://) laufen. Einzige fremde Bibliothek: `js/lib/qrcode.js` (MIT). Neue Skripte in `index.html` in der richtigen Reihenfolge eintragen **und** in `sw.js` (FILES) ergänzen. **Bei jeder Änderung an Spieldateien `VERSION` in `sw.js` erhöhen**, sonst behalten installierte Tablets die alte Version.
- **Spieltexte:** nur Grossbuchstaben (Pixelschrift), ca. 50 Zeichen pro Zeile, Schilder und Banner max. 2 Zeilen. Unbekannte Zeichen (z. B. ₂, ⚠) zeigt die Schrift nicht an. Alle Texte mit Nummern stehen in `TEXTE.md`; neue Texte dort eintragen.
- **Texte gehören dem Marketing:** Texte nicht eigenmächtig umformulieren. Vorschläge in `TEXTE.md`, Umsetzung erst nach Freigabe (Issue „Spieltexte durch das Marketing prüfen lassen“).
- **Nicht gewünscht** (von David abgelehnt): Geister, SPE-Kartuschen, Konzentrator-Röhrchen, Fässer, rote Wangen, 16-Bit-Schattierung am Professor, seitliche Haarbüschel, grosses Professor-Porträt auf dem Titel, Zittern/Blinken auf dem Startbildschirm, automatisches Umschalten der Bestenliste, Quiz (zurückgestellt).
- Einstellungen gehören nach `js/config.js`, gut kommentiert.
- Start-Dateien für Windows (`▶ START Windows.bat`), Mac (`▶ START Mac.command`) und Linux/Pi (`▶ START Linux + Raspberry Pi.sh`, `raspberry-pi/`) aktuell halten. Zielplattformen: Windows, Mac, iPad, iPhone, Android, Raspberry Pi (Arcade), Joystick/Gamepad.
- Zwei Betriebsarten (`CONFIG.mode`): `messe` (Anmeldung mit Lead-Erfassung, Admin) und `online` (GitHub Pages, nur Spitzname). Änderungen in beiden prüfen, dazu Tastatur, Gamepad und Touch.
- Farben wie die VACUUBRAND-Website: Navy `#46648c`, Gold `#f9b000`, Blau `#4f8fcf` (`THEME` in `js/sprites.js`).

## Aufbau
Siehe `TECHNIK.md` (Dateien, Mechanik, Datenformat, Kochrezepte), `ANLEITUNG.md` (Standpersonal), `README.md` (Pitch fürs Management), `TEXTE.md` (alle Texte), `raspberry-pi/README.md` und `docs/wiki/` (Wiki-Seiten).

## Aktueller Spielstand (Kurzfassung)
- **Ablauf:** Titel → Anmeldung (messe: Vorname, Name, Firma, E-Mail, Einwilligung, Newsletter / online: Spitzname) → Anleitung → Runde (120 s) → Ergebnis mit Medaillen → Kontakt-Seite mit grossem QR-Code → Bestenliste (heute / ganze Messe, öffentlich nur „Vorname N.“).
- **5 Zonen, 330 Kacheln:** Filtrationslabor (ME 1C), Zellkultur-Labor (BVC professional mit VHC, saugt dort alles, ×2 Punkte), Verdampfer-Labor (PC 3001 VARIO select), Chemielabor (MD 4C VARIO select), Hochvakuum-Technikum (VACUU·PURE 10C, Endgegner Dampf-Krake, nur mit Pumpe Stufe 4). Abgründe sind Auffangwannen.
- **Extras:** Schutzausrüstung (Brille, Handschuhe, Helm, Schuhe), VACUU·VIEW extended (+10 s), VACUU·LAN-Plattformen, Combo bis ×8 mit Timer-Kasten, 6 Medaillen, Zeitleiste, Musik pro Zone, Preis-Anzeige (Admin), Kontakt-QR (`contactUrl`).
- **Steuerung:** Tastatur, Gamepad, Joystick (inkl. Hat-Steuerkreuz), Touch-Tasten, eigene Knopfbelegung im Admin („Controller einrichten“).
- **Admin:** Strg+Shift+A (Tablet: 3 s aufs Logo), PIN 1234. Export CSV/JSON, Preise, Messename, Rundenzeit, Controller. Schnellstart ohne Speicherung: Strg+Shift+Enter.
- **Online:** https://gsb-deleven.github.io/vacuubrand-game/ (Pages: „Deploy from a branch“, `main`, Root; `.nojekyll`). Mit `?messe` volle Stand-Version (z. B. Tablet). PWA mit Offline-Cache.

## Arbeitsweise
- Arbeits-Branch `claude/vakuum-browsergame-concept-ir16iu`; nach jedem gemergten PR neu auf `origin/main` aufsetzen. Änderungen per PR nach `main`; David möchte, dass Claude nach erfolgreichem Test selbst mergt. PRs nicht beobachten (keine Abos).
- Vor dem PR testen: Playwright (Chromium unter `/opt/pw-browsers`) mit Screenshots, Konsole ohne Fehler. Bewährte Checks: Bot-Durchlauf, Erreichbarkeit aller Blöcke/Gegner, Touch (iPad/iPhone-Emulation), Gamepad-Stubs, QR mit jsQR aus Screenshots dekodieren.
- Echte Geräte (iPhone, Mac, Raspberry Pi, Arcade-Joystick) kann Claude nicht testen: ehrlich sagen und Test-Issues nutzen.
- Das Artifact auf claude.ai wird nicht mehr gepflegt; Testen läuft über GitHub Pages.

### Bei Issues
1. Kurz im Issue bestätigen, was umgesetzt wird.
2. Auf eigenem Branch umsetzen, im Browser testen (Konsole ohne Fehler), Pull Request mit „Schliesst #Nr.“ öffnen.
3. Bei fachlichen oder Marketing-Fragen (Produktaussagen, Texte, Datenschutz) nicht raten, sondern im Issue nachfragen.

## GitHub-Organisation
- **Epics mit Sub-Issues:** #2 Messe-bereit, #3 GitHub einrichten, #4 Ideen-Backlog.
- **Automatik:** `.github/workflows/claude.yml` reagiert auf `@claude` oder Label `claude` (braucht Secret `CLAUDE_CODE_OAUTH_TOKEN` oder `ANTHROPIC_API_KEY`, siehe #14). Vorlagen für Issues, Discussions und PRs liegen in `.github/`.
- **Offen bei David (nur im Browser möglich):**
  - Default-Branch auf `main` stellen (#11)
  - Milestones und Project-Board anlegen (#12); danach Issues den Milestones zuordnen
  - Discussions-Kategorien und Willkommens-Beitrag (#13, Text in `docs/discussions-willkommen.md`)
  - Secret für die Claude-Automatik (#14)
  - Erste Wiki-Seite anlegen (#15); danach `docs/wiki/*.md` ins Wiki übertragen (Claude)
- **Offen fachlich/Tests:** Texte durchs Marketing (#6), Datenschutz (#7), Preise (#8), PIN/Personal (#5), Hardware (#9), Tablet (#10), iPhone (#27), Raspberry Pi (#28), Arcade-Joystick (#29), QR-Code mit echtem iPhone bestätigen.
