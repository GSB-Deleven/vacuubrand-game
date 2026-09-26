# 🛠️ Professor Vakuumus: Technisches Handbuch

Dieses Dokument erklärt, wie das Spiel aufgebaut ist, was jede Datei macht und wie man es anpasst oder erweitert. Für den Überblick fürs Management gibt es [README.md](README.md), für das Standpersonal [ANLEITUNG.md](ANLEITUNG.md). Alle Zahlen hier stammen direkt aus dem Code (Stand dieses Dokuments).

---

## 📋 Inhalt

1. [Technik auf einen Blick](#-technik-auf-einen-blick)
2. [Ordner und Dateien](#-ordner-und-dateien)
3. [Architektur](#-architektur)
4. [Spielmechanik](#-spielmechanik)
5. [Level, Gegner und Endgegner](#-level-gegner-und-endgegner)
6. [Steuerung](#-steuerung)
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
| Browser | Edge, Chrome, Firefox (aktuelle Versionen) |
| Grösse | ca. 4200 Zeilen Code in 14 JavaScript-Dateien |

---

## 📁 Ordner und Dateien

```
vacuubrand-game/
├── index.html                    Einstiegsseite, lädt CSS und alle Skripte
├── Spiel starten (Vollbild).bat  startet Edge im App- und Vollbildmodus
├── README.md                     Pitch fürs Management
├── ANLEITUNG.md                  Anleitung fürs Standpersonal
├── TECHNIK.md                    dieses Dokument
├── TEXTE.md                      alle Spieltexte mit Korrekturvorschlägen
├── css/style.css                 Aussehen von Anmeldung und Admin-Bereich (HTML-Overlay)
├── assets/vacuubrand-logo.png    Logo im Anmeldeformular
├── daten/                        Referenzdaten (Testrunden vom 26.09.2026) als JSON und CSV
├── docs/                         Screenshots für die Dokumentation
└── js/                           der eigentliche Spielcode (siehe unten)
```

### Die JavaScript-Dateien in Ladereihenfolge

Die Reihenfolge in `index.html` ist wichtig, weil spätere Dateien Dinge aus früheren benutzen.

| Datei | Aufgabe |
|---|---|
| `config.js` | **Alle Einstellungen**: Rundenzeit, PIN, Zeitabzüge, Boni, Combo, Medaillen, Pumpen mit Werten und Slogans, Schutzausrüstung, Anmeldefelder und Einwilligungstexte. Gut kommentiert, zum Anpassen gedacht |
| `util.js` | Hilfsfunktionen: Kachelgrösse `T = 16`, Bildgrösse, `clamp`, Kollision `overlap`, Datum (`todayKey`, `formatDateTime`), `escapeHtml`, `displayName` („Vorname N.“), Vollbild |
| `font.js` | eigene 5×7-Pixelschrift (nur Grossbuchstaben, Umlaute, Ziffern, Zeichen) und das VACUUBRAND-Schriftlogo |
| `sprites.js` | erzeugt beim Start **alle Grafiken** im Code: Professor, Haare, Pumpen, Gegner, Moleküle, Kacheln, Deko, Farbthema (`THEME`, `PAL`) und die Zonen-Stile (`ZONE_STYLE`) |
| `sound.js` | 8-Bit-Musik und Soundeffekte über die WebAudio-API, ohne Audiodateien |
| `input.js` | Tastatur, Gamepad und Joystick, übersetzt alles in Aktionen (links, springen, saugen …) |
| `storage.js` | Speichern von Leads und Runden, Bestenliste, CSV- und JSON-Export, Import |
| `level.js` | Aufbau des Levels (Kacheln, Blöcke, Gegner, Schilder) und die automatische Erreichbarkeits-Korrektur |
| `entities.js` | Figuren: Professor (`Player`), Gegner (`Enemy`, `ENEMY_DEFS`), Items (`Item`), Endgegner (`Boss`), Kollision mit Kacheln (`moveBody`) |
| `game.js` | die **Spielrunde** (`PlayScene`): Bewegung, Saugen, Blöcke, Items, Treffer, Combo, Medaillen, Anzeige (HUD), Hintergrund, Auffangwannen |
| `scenes.js` | Startbildschirm mit Demo, Ergebnis mit Medaillen, Bestenliste |
| `referenzdaten.js` | die Referenzdaten als JavaScript, damit sie auch offline ohne Dateizugriff ladbar sind |
| `ui.js` | HTML-Overlay: Anmeldeformular und Admin-Bereich |
| `main.js` | Start, Szenenwechsel, Spielschleife, Skalierung, Mausklicks, Schnellstart |

---

## 🧩 Architektur

### Szenen

Das Spiel besteht aus Szenen. Es ist immer genau eine aktiv, `Game.go(neueSzene)` wechselt. Jede Szene hat `update()` (Logik, 60× pro Sekunde) und `draw(ctx)` (Zeichnen), optional `enter()`, `exit()` und `click(x, y)`.

```
 TitleScene ──Enter──► RegisterScene ──Formular ok──► PlayScene
     ▲  │ B                (HTML-Overlay)              │ Zeit um / Ausgang
     │  ▼                                              ▼
     │ Bestenliste                                ResultScene
     │                                                 │ Enter / Timeout
     └───────────────── BoardScene ◄───────────────────┘

 Strg+Shift+A  ► AdminScene (HTML-Overlay, mit PIN)
 Strg+Shift+Enter ► PlayScene als „ADMIN“ (Testrunde, wird nicht gespeichert)
```

### Spielschleife (`main.js`)

`requestAnimationFrame` sammelt die vergangene Zeit und führt so viele feste Logikschritte à 1/60 s aus wie nötig. Dann wird einmal gezeichnet. So läuft das Spiel auf 60-Hz- und 144-Hz-Bildschirmen gleich schnell.

Pro Logikschritt passiert: Gamepads abfragen, Szene aktualisieren, Musik weiterplanen, Tasten-„gerade gedrückt“ zurücksetzen.

### Canvas und Overlay

Das Spiel selbst ist ein Canvas mit 320 × 180 Pixeln. Formulare (Anmeldung, Admin) sind normales HTML in einem `<div id="overlay">` darüber, weil Texteingabe im Canvas umständlich wäre. Solange das Overlay offen ist, ignoriert das Spiel Tasten und Controller.

### Datenfluss einer Runde

1. `RegisterScene` prüft das Formular und speichert oder aktualisiert den Lead (`Store.upsertLead`, erkannt an der E-Mail).
2. `PlayScene` läuft mit diesem Lead.
3. Am Ende berechnet `PlayScene.end()` Zeitbonus und Medaillen und übergibt alles an `ResultScene`.
4. `ResultScene` speichert die Runde (`Store.addRound`), ausser bei Testrunden, und zeigt die Platzierung.
5. `BoardScene` zeigt die Bestenlisten.

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
| 3 | VACUU·PURE 10C | 104 px | 3 | 4 s | Hochvakuum-Technikum |

Eine neue Pumpe gibt +500 Punkte, füllt die SOG-Leiste und zeigt Name und Slogan im Boden-Banner. Dazu gibt es eine Fanfare, einen kurzen Blitz und ein leichtes Wackeln.

**BVC professional (Sonderfall):** kommt aus dem Block „V“ im Zellkultur-Labor. Im ganzen Zellkultur-Labor trägt der Professor dann die BVC, die Saugpistole wird zum VHC-Handstück. Sie saugt alle Gegner mit `liquid: true` (Medien, Wellplatten, Petrischalen, Tropfen) **ohne Energie-Limit** und mit **doppelten Punkten**, Reichweite mindestens 84 px. Verlässt man das Labor, ist wieder die normale Pumpe aktiv. Wird die BVC ausserhalb erwischt, gilt sie `bvcSeconds` = 8 s.

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

Das Level ist **280 × 12 Kacheln** à 16 px gross. Der Boden liegt in den Reihen 10 und 11. Die Kamera folgt dem Professor seitlich.

| Zone | ab Kachel | Pumpe/Thema |
|---|---|---|
| 1 Filtrationslabor | 0 | ME 1C |
| 2 Zellkultur-Labor | 80 | BVC professional |
| 3 Verdampfer-Labor | 120 | PC 3001 VARIO select |
| 4 Hochvakuum-Technikum | 200 | VACUU·PURE 10C, Endgegner |

Jede Zone hat eigene Farben (`ZONE_STYLE`), eigene Deko im Hintergrund, eigene Musik und Poster mit der passenden Pumpe.

### Kachel-Legende (`level.js`)

| Zeichen | Bedeutung |
|---|---|
| `#` | Boden |
| `B` | Wandblock (Edelstahl) |
| `-` | VACUU·LAN-Leitung, von unten durchspringbar |
| `1` `2` `3` | Kolben-Block mit Pumpe der Stufe |
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
| 4 | Flüssigstickstoff (hellblau mit Nebel) |

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
| i | Eiskristall | floater | 2 | 300 | 4 |
| l | Schlenk-Kolben | walker | 3 | 500 | 4 |
| z | Argon-Flasche | static, harmlos | 3 | 500 | 4 |
| b | Siedeblase | floater | 3 | 500 | 4 |
| H2O | Wasser | floater | 1 | 150 | 1, 4 |
| O2, N2 | Sauerstoff, Stickstoff | floater | 1 | 150 | 4 |
| H2O2 | Wasserstoffperoxid | floater | 2 | 250 | 2 |
| MEOH | Methanol | floater | 2 | 250 | 3 |
| ETOH | Ethanol | floater | 2 | 300 | 3 |

Moleküle sind Kugelmodelle in CPK-Farben, beim Einsaugen erscheint ihr Name.

Gegner mit `liquid: true` kann die BVC professional absaugen: d, t, n, e, w.

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

**Tastenkürzel fürs Personal:**
- `Strg + Shift + A`: Admin-Bereich (PIN)
- `Strg + Shift + Enter`: Schnellstart als „ADMIN“, die Runde wird nicht gespeichert

Die Tastatur ist bewusst auf Pfeile, Leertaste, Shift/Ctrl beschränkt, damit keine Browser-Kürzel wie Strg+W ausgelöst werden. Controller werden über die Gamepad-API des Browsers erkannt. Beim ersten Erkennen erscheint „CONTROLLER VERBUNDEN“. Manche Browser melden einen Controller erst nach dem ersten Tastendruck.

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
| `vakuumprof_settings_v1` | im Admin geänderte Einstellungen (Messename, Rundenzeit, PIN) |

⚠️ Die Daten gehören zu **diesem Browser auf diesem Laptop und diesem Ordner**. Ein anderer Browser, ein verschobener Ordner oder gelöschte Browserdaten bedeuten eine leere Bestenliste. Darum jeden Abend exportieren.

Ist der Speicher gesperrt (z. B. strenge Datenschutzeinstellung), läuft das Spiel mit einem Zwischenspeicher weiter und der Admin-Bereich zeigt eine Warnung.

### Datenmodell

**Lead:** `id`, `firstName`, `lastName`, `company`, `email` (klein geschrieben, eindeutig), `consent`, `newsletter`, `created`, `updated`. Wer sich mit derselben E-Mail wieder anmeldet, aktualisiert seinen Lead.

**Runde:** `id`, `ts` (Zeitstempel), `day` (JJJJ-MM-TT), `eventName`, `leadId`, `score` (Gesamt), `base` (Grundpunkte), `timeBonus`, `medalBonus`, `medals` (Liste), `finished`, `timeLeft`, `pump`, `captures`, `ppe`, `views`, `maxCombo`.

### Bestenliste

- Pro Person zählt nur das **beste** Ergebnis
- **Heute** = Runden mit dem heutigen Datum, **Gesamt** = alle Runden
- Bei Gleichstand gewinnt, wer früher gespielt hat
- Öffentlich sichtbar ist nur „Vorname N.“, die Liste zeigt die Top 10 (`leaderboardSize`)

### Export

| Export | Inhalt |
|---|---|
| Leads (CSV) | Vorname, Name, Firma, E-Mail, Einwilligung, Newsletter, bester Score, Platz gesamt, Anzahl Runden, erstmals gespielt |
| Runden (CSV) | Datum/Zeit, Tag, Messe, Kontaktdaten, Punkte, Grundpunkte, Zeitbonus, Medaillenbonus, Medaillen, Labor gerettet, Eingesaugt, beste Pumpe |
| Sicherung (JSON) | alle Leads und Runden, zum Übertragen auf einen anderen Laptop |

Die CSV-Dateien haben Strichpunkt als Trenner und eine UTF-8-Kennung, damit Excel sie mit Umlauten direkt richtig öffnet. Einträge, die mit `=`, `+`, `-` oder `@` beginnen, werden entschärft, damit Excel keine Formeln ausführt.

Beim **Laden einer Sicherung** werden nur neue Einträge ergänzt, nichts wird überschrieben.

### Referenzdaten

`daten/referenzdaten.json` (und als CSV) enthält 5 Leads und 6 Testrunden vom 26.09.2026. Im Admin-Bereich lädt „Referenzdaten laden (Test)“ sie ins Spiel, um Bestenliste und Export auszuprobieren. Vor der Messe mit „Alle Daten löschen“ wieder entfernen.

### Datenschutz

- Keine Datenübertragung ins Internet, keine externen Dienste
- Einwilligung ist Pflicht (`consentRequired`), Newsletter separat und freiwillig
- Texte der Einwilligung in `config.js` (`registration`)
- Das Anmeldeformular schliesst sich nach `registrationTimeoutSeconds` = 90 s ohne Eingabe, damit keine halb ausgefüllten Daten stehen bleiben
- Nach der Messe: Admin → „Alle Daten löschen“

---

## 🔐 Admin-Bereich

`Strg + Shift + A` auf Titelbild, Ergebnis oder Bestenliste, dann PIN (Standard `1234`).

| Bereich | Funktion |
|---|---|
| Übersicht | Spieler und Runden heute und gesamt |
| Top 3 | heute (Tagespreis) und gesamte Messe, mit vollen Kontaktdaten |
| Export & Sicherung | Leads-CSV, Runden-CSV, JSON-Sicherung speichern und laden, Referenzdaten laden. Nach jedem Export steht der Inhalt zusätzlich in einem Textfeld mit „Inhalt kopieren“, falls der Browser keinen Download zulässt |
| Einstellungen | Messename, Rundenzeit (30 bis 600 s), Admin-PIN |
| Letzte Runden | die letzten 40 Runden, einzeln löschbar (✕ zweimal klicken) |
| Gefahrenzone | alle Daten löschen, nur nach Eintippen von „LÖSCHEN“ |
| Sonstiges | Vollbild, Ton an/aus |

---

## 🧑‍🍳 Anpassen: Kochrezepte

Alle Dateien lassen sich mit einem normalen Texteditor (z. B. Notepad, besser Notepad++ oder VS Code) öffnen. Nach dem Speichern im Browser **F5** drücken.

**Rundenzeit, Messename, PIN**
Am einfachsten im Admin-Bereich. Die Standardwerte stehen oben in `js/config.js`.

**Texte ändern**
- Pumpen-Slogans, Schutzausrüstung, Anmeldung, Einwilligung, Medaillen: `js/config.js`
- Schilder im Level: `sign(...)` in `js/level.js`
- Meldungen im Spiel: `showMsg(...)` und `banner` in `js/game.js`
- Wichtig: Spieltexte nur in Grossbuchstaben, ca. 50 Zeichen pro Zeile, Zeilenumbruch mit `\n`. Eine vollständige Liste steht in [TEXTE.md](TEXTE.md)

**Punkte, Boni, Schwierigkeit**
In `js/config.js`: Zeitabzüge, Boni, Combo-Fenster, Saug-Energie, Sprint, Medaillen-Boni. Pumpenwerte (`range`, `power`, `pull`, `tank`) ebenfalls dort.

**Gegner oder Block im Level setzen**
In `js/level.js` in der passenden Zone eine Zeile ergänzen, z. B. `e('k', 150);` für einen Rundkolben auf dem Boden bei Kachel 150 oder `q(160, 6, '?');` für einen Schutzausrüstungs-Block. Die Kachel-Koordinaten sind Spalten (x, 0 bis 279) und Reihen (y, 0 oben bis 11 unten).

**Neue Gegnerart**
1. In `ENEMY_DEFS` (`js/entities.js`) einen Eintrag mit Name, Grösse, Gewicht, Punkten, Verhalten und Sprite-Namen ergänzen
2. In `js/sprites.js` das Sprite zeichnen (Raster oder `paint`), bei Animation zusätzlich `name2`
3. In `js/level.js` platzieren

**Neue Medaille**
In `CONFIG.medals` einen Eintrag ergänzen und in `earnedMedals()` (`js/game.js`) die Bedingung eintragen.

**Musik ändern**
In `SONGS` (`js/sound.js`) die Notenfolgen `lead` (Melodie) und `bass` bearbeiten. `step` ist die Dauer eines Schritts in Sekunden.

---

## 🧪 Testen und Fehlersuche

- **Schnellstart:** `Strg + Shift + Enter` startet sofort eine Testrunde als „ADMIN“, ohne Speicherung
- **Konsole:** `F12` öffnet die Entwicklerwerkzeuge. Fehler erscheinen rot unter „Konsole“. `window.__game` gibt Zugriff auf das laufende Spiel, z. B. `__game.scene.time = 999` für mehr Zeit beim Testen
- **Automatische Tests:** Während der Entwicklung wurde das Spiel mit Playwright (automatisierter Browser) getestet: Bot-Durchlauf, Erreichbarkeit aller Blöcke und schwebenden Gegner, Controller-Simulation, Medaillen und Screenshots. Diese Testskripte gehören nicht zum Spielordner

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
- Die Pixelschrift kennt nur Grossbuchstaben

**Ideen für später**
- Wissens-Quiz zwischen den Zonen mit Bonuszeit
- QR-Code am Ende mit Link zur Produktseite der erreichten Pumpe
- Weitere Zonen mit anderen Anwendungen und Pumpen
- Preis-Anzeige, im Admin einstellbar
