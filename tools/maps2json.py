"""
Expects the file `maps` with content like


  Tier 1
  
      Pen Map
      Arcade Map
      Jungle Valley Map
      Coves Map
  
  
  Tier 2
  
      Peninsula Map
      Grotto Map
      ...
 

Uses `MAPS-template.json` as base for updating and writes `out.json`.
"""

import json

def update(data, name, tier):
    for item in data['list']:
        if item['name'] == name:
            item['tier'] = tier
            #print(f'{name} found')
            break
    else:
        data['list'].append(dict(
            name=name,
            tier=tier,
            isUnique=False,
            isOnAtlas=True,
        ))
        print(f'{name} added')

with open('maps') as _in, open('MAPS-template.json') as _tpl, open('out.json', 'w') as _out:
    tpl = json.load(_tpl)
    for line in _in:
        line = line.strip()
        if not line:
            continue
        if line.lower().startswith('tier'):
            tier = int(line.split()[1])
            continue

        update(tpl, line, tier) 
        
    json.dump(fp=_out, obj=tpl, indent=2)

