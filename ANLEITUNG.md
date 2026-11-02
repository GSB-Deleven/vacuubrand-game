# Professor Vacuumus: Anleitung fürs Standpersonal

🇬🇧 English version: **[GUIDE.en.md](GUIDE.en.md)**

Ein kleines Retro-Jump'n'Run (Pixelart wie auf dem Game Boy) für den Messestand.
Der verrückte Professor (oranges Wuschelhaar, runde Brille – wie unser Maskottchen) saugt mit
seiner Saugpistole das Labor-Chaos weg. Aus den **Kolben-Blöcken** holt er sich immer stärkere Pumpen,
Schutzausrüstung und Spezial-Geräte. Die Level zeigen die echten Anwendungen der Pumpen:

| Zone | Gerät | Anwendungen / Gegner |
|---|---|---|
| 1 Filtrationslabor | **ME 1C** | Filtration: Filtrat-Tropfen, Partikel, Filterpapier, Reagenzgläser, H₂O |
| 2 Zellkultur-Labor | **BVC professional** (Spezial) | Medienabsaugung: Nährmedium, Petrischalen-Schleim, Wellplatten, H₂O₂ |
| 3 Verdampfer-Labor | **PC 3001 VARIO select** | Rotavap, Vakuum-Konzentrator, Trockenschrank: Lösemitteldampf, Hitzedampf, Rundkolben, Messbecher, Eppis, Methanol, Ethanol |
| 4 Chemielabor | **MD 4C VARIO select** | Destillation und Trocknung: Säuredampf, Scheidetrichter, Lösemitteldampf, Methanol, Ethanol |
| 5 Hochvakuum-Technikum | **VACUU·PURE 10C** | Ölfreie Trocknung (Gefriertrocknung, Schlenk-Line, Turbo-Vorvakuum): Eiskristalle, O₂, N₂, H₂O, Schlenk-Kolben, Argon-Flaschen, **Dampf-Krake** (Boss) |

Die durchspringbaren Plattformen sind **VACUU·LAN**-Leitungen.

**Items aus den Kolben-Blöcken** (laufen wie die Pilze bei Mario davon – hinterher oder einfach einsaugen!):

| Item | Wirkung |
|---|---|
| Pumpe ME 1C → PC 3001 VARIO select → MD 4C VARIO select → VACUU·PURE 10C | mehr Reichweite, schwerere Sachen einsaugen |
| Pumpe **BVC professional** (Zellkultur) | im ganzen Zellkultur-Labor: BVC auf dem Rücken, Pistole wird zum **VHC-Handstück**, saugt alles ein (Flüssigkeiten, Dämpfe und das ganze Labor-Chaos) ohne Energie-Limit mit doppelten Punkten; beim Verlassen des Labors wieder die normale Pumpe |
| Schutzbrille | Treffer kosten nur 1 statt 3 Sekunden |
| Handschuhe | Saug-Energie lädt doppelt so schnell |
| Schutzhelm | Gegner von unten wegköpfen |
| Sicherheitsschuhe | Gegner durch Draufspringen zerstören |
| alle 4 = **Vollschutz** | Gegner können nicht mehr schaden |
| VACUU·VIEW extended (versteckt, 3×) | „Zeitvakuum“: +10 Sekunden |

Jedes neue Schutz-Teil gibt +2 Sekunden. Eine Runde dauert **120 Sekunden**. Wer die Dampf-Krake
einsaugt und den Ausgang erreicht, bekommt die Restzeit als Bonus. Treffer kosten Zeit (kein Game Over).
Die verbleibende Zeit läuft zusätzlich als farbige **Zeitleiste** unter der Anzeige ab (grün → gelb → rot).

**Combo:** Wer innerhalb von 2 Sekunden wieder etwas einsaugt, baut eine Serie auf: Punkte ×2, ×3 … bis **×8**.
Der goldene Combo-Kasten oben links zeigt die Stufe und einen ablaufenden Timer. Ein Treffer beendet die Serie.

**Medaillen** am Ende der Runde (Bonuspunkte zählen zum Gesamtergebnis):

| Medaille | Bedingung | Bonus |
|---|---|---|
| Krake bezwungen | Dampf-Krake eingesaugt | +2000 |
| Vollschutz | alle 4 Schutz-Teile | +1000 |
| Unverletzt | kein Treffer (mind. 10× eingesaugt) | +1500 |
| Top-Pumpe | VACUU·PURE 10C erreicht | +1000 |
| Combo-Profi | Combo ×5 oder höher | +1000 |
| Zeitmeister | alle 3 VACUU·VIEW gefunden | +500 |

Jede Zone hat ihre eigene Musik, die Dampf-Krake ein eigenes Boss-Thema.

## Herunterladen und installieren

Die fertige Download-Version liegt auf GitHub: **[Neueste Version herunterladen](https://github.com/GSB-Deleven/vacuubrand-game/releases/latest)**.
Dort unten bei „Assets“ die Datei `Professor-Vacuumus-v….zip` laden (nicht „Source code“).

| System | So geht's |
|---|---|
| 🪟 Windows | ZIP rechtsklicken → **Alle extrahieren**. Nicht direkt im ZIP starten. Im Ordner `Professor-Vacuumus` die Datei `▶ START Windows.bat` doppelklicken. Fragt Windows „Der Computer wurde geschützt“: **Weitere Informationen** → **Trotzdem ausführen** |
| 🍎 Mac | ZIP doppelklicken (entpackt automatisch). `▶ START Mac.command` beim ersten Mal mit Rechtsklick → **Öffnen** → Öffnen starten. Kommt „keine Berechtigung“: im Terminal `chmod +x ` eintippen, die Datei ins Fenster ziehen, Enter |
| 🍓 Raspberry Pi / Linux | ZIP entpacken (Rechtsklick → Hier entpacken, oder im Terminal `unzip Professor-Vacuumus-v….zip`). `▶ START Linux + Raspberry Pi.sh` doppelklicken. Startet es nicht: im Ordner im Terminal `chmod +x *.sh raspberry-pi/*.sh`. Automatischer Start beim Einschalten: `raspberry-pi/README.md` |

Welche Version läuft, steht klein oben im Admin-Bereich (z. B. „Version 0.9.0“).
Bei einer neuen Version: Bestenliste vorher im Admin sichern (JSON), neuen Ordner an **dieselbe Stelle** legen
(alten ersetzen), sonst sieht das Spiel die bisherige Bestenliste nicht. Notfalls die Sicherung im Admin wieder laden.

## Starten – ohne Installation, ohne Internet

1. Den ganzen Ordner auf den Messe-Laptop kopieren (z.B. auf den Desktop).
2. Die passende Start-Datei doppelklicken:

| System | Start-Datei (Doppelklick) |
|---|---|
| 🪟 Windows | `▶ START Windows.bat` (Edge im Vollbild) |
| 🍎 Mac | `▶ START Mac.command` (Chrome/Edge im Vollbild, sonst Safari). Beim ersten Mal: Rechtsklick → **Öffnen** → Öffnen |
| 🐧 Linux / 🍓 Raspberry Pi | `▶ START Linux + Raspberry Pi.sh` (Chromium im Vollbild). Automatisch beim Einschalten: siehe `raspberry-pi/README.md` |
| alle | Notfalls einfach `index.html` doppelklicken |

3. Beenden: **Alt + F4** (Mac: **Cmd + Q**).

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
| B | Bestenliste ein/aus (auf dem Titelbild) |

**Knöpfe liegen falsch?** (z. B. Arcade-Joystick) Im Admin-Bereich unter **Controller / Joystick → Controller einrichten** der Reihe nach Springen, Saugen, Sprinten und Start drücken. Das Spiel merkt sich die Belegung für dieses Controller-Modell.

**Controller:** Xbox-/USB-Gamepads und einfache USB-Joysticks einfach einstecken, sie werden automatisch erkannt
(„CONTROLLER VERBUNDEN“; evtl. einmal eine Taste drücken). Die Tastatur funktioniert weiterhin.

| Gamepad (Xbox-Layout) | Joystick | Aktion |
|---|---|---|
| Stick / Steuerkreuz | Stick | laufen, ↑ springen, ↓ ducken |
| A oder Y | Knopf 2 / 3 | springen |
| B oder X | Feuerknopf | saugen |
| LB / RB / LT / RT | weitere Knöpfe | sprinten |
| Start / A | Feuerknopf | Start / weiter |
| Start oder Back | Knopf 9 / 10 | Pause ein/aus |

Die Anmeldung (Namen eintippen) geht natürlich nur mit Tastatur. Eine Runde abbrechen geht nur mit
**Esc → Enter** auf der Tastatur, damit Spielende nicht aus Versehen abbrechen.

**Tipp für den Messe-Laptop:** Wenn jemand 5× Shift drückt, fragt Windows nach der „Einrastfunktion“.
Abschalten unter *Einstellungen → Barrierefreiheit → Tastatur → Einrastfunktion* (Tastenkombination deaktivieren).
Sprinten geht auch mit Ctrl.

## Tablet am Stand

1. Auf dem Tablet im Browser **https://gsb-deleven.github.io/vacuubrand-game/?messe** öffnen (wichtig: `?messe` am Ende, sonst startet die Online-Demo ohne Anmeldung).
2. Einmal **„Zum Home-Bildschirm“** hinzufügen (iPad: Teilen-Symbol → „Zum Home-Bildschirm“; Android: Menü ⋮ → „App installieren“). Dann startet es wie eine App im Vollbild und läuft auch ohne WLAN.
3. Tablet quer halten. Beim ersten Antippen erscheinen die Bildschirm-Tasten.
4. **Admin-Bereich:** 3 Sekunden auf das VACUUBRAND-Logo oben drücken, dann PIN.
5. Die Daten liegen nur auf diesem Tablet. Exportieren wie am Laptop über den Admin-Bereich („Inhalt kopieren“ funktioniert auch, wenn der Download nicht klappt).

## Ablauf am Stand

1. Titelbild mit Demo lockt Besucher an. **B** (oder Klick auf den Knopf) zeigt die Bestenliste.
2. **Enter** → **Land und Sprache wählen:** vier Flaggen (Schweiz, Deutschland, UK/Irland, Frankreich), darunter die Sprachen DEUTSCH · ENGLISH · FRANÇAIS.
   - Tastatur/Gamepad: ← → Flagge, ↑ ↓ wechselt zur Sprachzeile, Enter bestätigt. Die Flagge wählt die Landessprache vor (Schweiz: Deutsch), in der Sprachzeile geht jede andere Sprache.
   - Tablet/Handy: zuerst die Sprache antippen (nur nötig, wenn sie anders sein soll), dann auf die Flagge tippen. Das startet direkt.
   - Nach 60 Sekunden ohne Eingabe geht es zurück zum Titelbild.
3. Anmeldung in der gewählten Sprache: Vorname, Name, Firma, E-Mail + Einwilligung (Pflicht), Newsletter (freiwillig).
4. Kurze Anleitung → Countdown → spielen.
5. Ergebnis mit Platzierung (heute / ganze Messe).
6. **Kontakt-Seite mit grossem QR-Code** zu den Ansprechpartnern des gewählten Landes. Sie bleibt stehen, bis jemand Enter drückt, tippt oder einen Knopf drückt. So hat der Besucher Zeit zum Scannen.
7. Bestenliste → nach 20 Sekunden zurück zum Titelbild.

Das **Titelbild ist immer auf Englisch** (z. B. „B = HIGH SCORES“), damit es an jeder Messe passt. Ab der Länderwahl gilt die Sprache des Spielers.

In der öffentlichen Bestenliste erscheint nur **„Vorname N.“**. Wer mehrmals spielt (gleiche E-Mail),
steht mit seinem besten Ergebnis drin.

## Schnellstart ohne Anmeldung (zum Testen / Vorführen)

Auf dem Titelbild, der Bestenliste oder im Anmeldeformular **Strg + Shift + Enter** drücken:
Das Spiel startet sofort mit dem Spieler **ADMIN**. Diese Testrunden werden **nicht** gespeichert
und erscheinen weder in der Bestenliste noch im Export. Die Länderwahl wird übersprungen: Es gilt die Gerätesprache,
der QR-Code am Ende zeigt die Ansprechpartner weltweit (alle Länder).

## Admin-Bereich (für das Standpersonal)

Auf dem Titelbild **Strg + Shift + A** drücken, PIN eingeben (Standard **1234** – bitte ändern!).

- Klein unter der Überschrift steht die **Version** (z. B. „Version 0.9.0“), damit man sieht, welche Version läuft
- **Top 3 heute** (Tagespreis) und **Top 3 gesamte Messe** mit vollen Kontaktdaten
- **Leads (CSV/Excel)** und **Alle Runden (CSV/Excel)** exportieren → landen im Download-Ordner
- **Sicherung speichern / laden** (JSON) – z.B. um Daten auf einen anderen Laptop zu übertragen
- Messename, Rundenzeit, PIN, Tagespreis und Hauptpreis ändern (Preise erscheinen auf Startbildschirm und Bestenliste)
- **Gerätesprache:** bestimmt, welches Land und welche Sprache in der Länderwahl vorgewählt sind (Deutsch → Schweiz, Englisch → UK, Französisch → Frankreich). Auf einer Messe in Frankreich z. B. auf Französisch stellen. Das Titelbild bleibt immer Englisch (`titleLang` in `js/config.js`).
- **Admin-Sprache:** Deutsch oder Englisch, z. B. für das Team in UK
- Im Export stehen pro Runde und pro Lead zusätzlich **Land** (CH, DE, UK, FR) und **Sprache** (de, en, fr)
- **Referenzdaten laden (Test):** lädt Beispieldaten mit erfundenen Personen (Ordner `daten/`: JSON und CSV-Beispiele), um Bestenliste und Export auszuprobieren – vor der Messe mit „Alle Daten löschen“ wieder entfernen
- Einzelne Runden löschen (✕ zweimal klicken), **alle Daten löschen** nach der Messe (LÖSCHEN ins Feld tippen)
- Nach jedem Export erscheint der Inhalt zusätzlich in einem Textfeld mit „Inhalt kopieren“ – praktisch, falls der Browser keinen Download erlaubt (z.B. in der Online-Vorschau)

**Tipp:** Am Ende jedes Messetags die Leads exportieren. Die Daten liegen nur im Browser-Speicher
dieses Laptops. Wenn jemand den Browserverlauf/Cookies löscht, sind sie weg.

## Datenschutz

Alle Daten bleiben lokal auf dem Laptop, es wird nichts ins Internet gesendet.
Einwilligungstext und Hinweise stehen in `js/i18n.js` (in allen drei Sprachen) und sollten vor der Messe
kurz mit der Marketing-/Datenschutzstelle abgestimmt werden. Die englische und französische Fassung sind
Entwürfe und brauchen die Freigabe für UK/Irland bzw. Frankreich. Nach der Messe im Admin-Bereich
**Alle Daten löschen**.

## QR-Codes prüfen

Im Ordner `qr/` liegt eine Prüfseite: **`qr/index.html`** doppelklicken (läuft ohne Internet) oder online
**https://gsb-deleven.github.io/vacuubrand-game/qr/** öffnen. Sie zeigt für jedes Land den QR-Code gross,
dazu den Link als Text und zum Anklicken. Einfach mit dem Handy scannen und schauen, ob die richtige Seite kommt.
Die fünfte Karte **„Ohne Land (Schnellstart)“** zeigt den Code, der kommt, wenn kein Land gewählt wurde:
die Seite mit den Ansprechpartnern weltweit (alle Länder). Oben rechts lässt sich die Seite auf Englisch umstellen (DE / EN).

![Prüfseite qr/index.html mit allen fünf QR-Codes](docs/qr-pruefseite.png)

Die Links stehen in `js/config.js` im Abschnitt `countries` (ohne Land: `contactUrl`) und lassen sich dort austauschen.
Die Prüfseite ist danach sofort aktuell (F5). Für E-Mails liegen die Bilder `QR_CH.png`, `QR_DE.png`, `QR_UK.png`,
`QR_FR.png` und `QR_ALLE.png` (ohne Land) im gleichen Ordner. Diese Bilder werden nach einer Link-Änderung nicht von
selbst neu erzeugt (siehe TECHNIK.md, Abschnitt „QR-Codes prüfen und Bilder neu erzeugen“).

## Anpassen

Die meisten Einstellungen stehen gut kommentiert in **`js/config.js`**:
Rundenzeit, Punkte, Zeitabzüge, Saug-Energie, Sprint, Item-Boni, Pumpen, Schutzausrüstung, Anmeldefelder,
Länder mit ihren QR-Links und die Gerätesprache.
Alle **Texte** (Deutsch, Englisch, Französisch) stehen in **`js/i18n.js`**.
Datei mit einem Texteditor öffnen, ändern, speichern, im Browser **F5** drücken.

## Technik

Reines HTML + JavaScript + Canvas, keine Installation, keine Internetverbindung.
Alles Technische (Aufbau, Dateien, Spielmechanik, Datenformat, Anpassungen) steht in **[TECHNIK.md](TECHNIK.md)**,
alle Spieltexte mit Korrekturvorschlägen in **[TEXTE.md](TEXTE.md)**.
