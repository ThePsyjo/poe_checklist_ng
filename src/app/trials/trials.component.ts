import { Component, OnInit } from '@angular/core';
import {Sort} from "@angular/material/sort";
import TRIALS from "./TRIALS";
import {FilterItem, FilterItemType, FiltersBase, StoreFilterItem, StoreFiltersBase} from "../filters/filters.component";

export interface Trial extends Record<string, any> {
    id: number;
    act: string;
    zone: string;
    location: string|undefined;
    zone_display: string;
    difficulty: string;
    checked: boolean;
}
export interface StoreFilters extends StoreFiltersBase {
  trials: Record<string, StoreFilterItem>;
}
export interface Filters extends FiltersBase {
  trials: Record<string, FilterItem>;
}
@Component({
  selector: 'app-trials',
  templateUrl: './trials.component.html',
  styleUrls: ['./trials.component.css']
})
export class TrialsComponent implements OnInit {
  model: Trial[] = []
  filters: Filters = {
    trials: {
      'all': {name: 'Hide checked trials', type: FilterItemType.Checkbox, state: false},
      'eternal': {name: 'Hide eternal difficulty', type: FilterItemType.Checkbox, state: false},
      'merciless': {name: 'Hide merciless difficulty', type: FilterItemType.Checkbox, state: false},
      'cruel': {name: 'Hide cruel difficulty', type: FilterItemType.Checkbox, state: false},
      'normal': {name: 'Hide normal difficulty', type: FilterItemType.Checkbox, state: false},
    },
    misc: {
      'expanded': {name: undefined, type: undefined, state: false},
      'search': {name: undefined, type: undefined, state: ''},
    }
  };
  private _filter_order: Record<string, any>[] = [
    {name: 'trials', keys: ['all','eternal','merciless','cruel','normal']},
  ];
  private to_store: StoreFilters = {
    trials: {},
    misc: {},
  };

  constructor() { }

  ngOnInit(): void {
    // this.filters = JSON.parse(localStorage.getItem('trial_filter') ?? '{}') ?? {}
    let filter_data: StoreFilters = JSON.parse(localStorage.getItem('trial_filter') ?? '{}') ?? {}
    Object.entries(filter_data).forEach(([gk, gv]) => {
      Object.entries(gv).forEach(([ik, iv]) => {
        if (this.filters[gk][ik])
          this.filters[gk][ik].state = iv.state
      });
    });
    this.initModel()
  }

  initModel(clear: boolean = false) {
    // delete localStorage.map_checked
    let checked: Map<number, boolean>
    if (clear) {
      checked = new Map()
    } else {
      checked = new Map(JSON.parse(localStorage.getItem('trial_checked') ?? 'null'))
    }
    // console.log(checked)
    // @ts-ignore
    this.model = TRIALS.map(trial => {
      return {
        ...trial,
        act: trial.act ? `${trial.act}` : '-',
        checked: checked.get(trial.id) ?? false,
        zone_display: trial.location ? `${trial.zone} (${trial.location})` : trial.zone,
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
        case 'act':
          return compare(a.act, b.act, isAsc);
        case 'zone':
          return compare(a.zone_display, b.zone_display, isAsc);
        case 'difficulty':
          return compare(a.difficulty, b.difficulty, isAsc);
        default:
          return 0;
      }
    });
  }

  onTdClick(trial: Trial) {
    trial.checked = !trial.checked
  }

  isVisible(trial: Trial) {
    // search
    return !(
      (trial.checked && this.filters.trials.all.state)
      || (trial.difficulty == 'Normal' && this.filters.trials.normal.state)
      || (trial.difficulty == 'Cruel' && this.filters.trials.cruel.state)
      || (trial.difficulty == 'Merciless' && this.filters.trials.merciless.state)
      || (trial.difficulty == 'Eternal' && this.filters.trials.eternal.state)
    )
  }

  saveModel() {
    localStorage.trial_checked = JSON.stringify(Array.from(this.model.map(item => {
      return [item.id, item.checked]
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

    localStorage.trial_filter = JSON.stringify(this.to_store);
    // console.log(localStorage.map_filter)
  }
  get filter_order(): Record<string, any>[] {
    return this._filter_order;
  }

  clear() {
    this.initModel(true)
  }

  onRowClick(trial: Trial) {
    trial.checked = !trial.checked
    this.saveModel()
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
