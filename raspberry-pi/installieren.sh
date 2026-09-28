#!/bin/bash
# Einmalig auf dem Raspberry Pi ausführen (Raspberry Pi OS mit Desktop):
#   bash raspberry-pi/installieren.sh
# Danach startet das Spiel bei jedem Einschalten automatisch im Vollbild.
set -e
DIR="$(cd "$(dirname "$0")/.." && pwd)"
START="$DIR/raspberry-pi/spiel-starten.sh"
chmod +x "$START" "$DIR/▶ START Linux + Raspberry Pi.sh" 2>/dev/null || true

echo "1/3 Programme installieren (braucht einmalig Internet) ..."
sudo apt-get update -y
sudo apt-get install -y unclutter || true
if ! command -v chromium-browser >/dev/null 2>&1 && ! command -v chromium >/dev/null 2>&1; then
  sudo apt-get install -y chromium-browser || sudo apt-get install -y chromium
fi

echo "2/3 Bildschirmschoner ausschalten ..."
if command -v raspi-config >/dev/null 2>&1; then sudo raspi-config nonint do_blanking 1 || true; fi

echo "3/3 Autostart einrichten ..."
# Standard-Autostart (ältere Desktops und alle, die XDG-Autostart unterstützen)
mkdir -p "$HOME/.config/autostart"
cat > "$HOME/.config/autostart/professor-vakuumus.desktop" <<DESK
[Desktop Entry]
Type=Application
Name=Professor Vakuumus
Exec="$START"
X-GNOME-Autostart-enabled=true
DESK
# Neuerer Raspberry-Pi-Desktop (labwc)
mkdir -p "$HOME/.config/labwc"
touch "$HOME/.config/labwc/autostart"
grep -q "spiel-starten.sh" "$HOME/.config/labwc/autostart" || echo "\"$START\" &" >> "$HOME/.config/labwc/autostart"

echo
echo "Fertig! Beim nächsten Neustart startet das Spiel automatisch."
echo "Jetzt testen: \"$START\"   (Beenden mit Alt + F4)"
echo "Autostart wieder entfernen: rm ~/.config/autostart/professor-vakuumus.desktop und die Zeile in ~/.config/labwc/autostart löschen."
