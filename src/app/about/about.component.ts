import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
