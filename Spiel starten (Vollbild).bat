@echo off
rem Startet den Vakuum-Professor im Vollbild mit Microsoft Edge.
rem Beenden: Alt + F4
start "" msedge --app="file:///%~dp0index.html" --start-fullscreen --no-first-run
