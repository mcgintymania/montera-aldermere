#!/usr/bin/env python3
"""Builds dist/launcher.html, the Montera title screen that opens each game and the Companion."""
import pathlib, sys
root = pathlib.Path(__file__).parent
src = root / 'launcher'
released = '--release' in sys.argv
js = (src / 'app.js').read_text().replace('/*RELEASED*/false', 'true' if released else 'false')
html = (src / 'template.html').read_text()
html = html.replace('/*CSS*/', (src / 'style.css').read_text()).replace('/*JS*/', js)
out = root / 'dist' / 'launcher.html'
out.parent.mkdir(exist_ok=True)
out.write_text(html)
print(f'built {out.name}: {len(html)} bytes' + (' (released)' if released else ''))
