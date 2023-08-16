"""
Expects the file `maps` with content like

.. code::

  Tier 1

      Pen Map
      Arcade Map
      Jungle Valley Map
      Coves Map


  Tier 2

      Peninsula Map
      Grotto Map
      ...


Uses `MAPS_non_atlas.json` as base for updating and writes `out.json`.
"""

import json


def update(data, name, _tier):
    for item in data['list']:
        if item['name'] == name:
            item['tier'] = _tier
            # print(f'{name} found')
            break
    else:
        data['list'].append(
            dict(
                name=name,
                tier=_tier,
                isUnique=False,
                isOnAtlas=True,
            )
        )
        print(f'{name} added')


with open('maps') as _in, open('MAPS_non_atlas.json') as _tpl, open('unique.json') as _unique:
    tpl = json.load(_tpl)
    for line in _in:
        line = line.strip()
        if not line:
            continue
        if line.lower().startswith('tier'):
            tier = int(line.split()[1])
            continue

        update(tpl, line, tier)

    def _del_base(obj):
        if 'base' in obj:
            del obj['base']
        return obj

    tpl['list'].extend([_del_base(map_object) for map_object in json.load(_unique)])

with open('out.json', 'w') as _out:
    json.dump(fp=_out, obj=tpl, indent=2)
