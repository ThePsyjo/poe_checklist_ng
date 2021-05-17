import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';

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

export interface StoreFiltersBase extends Record<string, Record<string, StoreFilterItem>> {
  misc: Record<string, StoreFilterItem>;
}

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {
  @Input() isCollapse: boolean = false;
  @Input() isSearch: boolean = false;
  @Input() isBordered: boolean = true;
  @Input() filterOrder: Record<string, any>[] = [];
  @Input() search: string = '';
  @Input() filters: FiltersBase = {misc: {
    'expanded': {name: undefined, type: undefined, state: false},
    'search': {name: undefined, type: undefined, state: ''}
  }};
  @Output() toggleFilters = new EventEmitter();
  @Output() saveFilters = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

  clearSearch() {
    this.search = ''
  }
}
