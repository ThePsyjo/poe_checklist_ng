import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import MAPS from './MAPS';
import { Sort, MatSortModule } from '@angular/material/sort';
import { FilterItem, FilterItemType, FiltersBase, FiltersComponent } from "../filters/filters.component";
import {compare} from "../common";
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf, DecimalPipe } from '@angular/common';

interface MapObject extends Record<string, any> {
  id: string;
  name: string;
  tier?: number;
  isUnique: boolean;
  isOnAtlas: boolean;
  c: boolean;
  b: boolean;
}

interface Filters extends FiltersBase {
  show_checked: Record<string, FilterItem>;
  hide_checked: Record<string, FilterItem>;
  hide_misc: Record<string, FilterItem>;
}

@Component({
    selector: 'maps',
    templateUrl: './maps.component.html',
    styleUrls: ['./maps.component.css'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FiltersComponent, MatSortModule, NgFor, NgIf, FormsModule, DecimalPipe],
})
export class MapsComponent implements OnInit {
  model: MapObject[] = [];
  filters: Filters = {
    show_checked: {
      'show_c': {name: 'Show unchecked C', type: FilterItemType.Checkbox, state: false},
      'show_b': {name: 'Show unchecked B', type: FilterItemType.Checkbox, state: false},
    },
    hide_checked: {
      'hide_c': {name: 'Hide checked C', type: FilterItemType.Checkbox, state: false},
      'hide_b': {name: 'Hide checked B', type: FilterItemType.Checkbox, state: false},
    },
    hide_misc: {
      'hide_unique': {name: 'Hide uniques', type: FilterItemType.Checkbox, state: false},
      'hide_non_atlas': {name: 'Hide non-atlas maps', type: FilterItemType.Checkbox, state: false},
    },
    misc: {
      'expanded': {name: undefined, type: undefined, state: false},
      'search': {name: undefined, type: undefined, state: ''},
      'legend_c': {name: 'C - Completed', type: FilterItemType.Text, state: undefined},
      'legend_b': {name: 'B - Bonus completed', type: FilterItemType.Text, state: undefined},
    }
  };
  private _filter_order: Record<string, any>[] = [
    {name: 'hide_misc', keys: ['hide_unique', 'hide_non_atlas']},
    {name: 'misc', keys: ['legend_c', 'legend_b']},
    {name: 'hide_checked', keys: ['hide_c', 'hide_b']},
    {name: 'show_checked', keys: ['show_c', 'show_b']},
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
      const id = _map.name.toLowerCase().replace(/[ -']/gi, '_')
      return {
        id: id,
        c: checked[id]?.c ?? false,
        b: checked[id]?.b ?? !_map.isOnAtlas,
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
      return [item.id, {c: item.c, b: item.b}]
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
        default:
          return 0;
      }
    });
  }

  filterVisible(items: MapObject[]): MapObject[]{
    return items.filter((map) => {
      const search = this.filters.misc.search.state as string
      if(search) {
        for (const k of search.toLowerCase().split(' ')) {
          if (k.startsWith('tier:') || Number(k)) {
            if (map.tier == undefined) return false

            let tier: number = Number(k)
            if (isNaN(tier)) tier = Number(k.split(':')[1])

            if (map.tier != tier) return false
          } else {
            if (!map.id.includes(k)) return false
          }
        }
      }
      if(map.isUnique && this.filters.hide_misc.hide_unique.state) return false
      if (!map.isOnAtlas && this.filters.hide_misc.hide_non_atlas.state) return false
      if (!map.c && this.filters.show_checked.show_c.state) return true
      if (!map.b && this.filters.show_checked.show_b.state) return true
      if (map.c && this.filters.hide_checked.hide_c.state) return false
      if (map.b && this.filters.hide_checked.hide_b.state) return false
      return true
    })
  }

  colorClass(map: MapObject, name: boolean = false) {
    if (map.c && map.b) {
      if (map.isUnique && name) return 'text-unique2'
      else return 'text-secondary'
    } else {
      if (map.isUnique && name) return 'text-unique'
      else return null
    }
  }

  track(index: number, map: MapObject) {
    return map.id;
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
          map.c = map.b = false
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
