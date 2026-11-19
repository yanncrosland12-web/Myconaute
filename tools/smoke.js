const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];
p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.argv[2]);await p.waitForTimeout(1500);
const r=await p.evaluate(()=>({v:GAME_VERSION,full:Object.keys(SPRB).filter(k=>Object.values(SPRB[k]).every(q=>q[0].startsWith("iVBOR"))).length,
 boxes:Object.values(SPRB).every(F=>Object.values(F).every(q=>q[3]>0&&q[4]>0&&Math.abs(q[2]+q[4])<12)),
 ro:Object.keys(SPRB.rosalie),er:Object.keys(SPRB.ermite)}));
console.log(JSON.stringify(r),'errors',JSON.stringify(errs));await p.screenshot({path:'/home/claude/backup/smoke.png'});await b.close()})();
