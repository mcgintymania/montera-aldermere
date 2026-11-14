const fs=require('fs'), vm=require('vm');
const ctx={console, Math, Date, Set, Map, JSON, Object, Array, Number, String, setTimeout}; ctx.clamp=(v,a,b)=>v<a?a:v>b?b:v; ctx.G=null; vm.createContext(ctx);
vm.runInContext(['data.js','monsters.js','battledata.js','progressdata.js','act1data.js','act2data.js','act3data.js','skyreachdata.js','frostdata.js','spiredata.js','leaguedata.js','postgamedata.js','battle.js'].map(f=>fs.readFileSync(__dirname+'/../src/'+f,'utf8')).join('\n')+';this.DATA=DATA;this.Mon=Mon;this.BE=BattleEngine;',ctx);
const {DATA,Mon,BE}=ctx;
const even=(p)=>({hp:p,atk:p,def:p,spa:p,spd:p,spe:p});
let c_pot=8;
function fight(pteam, eteam, tier){
  const P=pteam.map(([sp,lv])=>Mon.create(sp,lv,{mastery:{}})), E=eteam.map(([sp,lv,it],i)=>Mon.create(sp,lv,{mastery:{},pot:even(c_pot),item:it||null,ti:0}));
  const B={kind:'trainer',rng:Math.random,turn:0,used:[],trainer:{ai:tier},sides:[{a:BE.actor(P[0]),idx:0,party:P,items:{}},{a:BE.actor(E[0]),idx:0,party:E,items:{potion:1}}]};
  let pi=0,ei=0,t=0;
  while(t<400){
    const ev=[]; const A0=B.sides[0].a, D0=B.sides[1].a; let bestId=null,bd=-1; for(const m of A0.mon.moves){ if(m.pp<=0) continue; const mv=DATA.moves[m.id]; const e=mv.cat==='status'?0:BE.estimate(B,A0,D0,m.id)*((mv.acc||100)/100); if(e>bd){bd=e;bestId=m.id;} } const a0={type:'move',id:bd>0?bestId:BE.aiMove(B,0,'tactical')}; let a1=BE.aiAction(B,1,tier);
    if(a1.type==='switch'){ B.sides[1].idx=a1.idx; B.sides[1].a=BE.actor(E[a1.idx]); a1={type:'none'}; }
    if(a1.type==='item'){ a1={type:'none'}; }
    if(a1.type==='none'){ BE.useMove(B,0,a0.id,ev); }
    else { const ord=BE.order(B,a0,a1); for(const si of ord){ BE.useMove(B,si,si===0?a0.id:a1.id,ev); if(B.sides[0].a.mon.hp<=0||B.sides[1].a.mon.hp<=0) break; } }
    BE.endTurn(B,ev); B.turn++; t++;
    if(B.sides[1].a.mon.hp<=0){ const n=E.findIndex(m=>m.hp>0); if(n<0) return [true, P.filter(m=>m.hp>0).length]; B.sides[1].idx=n; B.sides[1].a=BE.actor(E[n]); }
    if(B.sides[0].a.mon.hp<=0){ const n=P.findIndex(m=>m.hp>0); if(n<0) return [false,0]; B.sides[0].idx=n; B.sides[0].a=BE.actor(P[n]); }
  }
  return [false,0];
}
const T=DATA.trainers;
const cases={
  rhea:{ e:T.rhea.team, tier:T.rhea.ai, teams:{ mossling:[['thornback',26],['fawnlight',22],['sandkit',23],['stinglet',22]], firecub:[['cinderclaw',26],['fawnlight',22],['sandkit',23],['sprigrat',22]], puddlepup:[['brinehound',26],['fawnlight',22],['sandkit',23],['stinglet',22]] } },
  sable:{ e:T.sable.team, tier:T.sable.ai, teams:{ mossling:[['thornback',25],['fawnlight',22],['joltfox',23],['gullet',22]], firecub:[['cinderclaw',25],['fawnlight',22],['joltfox',23],['sprigrat',22]], puddlepup:[['brinehound',25],['fawnlight',22],['joltfox',23],['stinglet',22]] } },
  brann:{ e:T.brann.team, tier:T.brann.ai, teams:{ mossling:[['thornback',30],['fawnlight',26],['joltfox',27],['squallgull',27]], firecub:[['cinderclaw',30],['fawnlight',26],['joltfox',27],['squallgull',27]], puddlepup:[['brinehound',30],['fawnlight',26],['joltfox',27],['thicketrat',27]] } },
  corvin:{ e:T.corvin.team, tier:T.corvin.ai, teams:{ mossling:[['thornback',33],['fawnlight',29],['joltfox',30],['squallgull',30]], firecub:[['cinderclaw',33],['fawnlight',29],['joltfox',30],['squallgull',30]], puddlepup:[['brinehound',33],['fawnlight',29],['joltfox',30],['squallgull',30]] } },
  morrow:{ e:T.morrow.team, tier:T.morrow.ai, teams:{ mossling:[['thornback',34],['fawnlight',30],['joltfox',31],['squallgull',31]], firecub:[['cinderclaw',34],['fawnlight',30],['joltfox',31],['squallgull',31]], puddlepup:[['brinehound',34],['fawnlight',30],['joltfox',31],['squallgull',31]] } },
  vesper:{ e:T.vesper.team, tier:T.vesper.ai, teams:{ mossling:[['bastionoak',36],['fawnlight',32],['joltfox',33],['squallgull',33]], firecub:[['infernyx',36],['fawnlight',32],['joltfox',33],['squallgull',33]], puddlepup:[['abyssmaul',36],['fawnlight',32],['joltfox',33],['squallgull',33]] } },
  aerin:{ e:T.aerin.team, tier:T.aerin.ai, teams:{ mossling:[['bastionoak',38],['fawnlight',34],['joltfox',35],['squallgull',35]], firecub:[['infernyx',38],['fawnlight',34],['joltfox',35],['squallgull',35]], puddlepup:[['abyssmaul',38],['fawnlight',34],['joltfox',35],['squallgull',35]] } },
  torvald:{ e:T.torvald.team, tier:T.torvald.ai, teams:{ mossling:[['bastionoak',44],['solstag',40],['joltfox',41],['squallgull',41]], firecub:[['infernyx',44],['solstag',40],['joltfox',41],['squallgull',41]], puddlepup:[['abyssmaul',44],['solstag',40],['joltfox',41],['squallgull',41]] } },
  kit5:{ e:T.kit5.team, tier:T.kit5.ai, teams:{ mossling:[['bastionoak',44],['solstag',40],['joltfox',41],['squallgull',41]], firecub:[['infernyx',44],['solstag',40],['joltfox',41],['squallgull',41]], puddlepup:[['abyssmaul',44],['solstag',40],['joltfox',41],['squallgull',41]] } },
  corvin3:{ e:T.corvin3.team, tier:T.corvin3.ai, teams:{ mossling:[['bastionoak',44],['solstag',40],['joltfox',41],['squallgull',41]], firecub:[['infernyx',44],['solstag',40],['joltfox',41],['squallgull',41]], puddlepup:[['abyssmaul',44],['solstag',40],['joltfox',41],['squallgull',41]] } },
  sable3:{ e:T.sable3.team, tier:T.sable3.ai, teams:{ mossling:[['bastionoak',44],['solstag',40],['joltfox',41],['squallgull',41]], firecub:[['infernyx',44],['solstag',40],['joltfox',41],['squallgull',41]], puddlepup:[['abyssmaul',44],['solstag',40],['joltfox',41],['squallgull',41]] } },
  morrow2:{ e:T.morrow2.team, tier:T.morrow2.ai, teams:{ mossling:[['bastionoak',50],['solstag',47],['joltfox',47],['squallgull',47]], firecub:[['infernyx',50],['solstag',47],['joltfox',47],['squallgull',47]], puddlepup:[['abyssmaul',50],['solstag',47],['joltfox',47],['squallgull',47]] } },
  vance:{ e:T.vance.team, tier:T.vance.ai, teams:{ mossling:[['bastionoak',50],['solstag',47],['joltfox',47],['squallgull',47]], firecub:[['infernyx',50],['solstag',47],['joltfox',47],['squallgull',47]], puddlepup:[['abyssmaul',50],['solstag',47],['joltfox',47],['squallgull',47]] } },
  nocthra:{ e:[['nocthra',52]], tier:'basic', teams:{ mossling:[['bastionoak',50],['solstag',47],['joltfox',47],['squallgull',47]], firecub:[['infernyx',50],['solstag',47],['joltfox',47],['squallgull',47]], puddlepup:[['abyssmaul',50],['solstag',47],['joltfox',47],['squallgull',47]] } },
  gk_ilsa:{ e:T.gk_ilsa.team, tier:T.gk_ilsa.ai, teams:{ mossling:[['bastionoak',60],['solstag',57],['joltfox',57],['squallgull',57],['cyclonix',56],['leviathorn',56]], firecub:[['infernyx',60],['solstag',57],['joltfox',57],['squallgull',57],['cyclonix',56],['leviathorn',56]], puddlepup:[['abyssmaul',60],['solstag',57],['joltfox',57],['squallgull',57],['cyclonix',56],['leviathorn',56]] } },
  gk_nyx:{ e:T.gk_nyx.team, tier:T.gk_nyx.ai, teams:{ mossling:[['bastionoak',60],['solstag',57],['joltfox',57],['squallgull',57],['cyclonix',56],['leviathorn',56]], firecub:[['infernyx',60],['solstag',57],['joltfox',57],['squallgull',57],['cyclonix',56],['leviathorn',56]], puddlepup:[['abyssmaul',60],['solstag',57],['joltfox',57],['squallgull',57],['cyclonix',56],['leviathorn',56]] } },
  gk_brigid:{ e:T.gk_brigid.team, tier:T.gk_brigid.ai, teams:{ mossling:[['bastionoak',60],['solstag',57],['joltfox',57],['squallgull',57],['cyclonix',56],['leviathorn',56]], firecub:[['infernyx',60],['solstag',57],['joltfox',57],['squallgull',57],['cyclonix',56],['leviathorn',56]], puddlepup:[['abyssmaul',60],['solstag',57],['joltfox',57],['squallgull',57],['cyclonix',56],['leviathorn',56]] } },
  gk_thane:{ e:T.gk_thane.team, tier:T.gk_thane.ai, teams:{ mossling:[['bastionoak',60],['solstag',57],['joltfox',57],['squallgull',57],['cyclonix',56],['leviathorn',56]], firecub:[['infernyx',60],['solstag',57],['joltfox',57],['squallgull',57],['cyclonix',56],['leviathorn',56]], puddlepup:[['abyssmaul',60],['solstag',57],['joltfox',57],['squallgull',57],['cyclonix',56],['leviathorn',56]] } },
  champion_kit:{ e:T.champion_kit.team, tier:T.champion_kit.ai, teams:{ mossling:[['bastionoak',60],['solstag',57],['joltfox',57],['squallgull',57],['cyclonix',56],['leviathorn',56]], firecub:[['infernyx',60],['solstag',57],['joltfox',57],['squallgull',57],['cyclonix',56],['leviathorn',56]], puddlepup:[['abyssmaul',60],['solstag',57],['joltfox',57],['squallgull',57],['cyclonix',56],['leviathorn',56]] } },
  gk_thane_m:{ e:T.gk_thane_m.team, tier:T.gk_thane_m.ai, teams:{ mossling:[['bastionoak',75],['solstag',72],['joltfox',72],['squallgull',72],['cyclonix',72],['leviathorn',72]], firecub:[['infernyx',75],['solstag',72],['joltfox',72],['squallgull',72],['cyclonix',72],['leviathorn',72]], puddlepup:[['abyssmaul',75],['solstag',72],['joltfox',72],['squallgull',72],['cyclonix',72],['leviathorn',72]] } },
  kit_m:{ e:T.kit_m.team, tier:T.kit_m.ai, teams:{ mossling:[['bastionoak',75],['solstag',72],['joltfox',72],['squallgull',72],['cyclonix',72],['leviathorn',72]], firecub:[['infernyx',75],['solstag',72],['joltfox',72],['squallgull',72],['cyclonix',72],['leviathorn',72]], puddlepup:[['abyssmaul',75],['solstag',72],['joltfox',72],['squallgull',72],['cyclonix',72],['leviathorn',72]] } },
  solenne:{ e:T.solenne.team, tier:T.solenne.ai, teams:{ mossling:[['bastionoak',75],['solstag',72],['joltfox',72],['squallgull',72],['cyclonix',72],['leviathorn',72]], firecub:[['infernyx',75],['solstag',72],['joltfox',72],['squallgull',72],['cyclonix',72],['leviathorn',72]], puddlepup:[['abyssmaul',75],['solstag',72],['joltfox',72],['squallgull',72],['cyclonix',72],['leviathorn',72]] } },
};
const RP={mossling:'firecub',firecub:'puddlepup',puddlepup:'mossling'}, EV={mossling:'thornback',firecub:'cinderclaw',puddlepup:'brinehound'};
for(const [k,c] of Object.entries(cases)) for(const [st,team] of Object.entries(c.teams)){
  c_pot=(T[k]&&T[k].pot)||8; const e=c.e||[['twigwing',12],['zappik',13],[RP[st],15]];
  let w=0,left=0; const N=600; for(let i=0;i<N;i++){ const [won,l]=fight(team,e,c.tier); if(won){w++;left+=l;} }
  console.log(k.padEnd(6), st.padEnd(10), 'win', (100*w/N).toFixed(0)+'%', 'avg survivors', (left/Math.max(1,w)).toFixed(2));
}
