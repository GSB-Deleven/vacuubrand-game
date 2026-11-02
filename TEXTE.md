# ✏️ Professor Vacuumus: alle Spieltexte

> 📌 **Offene Aufgabe fürs Marketing:** alle Texte prüfen und freigeben oder umschreiben. Die Vorschläge unten sind ein Ausgangspunkt, keine Vorgabe.

Hier stehen alle Texte, die man im Spiel sieht, mit Ort, aktuellem Text und einem Vorschlag.

- ✅ **erledigt**: eindeutige Fehler, schon korrigiert
- ❓ **Vorschlag**: bitte prüfen und mit Ja, Nein oder eigenem Text antworten
- ⚪ **passt**: kein Änderungsbedarf gesehen

Die Pixelschrift kann nur **Grossbuchstaben**, eine Zeile hat Platz für ca. **50 Zeichen**. Bei Schildern und Bannern sind es 2 Zeilen. Tiefgestellte Zahlen (H₂O) und Sonderzeichen wie ⚠ kennt die Schrift nicht.

Für die Nummern bei der Rückmeldung reicht z. B. „T12 ja, T15 lieber: …“.

> 🌍 **Neu: Das Spiel gibt es auf Deutsch, Englisch und Französisch.** Alle Texte stehen technisch in `js/i18n.js`. Die deutschen Texte sind unverändert. Die englischen und französischen Texte sind **Entwürfe und vom Marketing zu prüfen** (Tabelle ganz unten, Abschnitt „Alle Texte in drei Sprachen“).
>
> 🇬🇧 **Startbildschirm:** Er erscheint immer auf **Englisch** (Wunsch David, damit er an jeder Messe passt), z. B. T189 SUCK UP THE LAB CHAOS!, T41 B = HIGH SCORES. Ab der Länderwahl gilt die Sprache des Spielers.
>
> ⚖️ **Einwilligung (T53) und Datenschutz-Hinweis (T55)** sind rechtlich wichtig. Die englische Fassung bitte mit der Rechtsabteilung bzw. dem Datenschutz für UK und Irland abstimmen, die französische für Frankreich. Bis dahin sind es nur Übersetzungsentwürfe.

---

## ✅ Bereits korrigiert

| Nr. | Ort | Vorher | Jetzt | Grund |
|---|---|---|---|---|
| T1 | Meldung beim Sturz ins Becken | IN DIE DESINFEKTIONSBAD GEFALLEN! / IN DIE FLÜSSIGSTICKSTOFF GEFALLEN! | INS DESINFEKTIONSBAD GEFALLEN! / IN DEN FLÜSSIGSTICKSTOFF GEFALLEN! | Artikel war falsch |
| T2 | Banner Handschuhe | SAUG-ENERGIE LÄDT DOPPELT SO SCHNELL. | SOG-LEISTE LÄDT DOPPELT SO SCHNELL. | gleiches Wort wie in der Anzeige („SOG“) |
| T40, T150 | Titel und Admin-Überschrift (alle Sprachen DE/EN/FR) | PROFESSOR VAKUUMUS | PROFESSOR VACUUMUS | Wunsch David: Name wie VACUUBRAND geschrieben |

---

## ❓ Vorschläge zur Freigabe

### Fachlich und Marketing (wichtig)

| Nr. | Ort | Aktuell | Vorschlag | Grund |
|---|---|---|---|---|
| T10 | Meldung bei leerer SOG-Leiste (2×) und Anzeige „HEISS“ | ÜBERHITZT! KURZ ABKÜHLEN LASSEN... | SOG-LEISTE LEER! KURZ DURCHATMEN... und in der Anzeige „LEER“ statt „HEISS“ | Eine VACUUBRAND Pumpe, die im Spiel dauernd „überhitzt“, ist keine gute Botschaft am eigenen Stand |
| T11 | Slogan PC 3001 VARIO select, Zeile 2 | MEHR SOG: JETZT AUCH RUNDKOLBEN! | MEHR SAUGVERMÖGEN FÜR SCHWERERES CHAOS! | „Saugt Rundkolben“ klingt nach Feststoffen. Im Spiel ist Einsaugen zwar die Spielidee, beim Produktslogan wäre ich aber vorsichtig |
| T12 | Titel beim Pumpen-Banner VACUU·PURE 10C | VACUU·PURE 10C | SCHRAUBENPUMPE VACUU·PURE 10C | analog zu „MEMBRANPUMPE ME 1C“. Bitte prüfen, ob die Bezeichnung so stimmt |
| T13 | Titel beim Pumpen-Banner PC 3001 | PC 3001 VARIO SELECT | VAKUUMPUMPSTAND PC 3001 VARIO SELECT | gleiche Logik wie T12. Bitte die korrekte Produktbezeichnung bestätigen |
| T14 | ~~Meldung, wenn die BVC etwas nicht absaugen kann~~ | ~~DIE BVC SAUGT NUR FLÜSSIGKEITEN!~~ | entfällt | ✅ Die BVC saugt jetzt alles ein, die Meldung gibt es nicht mehr |
| T15 | Slogan VACUU·PURE 10C | ÖLFREI: GEFRIERTROCKNUNG · SCHLENK · TURBO / MAXIMALER SOG! | ÖLFREI: GEFRIERTROCKNUNG · SCHLENK · TURBO / DAS STÄRKSTE IM LABOR! | „Maximaler Sog“ ist eine absolute Aussage. Die zweite Zeile ist aber reiner Spieltext, auch „MAXIMALER SOG!“ geht, wenn du es so willst |

### Steuerung, weil jetzt auch Controller gehen

| Nr. | Ort | Aktuell | Vorschlag | Grund |
|---|---|---|---|---|
| T20 | Schild im Level 1 | LEERTASTE HALTEN / = SAUGEN! | SAUGEN: LEERTASTE / ODER B HALTEN! | auch für Gamepad-Spieler |
| T21 | Startbildschirm, Knopf | ENTER = START | ENTER / START = SPIELEN | auch für Gamepad |
| T22 | Anleitung vor der Runde, unten | ENTER = START | ENTER / START = LOS GEHT'S | gleich wie T21 |

### Tonalität und Einheitlichkeit

| Nr. | Ort | Aktuell | Vorschlag | Grund |
|---|---|---|---|---|
| T30 | Leere Bestenliste | NOCH KEINE EINTRÄGE. / SEI DER ERSTE! | NOCH KEINE EINTRÄGE. / HOL DIR PLATZ 1! | neutral für alle |
| T31 | Meldung BVC ausserhalb des Labors | DIE BVC BLEIBT IM ZELLKULTUR-LABOR - WEITER MIT DER PUMPE! | DIE BVC BLEIBT IM ZELLKULTUR-LABOR. WEITER MIT DER PUMPE! | Punkt statt Bindestrich, liest sich ruhiger |
| T32 | Ergebnis bei Testrunde | TESTRUNDE - NICHT IN DER BESTENLISTE | TESTRUNDE: NICHT IN DER BESTENLISTE | gleich wie T31 |
| T33 | Pumpe fällt ins Becken | OH NEIN, DIE PUMPE IST WEG! NÄCHSTER KOLBEN-BLOCK... | OH NEIN, DIE PUMPE IST WEG! HOL DIR DIE NÄCHSTE! | kürzer, aktiver |
| T34 | Bestenliste nach dem Ergebnis | DANKE FÜRS SPIELEN!  ENTER = WEITER | DANKE FÜRS MITSPIELEN! BESUCH UNS AM STAND! | Hinweis aufs Gespräch am Stand. Weiter geht es dann automatisch oder mit Enter |

---

## 🆕 Neue Texte (Chemielabor, QR-Code, Preise) zur Prüfung

| Nr. | Ort | Text |
|---|---|---|
| T160 | Schild Zone 4 | CHEMIELABOR: / MD 4C VARIO SELECT |
| T161 | Banner neue Pumpe (Titel) | MD 4C VARIO SELECT |
| T162 | Banner neue Pumpe (Text) | CHEMIEFEST: DESTILLATION · TROCKNUNG / VACUU·SELECT REGELT AUTOMATISCH! |
| T163 | Meldung Zonenwechsel | ZONE 4: CHEMIELABOR (Hochvakuum ist jetzt ZONE 5) |
| T164 | Poster im Hintergrund | MD 4C VARIO SELECT |
| T165 | Sturz ins Becken Zone 4 | IN DIE SÄURE-AUFFANGWANNE GEFALLEN! |
| T166 | Gegnernamen Zone 4 | Säuredampf, Scheidetrichter |
| T167 | Kontakt-Seite nach dem Ergebnis, Titel | KONTAKT |
| T170 | Kontakt-Seite | HANDY-KAMERA AUF / DEN CODE RICHTEN: |
| T171 | Kontakt-Seite | DEIN DIREKTER DRAHT / ZU VACUUBRAND. |
| T172 | Kontakt-Seite unten | ENTER = WEITER / TIPPEN = WEITER |
| T168 | Startbildschirm unten links | ZU GEWINNEN: *Preis aus dem Admin* |
| T169 | Bestenliste, unten in jedem Kasten | PREIS: *Tagespreis / Hauptpreis* |

## 🆕 Neue Texte (Länderwahl und Mehrsprachigkeit) zur Prüfung

Die Übersetzungen dazu stehen in der grossen Tabelle unten.

| Nr. | Ort | Text |
|---|---|---|
| T180 | Länderwahl, Titel | LAND UND SPRACHE |
| T181 | Länderwahl, Hinweis unten | ← → LAND   ↑ ↓ SPRACHE   ENTER = OK / Touch: SPRACHE WÄHLEN, DANN FLAGGE ANTIPPEN |
| T182 | Länderwahl, Namen unter den Flaggen (in `js/config.js`) | SCHWEIZ / SUISSE · DEUTSCHLAND · UK / IRELAND · FRANCE |
| T183 | Länderwahl, Sprachzeile (jede Sprache in sich selbst) | DEUTSCH · ENGLISH · FRANÇAIS |
| T184 | Touch-Knöpfe | SPRUNG · SAUGEN |
| T185 | Handy hochkant gehalten | BITTE GERÄT QUER HALTEN |
| T186 | Hinweis auf iPhone/iPad | Für Vollbild: unten auf Teilen tippen und „Zum Home-Bildschirm“ wählen. |
| T187 | Online-Demo, Spitzname-Seite | ONLINE-DEMO / Keine Anmeldung nötig. … / Spitzname / GAST |
| T188 | Name in der Bestenliste, falls leer | SPIELER |
| T189 | Startbildschirm, Untertitel | SAUG DAS LABOR-CHAOS WEG! |
| T191 | 🆕 Messe mit Admin-Schalter „Nur Spitzname“: Überschrift der Spitzname-Seite (statt ONLINE-DEMO; Rest wie T187) | WILLKOMMEN! |

---

## ⚪ Alle übrigen Texte (passen aus meiner Sicht)

Falls dir hier trotzdem etwas nicht gefällt, einfach die Nummer nennen.

### Startbildschirm und Bestenliste

| Nr. | Text |
|---|---|
| T40 | VACUUBRAND (Logo) / PROFESSOR / VACUUMUS |
| T41 | B = BESTENLISTE |
| T42 | HEUTE FÜHRT: *Name, Punkte* |
| T43 | MESSE 2026 (im Admin einstellbar) |
| T44 | BESTENLISTE / HEUTE / GESAMT · MESSE 2026 |
| T45 | B / ESC = ZURÜCK    ENTER = START |

### Anmeldung (HTML-Formular)

| Nr. | Text |
|---|---|
| T50 | SPIELER-ANMELDUNG |
| T51 | Nur Vorname + erster Buchstabe des Nachnamens erscheinen in der Bestenliste. |
| T52 | Felder: Vorname, Name, Firma, E-Mail (alle Pflicht) |
| T53 | Einwilligung (Pflicht): Ich bin einverstanden, dass VACUUBRAND mich im Rahmen des Gewinnspiels und zu Produktinformationen kontaktiert. **👉 bitte mit Datenschutz abstimmen** |
| T54 | Newsletter (freiwillig): Ja, ich möchte zusätzlich den VACUUBRAND Newsletter erhalten. |
| T55 | Hinweis: Die Daten werden nur lokal auf diesem Gerät gespeichert und ausschliesslich für das Gewinnspiel und die Kontaktaufnahme verwendet. **👉 bitte mit Datenschutz abstimmen** |
| T56 | Knöpfe: ESC · ZURÜCK / ENTER · LOS GEHT'S! |
| T57 | Fehler: Bitte ausfüllen: … / E-Mail (ungültig) / Bitte die Einwilligung ankreuzen, um am Gewinnspiel teilzunehmen. |

### Anleitung vor der Runde

| Nr. | Text |
|---|---|
| T60 | SO GEHT'S |
| T61 | ← → LAUFEN · ↑ SPRINGEN · ↓ DUCKEN · LEERTASTE SAUGEN · SHIFT/CTRL SPRINTEN · CONTROLLER GEHT AUCH |
| T62 | SOG + SPRINT SIND BEGRENZT: LEISTEN BEACHTEN! |
| T63 | KOLBEN-BLÖCKE VON UNTEN ANSPRINGEN: PUMPEN · SCHUTZAUSRÜSTUNG · +10 S |
| T64 | SAUG IN 120 SEK SO VIEL CHAOS WIE MÖGLICH EIN! |
| T65 | Countdown 3, 2, 1 / LOS! |

### Schilder im Level

| Nr. | Zone | Text |
|---|---|---|
| T70 | 1 | SPRING VON UNTEN GEGEN / DEN KOLBEN-BLOCK! |
| T71 | 1 | ME 1C: IDEAL FÜR / DIE FILTRATION |
| T72 | 2 | ZELLKULTUR-LABOR: / HOL DIR DIE BVC! |
| T73 | 3 | PC 3001 VARIO SELECT: / IDEAL FÜR DEN ROTAVAP |
| T74 | 4 | VACUU·PURE 10C: / IDEAL FÜR ÖLFREIE TROCKNUNG |
| T75 | 4 | ACHTUNG: / DAMPF-KRAKE! |
| T76 | Ende | EXIT |

### Banner im Boden (beim Einsammeln)

> Die Produkt-Banner (Pumpen, BVC professional, VACUU·VIEW extended) sind vorerst **ausgeschaltet**, bis das Marketing die Texte freigegeben hat. Einschalten: `productBanners: true` in `js/config.js`. Schutzausrüstung und „LABOR GERETTET!“ erscheinen immer.

| Nr. | Titel | Text |
|---|---|---|
| T80 | MEMBRANPUMPE ME 1C | IDEAL FÜR DIE FILTRATION |
| T81 | PC 3001 VARIO SELECT | ROTAVAP · VAKUUM-KONZENTRATOR · TROCKENSCHRANK / *(Zeile 2 siehe T11)* |
| T82 | VACUU·PURE 10C | *(siehe T12, T15)* |
| T83 | PUMPE BVC PROFESSIONAL | MIT VHC: MEDIENABSAUGUNG / PUNKTE ×2 |
| T84 | VACUU·VIEW EXTENDED | ZEITVAKUUM: +10 SEKUNDEN! |
| T85 | SCHUTZBRILLE | TREFFER KOSTEN NUR NOCH 1 SEKUNDE. |
| T86 | HANDSCHUHE | SOG-LEISTE LÄDT DOPPELT SO SCHNELL. |
| T87 | SCHUTZHELM | GEGNER VON UNTEN WEGKÖPFEN! |
| T88 | SICHERHEITSSCHUHE | AUF GEGNER SPRINGEN ZERSTÖRT SIE! |
| T89 | VOLLSCHUTZ! | KOMPLETTE SCHUTZAUSRÜSTUNG: / NICHTS KANN DIR MEHR SCHADEN! |
| T90 | LABOR GERETTET! | SCHNELL ZUM AUSGANG → / RESTZEIT GIBT BONUSPUNKTE! |

### Meldungen im Boden

| Nr. | Text |
|---|---|
| T100 | ZONE 1: FILTRATIONSLABOR (und Zonen 2 bis 4: ZELLKULTUR-LABOR, VERDAMPFER-LABOR, HOCHVAKUUM-TECHNIKUM) |
| T101 | KEINE PUMPE! SPRING GEGEN DEN KOLBEN-BLOCK! |
| T102 | ZU SCHWER! DU BRAUCHST EINE STÄRKERE PUMPE! |
| T103 | MIT SICHERHEITSSCHUHEN KÖNNTEST DU SIE ZERTRETEN! |
| T104 | DIE DAMPF-KRAKE! SAUG SIE WEG! |
| T105 | DIE KRAKE IST ZU STARK! HOL DIR DIE VACUU·PURE 10C! |
| T106 | GLEICH HAST DU SIE! |
| T107 | ERST DIE DAMPF-KRAKE EINSAUGEN! |
| T108 | IN DIE FILTRAT-WANNE / INS DESINFEKTIONSBAD / IN DIE LÖSEMITTEL-AUFFANGWANNE / IN DEN FLÜSSIGSTICKSTOFF GEFALLEN! |
| T109 | CONTROLLER VERBUNDEN |

### Kurze Einblendungen über dem Professor

| Nr. | Text |
|---|---|
| T110 | AUTSCH! / −3 SEK / +10 SEK / +500 / +250 ×3 / Name des Moleküls (H2O, O2, N2, H2O2, METHANOL, ETHANOL) |

### Anzeige oben (HUD)

| Nr. | Text |
|---|---|
| T120 | PUNKTE · Pumpenname oder KEINE PUMPE oder BVC PROFESSIONAL · ZEIT |
| T121 | SOG (siehe T10) · SPRINT |
| T122 | COMBO ×2 bis ×8 · VORBEI |
| T123 | DAMPF-KRAKE (Lebensleiste) |

### Ende der Runde und Ergebnis

| Nr. | Text |
|---|---|
| T130 | ZEIT ABGELAUFEN! / GESCHAFFT! / RESTZEIT … SEK = BONUS! |
| T131 | PAUSE / ESC / START = WEITERSPIELEN / ENTER = RUNDE ABBRECHEN |
| T132 | LABOR GERETTET! oder ZEIT ABGELAUFEN! |
| T133 | EINGESAUGT · PUMPE · SCHUTZ · BESTE COMBO · PUNKTE · ZEITBONUS · MEDAILLEN · GESAMT |
| T134 | Medaillen: KRAKE BEZWUNGEN · VOLLSCHUTZ · UNVERLETZT · TOP-PUMPE · COMBO-PROFI · ZEITMEISTER |
| T135 | PLATZ … HEUTE · PLATZ … GESAMT / DEIN BESTWERT: … / ★ TAGESBESTWERT! ★ |
| T136 | ENTER = BESTENLISTE |

### Gegnernamen (erscheinen nur bei Molekülen)

| Nr. | Text |
|---|---|
| T140 | Filtrat-Tropfen, Schmutzpartikel, Filterpapier, Reagenzglas, Nährmedium, Petri-Schleim, Wellplatte, Lösemitteldampf, Rundkolben, Hitzedampf, Messbecher, Eppi, Eiskristall, Schlenk-Kolben, Argon-Flasche, Siedeblase, Dampf-Krake |

### Admin-Bereich (nur fürs Personal)

| Nr. | Text |
|---|---|
| T150 | ADMIN · PROFESSOR VACUUMUS, Übersicht, Top 3 heute (Tagespreis), Top 3 gesamte Messe, Export & Sicherung, Einstellungen, Letzte Runden, Gefahrenzone, Knöpfe und Bestätigungen. Sachlich und für das Personal verständlich |
| T190 | 🆕 Admin, klein unter der Überschrift: Version … (Nummer aus `CONFIG.version`, z. B. 0.9.0), damit man am Stand sieht, welche Version läuft |
| T192 | 🆕 Admin, Schalter „Nur Spitzname“: Nur Spitzname (keine Lead-Erfassung) / Für Anlässe ohne Lead-Sammlung: Spieler geben nur einen Spitznamen ein, wie in der Online-Version. Keine E-Mail, keine Firma, keine Einwilligung. Länderwahl, Bestenliste und QR-Code bleiben. |
| T193 | 🆕 Admin, gelber Balken oben, solange der Schalter an ist: NUR SPITZNAME IST AKTIV: Es werden keine Leads erfasst. An einer Lead-Messe unten bei Einstellungen ausschalten! |
| T194 | 🆕 Admin, Übersicht und Tabellen: · … Spitznamen (keine Leads) / Spitzname; Runden-Export Spalten: Art (Lead / Spitzname), Spitzname |

---

## 🌍 Alle Texte in drei Sprachen

Englisch und Französisch sind **Entwürfe, vom Marketing zu prüfen**. ⚖️ = rechtlich wichtig (Rechtsabteilung bzw. Datenschutz im jeweiligen Land). „…“ steht für eine Zahl oder einen Namen, den das Spiel einsetzt. „ / “ bedeutet neue Zeile. Mehrere Texte in einer Zelle sind untereinander aufgeführt.

Für Französisch kennt die Pixelschrift jetzt auch É È Ê Ë À Â Ç Î Ï Ô Û Ù Œ. Platz: wie auf Deutsch ca. 50 Zeichen pro Zeile, Schilder und Banner max. 2 Zeilen. Ein automatischer Test prüft bei jeder Änderung, dass alle Texte in ihre Kästen passen.

Den Admin-Bereich (T150) gibt es auf Deutsch und Englisch (Einstellung „Admin-Sprache“), nicht auf Französisch.

| Nr. | Ort | Deutsch | Englisch (Entwurf) | Französisch (Entwurf) |
|---|---|---|---|---|
| T189 | Startbildschirm, Untertitel | SAUG DAS LABOR-CHAOS WEG! | SUCK UP THE LAB CHAOS! | ASPIRE LE CHAOS DU LABO! |
| T21 | Startbildschirm, Knopf (Tastatur / Touch) | ENTER = START<br>TIPPEN = START | ENTER = START<br>TAP = START | ENTRÉE = JOUER<br>TOUCHER = JOUER |
| T41 | Startbildschirm, Knopf Bestenliste | B = BESTENLISTE<br>BESTENLISTE | B = HIGH SCORES<br>HIGH SCORES | B = CLASSEMENT<br>CLASSEMENT |
| T42 | Startbildschirm, Siegerschild | HEUTE FÜHRT: | TODAY'S LEADER: | EN TÊTE AUJOURD'HUI: |
| T168 | Startbildschirm unten links | ZU GEWINNEN: … | TO WIN: … | À GAGNER: … |
| T44 | Bestenliste, Titel und Spalten | BESTENLISTE<br>HEUTE<br>GESAMT · … | HIGH SCORES<br>TODAY<br>OVERALL · … | CLASSEMENT<br>AUJOURD'HUI<br>TOTAL · … |
| T169 | Bestenliste, Preis | PREIS: … | PRIZE: … | PRIX: … |
| T30 | Leere Bestenliste | NOCH KEINE EINTRÄGE. / SEI DER ERSTE! | NO ENTRIES YET. / BE THE FIRST! | PAS ENCORE DE SCORES. / SOIS LE PREMIER! |
| T45 | Bestenliste vom Titel aus | B / ESC = ZURÜCK    ENTER = START<br>TIPPEN = ZURÜCK | B / ESC = BACK    ENTER = START<br>TAP = BACK | B / ÉCHAP = RETOUR    ENTRÉE = JOUER<br>TOUCHER = RETOUR |
| T34 | Bestenliste nach dem Ergebnis | DANKE FÜRS SPIELEN!  ENTER = WEITER<br>DANKE FÜRS SPIELEN!  TIPPEN = WEITER | THANKS FOR PLAYING!  ENTER = NEXT<br>THANKS FOR PLAYING!  TAP = NEXT | MERCI D'AVOIR JOUÉ!  ENTRÉE = SUITE<br>MERCI D'AVOIR JOUÉ!  TOUCHER = SUITE |
| T180 | 🆕 Länderwahl, Titel | LAND UND SPRACHE | COUNTRY AND LANGUAGE | PAYS ET LANGUE |
| T181 | 🆕 Länderwahl, Hinweis unten (Tastatur / Touch) | ← → LAND   ↑ ↓ SPRACHE   ENTER = OK<br>SPRACHE WÄHLEN, DANN FLAGGE ANTIPPEN | ← → COUNTRY   ↑ ↓ LANGUAGE   ENTER = OK<br>CHOOSE LANGUAGE, THEN TAP A FLAG | ← → PAYS   ↑ ↓ LANGUE   ENTRÉE = OK<br>CHOISIS LA LANGUE, PUIS TOUCHE UN DRAPEAU |
| T50 | Anmeldung, Titel | SPIELER-ANMELDUNG | PLAYER REGISTRATION | INSCRIPTION DU JOUEUR |
| T51 | Anmeldung, Hinweis | Nur Vorname + erster Buchstabe des Nachnamens erscheinen in der Bestenliste. | Only your first name and the first letter of your last name appear on the high score list. | Seuls le prénom et la première lettre du nom apparaissent dans le classement. |
| T52 | Anmeldung, Felder | Vorname<br>Name<br>Firma<br>E-Mail | First name<br>Last name<br>Company<br>Email | Prénom<br>Nom<br>Entreprise<br>E-mail |
| T53 | ⚖️ Einwilligung (Pflicht) | Ich bin einverstanden, dass VACUUBRAND mich im Rahmen des Gewinnspiels und zu Produktinformationen kontaktiert. | I agree that VACUUBRAND may contact me in connection with the prize draw and with product information. | J'accepte que VACUUBRAND me contacte dans le cadre du jeu-concours et pour des informations sur les produits. |
| T54 | Newsletter (freiwillig) | Ja, ich möchte zusätzlich den VACUUBRAND Newsletter erhalten. | Yes, I would also like to receive the VACUUBRAND newsletter. | Oui, je souhaite aussi recevoir la newsletter VACUUBRAND. |
| T55 | ⚖️ Datenschutz-Hinweis | Die Daten werden nur lokal auf diesem Gerät gespeichert und ausschliesslich für das Gewinnspiel und die Kontaktaufnahme verwendet. | Your data is stored only locally on this device and used exclusively for the prize draw and to contact you. | Les données sont enregistrées uniquement sur cet appareil et utilisées exclusivement pour le jeu-concours et la prise de contact. |
| T56 | Anmeldung, Knöpfe | ESC · ZURÜCK<br>ENTER · LOS GEHT'S! | ESC · BACK<br>ENTER · LET'S GO! | ÉCHAP · RETOUR<br>ENTRÉE · C'EST PARTI! |
| T57 | Anmeldung, Fehler | Bitte ausfüllen: …<br>… (ungültig)<br>Bitte die Einwilligung ankreuzen, um am Gewinnspiel teilzunehmen. | Please fill in: …<br>… (invalid)<br>Please tick the consent box to take part in the prize draw. | Merci de remplir: …<br>… (non valide)<br>Merci de cocher le consentement pour participer au jeu-concours. |
| T187 | Online-Demo: Spitzname-Seite | ONLINE-DEMO<br>Keine Anmeldung nötig. Wie sollen wir dich in der Bestenliste nennen?<br>Spitzname<br>GAST<br>ZURÜCK<br>LOS GEHT'S!<br>Deine Punkte werden nur auf diesem Gerät gespeichert. Es werden keine Daten übertragen. | ONLINE DEMO<br>No registration needed. What name should we show on the high score list?<br>Nickname<br>GUEST<br>BACK<br>LET'S GO!<br>Your points are stored only on this device. No data is transmitted. | DÉMO EN LIGNE<br>Pas d'inscription nécessaire. Quel nom afficher dans le classement?<br>Pseudo<br>INVITÉ<br>RETOUR<br>C'EST PARTI!<br>Tes points sont enregistrés uniquement sur cet appareil. Aucune donnée n'est transmise. |
| T60 | Anleitung, Titel | SO GEHT'S | HOW TO PLAY | COMMENT JOUER |
| T61 | Anleitung, Steuerung | LAUFEN<br>SPRINGEN<br>DUCKEN<br>SAUGEN<br>HALTEN<br>PAUSE<br>SPRINTEN<br>GEHT AUCH<br>LEERTASTE<br>SHIFT/CTRL<br>CONTROLLER | WALK<br>JUMP<br>DUCK<br>SUCK<br>HOLD<br>PAUSE<br>SPRINT<br>WORKS TOO<br>SPACE<br>SHIFT/CTRL<br>CONTROLLER | MARCHER<br>SAUTER<br>SE BAISSER<br>ASPIRER<br>MAINTENIR<br>PAUSE<br>SPRINTER<br>COMPATIBLE<br>ESPACE<br>MAJ/CTRL<br>MANETTE |
| T62 | Anleitung | SOG + SPRINT SIND BEGRENZT: LEISTEN BEACHTEN! | SUCTION + SPRINT ARE LIMITED: WATCH THE BARS! | ASPI + SPRINT LIMITÉS: SURVEILLE LES JAUGES! |
| T63 | Anleitung, Kolben-Blöcke | KOLBEN-BLÖCKE VON UNTEN ANSPRINGEN:<br>PUMPEN<br>SCHUTZAUSRÜSTUNG | JUMP UP AGAINST THE FLASK BLOCKS:<br>PUMPS<br>SAFETY GEAR | SAUTE SOUS LES BLOCS BALLONS:<br>POMPES<br>PROTECTIONS |
| T64 | Anleitung, Ziel | SAUG IN … SEK SO VIEL CHAOS WIE MÖGLICH EIN! | SUCK UP AS MUCH CHAOS AS YOU CAN IN … SEC! | ASPIRE UN MAX DE CHAOS EN … SEC! |
| T22 | Anleitung, unten (Tastatur / Touch) | ENTER = START<br>TIPPEN = START | ENTER = START<br>TAP = START | ENTRÉE = JOUER<br>TOUCHER = JOUER |
| T65 | Countdown | LOS! | GO! | PARTEZ! |
| T184 | 🆕 Touch-Knöpfe | SPRUNG<br>SAUGEN | JUMP<br>SUCK | SAUT<br>ASPIRER |
| T185 | 🆕 Handy hochkant | BITTE GERÄT QUER HALTEN | PLEASE TURN YOUR DEVICE SIDEWAYS | TOURNE L'APPAREIL À L'HORIZONTALE |
| T186 | 🆕 iPhone/iPad-Hinweis Vollbild | 📲 Für Vollbild: unten auf Teilen tippen und „Zum Home-Bildschirm“ wählen. | 📲 For full screen: tap Share below and choose “Add to Home Screen”. | 📲 Pour le plein écran: touche Partager en bas et choisis « Sur l’écran d’accueil ». |
| T70 | Schild Zone 1 | SPRING VON UNTEN GEGEN / DEN KOLBEN-BLOCK! | JUMP UP AGAINST / THE FLASK BLOCK! | SAUTE SOUS / LE BLOC BALLON! |
| T20 | Schild Zone 1 (Tastatur / Touch) | LEERTASTE HALTEN / = SAUGEN!<br>KNOPF SAUGEN HALTEN / = SAUGEN! | HOLD SPACE / = SUCK!<br>HOLD THE SUCK BUTTON / = SUCK! | MAINTIENS ESPACE / = ASPIRER!<br>MAINTIENS LE BOUTON / ASPIRER! |
| T71 | Schild Zone 1 | ME 1C: IDEAL FÜR / DIE FILTRATION | ME 1C: IDEAL FOR / FILTRATION | ME 1C: IDÉALE POUR / LA FILTRATION |
| T72 | Schild Zone 2 | ZELLKULTUR-LABOR: / HOL DIR DIE BVC! | CELL CULTURE LAB: / GRAB THE BVC! | LABO DE CULTURE CELLULAIRE: / PRENDS LA BVC! |
| T73 | Schild Zone 3 | PC 3001 VARIO SELECT: / IDEAL FÜR DEN ROTAVAP | PC 3001 VARIO SELECT: / IDEAL FOR THE ROTAVAP | PC 3001 VARIO SELECT: / IDÉAL POUR LE ROTAVAP |
| T160 | Schild Zone 4 | CHEMIELABOR: / MD 4C VARIO SELECT | CHEMISTRY LAB: / MD 4C VARIO SELECT | LABO DE CHIMIE: / MD 4C VARIO SELECT |
| T74 | Schild Zone 5 | VACUU·PURE 10C: / IDEAL FÜR ÖLFREIE TROCKNUNG | VACUU·PURE 10C: / IDEAL FOR OIL-FREE DRYING | VACUU·PURE 10C: / IDÉALE POUR LE SÉCHAGE SANS HUILE |
| T75 | Schild vor dem Endgegner | ACHTUNG: / DAMPF-KRAKE! | WARNING: / STEAM KRAKEN! | ATTENTION: / PIEUVRE À VAPEUR! |
| T76 | Ausgang | EXIT | EXIT | SORTIE |
| T80 | Banner ME 1C (vorerst aus) | MEMBRANPUMPE ME 1C<br>IDEAL FÜR DIE FILTRATION | DIAPHRAGM PUMP ME 1C<br>IDEAL FOR FILTRATION | POMPE À MEMBRANE ME 1C<br>IDÉALE POUR LA FILTRATION |
| T81 | Banner PC 3001 (vorerst aus) | PC 3001 VARIO SELECT<br>ROTAVAP · VAKUUM-KONZENTRATOR · TROCKENSCHRANK / MEHR SOG: JETZT AUCH RUNDKOLBEN! | PC 3001 VARIO SELECT<br>ROTAVAP · VACUUM CONCENTRATOR · DRYING OVEN / MORE SUCTION: NOW ROUND FLASKS TOO! | PC 3001 VARIO SELECT<br>ROTAVAP · CONCENTRATEUR SOUS VIDE · ÉTUVE / PLUS D'ASPIRATION: MÊME LES BALLONS! |
| T161 | Banner MD 4C (vorerst aus) | MD 4C VARIO SELECT<br>CHEMIEFEST: DESTILLATION · TROCKNUNG / VACUU·SELECT REGELT AUTOMATISCH! | MD 4C VARIO SELECT<br>CHEMISTRY-PROOF: DISTILLATION · DRYING / VACUU·SELECT CONTROLS AUTOMATICALLY! | MD 4C VARIO SELECT<br>RÉSISTANTE À LA CHIMIE: DISTILLATION · SÉCHAGE / VACUU·SELECT RÈGLE TOUT SEUL! |
| T82 | Banner VACUU·PURE 10C (vorerst aus) | VACUU·PURE 10C<br>ÖLFREI: GEFRIERTROCKNUNG · SCHLENK · TURBO / MAXIMALER SOG! | VACUU·PURE 10C<br>OIL-FREE: FREEZE DRYING · SCHLENK · TURBO / MAXIMUM SUCTION! | VACUU·PURE 10C<br>SANS HUILE: LYOPHILISATION · SCHLENK · TURBO / ASPIRATION MAXIMALE! |
| T83 | Banner BVC professional (vorerst aus) | PUMPE BVC PROFESSIONAL<br>MIT VHC: MEDIENABSAUGUNG / PUNKTE ×2 | BVC PROFESSIONAL PUMP<br>WITH VHC: LIQUID ASPIRATION / POINTS ×2 | POMPE BVC PROFESSIONAL<br>AVEC VHC: ASPIRATION DE LIQUIDES / POINTS ×2 |
| T84 | Banner VACUU·VIEW extended (vorerst aus) | VACUU·VIEW EXTENDED<br>ZEITVAKUUM: +… SEKUNDEN! | VACUU·VIEW EXTENDED<br>TIME VACUUM: +… SECONDS! | VACUU·VIEW EXTENDED<br>VIDE TEMPOREL: +… SECONDES! |
| T85 | Banner Schutzbrille | SCHUTZBRILLE<br>TREFFER KOSTEN NUR NOCH 1 SEKUNDE. | SAFETY GOGGLES<br>HITS NOW ONLY COST 1 SECOND. | LUNETTES DE PROTECTION<br>UN CHOC NE COÛTE PLUS QUE 1 SECONDE. |
| T86 | Banner Handschuhe | HANDSCHUHE<br>SOG-LEISTE LÄDT DOPPELT SO SCHNELL. | GLOVES<br>SUCTION BAR RECHARGES TWICE AS FAST. | GANTS<br>LA JAUGE D'ASPIRATION SE RECHARGE 2× PLUS VITE. |
| T87 | Banner Schutzhelm | SCHUTZHELM<br>GEGNER VON UNTEN WEGKÖPFEN! | SAFETY HELMET<br>HEADBUTT ENEMIES FROM BELOW! | CASQUE<br>ÉLIMINE LES ENNEMIS PAR EN DESSOUS! |
| T88 | Banner Sicherheitsschuhe | SICHERHEITSSCHUHE<br>AUF GEGNER SPRINGEN ZERSTÖRT SIE! | SAFETY SHOES<br>JUMPING ON ENEMIES DESTROYS THEM! | CHAUSSURES DE SÉCURITÉ<br>SAUTER SUR LES ENNEMIS LES DÉTRUIT! |
| T89 | Banner Vollschutz | VOLLSCHUTZ!<br>KOMPLETTE SCHUTZAUSRÜSTUNG: / NICHTS KANN DIR MEHR SCHADEN! | FULL PROTECTION!<br>COMPLETE SAFETY GEAR: / NOTHING CAN HURT YOU NOW! | PROTECTION TOTALE!<br>ÉQUIPEMENT DE PROTECTION COMPLET: / PLUS RIEN NE PEUT T'ARRIVER! |
| T90 | Banner Labor gerettet | LABOR GERETTET!<br>SCHNELL ZUM AUSGANG → / RESTZEIT GIBT BONUSPUNKTE! | LAB SAVED!<br>QUICK, TO THE EXIT → / TIME LEFT GIVES BONUS POINTS! | LABO SAUVÉ!<br>VITE, VERS LA SORTIE → / LE TEMPS RESTANT DONNE DES BONUS! |
| T100 | Meldung Zonenwechsel und Zonen | ZONE …: …<br>FILTRATIONSLABOR<br>ZELLKULTUR-LABOR<br>VERDAMPFER-LABOR<br>CHEMIELABOR<br>HOCHVAKUUM-TECHNIKUM | ZONE …: …<br>FILTRATION LAB<br>CELL CULTURE LAB<br>EVAPORATION LAB<br>CHEMISTRY LAB<br>HIGH VACUUM PILOT PLANT | ZONE …: …<br>LABO DE FILTRATION<br>LABO DE CULTURE CELLULAIRE<br>LABO D'ÉVAPORATION<br>LABO DE CHIMIE<br>HALL DE VIDE POUSSÉ |
| T101 | Meldung | KEINE PUMPE! SPRING GEGEN DEN KOLBEN-BLOCK! | NO PUMP! JUMP UP AGAINST THE FLASK BLOCK! | PAS DE POMPE! SAUTE SOUS LE BLOC BALLON! |
| T102 | Meldung | ZU SCHWER! DU BRAUCHST EINE STÄRKERE PUMPE! | TOO HEAVY! YOU NEED A STRONGER PUMP! | TROP LOURD! IL TE FAUT UNE POMPE PLUS PUISSANTE! |
| T10 | Meldung leere SOG-Leiste | ÜBERHITZT! KURZ ABKÜHLEN LASSEN... | OVERHEATED! LET IT COOL DOWN... | SURCHAUFFE! LAISSE REFROIDIR UN PEU... |
| T103 | Meldung | MIT SICHERHEITSSCHUHEN KÖNNTEST DU SIE ZERTRETEN! | WITH SAFETY SHOES YOU COULD STOMP THEM! | AVEC DES CHAUSSURES DE SÉCURITÉ, TU POURRAIS LES ÉCRASER! |
| T104 | Meldung | DIE DAMPF-KRAKE! SAUG SIE WEG! | THE STEAM KRAKEN! SUCK IT UP! | LA PIEUVRE À VAPEUR! ASPIRE-LA! |
| T105 | Meldung | DIE KRAKE IST ZU STARK! HOL DIR DIE VACUU·PURE 10C! | THE KRAKEN IS TOO STRONG! GET THE VACUU·PURE 10C! | LA PIEUVRE EST TROP FORTE! PRENDS LA VACUU·PURE 10C! |
| T106 | Meldung | GLEICH HAST DU SIE! | ALMOST GOT IT! | TU Y ES PRESQUE! |
| T107 | Meldung | ERST DIE DAMPF-KRAKE EINSAUGEN! | SUCK UP THE STEAM KRAKEN FIRST! | ASPIRE D'ABORD LA PIEUVRE À VAPEUR! |
| T31 | Meldung BVC | DIE BVC BLEIBT IM ZELLKULTUR-LABOR - WEITER MIT DER PUMPE!<br>DIE BVC BLEIBT IM ZELLKULTUR-LABOR! | THE BVC STAYS IN THE CELL CULTURE LAB - CARRY ON WITH THE PUMP!<br>THE BVC STAYS IN THE CELL CULTURE LAB! | LA BVC RESTE AU LABO DE CULTURE CELLULAIRE - CONTINUE AVEC LA POMPE!<br>LA BVC RESTE AU LABO DE CULTURE CELLULAIRE! |
| T33 | Meldung Pumpe ins Becken | OH NEIN, DIE PUMPE IST WEG! NÄCHSTER KOLBEN-BLOCK... | OH NO, THE PUMP IS GONE! NEXT FLASK BLOCK... | OH NON, LA POMPE A DISPARU! PROCHAIN BLOC BALLON... |
| T108 | Sturz ins Becken (Zonen 1 bis 5) | IN DIE FILTRAT-WANNE GEFALLEN!<br>INS DESINFEKTIONSBAD GEFALLEN!<br>IN DIE LÖSEMITTEL-AUFFANGWANNE GEFALLEN!<br>IN DIE SÄURE-AUFFANGWANNE GEFALLEN!<br>IN DEN FLÜSSIGSTICKSTOFF GEFALLEN! | YOU FELL INTO THE FILTRATE TRAY!<br>YOU FELL INTO THE DISINFECTANT BATH!<br>YOU FELL INTO THE SOLVENT DRIP TRAY!<br>YOU FELL INTO THE ACID DRIP TRAY!<br>YOU FELL INTO THE LIQUID NITROGEN! | TOMBÉ DANS LE BAC À FILTRAT!<br>TOMBÉ DANS LE BAIN DÉSINFECTANT!<br>TOMBÉ DANS LE BAC DE RÉTENTION À SOLVANTS!<br>TOMBÉ DANS LE BAC DE RÉTENTION À ACIDES!<br>TOMBÉ DANS L'AZOTE LIQUIDE! |
| T109 | Controller eingesteckt | CONTROLLER VERBUNDEN | CONTROLLER CONNECTED | MANETTE CONNECTÉE |
| T110 | Einblendungen über dem Professor | AUTSCH!<br>+… SEK<br>-… SEK<br>METHANOL<br>ETHANOL | OUCH!<br>+… SEC<br>-… SEC<br>METHANOL<br>ETHANOL | AÏE!<br>+… SEC<br>-… SEC<br>MÉTHANOL<br>ÉTHANOL |
| T120 | Anzeige oben | PUNKTE …<br>KEINE PUMPE<br>BVC PROFESSIONAL<br>ZEIT …<br>… S | SCORE …<br>NO PUMP<br>BVC PROFESSIONAL<br>TIME …<br>… S | POINTS …<br>PAS DE POMPE<br>BVC PROFESSIONAL<br>TEMPS …<br>… S |
| T121 | Anzeige oben, Leisten | SOG<br>HEISS<br>SPRINT | VAC<br>HOT<br>SPRINT | ASPI<br>CHAUD<br>SPRINT |
| T122 | Combo | COMBO<br>VORBEI | COMBO<br>OVER | COMBO<br>FINI |
| T123 | Endgegner | DAMPF-KRAKE | STEAM KRAKEN | PIEUVRE À VAPEUR |
| T130 | Ende der Runde | ZEIT ABGELAUFEN!<br>GESCHAFFT!<br>RESTZEIT … SEK = BONUS! | TIME'S UP!<br>WELL DONE!<br>TIME LEFT … SEC = BONUS! | TEMPS ÉCOULÉ!<br>RÉUSSI!<br>TEMPS RESTANT … SEC = BONUS! |
| T131 | Pause (Tastatur / Touch) | PAUSE<br>ESC / START = WEITERSPIELEN / ENTER = RUNDE ABBRECHEN<br>TIPPEN = WEITERSPIELEN | PAUSE<br>ESC / START = CONTINUE / ENTER = END ROUND<br>TAP = CONTINUE | PAUSE<br>ÉCHAP / START = CONTINUER / ENTRÉE = ARRÊTER LA PARTIE<br>TOUCHER = CONTINUER |
| T132 | Ergebnis, Titel | LABOR GERETTET!<br>ZEIT ABGELAUFEN! | LAB SAVED!<br>TIME'S UP! | LABO SAUVÉ!<br>TEMPS ÉCOULÉ! |
| T133 | Ergebnis, Zeilen | EINGESAUGT<br>PUMPE<br>SCHUTZ<br>BESTE COMBO<br>PUNKTE<br>ZEITBONUS<br>MEDAILLEN<br>GESAMT | SUCKED UP<br>PUMP<br>SAFETY<br>BEST COMBO<br>POINTS<br>TIME BONUS<br>MEDALS<br>TOTAL | ASPIRÉS<br>POMPE<br>PROTECTION<br>MEILLEUR COMBO<br>POINTS<br>BONUS TEMPS<br>MÉDAILLES<br>TOTAL |
| T134 | Medaillen | KRAKE BEZWUNGEN<br>VOLLSCHUTZ<br>UNVERLETZT<br>TOP-PUMPE<br>COMBO-PROFI<br>ZEITMEISTER | KRAKEN BEATEN<br>FULL PROTECTION<br>UNHARMED<br>TOP PUMP<br>COMBO PRO<br>TIME MASTER | PIEUVRE VAINCUE<br>PROTECTION MAX<br>INDEMNE<br>POMPE ULTIME<br>PRO DU COMBO<br>MAÎTRE DU TEMPS |
| T135 | Ergebnis, Platz | PLATZ … HEUTE  ·  PLATZ … GESAMT<br>DEIN BESTWERT: …<br>★ TAGESBESTWERT! ★ | RANK … TODAY  ·  RANK … OVERALL<br>YOUR BEST: …<br>★ BEST SCORE TODAY! ★ | …E AUJOURD'HUI  ·  …E AU TOTAL<br>TON RECORD: …<br>★ RECORD DU JOUR! ★ |
| T32 | Ergebnis bei Testrunde | TESTRUNDE - NICHT IN DER BESTENLISTE | TEST ROUND - NOT ON THE HIGH SCORES | PARTIE TEST - PAS DANS LE CLASSEMENT |
| T136 | Ergebnis, unten | ENTER = BESTENLISTE<br>TIPPEN = BESTENLISTE | ENTER = HIGH SCORES<br>TAP = HIGH SCORES | ENTRÉE = CLASSEMENT<br>TOUCHER = CLASSEMENT |
| T167 | Kontakt-Seite, Titel | KONTAKT | CONTACT | CONTACT |
| T170 | Kontakt-Seite | HANDY-KAMERA AUF / DEN CODE RICHTEN: | POINT YOUR PHONE / CAMERA AT THE CODE: | VISE LE CODE AVEC / L'APPAREIL PHOTO: |
| T171 | Kontakt-Seite | DEIN DIREKTER DRAHT / ZU VACUUBRAND. | YOUR DIRECT LINE / TO VACUUBRAND. | TA LIGNE DIRECTE / VERS VACUUBRAND. |
| T172 | Kontakt-Seite, unten | ENTER = WEITER<br>TIPPEN = WEITER | ENTER = NEXT<br>TAP = NEXT | ENTRÉE = SUITE<br>TOUCHER = SUITE |
| T188 | 🆕 Name, falls leer | SPIELER | PLAYER | JOUEUR |
| T190 | 🆕 Admin, klein unter der Überschrift (Admin nur DE/EN) | Version … | Version … | (Admin nicht auf Französisch; wäre ebenfalls „Version …“) |
| T191 | 🆕 Spitzname-Seite an der Messe mit Schalter „Nur Spitzname“, Überschrift | WILLKOMMEN! | WELCOME! | BIENVENUE! |
| T192 | 🆕 Admin, Schalter (Admin nur DE/EN) | Nur Spitzname (keine Lead-Erfassung)<br>Für Anlässe ohne Lead-Sammlung: Spieler geben nur einen Spitznamen ein, wie in der Online-Version. Keine E-Mail, keine Firma, keine Einwilligung. Länderwahl, Bestenliste und QR-Code bleiben. | Nickname only (no lead capture)<br>For events without lead collection: players only enter a nickname, like in the online version. No email, no company, no consent. Country selection, high score list and QR code stay. | (Admin nicht auf Französisch) |
| T193 | 🆕 Admin, gelber Warnbalken (Admin nur DE/EN) | NUR SPITZNAME IST AKTIV: Es werden keine Leads erfasst. An einer Lead-Messe unten bei Einstellungen ausschalten! | NICKNAME ONLY IS ACTIVE: no leads are captured. At a lead-collecting trade show, switch it off below under Settings! | (Admin nicht auf Französisch) |
| T194 | 🆕 Admin, Übersicht, Tabellen und Runden-Export (Admin nur DE/EN) | · … Spitznamen (keine Leads)<br>Spitzname<br>Art: Lead / Spitzname | · … nicknames (no leads)<br>nickname<br>Type: Lead / Nickname | (Admin nicht auf Französisch) |
