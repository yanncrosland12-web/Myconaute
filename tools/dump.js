const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.goto('file://'+process.argv[2]);await p.waitForTimeout(1500);
const r=await p.evaluate((ns)=>{const o={};for(const n of ns){o[n]={};for(const k of ['f','b','w','w2','a']) if(SPRB[n]&&SPRB[n][k]) o[n][k]=SPRB[n][k][0];}return o;},process.argv.slice(3));
require('fs').writeFileSync('cur/dump.json',JSON.stringify(r));await b.close();})();
