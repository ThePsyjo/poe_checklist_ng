import {Component, OnInit} from '@angular/core';
import {Sort} from "@angular/material/sort";
import TRIALS from "./TRIALS";
import {FilterItem, FilterItemType, FiltersBase} from "../filters/filters.component";
import {compare} from "../common";

export interface Trial extends Record<string, any> {
  id: number;
  act: string;
  zone: string;
  location: string | undefined;
  zone_display: string;
  difficulty: string;
  checked: boolean;
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
    {name: 'trials', keys: ['all', 'eternal', 'merciless', 'cruel', 'normal']},
  ];

  constructor() {
  }

  ngOnInit(): void {
    this.initModel()
  }

  initModel(clear: boolean = false) {
    // delete localStorage.map_checked
    let checked: Record<number, boolean>
    if (clear) {
      checked = {}
    } else {
      checked = JSON.parse(localStorage.getItem('trial_checked') ?? '{}')
    }
    // console.log(checked)
    // @ts-ignore
    this.model = TRIALS.map(trial => {
      return {
        ...trial,
        act: trial.act ? `${trial.act}` : '-',
        checked: checked[trial.id] ?? false,
        zone_display: trial.location ? `${trial.zone} (${trial.location})` : trial.zone,
      }
    })
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
    localStorage.trial_checked = JSON.stringify(Object.fromEntries(this.model.map(item => {
      return [item.id, item.checked]
    })));
  }

  get filter_order(): Record<string, any>[] {
    return this._filter_order;
  }

  clear() {
    this.initModel(true)
    this.saveModel()
  }

  onRowClick(trial: Trial) {
    trial.checked = !trial.checked
    this.saveModel()
  }
}
