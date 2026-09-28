@echo off
rem Professor Vakuumus unter Windows starten (Edge im Vollbild, ohne Internet).
rem Beenden: Alt + F4
start "" msedge --app="file:///%~dp0index.html" --start-fullscreen --no-first-run --autoplay-policy=no-user-gesture-required
