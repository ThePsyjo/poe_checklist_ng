import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FilterItem, FilterItemType, FiltersBase, FiltersComponent} from "../filters/filters.component";
import {MatSortModule, Sort} from "@angular/material/sort";
import {compare} from "../common";
import PASSIVES, {wikiLink} from "./PASSIVES"
import {FormsModule} from '@angular/forms';


interface Quest extends Record<string, any> {
  id: number;
  name: string;
  objective: string;
  act: number;
  points: number;
  checked: boolean;
}

interface Filters extends FiltersBase {
  quests: Record<string, FilterItem>;
}

@Component({
    selector: 'app-passives',
    templateUrl: './passives.component.html',
    styleUrls: ['./passives.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FiltersComponent, MatSortModule, FormsModule]
})
export class PassivesComponent implements OnInit {
  model: Quest[] = []
  filters: Filters = {
    quests: {
      'hide': {name: 'Hide checked quests', type: FilterItemType.Checkbox, state: false},
    },
    misc: {
      'expanded': {name: undefined, type: undefined, state: false},
      'search': {name: undefined, type: undefined, state: ''},
    }
  };
  private _filter_order: Record<string, any>[] = [
    {name: 'quests', keys: ['hide']},
  ];

  constructor() {
  }

  ngOnInit(): void {
    this.initModel()
  }

  initModel(clear: boolean = false) {
    // delete localStorage.passive_checked
    let checked: Record<number, boolean>
    if (clear) {
      checked = {}
    } else {
      checked = JSON.parse(localStorage.getItem('passive_checked') ?? '{}')
    }
    // console.log(localStorage.getItem('passive_checked'))
    // console.log(checked)
    this.model = PASSIVES.map(quest => {
      return {
        ...quest,
        checked: checked[quest.id] ?? false,
      }
    })
    // console.log(this.model)
  }

  saveModel() {
    localStorage.passive_checked = JSON.stringify(Object.fromEntries(this.model.map(item => {
      return [item.id, item.checked]
    })));
    // console.log(localStorage.passive_checked)
  }

  questLink(quest: Quest): string{
    return wikiLink(quest.name)
  }

  sortData(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      return;
    }

    this.model = this.model.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'act':
          return compare(a.act, b.act, isAsc);
        case 'name':
          return compare(a.name, b.name, isAsc);
        case 'objective':
          return compare(a.objective, b.objective, isAsc);
        default:
          return 0;
      }
    });
  }

  onRowClick(quest: Quest) {
    quest.checked = !quest.checked
    this.saveModel()
  }

  filterVisible(items: Quest[]) {
    return items.filter((quest) => {
      return !(quest.checked && this.filters.quests.hide.state)
    })
  }

  track(index: number, item: Quest) {
    return item.id;
  }

  get filter_order(): Record<string, any>[] {
    return this._filter_order;
  }

  clear() {
    this.initModel(true)
    this.saveModel()
  }

}
