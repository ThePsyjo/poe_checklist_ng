import {Component, Inject, OnInit, Optional} from '@angular/core';
import {RESPONSE} from "@nguniversal/express-engine/tokens";
import {Response} from "express";

@Component({
    selector: 'app-not-found',
    templateUrl: './not-found.component.html',
    styleUrls: ['./not-found.component.css'],
    standalone: true
})
export class NotFoundComponent implements OnInit {

  constructor(
    @Optional() @Inject(RESPONSE) private response: Response
  ) { }

  ngOnInit() {
    if(this.response){
      this.response.status(404);
    }
  }

}
