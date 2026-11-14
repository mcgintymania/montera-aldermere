'use strict';
/* =====================================================================
   BOOT
   ===================================================================== */
window.MQ = { Game, World, UI, Save, Settings, DATA, S, Input, Script, BattleScene, BattleEngine, Mon, MonArt, LanternStorage, get G() { return G; }, set G(v) { G = v; } };
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => Game.boot());
else Game.boot();
