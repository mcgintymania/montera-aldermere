#!/usr/bin/env python3
"""Builds dist/brightholm.html, Montera: The Rising Light of Brightholm."""
import base64, pathlib
root = pathlib.Path(__file__).parent
src = root / 'brightholm'
FILES = ['data.js', 'monsters.js', 'battledata.js', 'progressdata.js', 'act1data.js', 'act1maps.js', 'act2data.js', 'act2maps.js', 'act3data.js', 'act3rows.js', 'act3maps.js', 'skyreachdata.js', 'skyreachrows.js', 'skyreachmaps.js', 'frostdata.js', 'frostrows.js', 'frostmaps.js', 'spiredata.js', 'spirerows.js', 'spiremaps.js', 'leaguedata.js', 'leaguerows.js', 'leaguemaps.js', 'postgamedata.js', 'postgamerows.js', 'postgamemaps.js', 'glossarydata.js',
         'bh_data.js',
         'monart.js', 'artdata.js', 'engine.js', 'battle.js', 'ui.js', 'ui2.js', 'progress.js', 'field.js', 'doubles.js', 'act2.js', 'storage.js', 'act3.js', 'skyreach.js', 'frost.js', 'spire.js', 'league.js', 'postgame.js', 'arena.js', 'index.js',
         'bh_build.js', 'bh_follow.js', 'bh_badges.js', 'bh_story.js', 'bh_town1.js', 'bh_trials.js', 'bh_town2.js', 'bh_town3.js', 'bh_town4.js', 'bh_home.js', 'bh_keys.js', 'bh_salt.js', 'bh_hq.js', 'bh_star.js', 'bh_lark8.js', 'bh_festival.js', 'bh_league.js', 'bh_postgame.js', 'bh_link.js', 'bh_wild.js', 'bh_house.js', 'bh_friends.js', 'bh_jobs.js', 'bh_fun.js',
         'battlestage.js', 'hearth.js', 'completion.js', 'pwa.js', 'main.js']
tpl = (src / 'template.html').read_text()
css = (src / 'style.css').read_text() + '\n' + (src.parent / 'shared' / 'battlestage.css').read_text() + '\n' + (src.parent / 'shared' / 'hearth.css').read_text()
js = '\n'.join(((root / 'shared' / f) if f in ('completion.js', 'battlestage.js', 'hearth.js') else (src / f)).read_text() for f in FILES)
logo = "const LOGO_SRC = 'data:image/webp;base64," + base64.b64encode((root / 'launcher' / 'logo.webp').read_bytes()).decode() + "';\n"
out = tpl.replace('/*CSS*/', css).replace('/*JS*/', "/* MONTERA: THE RISING LIGHT OF BRIGHTHOLM */\n" + logo + js)
dist = root / 'dist'; dist.mkdir(exist_ok=True)
(dist / 'brightholm.html').write_text(out)
print('built brightholm.html', len(out), 'bytes,', out.count('\n'), 'lines')
