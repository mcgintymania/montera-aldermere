import pathlib
src = pathlib.Path(__file__).parent / 'src'
tpl = (src / 'template.html').read_text()
css = (src / 'style.css').read_text() + '\n' + (src.parent / 'shared' / 'battlestage.css').read_text() + '\n' + (src.parent / 'shared' / 'hearth.css').read_text()
js = '\n'.join(((src.parent / 'shared' / f) if f in ('completion.js', 'battlestage.js', 'hearth.js', 'store.js') else (src / f)).read_text() for f in ['data.js', 'monsters.js', 'battledata.js', 'progressdata.js', 'act1data.js', 'act1maps.js', 'act2data.js', 'act2maps.js', 'act3data.js', 'act3rows.js', 'act3maps.js', 'skyreachdata.js', 'skyreachrows.js', 'skyreachmaps.js', 'frostdata.js', 'frostrows.js', 'frostmaps.js', 'spiredata.js', 'spirerows.js', 'spiremaps.js', 'leaguedata.js', 'leaguerows.js', 'leaguemaps.js', 'postgamedata.js', 'postgamerows.js', 'postgamemaps.js', 'glossarydata.js', 'monart.js', 'artdata.js', 'engine.js', 'battle.js', 'ui.js', 'ui2.js', 'progress.js', 'field.js', 'doubles.js', 'act2.js', 'storage.js', 'act3.js', 'skyreach.js', 'frost.js', 'spire.js', 'league.js', 'postgame.js', 'arena.js', 'index.js', 'battlestage.js', 'hearth.js', 'store.js', 'completion.js', 'pwa.js', 'main.js'])
header = "/* MONTERA: THE LANTERNS OF ALDERMERE — single-file build.\n   Sections: DATA (content) · CORE + SYSTEMS (engine) · UI (screens) · BOOT */\n"
logo = "const LOGO_SRC = 'data:image/jpeg;base64," + (src / 'logo.b64').read_text().strip() + "';\n"
out = tpl.replace('/*CSS*/', css).replace('/*JS*/', header + logo + js)
dist = pathlib.Path(__file__).parent / 'dist'; dist.mkdir(exist_ok=True)
(dist / 'montera.html').write_text(out)
print('built', len(out), 'bytes,', out.count('\n'), 'lines')
