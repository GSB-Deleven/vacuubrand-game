#!/bin/bash
# Professor Vakuumus auf dem Mac starten: Doppelklick auf diese Datei.
# Erstes Mal: Rechtsklick -> "Öffnen" -> "Öffnen" (macOS fragt einmal nach).
# Nimmt Chrome oder Edge im Vollbild, falls installiert, sonst den Standardbrowser (Safari).
# Wichtig: Immer mit derselben Datei starten, sonst sieht ein anderer Browser eine leere Bestenliste.
cd "$(dirname "$0")" || exit 1
URL="file://$(pwd)/index.html"
for APP in "Google Chrome" "Microsoft Edge" "Chromium" "Brave Browser"; do
  if open -Ra "$APP" >/dev/null 2>&1; then
    open -na "$APP" --args --app="$URL" --start-fullscreen --no-first-run --autoplay-policy=no-user-gesture-required
    exit 0
  fi
done
open "index.html"
