import re,sys,json
s=open('Myconautes-0.9.37.html').read()
i=s.find('const SPRB'); line=s[i:s.find('\n',i)]
def boxes(nm):
    k=line.find(' '+nm+': {'); seg=line[k:]
    nxt=re.search(r'\] \}, [a-z_0-9]+: \{ f: \[',seg); seg=seg[:nxt.end()] if nxt else seg
    return {m[0]:tuple(map(float,m[1:])) for m in re.findall(r'\b(f|b|w|w2|a): \["[^"]*", ([-\d.]+), ([-\d.]+), ([-\d.]+), ([-\d.]+)\]',seg)}
if __name__=='__main__':
    for n in sys.argv[1:]: print(n,boxes(n))
