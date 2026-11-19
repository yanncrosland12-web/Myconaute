import re,subprocess,json,sys,glob,os
s=open(glob.glob('/root/.claude/projects/-home-claude/*.jsonl')[0]).read()
M=json.loads(sys.argv[1]);tag=sys.argv[2]
for p,n in M.items():
    m=re.findall(r'https://export-download\.canva\.com/EO13g/DAHZbAEO13g/-1/0/%04d-%s\.png\?[^"\\\s]+'%(int(p),tag),s)
    if not m: print('MISSING',p,n);continue
    r=subprocess.run(['curl','-sSf','-o','raw/%s.png'%n,m[-1].replace('\\u0026','&')]);print(n,r.returncode)
