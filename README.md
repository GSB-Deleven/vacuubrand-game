# Vakuum-Professor – das VACUUBRAND Messespiel

Ein kleines Retro-Jump'n'Run (Pixelart wie auf dem Game Boy) für den Messestand.
Der verrückte Professor (oranges Wuschelhaar, runde Brille – wie unser Maskottchen) saugt mit
seiner Saugpistole das Labor-Chaos weg. Aus den **Kolben-Blöcken** holt er sich immer stärkere Pumpen,
Schutzausrüstung und Spezial-Geräte. Die Level zeigen die echten Anwendungen der Pumpen:

| Zone | Gerät | Anwendungen / Gegner |
|---|---|---|
| 1 Filtrationslabor | **ME 1C** | Filtration & SPE: Filtrat-Tropfen, Partikel, Filterpapier, SPE-Kartuschen |
| 2 Zellkultur-Labor | **BVC professional** (Spezial) | Medienabsaugung: Nährmedium, Petrischalen-Schleim, Wellplatten |
| 3 Verdampfer-Labor | **PC 3001 VARIO select** | Rotavap, Konzentrator, Trockenschrank: Dampf, Geister, Röhrchen, Rundkolben |
| 4 Hochvakuum-Technikum | **VACUU·PURE 10C** | Gefriertrocknung, Schlenk-Line, Turbo-Vorvakuum: Eiskristalle, Schlenk-Kolben, Argon-Flaschen, **Dampf-Krake** (Boss) |

Die durchspringbaren Plattformen sind **VACUU·LAN**-Leitungen.

**Items aus den Kolben-Blöcken** (laufen wie die Pilze bei Mario davon – hinterher!):

| Item | Wirkung |
|---|---|
| Pumpe ME 1C → PC 3001 VARIO select → VACUU·PURE 10C | mehr Reichweite, schwerere Sachen einsaugen |
| Schutzbrille | Treffer kosten nur 1 statt 3 Sekunden |
| Handschuhe | Saug-Energie lädt doppelt so schnell |
| Schutzhelm | Gegner von unten wegköpfen |
| Sicherheitsschuhe | Gegner durch Draufspringen zerstören |
| alle 4 = **Vollschutz** | Gegner können nicht mehr schaden |
| BVC professional | 8 Sekunden VHC-Handstück: saugt alle Flüssigkeiten, doppelte Punkte |
| VACUU·VIEW extended (versteckt, 3×) | „Zeitvakuum“: +10 Sekunden |

Jedes neue Schutz-Teil gibt +2 Sekunden. Eine Runde dauert **120 Sekunden**. Wer die Dampf-Krake
einsaugt und den Ausgang erreicht, bekommt die Restzeit als Bonus. Treffer kosten Zeit (kein Game Over).

## Starten – ohne Installation, ohne Internet

1. Den ganzen Ordner auf den Messe-Laptop kopieren (z.B. auf den Desktop).
2. **Doppelklick auf `Spiel starten (Vollbild).bat`** (öffnet Edge im Vollbild),
   oder einfach **Doppelklick auf `index.html`** und dann **F11** für Vollbild.
3. Beenden: **Alt + F4**.

Läuft in Edge, Chrome und Firefox. **Immer denselben Browser und denselben Ordner benutzen**,
sonst sieht das Spiel die bisherige Bestenliste nicht.

## Steuerung

| Taste | Aktion |
|---|---|
| ← → | laufen |
| ↑ | springen |
| ↓ | ducken |
| Leertaste (halten) | saugen – die **SOG**-Leiste leert sich, danach kurz abkühlen lassen |
| Shift oder Ctrl (halten) | sprinten – **SPRINT**-Leiste beachten |
| Enter | Start / bestätigen |
| Esc | Pause / zurück |
| M | Ton an/aus |
| F | Vollbild (auf dem Titelbild) |

**Tipp für den Messe-Laptop:** Wenn jemand 5× Shift drückt, fragt Windows nach der „Einrastfunktion“.
Abschalten unter *Einstellungen → Barrierefreiheit → Tastatur → Einrastfunktion* (Tastenkombination deaktivieren).
Sprinten geht auch mit Ctrl.

## Ablauf am Stand

1. Titelbild wechselt automatisch mit der Bestenliste und lockt Besucher an.
2. **Enter** → Anmeldung: Vorname, Name, Firma, E-Mail + Einwilligung (Pflicht), Newsletter (freiwillig).
3. Kurze Anleitung → Countdown → spielen.
4. Ergebnis mit Platzierung (heute / ganze Messe) → Bestenliste → zurück zum Titelbild.

In der öffentlichen Bestenliste erscheint nur **„Vorname N.“**. Wer mehrmals spielt (gleiche E-Mail),
steht mit seinem besten Ergebnis drin.

## Admin-Bereich (für das Standpersonal)

Auf dem Titelbild **Strg + Shift + A** drücken, PIN eingeben (Standard **1234** – bitte ändern!).

- **Top 3 heute** (Tagespreis) und **Top 3 gesamte Messe** mit vollen Kontaktdaten
- **Leads (CSV/Excel)** und **Alle Runden (CSV/Excel)** exportieren → landen im Download-Ordner
- **Sicherung speichern / laden** (JSON) – z.B. um Daten auf einen anderen Laptop zu übertragen
- Messename, Rundenzeit und PIN ändern
- Einzelne Runden löschen (z.B. Testrunden), **alle Daten löschen** nach der Messe

**Tipp:** Am Ende jedes Messetags die Leads exportieren. Die Daten liegen nur im Browser-Speicher
dieses Laptops. Wenn jemand den Browserverlauf/Cookies löscht, sind sie weg.

## Datenschutz

Alle Daten bleiben lokal auf dem Laptop, es wird nichts ins Internet gesendet.
Einwilligungstext und Hinweise stehen in `js/config.js` und sollten vor der Messe
kurz mit der Marketing-/Datenschutzstelle abgestimmt werden. Nach der Messe im Admin-Bereich
**Alle Daten löschen**.

## Anpassen

Die meisten Einstellungen stehen gut kommentiert in **`js/config.js`**:
Rundenzeit, Punkte, Zeitabzüge, Saug-Energie, Sprint, Item-Boni, Pumpen-Namen und -Slogans,
Schutzausrüstung, Anmeldefelder und Texte.
Datei mit einem Texteditor öffnen, ändern, speichern, im Browser **F5** drücken.

## Technik (für Neugierige)

Reines HTML + JavaScript + Canvas, keine Frameworks, keine Installation, keine Internetverbindung.
Pixelart und Sound werden direkt im Code erzeugt.

| Datei | Inhalt |
|---|---|
| `js/config.js` | Einstellungen |
| `js/level.js` | Levelaufbau (Blöcke, Gegner, Schilder) |
| `js/entities.js` | Professor, Gegner, Pumpen, Boss |
| `js/game.js` | Spielrunde, Saug-Mechanik, Anzeige |
| `js/scenes.js` | Titelbild, Ergebnis, Bestenliste |
| `js/ui.js` | Anmeldeformular, Admin-Bereich |
| `js/storage.js` | Speicherung, Bestenliste, CSV-Export |
| `js/sprites.js`, `js/font.js`, `js/sound.js` | Pixelgrafik, Schrift, 8-Bit-Sound |
| `assets/vacuubrand-logo.png` | Logo für das Anmeldeformular |
