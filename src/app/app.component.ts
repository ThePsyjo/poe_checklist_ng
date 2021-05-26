import {Component} from '@angular/core';
import {environment} from "../environments/environment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'poe-checklist-ng';

  get ga(): Record<string, string | null> {
    return 'ga' in environment ? environment['ga'] : {client: null, slot: null}
  }
}
