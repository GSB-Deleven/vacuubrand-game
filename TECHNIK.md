# 🛠️ Professor Vacuumus: Technisches Handbuch

Dieses Dokument erklärt, wie das Spiel aufgebaut ist, was jede Datei macht und wie man es anpasst oder erweitert. Für den Überblick fürs Management gibt es [README.md](README.md) (englisch: [README.en.md](README.en.md)), für das Standpersonal [ANLEITUNG.md](ANLEITUNG.md) (englisch: [GUIDE.en.md](GUIDE.en.md)). Alle Zahlen hier stammen direkt aus dem Code (Stand dieses Dokuments).

---

## 📋 Inhalt

1. [Technik auf einen Blick](#-technik-auf-einen-blick)
2. [Ordner und Dateien](#-ordner-und-dateien)
3. [Architektur](#-architektur)
   (darin auch: Mehrsprachigkeit, Länder und QR-Codes)
4. [Spielmechanik](#-spielmechanik)
5. [Level, Gegner und Endgegner](#%EF%B8%8F-level-gegner-und-endgegner)
6. [Steuerung](#%EF%B8%8F-steuerung)
7. [Grafik und Sound](#-grafik-und-sound)
8. [Daten, Bestenliste und Export](#-daten-bestenliste-und-export)
9. [Admin-Bereich](#-admin-bereich)
10. [Anpassen: Kochrezepte](#-anpassen-kochrezepte)
11. [Testen und Fehlersuche](#-testen-und-fehlersuche)
12. [Grenzen und Ideen](#-grenzen-und-ideen)

---

## ⚡ Technik auf einen Blick

| | |
|---|---|
| Sprache | reines HTML, CSS und JavaScript, keine Frameworks, keine Bibliotheken |
| Darstellung | HTML5 Canvas 2D, intern **320 × 180 Pixel**, pixelgenau auf Bildschirmgrösse skaliert (`image-rendering: pixelated`) |
| Takt | feste Spiellogik mit **60 Schritten pro Sekunde**, unabhängig von der Bildwiederholrate |
| Start | Doppelklick auf `index.html`. Die Skripte werden als klassische `<script>`-Tags geladen (keine ES-Module), deshalb läuft alles direkt von der Festplatte (`file://`) ohne Webserver |
| Internet | nicht nötig. Grafik, Schrift und Sound werden im Code erzeugt, nur das Logo ist eine Bilddatei |
| Speicher | `localStorage` des Browsers, also pro Browser und pro Ordner |
| Browser | Edge, Chrome, Firefox, Safari (auch iPad/iPhone und Android) |
| Grösse | ca. 5300 Zeilen Code in 16 JavaScript-Dateien (ohne Bibliothek) |

---

## 📁 Ordner und Dateien

```
vacuubrand-game/
├── index.html                    Einstiegsseite, lädt CSS und alle Skripte
├── ▶ START Windows.bat            Windows: Edge im App- und Vollbildmodus
├── ▶ START Mac.command            Mac: Chrome/Edge im App-/Vollbildmodus, sonst Safari
├── ▶ START Linux + Raspberry Pi.sh  Linux/Pi: Chromium im Kiosk-Modus
├── raspberry-pi/                 Kiosk-Start und Autostart-Installation für Raspberry Pi OS
├── README.md / README.en.md       Pitch fürs Management (deutsch / englisch)
├── ANLEITUNG.md / GUIDE.en.md     Anleitung fürs Standpersonal (deutsch / englisch)
├── TECHNIK.md                    dieses Dokument
├── RELEASE_NOTES.md              Text für die Download-Version (Release), Deutsch und Englisch
├── TEXTE.md                      alle Spieltexte mit Korrekturvorschlägen, mit Englisch und Französisch
├── qr/                           Prüfseite für die QR-Codes (index.html, DE/EN) und QR-Bilder pro Land und ohne Land (QR_ALLE.png)
├── css/style.css                 Aussehen von Anmeldung und Admin-Bereich (HTML-Overlay)
├── assets/                       Logo und App-Icons (icon-192.png, icon-512.png)
├── manifest.webmanifest          App-Beschreibung für „Zum Home-Bildschirm“ (PWA)
├── sw.js                         Service Worker: Online-Version offline verfügbar machen
├── CLAUDE.md                     Regeln für Claude und Mitwirkende
├── .gitattributes                was nicht ins Download-ZIP kommt (export-ignore)
├── .github/                      Release-Workflow, Claude-Automatik, Vorlagen für Issues, Discussions und PRs
├── daten/                        Beispieldaten (erfundene Personen) als JSON und CSV
├── docs/                         Screenshots für die Dokumentation
└── js/                           der eigentliche Spielcode (siehe unten)
```

### Die JavaScript-Dateien in Ladereihenfolge

Die Reihenfolge in `index.html` ist wichtig, weil spätere Dateien Dinge aus früheren benutzen.

| Datei | Aufgabe |
|---|---|
| `config.js` | **Alle Einstellungen**: Rundenzeit, PIN, Zeitabzüge, Boni, Combo, Medaillen, Pumpen mit Werten, Schutzausrüstung, Anmeldefelder, Länder mit QR-Links, Gerätesprache. Gut kommentiert, zum Anpassen gedacht |
| `i18n.js` | **Alle Texte** in Deutsch, Englisch und Französisch (Admin nur Deutsch/Englisch), dazu `L()`, `LA()`, `LT()`, `setLang()`, `deviceLang()`, `contactUrlFor()`. Siehe Abschnitt „Mehrsprachigkeit“ |
| `util.js` | Hilfsfunktionen: Kachelgrösse `T = 16`, Bildgrösse, `clamp`, Kollision `overlap`, Datum (`todayKey`, `formatDateTime`), `escapeHtml`, `displayName` („Vorname N.“), Vollbild |
| `font.js` | eigene 5×7-Pixelschrift (nur Grossbuchstaben, Umlaute, französische Akzente É È Ê Ë À Â Ç Î Ï Ô Û Ù Œ, Ziffern, Zeichen) und das VACUUBRAND-Schriftlogo |
| `sprites.js` | erzeugt beim Start **alle Grafiken** im Code: Professor, Haare, Pumpen, Gegner, Moleküle, Kacheln, Deko, Flaggen der Länderwahl, Farbthema (`THEME`, `PAL`) und die Zonen-Stile (`ZONE_STYLE`) |
| `sound.js` | 8-Bit-Musik und Soundeffekte über die WebAudio-API, ohne Audiodateien |
| `input.js` | Tastatur, Gamepad und Joystick, übersetzt alles in Aktionen (links, springen, saugen …) |
| `touch.js` | Bildschirm-Tasten für Tablet und Handy, erscheinen beim ersten Antippen. Admin per 3 s Druck aufs Logo |
| `storage.js` | Speichern von Leads und Runden, Bestenliste, CSV- und JSON-Export, Import |
| `level.js` | Aufbau des Levels (Kacheln, Blöcke, Gegner, Schilder) und die automatische Erreichbarkeits-Korrektur |
| `entities.js` | Figuren: Professor (`Player`), Gegner (`Enemy`, `ENEMY_DEFS`), Items (`Item`), Endgegner (`Boss`), Kollision mit Kacheln (`moveBody`) |
| `game.js` | die **Spielrunde** (`PlayScene`): Bewegung, Saugen, Blöcke, Items, Treffer, Combo, Medaillen, Anzeige (HUD), Hintergrund, Auffangwannen |
| `scenes.js` | Startbildschirm mit Demo, Länderwahl (`CountryScene`), Ergebnis mit Medaillen, Kontakt-Seite mit QR-Code, Bestenliste |
| `referenzdaten.js` | die Referenzdaten als JavaScript, damit sie auch offline ohne Dateizugriff ladbar sind |
| `ui.js` | HTML-Overlay: Anmeldeformular und Admin-Bereich |
| `main.js` | Start, Szenenwechsel, Spielschleife, Skalierung, Mausklicks, Schnellstart |
| `lib/qrcode.js` | QR-Code-Erzeugung (fremde Bibliothek „qrcode-generator“ von Kazuhiko Arase, MIT-Lizenz), für den Kontakt-QR-Code nach dem Ergebnis. Ziel-Link: `contactUrl` des gewählten Landes in `config.js` (`countries`), ohne Land der allgemeine `contactUrl` (Ansprechpartner weltweit) |

---

## 🧩 Architektur

### Betriebsarten (`CONFIG.mode`)

| Aufruf | Modus | Verhalten |
|---|---|---|
| Doppelklick auf `index.html` (file://) | `messe` | Anmeldung mit Lead-Erfassung, Admin, Export |
| `https://gsb-deleven.github.io/vacuubrand-game/` | `online` | Online-Demo: nur Spitzname (bleibt auf dem Gerät), kein Admin, Titel zeigt „ONLINE-DEMO“ |
| `…/vacuubrand-game/?messe` | `messe` | Stand-Version auf dem Tablet. Daten liegen im Browser des Tablets |
| `…?online` | `online` | Online-Modus erzwingen (zum Testen) |

Online-Runden werden als Lead mit `isOnline: true`, Spitzname als Vorname und E-Mail `online:<spitzname>` gespeichert, nur lokal.

### Tablet, Handy und PWA

- `touch.js` blendet beim ersten Antippen Bildschirm-Tasten ein (links ◀ ▶; rechts ein Bedienfeld mit SPRUNG oben und SAUGEN unten; Pause oben rechts; kein Sprint und kein Ducken auf Touch). Sie erzeugen virtuelle Tasten (`TouchLeft`, `TouchJump` …) wie das Gamepad. Mehrere Finger gleichzeitig gehen.
- Die Tasten sind nur während der Runde sichtbar. In Menüs genügt Tippen. Im Hochformat erscheint „Bitte Gerät quer halten“.
- Texte passen sich an: `LT('schlüssel')` nimmt auf Touch-Geräten den Text `schlüssel.touch`, z. B. „TIPPEN = START“ statt „ENTER = START“.
- Admin auf dem Tablet (nur `messe`): 3 Sekunden auf das VACUUBRAND-Logo oben drücken.
- `manifest.webmanifest` und `sw.js` machen die Online-Version zur installierbaren App („Zum Home-Bildschirm“, Vollbild, Querformat). Der Service Worker cached alle Spieldateien, danach läuft sie ohne Internet. Mit Internet holt er jede Datei zuerst frisch vom Server (Änderungen kommen sofort an); nur ohne Internet oder wenn der Server länger als 3 Sekunden braucht, nimmt er den Cache. Er ist nur auf `*.github.io` aktiv. **Bei jeder Änderung `VERSION` in `sw.js` erhöhen**, sonst behalten Tablets die alte Version. Ist eine neue Version geladen, startet das Spiel von selbst neu, sobald der Titelbildschirm zu sehen ist (nie mitten in einer Runde). Beim allerersten Update von einer Version vor v13 braucht es noch einmal manuelles Neuladen.

### GitHub Pages und Automatik

- GitHub Pages veröffentlicht bei jedem Push auf `main` automatisch das ganze Repo (Einstellung: Settings → Pages → „Deploy from a branch“, `main`, `/ (root)`). Die Datei `.nojekyll` sorgt dafür, dass die Dateien unverändert ausgeliefert werden.
- `.github/workflows/release.yml` baut die **Download-Version**: Sobald man ihn unter Actions mit „Run workflow“ startet (Version eintragen, er setzt den Tag selbst) oder ein Tag `v…` (z. B. `v0.9.0`) gepusht wird, packt `git archive --prefix=Professor-Vacuumus/` das Repo in `Professor-Vacuumus-v….zip`, erstellt das Release mit dem Text aus `RELEASE_NOTES.md` und hängt das ZIP an. Tags mit `v0.` oder `-` (z. B. `v1.0.0-beta`) werden als Vorabversion (Pre-release) markiert. Was nicht ins ZIP gehört (`.github/`, `docs/wiki/`, `docs/discussions-willkommen.md`, `CLAUDE.md`, Punkt-Dateien), steht mit `export-ignore` in `.gitattributes`. `git archive` übernimmt die Ausführbarkeit der Start-Dateien (`.command`, `.sh`) ins ZIP; Windows ignoriert sie, Mac und Pi behalten sie beim Entpacken normalerweise. Falls nicht: `chmod +x` (siehe ANLEITUNG.md). Download-Link für alle: https://github.com/GSB-Deleven/vacuubrand-game/releases/latest
- `.github/workflows/claude.yml` startet Claude, wenn in einem Issue oder Kommentar `@claude` steht oder das Label `claude` gesetzt wird. Claude setzt die Aufgabe auf einem eigenen Branch um und bereitet einen Pull Request vor. Voraussetzung: Repository-Secret `CLAUDE_CODE_OAUTH_TOKEN` (Claude-Abo, erzeugt mit `claude setup-token`) oder `ANTHROPIC_API_KEY`. Regeln für Claude stehen in `CLAUDE.md`.

### Szenen

Das Spiel besteht aus Szenen. Es ist immer genau eine aktiv, `Game.go(neueSzene)` wechselt. Jede Szene hat `update()` (Logik, 60× pro Sekunde) und `draw(ctx)` (Zeichnen), optional `enter()`, `exit()` und `click(x, y)`.

```
 TitleScene ──Enter──► CountryScene ──START──► RegisterScene ──Formular ok──► PlayScene
     ▲  │ B             (Land + Sprache)          (HTML-Overlay)              │ Zeit um / Ausgang
     │  ▼                                                                    ▼
     │ Bestenliste                                                      ResultScene
     │                                                                       │ Enter / Timeout
     └──── BoardScene ◄──Enter / Tippen── ContactScene (QR, bleibt stehen) ◄──┘

 Strg+Shift+A  ► AdminScene (HTML-Overlay, mit PIN)
 Strg+Shift+Enter ► PlayScene als „ADMIN“ (Testrunde, wird nicht gespeichert)
```

### Spielschleife (`main.js`)

`requestAnimationFrame` sammelt die vergangene Zeit und führt so viele feste Logikschritte à 1/60 s aus wie nötig. Dann wird einmal gezeichnet. So läuft das Spiel auf 60-Hz- und 144-Hz-Bildschirmen gleich schnell.

Pro Logikschritt passiert: Gamepads abfragen, Szene aktualisieren, Musik weiterplanen, Tasten-„gerade gedrückt“ zurücksetzen.

### Canvas und Overlay

Das Spiel selbst ist ein Canvas mit 320 × 180 Pixeln. Formulare (Anmeldung, Admin) sind normales HTML in einem `<div id="overlay">` darüber, weil Texteingabe im Canvas umständlich wäre. Solange das Overlay offen ist, ignoriert das Spiel Tasten und Controller.

### Datenfluss einer Runde

1. `CountryScene` setzt die Sprache (`setLang`) und übergibt das Land an `RegisterScene`.
2. `RegisterScene` prüft das Formular und speichert oder aktualisiert den Lead (`Store.upsertLead`, erkannt an der E-Mail), mit `country` und `lang`.
3. `PlayScene` läuft mit diesem Lead.
4. Am Ende berechnet `PlayScene.end()` Zeitbonus und Medaillen und übergibt alles an `ResultScene`.
5. `ResultScene` speichert die Runde (`Store.addRound`) mit Land und Sprache, ausser bei Testrunden, und zeigt die Platzierung.
6. `ContactScene` zeigt einen grossen QR-Code zur Kontaktseite des gewählten Landes (`contactUrlFor(lead.country)`, Rückfall `contactUrl`). Die Seite bleibt stehen, bis Enter, Tippen oder ein Knopf kommt. Der QR-Code wird als eigenes, scharfes Bild über das Spiel gelegt (`QRView`), weil er beim Hochskalieren des Pixelbilds unlesbar würde. Ist kein Link gesetzt, entfällt die Seite.
7. `BoardScene` zeigt die Bestenlisten und geht nach `boardAutoReturnSeconds` zum Titel. Der Titel stellt wieder seine Sprache ein (`titleLang`, Standard Englisch).

---

## 🌍 Mehrsprachigkeit

Das Spiel läuft auf **Deutsch (de), Englisch (en) und Französisch (fr)**. Alle Texte stehen in `js/i18n.js`:

```js
const I18N = {
  lang: 'de',              // aktuelle Spielsprache
  adminLang: 'de',         // Sprache des Admin-Bereichs (de/en)
  de: { 'title.sub': 'SAUG DAS LABOR-CHAOS WEG!', 'howto.goal': 'SAUG IN {0} SEK …', … },
  en: { … }, fr: { … }
};
```

| Funktion | Zweck |
|---|---|
| `L('schlüssel', a, b)` | Text in der Spielsprache, `{0}`, `{1}` werden durch `a`, `b` ersetzt. Fehlt die Übersetzung, kommt Deutsch |
| `LT('schlüssel')` | wie `L`, aber auf Touch-Geräten `schlüssel.touch`, falls vorhanden |
| `LA('schlüssel')` | Text in der Admin-Sprache (für `adm.…` und `csv.…`) |
| `setLang('fr')` | Sprache umschalten, setzt auch `<html lang>` und beschriftet die Touch-Knöpfe neu |
| `deviceLang()` | Gerätesprache: in der Messe-Version `CONFIG.defaultLang` (Admin), online die Browsersprache, falls de/en/fr, sonst `defaultLang` |

**Wann gilt welche Sprache?**
- Titelbild und Bestenliste vom Titel aus: `CONFIG.titleLang` (Standard `'en'`, damit der Titel an jeder Messe passt; leer = Gerätesprache)
- Länderwahl: startet in der Gerätesprache, die auch Land und Sprache vorwählt
- Admin-Schnellstart: Gerätesprache
- Ab der Länderwahl bis zur Bestenliste nach der Runde: die gewählte Sprache
- Zurück auf dem Titelbild (auch nach Abbruch oder Timeout): wieder `titleLang` (`TitleScene.enter()`)

**Regeln für Texte**
- Deutsche Texte sind vom Marketing freigegeben bzw. in Prüfung und werden nicht eigenmächtig geändert. Englisch und Französisch sind Entwürfe
- Neue Texte immer in allen drei Sprachen in `i18n.js` **und** mit Nummer in `TEXTE.md` eintragen
- Die Pixelschrift kennt Grossbuchstaben, Umlaute und É È Ê Ë À Â Ç Î Ï Ô Û Ù Œ. Unbekannte Zeichen (z. B. « », ’, ₂) nicht verwenden
- Platz: ca. 50 Zeichen pro Zeile, Schilder und Banner max. 2 Zeilen, Knöpfe und Spalten deutlich weniger. Beim Testen prüft ein Playwright-Skript alle Texte aller Sprachen gegen die Breite ihres Kastens (`Font.width`) und auf fehlende Zeichen
- HTML-Texte (Anmeldung, Admin) dürfen klein geschrieben sein

## 🏳️ Länder und QR-Codes

Vor jeder Runde wählt der Spieler in der `CountryScene` sein Land und seine Sprache. Die Länder stehen in `CONFIG.countries` (`js/config.js`):

```js
countries: [
  { key: 'CH', name: 'SCHWEIZ / SUISSE', lang: 'de', contactUrl: 'https://…' },
  { key: 'DE', name: 'DEUTSCHLAND',      lang: 'de', contactUrl: 'https://…' },
  { key: 'UK', name: 'UK / IRELAND',     lang: 'en', contactUrl: 'https://…' },
  { key: 'FR', name: 'FRANCE',           lang: 'fr', contactUrl: 'https://…' }
]
```

- `lang` ist die Sprache, die die Flagge einstellt. Jede Flaggenwahl setzt die Sprache wieder auf `lang`; danach ist in der Sprachzeile jede Sprache wählbar (wichtig für die Schweiz)
- Die Flaggen sind Pixel-Sprites `SPR.flag_CH` usw. in `sprites.js` (`buildFlags`). Für ein neues Land: Eintrag in `countries` und eine Flagge `flag_<key>` zeichnen
- Bedienung: drei Zeilen (`COUNTRY_ROWS`: Flaggen, Sprache, START). ↑ ↓ (`Input` Aktion `up`/`down`) wechselt die Zeile, ← → wählt darin, Enter/A startet aus jeder Zeile, Esc zurück. Touch und Maus: Flagge antippen (markiert nur, startet nicht), Sprache antippen (optional), START-Knopf antippen. Texte: `country.lang` (Vorsatz SPRACHE:), `country.start` (Knopf), `country.hint` / `.touch`. Nach `countrySelectSeconds` (60 s) ohne Eingabe zurück zum Titel
- Vorgewählt ist das erste Land, dessen Sprache der Gerätesprache entspricht
- Der Schnellstart (`Strg + Shift + Enter`) überspringt die Wahl: Gerätesprache und der allgemeine `contactUrl` (Ansprechpartner weltweit, `https://www.vacuubrand.com/service-advice/contact/contacts-worldwide`, englische Seite mit allen Ländern). Er gilt auch für ein Land ohne eigenen `contactUrl`

### QR-Codes prüfen und Bilder neu erzeugen

`qr/index.html` lädt `js/lib/qrcode.js` und `js/config.js` und zeigt für jedes Land den QR-Code (gleiche Einstellung wie im Spiel: `qrcode(0, 'L')`, Rand 4 Kästchen), den Link als Text und als Link. Die fünfte Karte „Ohne Land (Schnellstart)“ (`data-key="ALLE"`) zeigt den allgemeinen `contactUrl`. Die Seite läuft per Doppelklick und online unter https://gsb-deleven.github.io/vacuubrand-game/qr/. Nach einer Link-Änderung ist sie sofort aktuell.

Die Texte der Prüfseite gibt es auf Deutsch und Englisch (wie der Admin-Bereich, Objekt `T` in `qr/index.html`). Sprache: `?lang=de` / `?lang=en` oder Umschalter oben rechts, sonst die Browsersprache (Deutsch, sonst Englisch). Die Länder- und Sprachnamen auf den Karten kommen aus `CONFIG.countries`.

Die Bilder `qr/QR_CH.png`, `QR_DE.png`, `QR_UK.png`, `QR_FR.png` und `QR_ALLE.png` (ohne Land, 10 Pixel pro Kästchen) sind zum Weiterschicken gedacht und müssen nach einer Link-Änderung **neu erzeugt** werden. Der Dateiname steht auf jeder Karte („Bild zum Weiterschicken“):
- **Von Hand:** `qr/index.html` öffnen, Rechtsklick auf den QR-Code → „Bild speichern unter …“ und mit dem passenden Namen (z. B. `QR_UK.png`) in den Ordner `qr/` speichern
- **Automatisch (Claude/Entwicklung):** mit Playwright `qr/index.html` öffnen, von jedem `.card canvas` `toDataURL('image/png')` speichern (Dateiname aus dem Link `.card .png a`) und jedes Bild mit jsQR gegen `data-url` des Canvas prüfen

Danach auch die **Doku-Screenshots** der Prüfseite neu machen (sie stehen in ANLEITUNG.md, GUIDE.en.md, README.md und README.en.md):
- `docs/screenshots/de/17-qr-pruefseite.png` = `qr/index.html?lang=de`, `docs/screenshots/en/17-qr-pruefseite.png` = `qr/index.html?lang=en`
- Playwright mit Fenster 1720 × 900 Pixel (dann stehen alle 5 Karten nebeneinander), `deviceScaleFactor: 1`, `page.screenshot({ fullPage: true })`
- Von Hand geht es auch: Seite im Browser breit genug öffnen und einen Bildschirmausschnitt speichern

---

## 🎮 Spielmechanik

### Runde und Zeit

| Wert | Einstellung | Standard |
|---|---|---|
| Rundenlänge | `roundSeconds` | 120 s |
| Treffer durch Gegner | `hitTimePenalty` | −3 s |
| Treffer mit Schutzbrille | `hitTimePenaltyGoggles` | −1 s |
| In Auffangwanne gefallen | `fallTimePenalty` | −3 s |
| Restzeit beim Ausgang | `timeBonusPerSecond` | 50 Punkte pro Sekunde |
| Ausgang erreicht | `finishBonus` | +1000 Punkte |

Es gibt kein Game Over. Treffer kosten nur Zeit. In den letzten 10 Sekunden piept es jede Sekunde und die Musik wird schneller.

Die **Zeitleiste** unter der Anzeige zeigt die Restzeit als Balken: über 50 % grün, über 25 % gelb, darunter rot, in den letzten 10 s blinkend. Bei einem Zeitbonus blitzt sie kurz weiss.

### Bewegung

| | |
|---|---|
| Laufen | 1,5 px pro Schritt, beim Saugen 0,9 |
| Sprinten | 2,5 px pro Schritt, mit Shift/Ctrl bzw. Schultertaste. Die Ausdauer reicht `sprintSeconds` = 2 s und lädt in `sprintRegenSeconds` = 2,5 s wieder auf |
| Springen | voll gehalten ca. 53 px hoch (gut 3 Kacheln), kurzes Antippen ca. 34 px (gut 2 Kacheln). Beim Rennen etwas höher |
| Ducken | ↓, macht die Figur kleiner |
| Hilfen | **Coyote-Time** (6 Frames nach der Kante noch springen), **Sprungpuffer** (7 Frames zu früh gedrückt zählt), **Kopfnuss-Magnet** (ein Kolben-Block bis 5 px über dem Kopf zählt beim höchsten Punkt als getroffen) |

### Saugen

Leertaste gedrückt halten. Aus der Düse der Saugpistole geht ein Kegel nach vorne:
- Reichweite je nach Pumpe (Tabelle unten)
- Höhe des Kegels: 14 px + 0,6 × Abstand nach oben und unten
- Ein Gegner wird nur eingesaugt, wenn sein **Gewicht** höchstens der **Saugkraft** der Pumpe entspricht. Sonst wackelt er und es kommt „ZU SCHWER!“
- Die **SOG**-Leiste leert sich beim Saugen. Ist sie leer, überhitzt die Pumpe und man muss warten, bis wieder 30 % (`overheatResume`) geladen sind. Volle Ladung dauert `suckRegenSeconds` = 2,5 s, mit Handschuhen die Hälfte

### Pumpen

Pumpen kommen aus den Kolben-Blöcken mit Nummer. Sie laufen wie die Pilze bei Super Mario davon und lassen sich einfangen oder einsaugen.

| Stufe | Pumpe | Reichweite | Saugkraft | Dauersaugen | Zone |
|---|---|---|---|---|---|
| 1 | ME 1C | 46 px | 1 | 3 s | Filtrationslabor |
| 2 | PC 3001 VARIO select | 72 px | 2 | 3,5 s | Verdampfer-Labor |
| 3 | MD 4C VARIO select | 88 px | 2 | 5 s | Chemielabor |
| 4 | VACUU·PURE 10C | 104 px | 3 | 4 s | Hochvakuum-Technikum |

Eine neue Pumpe gibt +500 Punkte, füllt die SOG-Leiste und zeigt Name und Slogan im Boden-Banner (nur wenn `CONFIG.productBanners` eingeschaltet ist; Standard: aus, bis die Texte freigegeben sind). Dazu gibt es eine Fanfare, einen kurzen Blitz und ein leichtes Wackeln.

**BVC professional (Sonderfall):** kommt aus dem Block „V“ im Zellkultur-Labor. Im ganzen Zellkultur-Labor trägt der Professor dann die BVC, die Saugpistole wird zum VHC-Handstück. Sie saugt **alles** ein (Flüssigkeiten, Dämpfe und alle anderen Gegner, egal wie schwer) **ohne Energie-Limit** und mit **doppelten Punkten**. Nur die Dampf-Krake schafft sie nicht, Reichweite mindestens 84 px. Verlässt man das Labor, ist wieder die normale Pumpe aktiv. Wird die BVC ausserhalb erwischt, gilt sie `bvcSeconds` = 8 s.

### Schutzausrüstung

Kommt der Reihe nach aus den Blöcken mit „?“. Jedes neue Teil gibt +2 s (`ppeTimeBonus`) und +200 Punkte.

| Teil | Wirkung |
|---|---|
| 🥽 Schutzbrille | Treffer kosten nur 1 statt 3 Sekunden |
| 🧤 Handschuhe | SOG-Leiste lädt doppelt so schnell |
| ⛑️ Schutzhelm | Gegner von unten wegköpfen |
| 🥾 Sicherheitsschuhe | Draufspringen zerstört Gegner |
| ✨ alle vier = **Vollschutz** | Gegner zerplatzen bei Berührung, goldener Rahmen in der Anzeige |

Hat man schon alles, gibt ein weiterer „?“-Block +1 s (`ppeDuplicateTimeBonus`). Ein leerer Block gibt +200 Punkte und +1 s.

### Punkte

| Aktion | Punkte |
|---|---|
| Gegner einsaugen | Grundwert des Gegners (100 bis 500) × Combo × (2 mit BVC) |
| Gegner zertreten, wegköpfen, mit Vollschutz berühren | 50 |
| Neue Pumpe | 500 |
| Schutzausrüstung | 200 |
| BVC professional | 300 |
| VACUU·VIEW extended | 300 und +10 s (`viewTimeBonus`) |
| Dampf-Krake eingesaugt | 3000 |

### Combo

Wer innerhalb von `comboWindow` = 2 s wieder etwas einsaugt, erhöht die Combo bis `comboMax` = 8. Der Multiplikator gilt für die Punkte des Gegners.

Anzeige: goldener Kasten oben links mit „COMBO ×n“ und einem Timerbalken (grün → orange → rot, blinkt in der letzten halben Sekunde). Bei ×5 und ×8 gibt es einen Jingle, der Saugton wird mit jeder Stufe höher. Ein Treffer oder Sturz beendet die Serie, der Kasten wird grau und zeigt „VORBEI“.

### Medaillen

Werden am Ende berechnet (`PlayScene.earnedMedals`), die Boni zählen zum Gesamtergebnis.

| Medaille | Bedingung | Bonus |
|---|---|---|
| Krake bezwungen | Dampf-Krake eingesaugt | 2000 |
| Vollschutz | alle 4 Schutz-Teile | 1000 |
| Unverletzt | kein Treffer und kein Sturz, mindestens 10 Dinge eingesaugt | 1500 |
| Top-Pumpe | VACUU·PURE 10C erreicht | 1000 |
| Combo-Profi | Combo ×5 (`comboMedal`) oder höher | 1000 |
| Zeitmeister | alle VACUU·VIEW im Level gefunden (aktuell 3) | 500 |

**Gesamt** = Punkte + Zeitbonus (nur wenn der Ausgang erreicht wurde) + Medaillenbonus.

---

## 🗺️ Level, Gegner und Endgegner

### Aufbau

Das Level ist **330 × 12 Kacheln** à 16 px gross. Der Boden liegt in den Reihen 10 und 11. Die Kamera folgt dem Professor seitlich.

| Zone | ab Kachel | Pumpe/Thema |
|---|---|---|
| 1 Filtrationslabor | 0 | ME 1C |
| 2 Zellkultur-Labor | 80 | BVC professional |
| 3 Verdampfer-Labor | 120 | PC 3001 VARIO select |
| 4 Chemielabor | 200 | MD 4C VARIO select |
| 5 Hochvakuum-Technikum | 250 | VACUU·PURE 10C, Endgegner |

Jede Zone hat eigene Farben (`ZONE_STYLE`), eigene Deko im Hintergrund, eigene Musik und Poster mit der passenden Pumpe.

### Kachel-Legende (`level.js`)

| Zeichen | Bedeutung |
|---|---|
| `#` | Boden |
| `B` | Wandblock (Edelstahl) |
| `-` | VACUU·LAN-Leitung, von unten durchspringbar |
| `1` `2` `3` `4` | Kolben-Block mit Pumpe der Stufe |
| `?` | Kolben-Block mit Schutzausrüstung |
| `V` | Kolben-Block mit BVC professional |
| `U` | leerer Block (nach dem Anspringen) |
| Leerraum im Boden | Auffangwanne (Grube) |

Im Code baut man das Level mit kleinen Befehlen: `ground`, `pit`, `lan(x, y, breite)`, `brick(x, y, b, h)`, `q(x, y, zeichen)`, `e(typ, x, y)` für Gegner, `sign(x, text)` für Schilder.

### Automatische Erreichbarkeit (`fixReach`)

Nach dem Aufbau schiebt `fixReach()` alles nach unten, was zu hoch hängt:
- Schwebende Gegner höchstens **2 Kacheln** über der nächsten Fläche darunter
- VACUU·VIEW höchstens **3 Kacheln** darüber

So bleibt das Level spielbar, auch wenn jemand Positionen ändert. Kolben-Blöcke sollten mit höchstens 3 Kacheln Lücke über einer Standfläche liegen, erhöhte VACUU·LAN-Stufen höchstens 3 Kacheln über der nächsten tieferen Fläche.

### Auffangwannen

Die Gruben sind Becken mit Flüssigkeit, je Zone eine andere (`PIT_STYLE` in `game.js`):

| Zone | Becken |
|---|---|
| 1 | Filtrat-Wanne (blau) |
| 2 | Desinfektionsbad (rosa) |
| 3 | Lösemittel-Auffangwanne (orange) |
| 4 | Säure-Auffangwanne (gelbgrün) |
| 5 | Flüssigstickstoff (hellblau mit Nebel) |

Mit Edelstahlrand, Warnstreifen und ⚠-Schild. Wer hineinfällt, taucht sichtbar ein (Platsch, Spritzer, Meldung), verliert 3 s und startet an der letzten sicheren Stelle neu.

### Gegner (`ENEMY_DEFS` in `entities.js`)

Verhalten: **walker** läuft hin und her und dreht an Kanten, **hopper** hüpft zum Spieler, **floater** schwebt, **static** steht.

| Kürzel | Name | Verhalten | Gewicht | Punkte | Zone |
|---|---|---|---|---|---|
| d | Filtrat-Tropfen | hopper | 1 | 100 | 1 (auch vom Boss) |
| f | Schmutzpartikel | walker | 1 | 100 | 1 |
| p | Filterpapier | floater | 1 | 150 | 1 |
| t | Reagenzglas | walker | 1 | 150 | 1 |
| n | Nährmedium | walker | 1 | 150 | 2 |
| e | Petri-Schleim | walker | 1 | 150 | 2 |
| w | Wellplatte | hopper | 2 | 250 | 2 |
| c | Lösemitteldampf | floater | 1 | 150 | 3 |
| k | Rundkolben | walker | 2 | 250 | 3 |
| h | Hitzedampf | floater | 2 | 250 | 3 |
| m | Messbecher | walker | 2 | 250 | 3 |
| y | Eppi | hopper | 2 | 250 | 3 |
| a | Säuredampf | floater | 2 | 250 | 4 |
| g | Scheidetrichter | walker | 2 | 250 | 4 |
| i | Eiskristall | floater | 2 | 300 | 5 |
| l | Schlenk-Kolben | walker | 3 | 500 | 5 |
| z | Argon-Flasche | static, harmlos | 3 | 500 | 5 |
| b | Siedeblase | floater | 3 | 500 | 5 |
| H2O | Wasser | floater | 1 | 150 | 1, 5 |
| O2, N2 | Sauerstoff, Stickstoff | floater | 1 | 150 | 5 |
| H2O2 | Wasserstoffperoxid | floater | 2 | 250 | 2 |
| MEOH | Methanol | floater | 2 | 250 | 3, 4 |
| ETOH | Ethanol | floater | 2 | 300 | 3, 4 |

Moleküle sind Kugelmodelle in CPK-Farben, beim Einsaugen erscheint ihr Name.

Die BVC professional saugt alle Gegner ein. `liquid: true` (d, t, n, e, w) ist nur noch eine Beschreibung.

### Endgegner: Dampf-Krake

- Erscheint, sobald der Professor die Boss-Arena (ab Kachel 254) betritt, mit eigener Boss-Musik
- Schwebt langsam hin und her und spuckt alle 110 Frames einen Filtrat-Tropfen (höchstens 3 gleichzeitig)
- Nur mit der **VACUU·PURE 10C** einsaugbar. Mit schwächeren Pumpen kommt ein Hinweis
- Zuerst leert man ihre Lebensleiste (`bossHp` = 200 Frames Saugen), danach wird sie eingesaugt: +3000 Punkte, starkes Wackeln, der Ausgang öffnet sich
- Der Ausgang (EXIT) ist bis dahin gesperrt

---

## 🕹️ Steuerung

| Aktion | Tastatur | Gamepad (Xbox-Layout) | Joystick |
|---|---|---|---|
| Laufen | ← → | Stick / Steuerkreuz | Stick |
| Springen | ↑ | A, Y, Stick hoch | Knopf 2/3, Stick hoch |
| Ducken | ↓ | Stick / Steuerkreuz runter | Stick runter |
| Saugen | Leertaste | B, X | Feuerknopf |
| Sprinten | Shift, Ctrl | LB, RB, LT, RT | weitere Knöpfe |
| Start / weiter | Enter, Leertaste | Start, A | Feuerknopf |
| Pause | Esc | Start, Back | Knopf 9/10 |
| Runde abbrechen | Esc, dann Enter | nicht möglich (Absicht) | nicht möglich |
| Bestenliste | B | Y | |
| Ton an/aus | M | | |
| Vollbild | F | | |

**Touch (Tablet, Handy):** links ◀ ▶ zum Laufen, rechts ein Bedienfeld mit **SPRUNG** oben und **SAUGEN** unten (halten). Die Felder werden nach Fingerposition ausgewertet (`zoneCodes()` in `touch.js`): man kann ohne Loslassen wischen, und ein Daumen auf der Naht zwischen SPRUNG und SAUGEN drückt beide. Ein zweiter Finger geht natürlich auch. Oben rechts **II** für Pause. Sprinten und Ducken gibt es auf Touch nicht, darum fehlen dort auch die SPRINT-Leiste und der Sprint-Hinweis in der Anleitung. Tippen startet, schaltet weiter und beendet die Pause. Eine Runde lässt sich per Touch absichtlich nicht abbrechen.

**Tastenkürzel fürs Personal:**
- `Strg + Shift + A`: Admin-Bereich (PIN)
- `Strg + Shift + Enter`: Schnellstart als „ADMIN“, die Runde wird nicht gespeichert

Die Tastatur ist bewusst auf Pfeile, Leertaste, Shift/Ctrl beschränkt, damit keine Browser-Kürzel wie Strg+W ausgelöst werden. Controller werden über die Gamepad-API des Browsers erkannt. Beim ersten Erkennen erscheint „CONTROLLER VERBUNDEN“. Manche Browser melden einen Controller erst nach dem ersten Tastendruck.

---

### Joysticks, Arcade und eigene Belegung

- **Hat-Steuerkreuz:** Viele Arcade-Encoder („Zero Delay“) melden das Steuerkreuz als Achsen 6/7 oder als Achse 9 mit Stufenwerten. `pollPads()` wertet beides aus. Die Ruhewerte werden beim ersten Erkennen gemerkt, damit z. B. ein Schubregler nicht als Dauer-Richtung gilt.
- **Eigene Belegung:** Admin → **Controller einrichten** fragt nacheinander SPRINGEN, SAUGEN, SPRINTEN und START/PAUSE ab. Die Belegung wird pro Controller-Modell (`gamepad.id`) im `localStorage` unter `vakuumprof_padmap_v1` gespeichert und hat Vorrang vor der Standardbelegung.
- **Arcade-Tastatur-Encoder** (z. B. I-PAC): Pfeiltasten, Leertaste, Ctrl/Shift und Enter funktionieren direkt. Zusätzlich starten **1** und **5** (Arcade-Standard für Start und Münze).

### iPhone / iPad

- Eingabefelder haben mindestens 16 px Schrift, sonst zoomt iOS beim Antippen hinein.
- Ton wird bei der ersten Berührung freigeschaltet (`touchend`, stummer Puffer), auch nach Anruf oder Sperrbildschirm (`interrupted`).
- Die Bildgrösse richtet sich nach `visualViewport` (sichtbare Fläche ohne Safari-Leisten).
- In Safari erscheint online einmalig der Hinweis „Zum Home-Bildschirm“, weil es auf dem iPhone sonst keinen Vollbildmodus gibt.

### Raspberry Pi

`raspberry-pi/installieren.sh` installiert Chromium und `unclutter`, schaltet den Bildschirmschoner aus und richtet den Autostart ein (XDG-Autostart und labwc). `raspberry-pi/spiel-starten.sh` startet Chromium im Kiosk-Modus mit eigenem Profil `~/.professor-vakuumus` und erlaubt Ton ohne Tastendruck. Anleitung: `raspberry-pi/README.md`.

---

## 🎨 Grafik und Sound

### Grafik (`sprites.js`)

Alle Bilder entstehen beim Start im Code, es gibt keine Bilddateien ausser dem Logo:
- **Raster-Sprites:** Figuren als Textraster, jedes Zeichen steht für eine Farbe aus der Palette `PAL` (`spriteFromGrid`)
- **Prozedurale Sprites:** mit kleinen Zeichenbefehlen gemalt (`paint`), z. B. Pumpen, Moleküle, Haare
- **16-Bit-Schattierung** (`shade16`): Licht oben links, Schatten unten rechts, farbige Umrisse. Wird für Pumpen, Gegner, Endgegner und Items benutzt, nicht für den Professor
- **Hintergrund:** 3 Ebenen mit Parallax (Wand, Möbel, Deko), Deko halb so gross (`halfSize`) und blass, damit der Professor im Vordergrund bleibt
- **Farben:** `THEME` mit den VACUUBRAND-Farben (Navy `#46648c`, Gold `#f9b000`, Blau `#4f8fcf`), `ZONE_STYLE` pro Labor

Die Schrift (`font.js`) ist eine eigene 5×7-Pixelschrift. Sie kann nur **Grossbuchstaben**, Ziffern, ÄÖÜ und einige Zeichen (. , : ! ? - + / ( ) % · × ★ ♥ ← → ↑ ↓ usw.). Unbekannte Zeichen bleiben leer, darum schreibt das Spiel z. B. H2O statt H₂O. Eine Zeile hat bei 320 px Breite Platz für etwa 50 Zeichen.

### Sound (`sound.js`)

Alles wird mit der WebAudio-API synthetisiert (Rechteck-, Dreieck-, Sägezahnwellen und Rauschen).
- **Musik:** `SONGS` enthält die Titelmelodie, je eine Melodie pro Zone (`zone0` bis `zone3`) und `boss`. Noten stehen als Text, z. B. `seq('C5 . E5 G5')`, der Punkt ist eine Pause
- **Effekte:** Springen, Einsaugen (Tonhöhe steigt mit Combo), Autsch, Platsch, Upgrade-Fanfare, Combo-Jingle, Zeitbonus, Countdown, Boss usw.
- Der Browser erlaubt Ton erst nach der ersten Taste oder dem ersten Klick. `M` schaltet stumm

---

## 💾 Daten, Bestenliste und Export

### Speicherort

Im `localStorage` des Browsers:

| Schlüssel | Inhalt |
|---|---|
| `vakuumprof_leads_v1` | alle Leads |
| `vakuumprof_rounds_v1` | alle gespielten Runden |
| `vakuumprof_settings_v1` | im Admin geänderte Einstellungen (Messename, Rundenzeit, PIN, Preise) |

ℹ️ Der Professor hiess früher „Vakuumus“ und heisst jetzt **Vacuumus** (wie VACUUBRAND). Absichtlich mit altem Namen geblieben sind: die Speicher-Schlüssel `vakuumprof_*`, der Cache-Name `vakuumus-vNN` in `sw.js`, die Exportdateien `vakuum-professor_*`, auf dem Pi die Autostart-Datei `professor-vakuumus.desktop` und der Profilordner `~/.professor-vakuumus`. Wer diese umbenennt, verliert Bestenliste und Leads auf bestehenden Geräten bzw. erzeugt doppelte Autostarts.

⚠️ Die Daten gehören zu **diesem Browser auf diesem Laptop und diesem Ordner**. Ein anderer Browser, ein verschobener Ordner oder gelöschte Browserdaten bedeuten eine leere Bestenliste. Darum jeden Abend exportieren.

Ist der Speicher gesperrt (z. B. strenge Datenschutzeinstellung), läuft das Spiel mit einem Zwischenspeicher weiter und der Admin-Bereich zeigt eine Warnung.

### Datenmodell

**Lead:** `id`, `firstName`, `lastName`, `company`, `email` (klein geschrieben, eindeutig), `consent`, `newsletter`, `country` (CH, DE, UK, FR), `lang` (de, en, fr), `created`, `updated`. Wer sich mit derselben E-Mail wieder anmeldet, aktualisiert seinen Lead.

**Spitzname-Spieler** (kein Lead): online `isOnline: true`, `email` = `online:<spitzname>`; an der Messe mit Schalter „Nur Spitzname“ (`CONFIG.nameOnly`) `nickOnly: true`, `email` = `nick:<spitzname>`. Der Spitzname steht in `firstName`, die übrigen Felder sind leer. Gleicher Spitzname = gleicher Spieler. Erkennen mit `isNickLead(lead)` (`js/util.js`); `Store.realLeads()` liefert nur echte Leads.

**Runde:** `id`, `ts` (Zeitstempel), `day` (JJJJ-MM-TT), `eventName`, `leadId`, `country`, `lang`, `score` (Gesamt), `base` (Grundpunkte), `timeBonus`, `medalBonus`, `medals` (Liste), `finished`, `timeLeft`, `pump`, `captures`, `ppe`, `views`, `maxCombo`.

### Bestenliste

- Pro Person zählt nur das **beste** Ergebnis
- **Heute** = Runden mit dem heutigen Datum, **Gesamt** = alle Runden
- Bei Gleichstand gewinnt, wer früher gespielt hat
- Öffentlich sichtbar ist nur „Vorname N.“, die Liste zeigt die Top 10 (`leaderboardSize`)

### Export

| Export | Inhalt |
|---|---|
| Leads (CSV) | nur echte Leads (ohne Spitznamen): Vorname, Name, Firma, E-Mail, Einwilligung, Newsletter, Land, Sprache, bester Score, Platz gesamt, Anzahl Runden, erstmals gespielt |
| Runden (CSV) | Datum/Zeit, Tag, Messe, Art (Lead oder Spitzname), Spitzname, Kontaktdaten (bei Spitzname leer), Land, Sprache, Punkte, Grundpunkte, Zeitbonus, Medaillenbonus, Medaillen, Labor gerettet, Eingesaugt, beste Pumpe |
| Sicherung (JSON) | alle Leads und Runden, zum Übertragen auf einen anderen Laptop |

Die Spaltennamen folgen der Admin-Sprache (Deutsch oder Englisch). Die CSV-Dateien haben Strichpunkt als Trenner und eine UTF-8-Kennung, damit Excel sie mit Umlauten direkt richtig öffnet. Einträge, die mit `=`, `+`, `-` oder `@` beginnen, werden entschärft, damit Excel keine Formeln ausführt.

Beim **Laden einer Sicherung** werden nur neue Einträge ergänzt, nichts wird überschrieben.

### Referenzdaten

`daten/referenzdaten.json` (und als CSV) enthält 5 erfundene Leads und 6 Runden. Im Admin-Bereich lädt „Referenzdaten laden (Test)“ sie ins Spiel, um Bestenliste und Export auszuprobieren. Vor der Messe mit „Alle Daten löschen“ wieder entfernen.

### Datenschutz

- Keine Datenübertragung ins Internet, keine externen Dienste
- Einwilligung ist Pflicht (`consentRequired`), Newsletter separat und freiwillig
- Texte der Einwilligung und des Datenschutz-Hinweises in `i18n.js` (`reg.consent`, `reg.privacy`), je Sprache. Englisch und Französisch sind Entwürfe und brauchen die Freigabe für UK/Irland bzw. Frankreich
- Das Anmeldeformular schliesst sich nach `registrationTimeoutSeconds` = 90 s ohne Eingabe, damit keine halb ausgefüllten Daten stehen bleiben
- Nach der Messe: Admin → „Alle Daten löschen“

---

## 🔐 Admin-Bereich

`Strg + Shift + A` auf Titelbild, Ergebnis oder Bestenliste, dann PIN (Standard `1234`).

| Bereich | Funktion |
|---|---|
| Version | klein unter der Überschrift, aus `CONFIG.version` (`js/config.js`) |
| Übersicht | Spieler und Runden heute und gesamt |
| Top 3 | heute (Tagespreis) und gesamte Messe, mit vollen Kontaktdaten |
| Export & Sicherung | Leads-CSV, Runden-CSV, JSON-Sicherung speichern und laden, Referenzdaten laden. Nach jedem Export steht der Inhalt zusätzlich in einem Textfeld mit „Inhalt kopieren“, falls der Browser keinen Download zulässt |
| Einstellungen | Messename, Rundenzeit (30 bis 600 s), Admin-PIN, Tagespreis und Hauptpreis (je max. 17 Zeichen, erscheinen auf Startbildschirm und Bestenliste, nicht in der Online-Demo), Gerätesprache (`defaultLang`: de/en/fr), Admin-Sprache (`adminLang`: de/en), Schalter **Nur Spitzname** (`nameOnly`). Alles wird im Browser gespeichert (`vakuumprof_settings_v1`) und beim Start über `CONFIG` gelegt |
| Nur Spitzname | ist der Schalter an, zeigt der Admin oben einen gelben Warnbalken, die Übersicht zählt Spitznamen separat, Top 3 und Letzte Runden markieren sie mit „Spitzname“ ohne Firma/E-Mail. Die Anmeldung (`RegisterScene`) nimmt dann den Spitznamen-Weg wie online (`nickRegistration()` in `js/util.js`), mit Überschrift `nick.title` statt ONLINE-DEMO |
| Letzte Runden | die letzten 40 Runden mit Land und Sprache, einzeln löschbar (✕ zweimal klicken) |
| Gefahrenzone | alle Daten löschen, nur nach Eintippen von „LÖSCHEN“ (oder „DELETE“) |
| Sonstiges | Vollbild, Ton an/aus |

---

## 🧑‍🍳 Anpassen: Kochrezepte

Alle Dateien lassen sich mit einem normalen Texteditor (z. B. Notepad, besser Notepad++ oder VS Code) öffnen. Nach dem Speichern im Browser **F5** drücken.

**Rundenzeit, Messename, PIN**
Am einfachsten im Admin-Bereich. Die Standardwerte stehen oben in `js/config.js`.

**Texte ändern**
- **Alle Texte** stehen in `js/i18n.js`, je Sprache ein Block (`de`, `en`, `fr`) mit denselben Schlüsseln. Den Text beim passenden Schlüssel ändern
- Schilder im Level: `sign(x, 'sign.3')` in `js/level.js` verweist auf den Schlüssel in `i18n.js`
- Wichtig: Spieltexte nur in Grossbuchstaben, ca. 50 Zeichen pro Zeile, Zeilenumbruch mit `\n`. Eine vollständige Liste mit Nummern steht in [TEXTE.md](TEXTE.md)
- Neue Texte immer in **allen drei Sprachen** in `i18n.js` und in `TEXTE.md` eintragen

**Punkte, Boni, Schwierigkeit**
In `js/config.js`: Zeitabzüge, Boni, Combo-Fenster, Saug-Energie, Sprint, Medaillen-Boni. Pumpenwerte (`range`, `power`, `pull`, `tank`) ebenfalls dort.

**Gegner oder Block im Level setzen**
In `js/level.js` in der passenden Zone eine Zeile ergänzen, z. B. `e('k', 150);` für einen Rundkolben auf dem Boden bei Kachel 150 oder `q(160, 6, '?');` für einen Schutzausrüstungs-Block. Die Kachel-Koordinaten sind Spalten (x, 0 bis 279) und Reihen (y, 0 oben bis 11 unten).

**Neue Gegnerart**
1. In `ENEMY_DEFS` (`js/entities.js`) einen Eintrag mit Name, Grösse, Gewicht, Punkten, Verhalten und Sprite-Namen ergänzen
2. In `js/sprites.js` das Sprite zeichnen (Raster oder `paint`), bei Animation zusätzlich `name2`
3. In `js/level.js` platzieren

**Neue Medaille**
In `CONFIG.medals` einen Eintrag ergänzen, in `earnedMedals()` (`js/game.js`) die Bedingung eintragen und den Namen als `medal.<key>` in `js/i18n.js` (alle Sprachen).

**Neue Version veröffentlichen (Download-ZIP auf GitHub)**
1. In `js/config.js` `version` erhöhen (z. B. `'0.9.1'`), in `sw.js` `VERSION` erhöhen
2. `RELEASE_NOTES.md` anpassen (Deutsch zuerst, dann Englisch): Versionsnummer, was neu ist, Hinweis auf Vorabversion solange `0.x`
3. Per Pull Request nach `main` mergen
4. Release auslösen, **einfachster Weg im Browser:** auf GitHub **Actions** → links **„Release erstellen“** → rechts **„Run workflow“**, bei Version z. B. `v0.9.1` eintragen (mit v, gleiche Nummer wie in `js/config.js`) → grüner Knopf **Run workflow**. Der Workflow setzt den Tag selbst auf den neuesten Stand von `main`.
   Alternative mit Git: `git fetch origin main && git tag v0.9.1 origin/main && git push origin v0.9.1` (aus der Claude-Cloud-Umgebung blockiert, dort den Workflow über das GitHub-Werkzeug starten)
5. Unter Actions läuft „Release erstellen“; nach ca. 1 Minute steht das Release mit ZIP unter https://github.com/GSB-Deleven/vacuubrand-game/releases. `v0.…` und Versionen mit `-` (z. B. `v1.0.0-beta`) erscheinen als Vorabversion, ab `v1.0.0` als normale Version
6. Ging etwas schief: Fehler per PR beheben, dann altes Release und Tag löschen (Release-Seite → Delete; `git push origin :refs/tags/v0.9.1`) und den Workflow erneut starten

**Musik ändern**
In `SONGS` (`js/sound.js`) die Notenfolgen `lead` (Melodie) und `bass` bearbeiten. `step` ist die Dauer eines Schritts in Sekunden.

---

## 🧪 Testen und Fehlersuche

- **Schnellstart:** `Strg + Shift + Enter` startet sofort eine Testrunde als „ADMIN“, ohne Speicherung
- **Konsole:** `F12` öffnet die Entwicklerwerkzeuge. Fehler erscheinen rot unter „Konsole“. `window.__game` gibt Zugriff auf das laufende Spiel, z. B. `__game.scene.time = 999` für mehr Zeit beim Testen
- **Automatische Tests:** Während der Entwicklung wurde das Spiel mit Playwright (automatisierter Browser) getestet: Bot-Durchlauf, Erreichbarkeit aller Blöcke und schwebenden Gegner, Controller-Simulation, Medaillen und Screenshots. Diese Testskripte gehören nicht zum Spielordner

**Test-Rezepte für Claude** (Skripte im Scratchpad neu schreiben; `require('playwright')` geht überall, `npm install jsqr pngjs` im Scratchpad)
- **Textbreiten:** im Browser über alle Schlüssel von `I18N.de` und jede Sprache laufen, `Font.width()` jeder Zeile gegen den Platz des Kastens prüfen (z. B. Schilder `sign.1` ≤ 137 px, übrige Schilder ≤ 230 px, Banner ≤ 283 px, Medaillen ≤ 101 px, Knöpfe auf dem Titel ≤ 144 px, Meldungen ≤ 312 px bzw. 2 Zeilen) und jedes Zeichen gegen `FONT_GLYPHS`. Fehlende EN/FR-Schlüssel melden
- **Durchlauf pro Land/Sprache:** Titel → Enter → Pfeiltasten in der Länderwahl (mit ~80 ms Pause zwischen Tasten, sonst geht ein Druck verloren) → Formular mit erfundenen Daten (`@example.com`) → in der Anleitung erst nach 0,5 s Enter drücken → Spiel per `__game.update(); Input.endFrame();` in einer Schleife vorspulen → `__game.scene.time = 0.05` beendet die Runde → Kontakt-Seite: Screenshot, QR mit jsQR lesen und mit `contactUrlFor(land)` vergleichen, dann 61 s vorspulen und prüfen, dass die Seite noch steht
- **Touch:** `devices['iPhone 13 landscape']` bzw. iPad, Punkte im 320×180-Bild per `page.touchscreen.tap` antippen (Startknopf ca. 233/99, in der Länderwahl Flaggen bei y 50, Sprachzeile bei y 108, START-Knopf bei 160/135)
- **Gamepad:** vor dem Laden `navigator.getGamepads` mit einem Stub überschreiben (`mapping: 'standard'`, Knöpfe 0 = A, 9 = Start, 12 bis 15 = Steuerkreuz)
- **Online-Modus:** `index.html?online` mit `locale` en-GB / fr-CH / it-IT; der Titel ist immer Englisch, `deviceLang()` folgt dem Browser
- **Service Worker:** wird nur auf `*.github.io` registriert. Zum Testen das Spiel mit `python3 -m http.server` ausliefern und `navigator.serviceWorker.register('sw.js')` von Hand aufrufen; prüfen, dass eine geänderte Datei sofort ankommt und das Spiel ohne Server aus dem Cache startet
- **QR-Bilder:** siehe „QR-Codes prüfen und Bilder neu erzeugen“
- **Doku-Screenshots** (`docs/screenshots/de/` und `docs/screenshots/en/`, gleiche Dateinamen in beiden Ordnern, verlinkt in README, ANLEITUNG/GUIDE und `docs/wiki/Home.md`): Spiel per `python3 -m http.server` ausliefern, Fenster 1280 × 720 (`deviceScaleFactor: 1`, 4-fache Pixel, scharf). Vor dem Laden `vakuumprof_settings_v1` mit `defaultLang`/`adminLang` = `de` bzw. `en` setzen, Referenzdaten mit `Store.importJSON(REFERENCE_DATA)` laden (ein Teil der Runden mit `day = todayKey()`, damit „heute“ gefüllt ist). Ablauf wie oben mit erfundener Person (`@example.com`); für die Zonen den Spieler direkt setzen (`scene.player.x`, `pump`, `ppe`, `bvcT`/`bvcZone`, `scene.camX`, `scene.state = 'play'`) und kurz die Leertaste halten. Ergebnis erst nach `ResultScene.t > 260` aufnehmen (dann leuchten alle Medaillen). Touch: `devices['iPad Pro 11 landscape']`, einmal tippen. Online-Anmeldung: `index.html?online`. QR-Prüfseite: 1720 × 900, `fullPage`

**Typische Probleme**

| Problem | Lösung |
|---|---|
| Bestenliste plötzlich leer | anderer Browser, anderer Ordner oder Browserdaten gelöscht. Sicherung (JSON) im Admin laden |
| Windows fragt nach „Einrastfunktion“ | kommt bei 5× Shift. In den Windows-Einstellungen unter Barrierefreiheit → Tastatur abschalten |
| Kein Ton | einmal eine Taste drücken (Browser-Regel), `M` prüfen, Lautstärke am Laptop |
| Controller reagiert nicht | einmal eine Taste am Controller drücken, USB neu einstecken, anderen USB-Port versuchen |
| Export lädt nichts herunter | Inhalt aus dem Textfeld im Admin kopieren und in eine Textdatei einfügen |
| Spiel ruckelt | andere Programme schliessen, Netzteil einstecken (Energiesparmodus drosselt) |

---

## 🔭 Grenzen und Ideen

**Grenzen**
- Ein Level mit fester Anordnung, kein Zufall
- Daten nur lokal, keine zentrale Bestenliste über mehrere Laptops (Zusammenführen geht über JSON-Sicherungen)
- Die Pixelschrift kennt nur Grossbuchstaben (mit Umlauten und französischen Akzenten)

**Ideen für später**
- Wissens-Quiz zwischen den Zonen mit Bonuszeit
- QR-Code am Ende mit Link zur Produktseite der erreichten Pumpe
- Weitere Länder oder Sprachen (Italienisch für das Tessin und Italien)
- Weitere Zonen mit anderen Anwendungen und Pumpen
- Preis-Anzeige, im Admin einstellbar
