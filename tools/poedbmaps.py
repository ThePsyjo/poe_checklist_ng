from urllib.request import urlopen
from bs4 import BeautifulSoup
import json

def update(data, name, tier, region):
    for item in data['list']:
        if item['name'] == name:
            item['tier'] = tier
            item['region'] = region
            #print(f'{name} found')
            break
    else:
        data['list'].append(dict(
            name=name,
            tier=tier,
            region=region,
            isUnique=False,
            isOnAtlas=True,
        ))
        print(f'{name} added')

with open('MAPS-template.json') as _tpl, open('out.json', 'w') as _out:
    tpl = json.load(_tpl)

    data = BeautifulSoup(urlopen('https://poedb.tw/us/area.php?cn=Map').read())
    for row in data.find_all('tr'):
        r = row.find_all('td')
        if not r:
            continue
        tier, name, region = int(r[0].string), r[3].a.string, r[6].a.string

        update(tpl, name, tier, region) 
        
    json.dump(fp=_out, obj=tpl, indent=2)

