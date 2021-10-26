from urllib.request import urlopen
from bs4 import BeautifulSoup
import json

def update(data, name, unique, tier, region):
    if name in (
        'The Perandus Manor Chateau Map',
    ):
        print('skipped')
        return

    if name in (
        'Pit of the Chimera Map',
        'Lair of the Hydra Map',
        'Maze of the Minotaur Map',
        'Forge of the Phoenix Map',
    ):
        tier = 16

    if (
        name.startswith('Replica')
        or name in (
            'Untainted Paradise Tropical Island Map',
            'Hall of Grandmasters Promenade Map'
            'Altered Distant Memory Siege Map',
            'Augmented Distant Memory Haunted Mansion Map',
            'Rewritten Distant Memory Basilica Map',
            'Twisted Distant Memory Park Map',
            'Cortex Relic Chambers Map',
        )
    ):
        region = None

    for item in data['list']:
        if item['name'] == name:
            item['tier'] = tier
            if region:
                item['region'] = region
            print(f'  updated')
            break
    else:
        item = dict(
            name=name,
            tier=tier,
            isUnique=unique,
            isOnAtlas=bool(region),
        )
        if region:
            item['region'] = region
        data['list'].append(item)
        print(f'  added')


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

    base_url = 'https://poedb.tw'
    data = BeautifulSoup(urlopen(f'{base_url}/us/Maps').read(), features='html.parser')
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

        print(f'Getting info for "{name}"...')
        map_info = BeautifulSoup(urlopen(f'{base_url}/{links[0]["href"]}').read(), features='html.parser')
        map_info = map_info.find('div', {'class': 'Stats'})
        if not map_info:
            print('  No map info found, skipping')
            continue

        if map_info.contents[0].strip() != 'Maps':
            print('  Not a map, skipping')
            continue
        
        region = map_info.find('a')
        if not region:
            print('  Not on atlas, skipping')
            continue
        
        region = region.string
        tier = search_tier(map_info.find('span'))
        
        update(tpl, name, 'item_unique' in links[0]['class'], tier, region)

    json.dump(fp=_out, obj=tpl, indent=2)

