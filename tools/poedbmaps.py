from urllib.request import urlopen
from bs4 import BeautifulSoup
import json

def update(data, name, unique, tier, region):
    if name in (
        'Pit of the Chimera Map',
        'Lair of the Hydra Map',
        'Maze of the Minotaur Map',
        'Forge of the Phoenix Map',
    ):
        tier = 16

    for item in data['list']:
        if item['name'] == name:
            if tier:
                item['tier'] = tier
            else:
                if 'tier' in item:
                    del item['tier']
            if region:
                item['region'] = region
            else:
                if 'region' in item:
                    del item['region']
            print(f'{name} found')
            break
    else:
        item = dict(
            name=name,
            isUnique=unique,
            isOnAtlas=bool(tier),
        )
        if tier:
          item['tier'] = tier
        if region:
          item['region'] = region
        data['list'].append(item)
        print(f'{name} added')

skip_names = [
    'Harbinger Map',
]

def search_tier(element):
  for item in element.contents:
      item = item.string
      # print(type(item))
      # print(f'{item!r}')
      if not item:
          continue
      for tier_candidate in item.string.split(','):
          tier_candidate = tier_candidate.strip()
          # print(f'candidate: {tier_candidate}')
          if tier_candidate.isdigit():
              return int(tier_candidate)

with open('MAPS_non_atlas.json') as _tpl, open('out.json', 'w') as _out:
    tpl = json.load(_tpl)

    data = BeautifulSoup(urlopen(f'https://poedb.tw/us/Maps').read(), features='html.parser')
    for row in data.find_all('tr'):
        r = row.find_all('td')
        if not r:
            continue
        r = r[1]
        links = r.find_all('a')
        # print(links)
        if not links:
            continue
        # print(links[0])
        name = links[0].string
        if not name.endswith('Map') or name in skip_names:
            continue
        if len(links) > 1:
            region = links[1].string
            # print(name)
            tier = search_tier(r.find('span'))
            # print(tier)
            # tier = int(r.find('span').contents[-1].split()[-1])
            # print(tier)
        else:
            tier = region = None

        # tier, name, region = int(r[0].string), r[3].a.string, r[6].a.string
        update(tpl, name, 'item_unique' in links[0]['class'], tier, region)

    json.dump(fp=_out, obj=tpl, indent=2)

