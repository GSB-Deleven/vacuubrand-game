#!/bin/bash
# Startet das Spiel im Vollbild-Kiosk-Modus mit Chromium.
DIR="$(cd "$(dirname "$0")/.." && pwd)"
URL="file://$DIR/index.html"
BROWSER="$(command -v chromium-browser || command -v chromium || command -v google-chrome || true)"
if [ -z "$BROWSER" ]; then
  echo "Chromium wurde nicht gefunden. Bitte zuerst raspberry-pi/installieren.sh ausführen."
  exit 1
fi
# Mauszeiger ausblenden, falls unclutter installiert ist
command -v unclutter >/dev/null 2>&1 && (unclutter -idle 1 >/dev/null 2>&1 &)
# Eigenes Profil, damit Bestenliste und Leads immer am gleichen Ort gespeichert werden
exec "$BROWSER" --kiosk --noerrdialogs --disable-infobars --no-first-run \
  --disable-session-crashed-bubble --disable-features=Translate \
  --autoplay-policy=no-user-gesture-required --check-for-update-interval=31536000 \
  --user-data-dir="$HOME/.professor-vakuumus" "$URL"
