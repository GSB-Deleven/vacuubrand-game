#!/bin/bash
# Professor Vakuumus unter Linux / Raspberry Pi OS starten (Chromium im Kiosk-Modus, ohne Internet).
# Beenden: Alt + F4 (oder Strg + W)
# Automatisch beim Einschalten starten: raspberry-pi/installieren.sh ausführen.
cd "$(dirname "$0")" || exit 1
exec ./raspberry-pi/spiel-starten.sh
