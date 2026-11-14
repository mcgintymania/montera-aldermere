# Developing Montera

The full source for **Montera: The Lanterns of Aldermere**. The published game lives on the `main` branch (GitHub Pages); this `source` branch holds everything needed to change and rebuild it.

## Layout

| Path | What it is |
| --- | --- |
| `src/*.js` | Game code. Data files first (species, moves, maps, scripts), then engine files. Order is set in `build.py` |
| `src/template.html`, `src/style.css`, `src/logo.b64` | Page shell, styles and the logo |
| `src/monart.js` | Sprite engine: every Wildmon is a body form plus parts |
| `src/artdata.js` | Generated Wildmon looks. Edit `tools/artspec.py`, then run `tools/gen_art.py` |
| `companion/` | The Companion web app (template, styles, app code) |
| `launcher/` | The Montera title screen (`index.html` on the site), the new logo and the Brightholm page |
| `pwa/` | Icon source (`lantern_sym.png`) and `mkicons.py` |
| `tools/` | Art spec and generator, rename maps |
| `test/` | Data validators, uniqueness checker and Playwright playthroughs |

## Build

```
python3 build.py              # game      -> dist/montera.html
python3 build_companion.py    # companion -> dist/companion.html
python3 build_launcher.py     # title screen -> dist/launcher.html (add --release to open Brightholm to everyone)
python3 build_site.py         # title screen, Aldermere, Brightholm, companion + manifest, service worker, icons -> site/
```

On the site, `index.html` is the title screen and Aldermere is `aldermere.html`. Aldermere saves stay in `mq_slot_1..3`; Brightholm uses its own `mtb_` keys and only ever reads Aldermere's.

Brightholm stays hidden until release. Tap the logo on the title screen five times and enter the tester code `LARKFIELD` to open it on one device. Build with `python3 build_site.py --release` to show it to everyone, locked until the Champion is beaten.

Publish: copy `site/` into the `main` branch and push.

## Checks

```
node test/validate.js     # maps, warps, scripts, encounters, items
node test/unique.js       # Wildmon names, builds and outlines must be unique between families
python3 test/act1.py      # Playwright playthroughs (act1 ... act7, post, run.py for a new game)
python3 test/launcher.py OLD_SITE NEW_SITE RELEASED_LAUNCHER SHOT_DIR   # title screen, tester code, unlock, and saves surviving an upgrade
```

Known test-harness limits (not game bugs): the Spark Hall plate in `act2.py` and the Glasswater Kit walk in `act3.py`.

## Rules the code follows

- Saves store Wildmon, items and quests by id, so names and looks can change freely. Keep ids stable.
- Save keys are `mq_slot_1..3`; exports are base64 JSON `{format: 'MQSAVE', data}`.
- No comments or text about how the game was made; code only.
- New Wildmon must pass `test/unique.js`.
