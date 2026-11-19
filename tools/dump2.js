const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.goto('file://'+process.argv[2]);await p.waitForTimeout(1500);
const r=await p.evaluate(()=>{const o={};for(const T of ['SPR','SPRB_I','SPRB_P','TEX']){const t=eval(T);o[T]={};for(const k in t){const v=t[k];o[T][k]=(typeof v==='string')?v:(Array.isArray(v)?v[0]:JSON.stringify(v).slice(0,200));}}return o;});
require('fs').writeFileSync('cur/assets.json',JSON.stringify(r));await b.close();})();
