const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.goto('file://'+process.argv[2]);await p.waitForTimeout(1500);
const r=await p.evaluate(()=>{const o={};for(const n in SPRB){o[n]={};for(const k in SPRB[n])o[n][k]=SPRB[n][k].slice(1);}return o;});
require('fs').writeFileSync('cur/boxes.json',JSON.stringify(r));await b.close();})();
