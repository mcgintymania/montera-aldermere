# Developing Montera

The full source for **Montera: The Lanterns of Aldermere**. The published game lives on the `main` branch (GitHub Pages); this `source` branch holds everything needed to change and rebuild it.

## Layout

| Path | What it is |
| --- | --- |
| `src/*.js` | Game code. Data files first (species, moves, maps, scripts), then engine files. Order is set in `build.py` |
| `src/template.html`, `src/style.css`, `src/logo.b64` | Page shell, styles and the logo |
| `src/monart.js` | Sprite engine: every Wildmon is a body form plus parts. Brightholm's copy (`brightholm/monart.js`) adds 14 forms: `snake` (x: bands, hood; tail: rattle), `croc` (build: baby, king), `hippo` (mouth: jaw, tusks), `canine` (build: pup; tail: bushy; x: ruff, stripes, spots), `shark` (mouth: jaw; x: splash, stripes), `turtle` (x: barnacles, moss), `raptor` (build: hatch, rex; tail: flame), `feline` (x: mane, tuft, spots, stripes), `octopus`, `manta`, `monkey` (x: crest, hands; tail: striped), `hog` (build: hedgehog, hog, boar; x: vines, berries), `bovine` (build: bison; tail: tuft; x: spots, ring), `armadillo` (build: ball, tank; x: studs, spikes, moss, claws). Preview them with `python3 tools/bh_forms_sheet.py OUT.png` after building the site |
| `src/artdata.js` | Generated Wildmon looks. Edit `tools/artspec.py`, then run `tools/gen_art.py` |
| `companion/` | The Companion web app (template, styles, app code) |
| `launcher/` | The Montera title screen (`index.html` on the site) and the new logo |
| `brightholm/` | Game 2, The Rising Light of Brightholm: its own copy of the engine plus `bh_data.js` (Larkfield maps, characters, scripts), `bh_badges.js` (the 8 Brightholm Badges, their pixel art, award screen, trainer card badge case and trophy cabinet), `bh_town1.js` (Stockridge and Hall 1), `bh_trials.js` (Frontier Trials: `DATA.trials`, Bronze/Silver/Gold trophies stored in `flags.trial_<id>`, trophy art, the cabinet's trials shelf, pushable `herd` props, `trialpost` props, the Stockridge Round-Up and the Quarry Gauntlet), `bh_town2.js` (Quarry Road, Shalebrook, Hall 2 with boulders and sinkholes: a map with `sinkholes: true` draws `i` pits as sinkholes), `bh_town3.js` (Shalebrook Pass, Vantage City with roads `(`, pavement `)`, crossings `` ` ``, concrete `·` and barriers `¦`; Paragon Academy and the Founder's speech; the Skateboard (key item, `G.skate`, faster outdoors) and Jaz's quest; the Vantage Skate Trial with `rings`; Vantage Hall, where a map with `ramps: true` draws the slide tiles `^ : < >` as skate ramps), `bh_town4.js` (the Gibbolt's stolen Paragon Pass, the service door, the Paragon Training Wing with Skye, Instructor Vex and Ivo, and the Circuit Hall: floor switches `¡` flip every energy gate, `ä` open when switched on and `ö` open when switched off, stored in `flags.gates_<map>`), `bh_home.js` (game time: Brightholm runs on play time, not the real clock: a day is 20 minutes of play (`DAY_LEN`), the day starts at 8:00, `Game.hour()` and weather follow it; seasons: `Season`, 6 days each, outdoor greenery recoloured in autumn and winter, date and clock on the trainer card; the family garden: `DATA.crops`, `G.garden`, crops grow in game hours and twice as fast for a day after watering; herbs grow in any season; the kitchen at home brews `DATA.recipes` (Tonics, cures, Sweetroot Pie); seeds and produce in the Garden pocket; the farm stall; the Brightholm Bus between visited towns; Homeward Furnishings and four furniture spots in your bedroom, `G.room`), `bh_keys.js` (the Sunward Keys: the Vantage ferry, Coralport, the Ranger Station and Wren, Sunward Shore's Paragon buoy and grey `coral` props that regain colour when `flags.reef_saved`, the Reef Hall's water currents and Hall Master Nalu), `bh_salt.js` (Saltreach Key, diving: deep water `Ð` with a `bhDive` tile script takes you to a map with `underwater: true`, which gets a blue tint and bubbles, and a light shaft `Þ` brings you back up; the Sunken Ruins, the Drain Core and the K logbook; the dark Saltreach Hall with cold spots `ø` that send you back to the door), `bh_hq.js` (storming Paragon HQ: grey Wildmon are grey in battle too (a trainer team entry with `{ grey: true }` sets `mon.grey`, and `MonArt.get` draws it desaturated); keycard laser doors `Ŧ` (red) and `ŧ` (blue) open when the bag holds `hq_red` / `hq_blue`; the lobby tag battle with Skye (`DATA.allies.skye_hq`); the Founder's office and Kit's unmasking; the quest The Grand Lantern), `bh_star.js` (Starfall Road, Starfall and the Starfall Hall: a map with `pads: [[ax, ay, bx, by, oneWay?], ...]` carries you from a star pad to its twin, pad tiles `ǎ ǐ ǒ ǔ ǖ` by colour and `ǘ` for a one-way exit; star floor `ŝ`, star wall `Ŵ`; Hall Master Seren and the Starlight Badge), `bh_follow.js` (the lead Wildmon walks behind you; talk to it for Bond and the odd found item; Settings > Partner follows), `bh_build.js` (building styles: give a building `style: 'farmhouse' | 'brick' | 'stone' | 'timber' | 'cottage' | 'barn' | 'quarry' | 'paragon' | 'modern' | 'flat'`, or a Hall `style: 'barn' | 'ranch' | 'quarry' | 'skate'`, or `kind: 'academy'`) and `bh_story.js` (the Courier, the legend, character creation). Order is set in `build_brightholm.py` |
| `pwa/` | Icon source (`lantern_sym.png`) and `mkicons.py` |
| `tools/` | Art spec and generator, rename maps |
| `test/` | Data validators, uniqueness checker and Playwright playthroughs |

## Build

```
python3 build.py              # game      -> dist/montera.html
python3 build_companion.py    # companion -> dist/companion.html
python3 build_brightholm.py   # game 2    -> dist/brightholm.html
python3 build_launcher.py     # title screen -> dist/launcher.html (add --release to open Brightholm to everyone)
python3 build_site.py         # title screen, Aldermere, Brightholm, companion + manifest, service worker, icons -> site/
```

On the site, `index.html` is the title screen and Aldermere is `aldermere.html`. Aldermere saves stay in `mq_slot_1..3`; Brightholm uses its own `mtb_` keys (`mtb_slot_1..3`, `mtb_settings`, exports `{format: 'MTBSAVE'}` with `game: 'brightholm'`) and only ever reads Aldermere's. Changes to Aldermere go in `src/`, changes to Brightholm in `brightholm/`; the two engines are separate copies.

Brightholm dialogue tokens: `{player}`, `{legend}` (the Aldermere Champion), `{rival}` (Skye), and pronouns `{they} {them} {their} {theirs} {self} {are} {were} {s} {es}` for the player or `{Skye.they}` etc. for Skye. A capital first letter gives a capitalised word.

Brightholm stays hidden until release. Tap the logo on the title screen five times and enter the tester code `LARKFIELD` to open it on one device. Build with `python3 build_site.py --release` to show it to everyone, locked until the Champion is beaten.

Publish: copy `site/` into the `main` branch and push.

## Checks

```
node test/validate.js     # maps, warps, scripts, encounters, items
node test/unique.js       # Wildmon names, builds and outlines must be unique between families (add --brightholm for game 2)
python3 test/act1.py      # Playwright playthroughs (act1 ... act7, post, run.py for a new game)
python3 test/launcher.py OLD_SITE NEW_SITE RELEASED_LAUNCHER SHOT_DIR   # title screen, tester code, unlock, and saves surviving an upgrade
python3 test/bh_opening.py SITE SHOT_DIR   # Brightholm opening: Courier, character creation, Larkfield, pronouns, separate saves
python3 test/bh_route.py SITE SHOT_DIR     # Brightholm: following partner, Furrow Lane, trainers, Fisher Gil's quest, Pack Hunter
python3 test/bh_town1.py SITE SHOT_DIR     # Brightholm: Stockridge, Hearthhouse, Mart, Hall 1 maze, Cassidy, Spur Badge, badge case and trophy cabinet
python3 test/bh_town2.py SITE SHOT_DIR     # Brightholm: Round-Up and Quarry Gauntlet trials, Quarry Road, Skye's second battle, Shalebrook, Hall 2 boulder puzzle, Petra, Bedrock Badge
python3 test/bh_town3.py SITE SHOT_DIR     # Brightholm: Shalebrook Pass, Vantage City, Paragon Academy, skateboard quest, Skate Trial, Vantage Hall ramps, Zara, Updraft Badge
python3 test/bh_town4.py SITE SHOT_DIR     # Brightholm: Paragon Pass, Training Wing, Skye's third battle, Vex, Ivo, Circuit Hall switches, Circuit Badge
python3 test/bh_home.py SITE SHOT_DIR      # Brightholm: garden, watering, growth, harvest, farm stall, seasons, game clock, kitchen, extra beds, bus, furniture
python3 test/bh_keys.py SITE SHOT_DIR      # Brightholm: ferry, Coralport, Wren's quest, Captain Marlowe and the buoy, Reef Hall currents, Nalu, Reef Badge
python3 test/bh_salt.py SITE SHOT_DIR      # Brightholm: Saltreach ferry, dive gear, Sunken Ruins, Doran, Drain Core, Kit revealed to Wren, cold-spot maze, Morwen, Wisp Badge
python3 test/bh_hq.py SITE SHOT_DIR        # Brightholm: grey Wildmon in battle, Rangers at Paragon, tag battle with Skye, keycard doors, Admin Oren, the Founder unmasked as Kit, Starfall Road, star-pad Hall, Seren, Starlight Badge
```

Known test-harness limits (not game bugs): the Spark Hall plate in `act2.py` and the Glasswater Kit walk in `act3.py`.

## Rules the code follows

- Saves store Wildmon, items and quests by id, so names and looks can change freely. Keep ids stable.
- Save keys are `mq_slot_1..3`; exports are base64 JSON `{format: 'MQSAVE', data}`.
- No comments or text about how the game was made; code only.
- New Wildmon must pass `test/unique.js`.
