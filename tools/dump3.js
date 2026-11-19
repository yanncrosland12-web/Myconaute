const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.goto('file://'+process.argv[2]);await p.waitForTimeout(1500);
const r=await p.evaluate(()=>{const o={};for(const T of ['SPR','SPRB_I','SPRB_P']){const t=eval(T);o[T]={};for(const k in t)o[T][k]=t[k];}return o;});
require('fs').writeFileSync('lot4/orig.json',JSON.stringify(r));await b.close();})();
