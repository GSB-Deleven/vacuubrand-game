# Professor Vacuumus: Guide for Booth Staff

🇩🇪 Deutsche Fassung: **[ANLEITUNG.md](ANLEITUNG.md)**

A small retro platformer (pixel art like on the Game Boy) for the trade show booth.
The crazy professor (orange fuzzy hair, round glasses, just like our mascot) uses his suction gun to clean up the lab chaos.
From the **flask blocks** he gets ever stronger pumps, safety gear and special devices. The levels show real pump applications:

| Zone | Device | Applications / enemies |
|---|---|---|
| 1 Filtration lab | **ME 1C** | Filtration: filtrate drops, particles, filter paper, test tubes, H₂O |
| 2 Cell culture lab | **BVC professional** (special) | Liquid aspiration: culture medium, Petri dish slime, well plates, H₂O₂ |
| 3 Evaporation lab | **PC 3001 VARIO select** | Rotavap, vacuum concentrator, drying oven: solvent vapour, hot vapour, round flasks, measuring beakers, Eppis, methanol, ethanol |
| 4 Chemistry lab | **MD 4C VARIO select** | Distillation and drying: acid vapour, separating funnels, solvent vapour, methanol, ethanol |
| 5 High vacuum pilot plant | **VACUU·PURE 10C** | Oil-free drying (freeze drying, Schlenk line, turbo backing): ice crystals, O₂, N₂, H₂O, Schlenk flasks, argon cylinders, **steam kraken** (boss) |

The platforms you can jump through from below are **VACUU·LAN** lines.

**Items from the flask blocks** (they run away like the mushrooms in Mario: chase them or simply suck them in!):

| Item | Effect |
|---|---|
| Pump ME 1C → PC 3001 VARIO select → MD 4C VARIO select → VACUU·PURE 10C | longer range, sucks up heavier things |
| **BVC professional** pump (cell culture) | in the whole cell culture lab: BVC on the back, the gun becomes the **VHC hand piece**, sucks up everything (liquids, vapours and all the lab chaos) with no energy limit and double points; when leaving the lab, back to the normal pump |
| Safety goggles | hits cost only 1 instead of 3 seconds |
| Gloves | suction energy recharges twice as fast |
| Safety helmet | headbutt enemies from below |
| Safety shoes | destroy enemies by jumping on them |
| all 4 = **full protection** | enemies can no longer hurt you |
| VACUU·VIEW extended (hidden, 3×) | "time vacuum": +10 seconds |

Each new piece of safety gear gives +2 seconds. A round lasts **120 seconds**. Whoever sucks up the steam kraken
and reaches the exit gets the remaining time as a bonus. Hits cost time (no game over).
The remaining time is also shown as a coloured **time bar** below the display (green → yellow → red).

**Combo:** sucking something up again within 2 seconds builds a streak: points ×2, ×3 … up to **×8**.
The golden combo box at the top left shows the level and a running timer. A hit ends the streak.

**Medals** at the end of the round (bonus points count towards the total):

| Medal | Condition | Bonus |
|---|---|---|
| Kraken beaten | steam kraken sucked up | +2000 |
| Full protection | all 4 pieces of safety gear | +1000 |
| Unharmed | no hit (at least 10 things sucked up) | +1500 |
| Top pump | VACUU·PURE 10C reached | +1000 |
| Combo pro | combo ×5 or higher | +1000 |
| Time master | all 3 VACUU·VIEW found | +500 |

Each zone has its own music, the steam kraken has its own boss theme.

## Languages and countries

The game is available in **German, English and French**. Before every round the player picks a **country**
(Switzerland, Germany, UK/Ireland, France) and the **language**. The country decides which contact page the
QR code at the end leads to. The English and French texts are drafts and still have to be approved by marketing.

## Starting: no installation, no internet

1. Copy the whole folder onto the show laptop (e.g. onto the desktop).
2. Double-click the matching start file:

| System | Start file (double-click) |
|---|---|
| 🪟 Windows | `▶ START Windows.bat` (Edge in full screen) |
| 🍎 Mac | `▶ START Mac.command` (Chrome/Edge in full screen, otherwise Safari). First time: right-click → **Open** → Open |
| 🐧 Linux / 🍓 Raspberry Pi | `▶ START Linux + Raspberry Pi.sh` (Chromium in full screen). Automatic start when switched on: see `raspberry-pi/README.md` |
| all | if in doubt, simply double-click `index.html` |

3. To quit: **Alt + F4** (Mac: **Cmd + Q**).

Works in Edge, Chrome and Firefox. **Always use the same browser and the same folder**,
otherwise the game cannot see the existing high score list.

## Controls

| Key | Action |
|---|---|
| ← → | walk |
| ↑ | jump |
| ↓ | duck |
| Space (hold) | suck: the **VAC** bar empties, then let it cool down briefly |
| Shift or Ctrl (hold) | sprint: watch the **SPRINT** bar |
| Enter | start / confirm |
| Esc | pause / back |
| M | sound on/off |
| F | full screen (on the title screen) |
| B | high scores on/off (on the title screen) |

**Buttons in the wrong place?** (e.g. arcade joystick) In the admin area under **Controller / joystick → Set up controller**,
press jump, suck, sprint and start one after the other. The game remembers the mapping for this controller model.

**Controllers:** Xbox/USB gamepads and simple USB joysticks are detected automatically when plugged in
("CONTROLLER CONNECTED"; you may need to press a button once). The keyboard keeps working.

| Gamepad (Xbox layout) | Joystick | Action |
|---|---|---|
| Stick / D-pad | Stick | walk, ↑ jump, ↓ duck |
| A or Y | button 2 / 3 | jump |
| B or X | fire button | suck |
| LB / RB / LT / RT | further buttons | sprint |
| Start / A | fire button | start / next |
| Start or Back | button 9 / 10 | pause on/off |

Registration (typing names) of course only works with a keyboard. A round can only be aborted with
**Esc → Enter** on the keyboard, so that players cannot abort by accident.

**Tip for the show laptop:** if someone presses Shift 5 times, Windows asks about "Sticky Keys".
Switch it off under *Settings → Accessibility → Keyboard → Sticky Keys* (disable the shortcut).
Sprinting also works with Ctrl.

## Tablet at the booth

1. On the tablet, open **https://gsb-deleven.github.io/vacuubrand-game/?messe** in the browser (important: `?messe` at the end, otherwise the online demo without registration starts).
2. Add it once **"to the Home Screen"** (iPad: share icon → "Add to Home Screen"; Android: menu ⋮ → "Install app"). It then starts like an app in full screen and also works without Wi-Fi.
3. Hold the tablet sideways. The on-screen buttons appear on the first tap.
4. **Admin area:** press the VACUUBRAND logo at the top for 3 seconds, then enter the PIN.
5. The data is stored only on this tablet. Export it via the admin area as on the laptop ("Copy content" also works if the download fails).

## Flow at the booth

1. The title screen with a demo attracts visitors. **B** (or a click on the button) shows the high scores.
2. **Enter** → **choose country and language:** four flags (Switzerland, Germany, UK/Ireland, France), below them the languages DEUTSCH · ENGLISH · FRANÇAIS.
   - Keyboard/gamepad: ← → flag, ↑ ↓ switches to the language row, Enter confirms. The flag preselects the country's language (UK: English), any other language can be chosen in the language row.
   - Tablet/phone: first tap the language (only needed if it should be different), then tap the flag. That starts right away.
   - After 60 seconds without input the game returns to the title screen.
3. Registration in the chosen language: first name, last name, company, email + consent (required), newsletter (optional).
4. Short instructions → countdown → play.
5. Result with ranking (today / whole show).
6. **Contact page with a large QR code** leading to the contacts for the chosen country. It stays on screen until someone presses Enter, taps or presses a button, so visitors have time to scan it.
7. High scores → after 20 seconds back to the title screen, again in the device language.

The public high score list shows only **"First name + initial"**. Anyone who plays several times (same email)
is listed with their best result.

## Quick start without registration (for testing / demos)

On the title screen, the high scores or in the registration form press **Ctrl + Shift + Enter**:
the game starts immediately with the player **ADMIN**. These test rounds are **not** saved
and appear neither on the high score list nor in the export. The country selection is skipped: the device language
is used and the QR code at the end shows the general contact link.

## Admin area (for booth staff)

On the title screen press **Ctrl + Shift + A**, enter the PIN (default **1234**, please change it!).

- **Top 3 today** (daily prize) and **Top 3 whole show** with full contact details
- Export **Leads (CSV/Excel)** and **All rounds (CSV/Excel)** → saved in the Downloads folder
- **Save / load backup** (JSON), e.g. to move data to another laptop
- Change show name, round time, PIN, daily prize and main prize (prizes appear on the title screen and the high scores)
- **Device language:** language of the title screen (German, English or French). The game returns to it after every round. At a show in the UK, for example, set it to English.
- **Admin language:** German or English
- The export additionally contains **country** (CH, DE, UK, FR) and **language** (de, en, fr) for each round and each lead
- **Load reference data (test):** loads sample data with invented people (folder `daten/`: JSON and CSV examples) to try out the high scores and export. Remove it with "Delete all data" before the show
- Delete single rounds (click ✕ twice), **delete all data** after the show (type DELETE into the field)
- After every export the content also appears in a text field with "Copy content", handy if the browser does not allow downloads (e.g. in the online preview)

**Tip:** export the leads at the end of every show day. The data is stored only in the browser storage
of this laptop. If someone clears the browser history/cookies, it is gone.

## Data protection

All data stays locally on the laptop, nothing is sent to the internet.
The consent text and notices are in `js/i18n.js` (in all three languages) and should be agreed with
marketing / data protection before the show. The English and French versions are drafts and need approval
for the UK/Ireland and France respectively. After the show, use **Delete all data** in the admin area.

## Checking the QR codes

The folder `qr/` contains a check page: double-click **`qr/index.html`** (works without internet) or open
**https://gsb-deleven.github.io/vacuubrand-game/qr/** online. It shows the QR code for each country in large size,
together with the link as text and as a clickable link. Simply scan it with a phone and check that the right page opens.

The links are in `js/config.js` in the `countries` section and can be replaced there. The check page is up to date
immediately afterwards (F5). For emails, the images `QR_CH.png`, `QR_DE.png`, `QR_UK.png` and `QR_FR.png` are in the same folder.

## Customising

Most settings are well commented in **`js/config.js`**:
round time, points, time penalties, suction energy, sprint, item bonuses, pumps, safety gear, registration fields,
countries with their QR links and the device language.
All **texts** (German, English, French) are in **`js/i18n.js`**.
Open the file in a text editor, change it, save it and press **F5** in the browser.

## Technical details

Plain HTML + JavaScript + canvas, no installation, no internet connection.
Everything technical (structure, files, game mechanics, data format, customisation) is in **[TECHNIK.md](TECHNIK.md)** (German),
all game texts with translation drafts in **[TEXTE.md](TEXTE.md)** (German, with English and French columns).
