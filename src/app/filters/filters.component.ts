import {Component, Input, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf, NgTemplateOutlet, NgFor } from '@angular/common';

export enum FilterItemType {
  Checkbox,
  Text,
}

export interface FilterItem extends Record<string, any> {
  name: string | undefined;
  state: boolean | string | undefined;
  type: FilterItemType | undefined;
}

export interface FiltersBase extends Record<string, Record<string, FilterItem>> {
  misc: Record<string, FilterItem>;
}

export interface StoreFilterItem extends Record<string, any> {
  state: boolean;
}

export interface StoreFilters extends Record<string, Record<string, StoreFilterItem>> {
  misc: Record<string, StoreFilterItem>;
}

@Component({
    selector: 'app-filters',
    templateUrl: './filters.component.html',
    styleUrls: ['./filters.component.css'],
    standalone: true,
    imports: [NgIf, NgTemplateOutlet, NgFor, FormsModule]
})
export class FiltersComponent implements OnInit {
  @Input() isCollapse: boolean = false;
  @Input() isSearch: boolean = false;
  @Input() isBordered: boolean = true;
  @Input() storageKey: string = '';
  @Input() search_placeholder: string = 'Search...';
  @Input() filterOrder: Record<string, any>[] = [];
  @Input() filters: FiltersBase = {
    misc: {
      'expanded': {name: undefined, type: undefined, state: false},
      'search': {name: undefined, type: undefined, state: ''}
    }
  };
  private storeFilters: StoreFilters = {misc:{}}

  constructor() {
  }

  ngOnInit(): void {
    if (this.storageKey === '') {
      throw new Error('storageKey must not be empty')
    }

    Object.entries(this.filters).forEach(([gk, gv]) => {
      this.storeFilters[gk] = {}
      Object.entries(gv).forEach(([ik, iv]) => {
        if ((typeof iv.state) == "boolean") {
          this.storeFilters[gk][ik] = {state: false}
        }
      });
    });

    let filter_data: StoreFilters = JSON.parse(localStorage.getItem(`${this.storageKey}_filter`) ?? '{}') ?? {}
    Object.entries(filter_data).forEach(([gk, gv]) => {
      Object.entries(gv).forEach(([ik, iv]) => {
        if (this.filters[gk][ik])
          this.filters[gk][ik].state = iv.state
      });
    });
  }

  toggleFilters() {
    this.filters.misc.expanded.state = !this.filters.misc.expanded.state;
    this.saveFilters();
  }

  saveFilters() {
    // console.log(this.filters)
    Object.entries(this.filters).forEach(([gk, gv]) => {
      Object.entries(gv).forEach(([ik, iv]) => {
        if ((typeof iv.state) == "boolean") {
          this.storeFilters[gk][ik] = {state: iv.state as boolean}
        }
      });
    });

    localStorage.setItem(`${this.storageKey}_filter`, JSON.stringify(this.storeFilters));
    // console.log(localStorage.getItem(`${this.storageKey}_filter`))
  }

  clearSearch() {
    this.filters.misc.search.state = ''
  }
}
