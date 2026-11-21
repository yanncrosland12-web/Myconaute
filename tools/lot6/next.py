import json
q=json.load(open('/home/claude/backup/lot6/queue.json'))
for x in q:
    if x['status']!='done':
        print(x['id'],x['status']);print(x['prompt']);break
else: print('DONE ALL')
