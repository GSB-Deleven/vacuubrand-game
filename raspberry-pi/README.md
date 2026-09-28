# 🍓 Professor Vakuumus auf dem Raspberry Pi (Arcade-Automat)

Der Raspberry Pi startet beim Einschalten direkt ins Spiel, im Vollbild und ohne Internet. Joystick oder Arcade-Knöpfe einstecken, fertig.

## Was du brauchst

- **Raspberry Pi 4 oder 5** (Pi 3 geht vielleicht, kann aber ruckeln), Netzteil, microSD-Karte ab 16 GB
- Bildschirm mit HDMI, Lautsprecher (über HDMI oder Klinke)
- USB-Joystick, Gamepad oder Arcade-Encoder
- Eine Tastatur für die Anmeldung (USB oder Bluetooth)

## Einrichten (einmalig, ca. 20 Minuten)

1. Auf dem Computer den **Raspberry Pi Imager** installieren (raspberrypi.com/software) und **Raspberry Pi OS (64-bit) mit Desktop** auf die SD-Karte schreiben.
2. Pi starten, Grundeinrichtung durchklicken (Sprache, WLAN nur für die Installation).
3. Spielordner auf den Pi kopieren, z. B. per USB-Stick nach `/home/<name>/vacuubrand-game`, oder im Terminal:
   `git clone https://github.com/GSB-Deleven/vacuubrand-game.git`
4. Im Terminal:
   `bash ~/vacuubrand-game/raspberry-pi/installieren.sh`
5. Neu starten. Das Spiel startet automatisch.

## Bedienung

| Was | Wie |
|---|---|
| Spiel beenden | **Alt + F4** auf der Tastatur |
| Admin-Bereich | **Strg + Shift + A**, dann PIN |
| Knöpfe liegen falsch | Admin → **Controller / Joystick → Controller einrichten**: Knöpfe der Reihe nach drücken |
| Arcade-Tastatur-Encoder (z. B. I-PAC) | Joystick = Pfeiltasten, Saugen = Leertaste, Sprint = Ctrl/Shift, Start = Enter, **1** oder **5** |
| Leads exportieren | Admin → Export. Die Datei landet in `~/Downloads`, von dort auf einen USB-Stick kopieren. Oder im Admin „Inhalt kopieren“ |
| Spiel manuell starten | Doppelklick auf `▶ START Linux + Raspberry Pi.sh` im Spielordner |

Die Daten (Bestenliste, Leads) liegen im Ordner `~/.professor-vakuumus` auf der SD-Karte und bleiben auch nach dem Ausschalten erhalten. Trotzdem jeden Abend exportieren.

## Autostart wieder entfernen

```
rm ~/.config/autostart/professor-vakuumus.desktop
```
und in `~/.config/labwc/autostart` die Zeile mit `spiel-starten.sh` löschen.

## Hinweis

Die Skripte sind für Raspberry Pi OS (Bookworm) geschrieben, auf einem echten Pi aber noch nicht getestet. Rückmeldungen bitte als Issue.
