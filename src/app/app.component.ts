import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {FibboQueue} from "./game-gen/FibboQueue";
import {Constants} from "./utils/Constants";
import {GameEncoder} from "./game-gen/GameEncoder";
import {NavigationEnd, Router} from "@angular/router";
import {LOCAL_STORAGE, WebStorageService} from "angular-webstorage-service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'my-app';
  gameRoute = '';
  static savedGame = null;

  isMobileWidth: boolean = false;
  isAnniversaryDay: boolean = false;
  isAnniversaryBannerVisible: boolean = false;

  constructor(
    @Inject(LOCAL_STORAGE) private storage: WebStorageService,
    public router: Router
  ) {

    this.isMobileWidth = window.innerWidth < 500;
    this.isAnniversaryDay = new Date().getDate() === 20 && new Date().getMonth() === 0;
    this.isAnniversaryBannerVisible = this.isAnniversaryDay;

    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        if (e.url.includes('/play/')) {
          this.gameRoute = e.url;
          AppComponent.savedGame = e.url.split('/play/').pop();
          this.storage.set('savedGame', AppComponent.savedGame);
        }
      }
    });
  }

  ngOnInit(): void {
    FibboQueue.initialize();
    console.log('Queue Initialized');
    FibboQueue.log();

    AppComponent.savedGame = this.storage.get('savedGame');
    this.loadInitialGameRoute();
  }

  static getEasyGameKey(): string {
    const game = FibboQueue.getGame(Constants.EASY_DIFFICULTY);
    return GameEncoder.generateCodeString(game.seed, game.target);
  }

  /**
   * Called after onInit
   */
  loadInitialGameRoute(): void {
    if (!AppComponent.savedGame) {
      AppComponent.savedGame = AppComponent.getEasyGameKey();
    }
    this.gameRoute = '/play/' + AppComponent.savedGame;
  }

  onAnniversaryBannerClicked() {
    this.isAnniversaryBannerVisible = false;
  }

}
