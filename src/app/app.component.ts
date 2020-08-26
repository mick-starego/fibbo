import {Component, OnInit} from '@angular/core';
import {FibboQueue} from "./game-gen/FibboQueue";
import {Constants} from "./utils/Constants";
import {GameEncoder} from "./game-gen/Game";
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'my-app';
  gameRoute = '';
  static savedGame = null;

  constructor(public router: Router) {

    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        if (e.url.includes('/play/')) {
          this.gameRoute = e.url;
          AppComponent.savedGame = e.url.split('/play/').pop();
        }
      }
    });
  }

  ngOnInit(): void {
    if (!FibboQueue.INITIALIZED) {
      FibboQueue.initialize();
      console.log('Queue Initialized');
      FibboQueue.log();
    }
    this.loadEasyGameRoute();
  }

  static getEasyGameKey(): string {
    const game = FibboQueue.getGame(Constants.EASY_DIFFICULTY);
    return GameEncoder.generateCodeString(game.seed, game.target);
  }

  /**
   * Called after onInit
   */
  loadEasyGameRoute(): void {
    this.gameRoute = '/play/' + AppComponent.getEasyGameKey();
  }
}
