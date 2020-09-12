import { Component, OnInit } from '@angular/core';
import {AppComponent} from "../app.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  clickCounter = 0;
  name = '';
  gameRoute = '';

  constructor() { }

  ngOnInit(): void {
    if (AppComponent.savedGame) {
      this.gameRoute = '/play/' + AppComponent.savedGame;
    } else {
      console.error("AppComponent savedGame is null");
    }
  }

}
