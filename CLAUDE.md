# Hinweise für Claude (und alle, die am Spiel arbeiten)

Professor Vakuumus ist ein offline-fähiges Browsergame für VACUUBRAND-Messestände (Jump'n'Run im Pixel-Stil).
Auftraggeber ist David (VACUUBRAND Schweiz, Labor, kein Programmierer): Antworten und Issue-Kommentare auf **Deutsch (Schweiz, ss statt ß)**, einfach erklärt, ohne Fachjargon. Keine Gedankenstriche in Texten für David.

Diese Datei fasst den bisherigen Stand und alle Entscheidungen zusammen. Neue Sitzungen sollen hier einsteigen, statt den alten Chat zu brauchen.

## Regeln
- **⚠ IMMER ALLE SPRACHEN (sehr wichtig, Wunsch David):** Das Spiel gibt es auf Deutsch, Englisch und Französisch (Länder CH, DE, UK/IE, FR). **Jede Änderung, jeder neue Text und jede neue Funktion wird immer in allen Sprachen umgesetzt und getestet**, nie nur auf Deutsch. Das gilt für Spieltexte, Schilder, Meldungen, Anmeldung, Einwilligung, Touch-Knöpfe, QR-Links pro Land, TEXTE.md (Spalten DE/EN/FR) und die Doku (deutsche Datei **und** englische Fassung, z. B. `ANLEITUNG.md` + `GUIDE.en.md`, `README.md` + `README.en.md`). Vor jedem PR prüfen: Fehlt irgendwo eine Sprache? Wenn eine Übersetzung unsicher ist, als Entwurf eintragen und im PR erwähnen, nie weglassen.
- **Fachlich korrekt:** Vakuumpumpen pumpen nur Gase und Dämpfe, nie Flüssigkeiten oder Feststoffe. Ausnahme: BVC professional saugt Flüssigkeiten und Dämpfe (Medienabsaugung), im Spiel darf sie alles einsaugen. Produktnamen exakt: ME 1C, BVC professional, PC 3001 VARIO select, MD 4C VARIO select, VACUU·SELECT, VACUU·PURE 10C, VACUU·LAN, VACUU·VIEW extended.
- **Keine echten Personendaten** ins Repo (Namen, E-Mails, Firmen von echten Leuten). Das Repo ist öffentlich. Beispieldaten nur mit erfundenen Personen und `@example.com`. (Die Git-Historie wurde deswegen schon einmal bereinigt.)
- **Keine Frameworks, keine Build-Schritte, keine ES-Module.** Das Spiel muss per Doppelklick auf `index.html` (file://) laufen. Einzige fremde Bibliothek: `js/lib/qrcode.js` (MIT). Neue Skripte in `index.html` in der richtigen Reihenfolge eintragen **und** in `sw.js` (FILES) ergänzen. **Bei jeder Änderung an Spieldateien `VERSION` in `sw.js` erhöhen**, sonst behalten installierte Tablets die alte Version.
- **Spieltexte:** nur Grossbuchstaben (Pixelschrift), ca. 50 Zeichen pro Zeile, Schilder und Banner max. 2 Zeilen. Unbekannte Zeichen (z. B. ₂, ⚠, « », ’) zeigt die Schrift nicht an; bekannt sind Umlaute und É È Ê Ë À Â Ç Î Ï Ô Û Ù Œ. Alle Texte mit Nummern stehen in `TEXTE.md`; neue Texte dort eintragen.
- **Mehrsprachigkeit (i18n):** Alle Texte stehen in `js/i18n.js` (de, en, fr; Admin nur de/en) und werden mit `L('schlüssel')` geholt (`LT` für Touch-Varianten, `LA` für Admin). Keine Texte direkt in den Code schreiben. **Neue Texte immer in allen 3 Sprachen in `i18n.js` und mit Nummer in `TEXTE.md`.** Deutsch bleibt wörtlich, EN/FR sind Entwürfe fürs Marketing. Vor dem PR alle Texte aller Sprachen automatisch auf Breite (`Font.width` gegen den Kasten) und fehlende Zeichen prüfen.
- **Texte gehören dem Marketing:** Texte nicht eigenmächtig umformulieren. Vorschläge in `TEXTE.md`, Umsetzung erst nach Freigabe (Issue „Spieltexte durch das Marketing prüfen lassen“).
- **Nicht gewünscht** (von David abgelehnt): Geister, SPE-Kartuschen, Konzentrator-Röhrchen, Fässer, rote Wangen, 16-Bit-Schattierung am Professor, seitliche Haarbüschel, grosses Professor-Porträt auf dem Titel, Zittern/Blinken auf dem Startbildschirm, automatisches Umschalten der Bestenliste, Quiz (zurückgestellt).
- Einstellungen gehören nach `js/config.js`, gut kommentiert.
- Start-Dateien für Windows (`▶ START Windows.bat`), Mac (`▶ START Mac.command`) und Linux/Pi (`▶ START Linux + Raspberry Pi.sh`, `raspberry-pi/`) aktuell halten. Zielplattformen: Windows, Mac, iPad, iPhone, Android, Raspberry Pi (Arcade), Joystick/Gamepad.
- Zwei Betriebsarten (`CONFIG.mode`): `messe` (Anmeldung mit Lead-Erfassung, Admin) und `online` (GitHub Pages, nur Spitzname). Änderungen in beiden prüfen, dazu Tastatur, Gamepad und Touch.
- Farben wie die VACUUBRAND-Website: Navy `#46648c`, Gold `#f9b000`, Blau `#4f8fcf` (`THEME` in `js/sprites.js`).

## Aufbau
Siehe `TECHNIK.md` (Dateien, Mechanik, Datenformat, Mehrsprachigkeit, Länder, Kochrezepte; bleibt Deutsch), `ANLEITUNG.md` / `GUIDE.en.md` (Standpersonal, deutsch/englisch, beide aktuell halten), `README.md` / `README.en.md` (Pitch fürs Management), `TEXTE.md` (alle Texte mit EN/FR), `qr/` (QR-Prüfseite), `raspberry-pi/README.md` und `docs/wiki/` (Wiki-Seiten).

## Aktueller Spielstand (Kurzfassung)
- **Ablauf:** Titel (Gerätesprache) → Land & Sprache (4 Flaggen CH, DE, UK, FR + Sprachzeile DE/EN/FR) → Anmeldung in gewählter Sprache (messe: Vorname, Name, Firma, E-Mail, Einwilligung, Newsletter / online: Spitzname) → Anleitung → Runde (120 s) → Ergebnis mit Medaillen → Kontakt-Seite mit grossem QR-Code des gewählten Landes (bleibt bis Klick) → Bestenliste (heute / ganze Messe, öffentlich nur „Vorname N.“) → Titel, wieder Gerätesprache.
- **Sprachen und Länder (Wunsch UK-Team):** `CONFIG.countries` in `js/config.js` mit `contactUrl` pro Land (CH und DE: Davids allgemeiner Link zur Ansprechpartner-Suche, UK: englische, FR: französische Fassung, genauere Links pro Land kann David nachliefern). Gerätesprache `defaultLang` und Admin-Sprache `adminLang` im Admin; online gilt die Browsersprache. Export mit Land und Sprache. Prüfseite für QR-Codes: `qr/index.html` (Bilder `qr/QR_*.png` nach Link-Änderung neu erzeugen, siehe TECHNIK.md).
- **5 Zonen, 330 Kacheln:** Filtrationslabor (ME 1C), Zellkultur-Labor (BVC professional mit VHC, saugt dort alles, ×2 Punkte), Verdampfer-Labor (PC 3001 VARIO select), Chemielabor (MD 4C VARIO select), Hochvakuum-Technikum (VACUU·PURE 10C, Endgegner Dampf-Krake, nur mit Pumpe Stufe 4). Abgründe sind Auffangwannen.
- **Extras:** Schutzausrüstung (Brille, Handschuhe, Helm, Schuhe), VACUU·VIEW extended (+10 s), VACUU·LAN-Plattformen, Combo bis ×8 mit Timer-Kasten, 6 Medaillen, Zeitleiste, Musik pro Zone, Preis-Anzeige (Admin), Kontakt-QR (`contactUrl`). Produkt-Banner beim Einsammeln vorerst aus (`productBanners`), bis Marketing die Texte freigibt.
- **Steuerung:** Tastatur, Gamepad, Joystick (inkl. Hat-Steuerkreuz), Touch (links ◀ ▶, rechts SPRUNG über SAUGEN, Naht drückt beide; kein Sprint/Ducken auf Touch), eigene Knopfbelegung im Admin („Controller einrichten“).
- **Admin:** Strg+Shift+A (Tablet: 3 s aufs Logo), PIN 1234. Export CSV/JSON, Preise, Messename, Rundenzeit, Gerätesprache, Admin-Sprache (DE/EN), Controller. Schnellstart ohne Speicherung und ohne Länderwahl: Strg+Shift+Enter.
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
  - Milestones und Project-Board anlegen (#12); danach Issues den Milestones zuordnen
  - Discussions-Kategorien und Willkommens-Beitrag (#13, Text in `docs/discussions-willkommen.md`)
  - Secret für die Claude-Automatik (#14)
  - Erste Wiki-Seite anlegen (#15); danach `docs/wiki/*.md` ins Wiki übertragen (Claude)
- **Offen fachlich/Tests:** Texte durchs Marketing (#6, jetzt auch EN/FR-Entwürfe; Einwilligung/Datenschutz für UK und FR durch Recht/Datenschutz), genauere Kontakt-Links pro Land (David), Datenschutz (#7), Preise (#8), PIN/Personal (#5), Hardware (#9), Tablet (#10), iPhone (#27), Raspberry Pi (#28), Arcade-Joystick (#29), QR-Code mit echtem iPhone bestätigen.
