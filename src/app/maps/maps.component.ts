import {Component, OnInit} from '@angular/core';
import MAPS from './MAPS';
import {Sort} from '@angular/material/sort';
import {FilterItem, FilterItemType, FiltersBase} from "../filters/filters.component";
import {compare} from "../common";

export interface MapObject extends Record<string, any> {
  id: string;
  name: string;
  tier?: number;
  region?: string;
  isUnique: boolean;
  isOnAtlas: boolean;
  c: boolean;
  b: boolean;
  a: boolean;
}

export interface Filters extends FiltersBase {
  show_checked: Record<string, FilterItem>;
  hide_checked: Record<string, FilterItem>;
  hide_misc: Record<string, FilterItem>;
  hide_region: Record<string, FilterItem>;
}

@Component({
  selector: 'maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {
  model: MapObject[] = [];
  filters: Filters = {
    show_checked: {
      'show_c': {name: 'Show unchecked C', type: FilterItemType.Checkbox, state: false},
      'show_b': {name: 'Show unchecked B', type: FilterItemType.Checkbox, state: false},
      'show_a': {name: 'Show unchecked A', type: FilterItemType.Checkbox, state: false},
    },
    hide_checked: {
      'hide_c': {name: 'Hide checked C', type: FilterItemType.Checkbox, state: false},
      'hide_b': {name: 'Hide checked B', type: FilterItemType.Checkbox, state: false},
      'hide_a': {name: 'Hide checked A', type: FilterItemType.Checkbox, state: false},
    },
    hide_misc: {
      'hide_unique': {name: 'Hide uniques', type: FilterItemType.Checkbox, state: false},
      'hide_non_atlas': {name: 'Hide non-atlas maps', type: FilterItemType.Checkbox, state: false},
    },
    hide_region: {
      'hide_gc': {name: 'Hide Glennach Cairns', type: FilterItemType.Checkbox, state: false},
      'hide_hh': {name: 'Hide Haewark Hamlet', type: FilterItemType.Checkbox, state: false},
      'hide_le': {name: 'Hide Lex Ejoris', type: FilterItemType.Checkbox, state: false},
      'hide_lp': {name: 'Hide Lex Proxima', type: FilterItemType.Checkbox, state: false},
      'hide_la': {name: 'Hide Lira Arthain', type: FilterItemType.Checkbox, state: false},
      'hide_nv': {name: 'Hide New Vastir', type: FilterItemType.Checkbox, state: false},
      'hide_te': {name: 'Hide Tirn\'s End', type: FilterItemType.Checkbox, state: false},
      'hide_vr': {name: 'Hide Valdo\'s Rest', type: FilterItemType.Checkbox, state: false},
    },
    misc: {
      'expanded': {name: undefined, type: undefined, state: false},
      'search': {name: undefined, type: undefined, state: ''},
      'legend_c': {name: 'C - Completed', type: FilterItemType.Text, state: undefined},
      'legend_b': {name: 'B - Bonus completed', type: FilterItemType.Text, state: undefined},
      'legend_a': {name: 'A - Atlas bonus completed', type: FilterItemType.Text, state: undefined},
    }
  };
  private _filter_order: Record<string, any>[] = [
    {name: 'hide_region', keys: ['hide_hh', 'hide_te', 'hide_lp', 'hide_le']},
    {name: 'hide_region', keys: ['hide_nv', 'hide_gc', 'hide_vr', 'hide_la']},
    {name: 'hide_misc', keys: ['hide_unique', 'hide_non_atlas']},
    {name: 'misc', keys: ['legend_c', 'legend_b', 'legend_a']},
    {name: 'hide_checked', keys: ['hide_c', 'hide_b', 'hide_a']},
    {name: 'show_checked', keys: ['show_c', 'show_b', 'show_a']},
  ];

  constructor() {
  }

  ngOnInit(): void {
    this.initModel();
  }

  initModel(clear: boolean = false): void {
    // delete localStorage.map_checked
    let checked: Record<string, Record<string, boolean>>
    if (clear) {
      checked = {}
    } else {
        checked = JSON.parse(localStorage.getItem('map_checked') ?? '{}')
    }
    // console.log(localStorage.map_checked)
    // console.log(checked)
    this.model = MAPS.list.map(function (_map): MapObject {
      let id = _map.name.toLowerCase().replace(/[ -']/gi, '_')
      return {
        id: id,
        c: checked[id]?.c ?? false,
        b: checked[id]?.b ?? !_map.isOnAtlas,
        a: checked[id]?.a ?? !_map.isOnAtlas,
        ..._map
      }
    })

    this.model = this.model.sort((a, b) => {
      return compare(a.name, b.name, true);
    })
    this.model = this.model.sort((a, b) => {
      return compare(a.tier ?? 999, b.tier ?? 999, true);
    })
    this.model = this.model.sort((a, b) => {
      return compare(a.isOnAtlas ? 0 : 1, b.isOnAtlas ? 0 : 1, true);
    })
  }

  saveModel() {
    // console.log(this.model)
    localStorage.map_checked = JSON.stringify(Object.fromEntries(this.model.map(item => {
      return [item.id, {c: item.c, b: item.b, a: item.a}]
    })));
  }

  sortData(sort: Sort) {
    // const data = this.model.slice();
    if (!sort.active || sort.direction === '') {
      // this.sortedData = data;
      return;
    }

    this.model = this.model.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return compare(a.name, b.name, isAsc);
        case 'tier':
          return compare(a.tier ?? 999, b.tier ?? 999, isAsc);
        case 'region':
          return compare(a.region ?? 'ZZZ', b.region ?? 'ZZZ', isAsc);
        default:
          return 0;
      }
    });
  }

  isVisible(map: MapObject) {
    // console.log(map)
    let search = this.filters.misc.search.state as string
    if (search) {
      //console.log(`${search} in ${map.id} -> ${map.id.search(search.toLowerCase())}`)
      if (map.id.search(search.toLowerCase()) === -1) return false
    }
    if (map.isUnique && this.filters.hide_misc.hide_unique.state) return false
    if (!map.isOnAtlas && this.filters.hide_misc.hide_non_atlas.state) return false
    if (map.region == 'Glennach Cairns' && this.filters.hide_region.hide_gc.state) return false
    if (map.region == 'Haewark Hamlet' && this.filters.hide_region.hide_hh.state) return false
    if (map.region == 'Lex Ejoris' && this.filters.hide_region.hide_le.state) return false
    if (map.region == 'Lex Proxima' && this.filters.hide_region.hide_lp.state) return false
    if (map.region == 'Lira Arthain' && this.filters.hide_region.hide_la.state) return false
    if (map.region == 'New Vastir' && this.filters.hide_region.hide_nv.state) return false
    if (map.region == 'Tirn\'s End' && this.filters.hide_region.hide_te.state) return false
    if (map.region == 'Valdo\'s Rest' && this.filters.hide_region.hide_vr.state) return false
    if (!map.c && this.filters.show_checked.show_c.state) return true
    if (!map.b && this.filters.show_checked.show_b.state) return true
    if (!map.a && this.filters.show_checked.show_a.state) return true
    if (map.c && this.filters.hide_checked.hide_c.state) return false
    if (map.b && this.filters.hide_checked.hide_b.state) return false
    if (map.a && this.filters.hide_checked.hide_a.state) return false
    return true
  }

  colorClass(map: MapObject, name: boolean = false) {
    if (map.c && map.b && map.a) {
      if (map.isUnique && name) return 'text-unique2'
      else return 'text-secondary'
    } else {
      if (map.isUnique && name) return 'text-unique'
      else return null
    }
  }

  get filter_order(): Record<string, any>[] {
    return this._filter_order;
  }

  clear(key: string) {
    // console.log(key)
    if (key == 'all') {
      this.initModel(true)
    }
    this.saveModel()
  }

  get version(): number {
    return MAPS.version;
  }

  onTdClick(map: MapObject, key: string) {
    map[key] = !map[key]
    this.saveModel()
  }

  onRowClick(map: MapObject) {
    if (map.c) {
      if (map.isOnAtlas) {
        if (map.b) {
          if (map.a) {
            map.c = map.b = map.a = false
          } else {
            map.a = true
          }
        } else {
          map.b = true
        }
      } else {
        map.c = false
      }
    } else {
      map.c = true
    }
    this.saveModel()
  }

}
