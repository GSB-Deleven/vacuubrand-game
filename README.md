# Vakuum-Professor – das VACUUBRAND Messespiel

Ein kleines Retro-Jump'n'Run (Pixelart wie auf dem Game Boy) für den Messestand.
Der verrückte **Prof. Vakuumus** saugt mit seiner Saugpistole das Labor-Chaos weg.
Aus den **?-Blöcken** holt er sich immer stärkere Pumpen:

| Pumpe | kann einsaugen |
|---|---|
| **ME 1** (Start) | Tropfen, Staubfussel, Dampfwolken |
| **PC 3001 VARIO select** | + Glaskolben, Messbecher, Lösemittel-Geister |
| **VACUU·PURE** | + Gasflaschen, Fässer und die **Dampf-Krake** (Endgegner) |

Eine Runde dauert **120 Sekunden**. Wer die Dampf-Krake einsaugt und den Ausgang erreicht,
bekommt die Restzeit als Bonus. Treffer kosten Zeit (kein Game Over).

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
| Leertaste | springen |
| X (gedrückt halten) | saugen |
| Enter | Start / bestätigen |
| Esc | Pause / zurück |
| M | Ton an/aus |
| F | Vollbild (auf dem Titelbild) |

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
Rundenzeit, Punkte, Zeitabzüge, Pumpen-Namen und -Slogans, Anmeldefelder und Texte.
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
