import {Component, OnInit} from '@angular/core';
import MAPS from '../../assets/json/MAPS.json';
import {Sort} from '@angular/material/sort';
import {FilterItem, FilterItemType, FiltersBase, StoreFilterItem, StoreFiltersBase} from "../filters/filters.component";

export interface MapObject extends Record<string, any> {
  id: string;
  name: string;
  tier: number | undefined;
  region: string | undefined;
  isUnique: boolean;
  isOnAtlas: boolean;
  c: boolean;
  b: boolean;
  a: boolean;
}

export interface StoreFilters extends StoreFiltersBase {
  show_checked: Record<string, StoreFilterItem>;
  hide_checked: Record<string, StoreFilterItem>;
  hide_misc: Record<string, StoreFilterItem>;
  hide_region: Record<string, StoreFilterItem>;
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
  // filters: Record<string, boolean|false> = {}
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
  private to_store: StoreFilters = {
    show_checked: {},
    hide_checked: {},
    hide_misc: {},
    hide_region: {},
    misc: {}
  };

  constructor() {
  }

  ngOnInit(): void {
    // console.log(this.version)
    this.initModel();
    // delete localStorage.map_filter
    // this.filters = JSON.parse(localStorage.getItem('map_filter') ?? '{}') ?? {};
    let filter_data: StoreFilters = JSON.parse(localStorage.getItem('map_filter') ?? '{}') ?? {}
    Object.entries(filter_data).forEach(([gk, gv]) => {
      Object.entries(gv).forEach(([ik, iv]) => {
        if (this.filters[gk][ik])
          this.filters[gk][ik].state = iv.state
      });
    });
    // console.log(this.filters)
    // console.log(this.model)
  }

  initModel(clear: boolean = false): void {
    // delete localStorage.map_checked
    let checked: Map<string, { a: boolean, b: boolean, c: boolean }>
    if (clear) {
      checked = new Map()
    } else {
      checked = new Map(JSON.parse(localStorage.getItem('map_checked') ?? 'null'))
    }
    // console.log(checked)
    // @ts-ignore
    this.model = MAPS.list.map(_map => {
      let id = _map.name.toLowerCase().replace(/[ -']/gi, '_')
      return {
        id: id,
        c: checked?.get(id)?.c ?? false,
        b: checked?.get(id)?.b ?? !_map.isOnAtlas,
        a: checked?.get(id)?.a ?? !_map.isOnAtlas,
        ..._map
      }
    })
    this.saveModel()

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

  onTdClick(map: MapObject, key: string) {
    map[key] = !map[key]
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

  saveModel() {
    // console.log(this.model)
    localStorage.map_checked = JSON.stringify(Array.from(this.model.map(item => {
      return [item.id, {c: item.c, b: item.b, a: item.a}]
    })));
  }

  toggleFilters() {
    this.filters.misc.expanded.state = !this.filters.misc.expanded.state;
    this.saveFilters();
  }

  saveFilters() {
    // console.log(this.filters)
    Object.entries(this.filters).forEach(([gk, gv]) => {
      Object.entries(gv).forEach(([ik, iv]) => {
        if ((typeof iv.state) == "boolean")
          this.to_store[gk][ik] = {state: iv.state as boolean}
      });
    });

    localStorage.map_filter = JSON.stringify(this.to_store);
    // console.log(localStorage.map_filter)
  }

  get filter_order(): Record<string, any>[] {
    return this._filter_order;
  }

  clear(key: string) {
    // console.log(key)
    if (key == 'all') {
      this.initModel(true)
    }
  }

  get version(): number {
    return MAPS.version;
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

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
