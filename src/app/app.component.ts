import {Component} from '@angular/core';
import {NgIf} from '@angular/common';
import {RouterLink, RouterOutlet} from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: true,
    imports: [RouterLink, NgIf, RouterOutlet]
})
export class AppComponent {
  title = 'poe-checklist-ng';
}
