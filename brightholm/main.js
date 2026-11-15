'use strict';
/* =====================================================================
   BOOT
   ===================================================================== */
window.MQ = { Game, World, UI, Save, Settings, DATA, S, Input, Script, BattleScene, BattleEngine, Mon, MonArt, LanternStorage, get G() { return G; }, set G(v) { G = v; } };
if (!/[?&]guide=1/.test(location.search)) {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => Game.boot());
  else Game.boot();
}
