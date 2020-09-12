import {ChangeDetectorRef, Component, ElementRef, HostListener, Inject, OnInit, ViewChild} from '@angular/core';
import {FibboDifficulty} from "../game-gen/FibboDifficulty";
import {Constants} from "../utils/Constants";
import {Game} from "../game-gen/models/Game";
import {FibboQueue} from "../game-gen/FibboQueue";
import {MatDialog} from "@angular/material/dialog";
import {PlayOptionsDialog} from "./options-dialog/play-options-dialog.component";
import {PlayWarningDialog} from "./warning-dialog/play-warning-dialog.component";
import {ActivatedRoute, Router} from "@angular/router";
import {GameEncoder} from "../game-gen/GameEncoder";
import {Meta} from "@angular/platform-browser";
import {LOCAL_STORAGE, WebStorageService} from "angular-webstorage-service";
import {MoveFinder} from "./MoveFinder";
import {Move} from "./models/Move";

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {

  readonly EASY = Constants.EASY_DIFFICULTY;
  readonly MEDIUM = Constants.MEDIUM_DIFFICULTY;
  readonly HARD = Constants.HARD_DIFFICULTY;
  readonly EVIL = Constants.EVIL_DIFFICULTY;

  @ViewChild('optionsButton') optionsButton: ElementRef;
  @ViewChild('newGameButton') newGameButton: ElementRef;

  gameCode: string;

  screenSizeClass: string;

  values: number[];
  directions: number[][];
  moveStack: number[][] = [];
  numMoves = 0;
  fibbSeq: number[];

  start: number;
  middle: number;
  target: number;
  passClickAway = false;
  state: number[] = [];
  invalid: number;
  solved: boolean;
  targetState = 0;

  boardTarget: number;
  difficulty: string;

  spacebarMoveIndex: number;
  isSpacebarDown: boolean;

  lastArrowKey: string;
  lastArrowKeyIndex: number;

  constructor(
    @Inject(LOCAL_STORAGE) private storage: WebStorageService,
    public dialog: MatDialog,
    public changeDetectorRef: ChangeDetectorRef,
    public route: ActivatedRoute,
    public router: Router,
    private meta: Meta
  ) {
    this.setScreenSizeClass();

    this.directions = FibboDifficulty.DIRECTIONS;
    this.fibbSeq = [0,1,2,3,5,8,13,21,34,55,89];

    this.start = undefined;
    this.middle = undefined;
    this.target = undefined;
    this.boardTarget = 89;
    this.difficulty = undefined;
    this.solved = false;
    for (let i = 0; i < 15; i++) {
      this.state[i] = 0;
    }

    this.spacebarMoveIndex = 0;
    this.isSpacebarDown = true;
    this.lastArrowKeyIndex = 0;

    this.route.params.subscribe((params) => {
      this.gameCode = params['code'];
      this.loadGame(GameEncoder.buildFromCodeString(this.gameCode));
    });

    this.meta.addTags([
      {property: 'og:title', content: 'Fibbo'},
      {property: 'og:image', content: 'https://pushoflove.com/icon.png'},
      {property: 'og:url', content: this.router.url }
    ])
  }

  ngOnInit(): void {
    const thisRef = this;
    window.addEventListener('keydown', function(e) {
      if (e.code === 'Space') {
        e.preventDefault();
      } else if (e.code === 'ArrowRight') {
        thisRef.onArrowKey(Constants.ARROW_RIGHT);
        e.preventDefault();
      } else if (e.code === 'ArrowLeft') {
        thisRef.onArrowKey(Constants.ARROW_LEFT);
        e.preventDefault();
      } else if (e.code === 'ArrowUp') {
        thisRef.onArrowKey(Constants.ARROW_UP);
        e.preventDefault();
      } else if (e.code === 'ArrowDown') {
        thisRef.onArrowKey(Constants.ARROW_DOWN);
        e.preventDefault();
      } else if (e.code.includes('Shift')) {
        thisRef.undo();
      } else {
        thisRef.clearBoard();
      }
    });

    window.addEventListener('keyup', function(e) {
      if (e.code === 'Space') {
        thisRef.onSpacebarUp();
        e.preventDefault();
      }
    });
  }

  setScreenSizeClass() {
    if (screen.width <= 340) {
      this.screenSizeClass = 'mobile-sm';
    } else if (screen.width <= 375) {
      this.screenSizeClass = 'mobile';
    } else if (screen.width <= 414) {
      this.screenSizeClass = 'mobile-lg';
    } else {
      this.screenSizeClass = 'desktop';
    }
  }

  onClick(id: number) {
    if (this.start === id) {
      this.start = undefined;
      this.middle = undefined;
      this.target = undefined;
    } else if (this.middle === undefined && this.target == undefined && this.startIsValid(id)) {
      this.start = id;
      this.middle = undefined;
      this.target = undefined;
    } else if (this.start !== undefined && this.middle !== undefined && this.target !== undefined) {
      if (this.targetIsValid(this.target)) {
        this.performMove();
      } else {
        this.start = undefined;
        this.middle = undefined;
        this.target = undefined;
      }
    }
    this.passClickAway = true;
    this.updateState();

    if (this.solved) {
      this.storage.remove('savedGame');
    }
  }

  performMove() {
    this.moveStack[this.numMoves] = Object.assign([], this.values);
    this.numMoves++;
    this.values[this.target] = this.values[this.start] + this.values[this.middle];
    this.values[this.start] = -1;
    this.values[this.middle] = -1;
    this.start = undefined;
    this.middle = undefined;
    this.target = undefined;
    this.solved = this.checkSolved();
    this.updateState();
  }

  clickAway() {
    if (!this.passClickAway) {
      this.clearBoard();
    }
    this.passClickAway = false;
  }

  clearBoard() {
    this.start = undefined;
    this.middle = undefined;
    this.target = undefined;
    this.updateState();
  }

  onHover(id: number) {
    if (this.start !== undefined && this.middle === undefined && this.target === undefined) {
      const middle = this.getMiddle(id);
      if (middle !== undefined && this.values[middle] >= 0) {
        this.middle = middle;
        this.target = id;
        this.updateState();
      }
    }
  }

  onMouseOut(id: number) {
    this.middle = undefined;
    this.target = undefined;
    this.updateState();
  }

  updateState() {
    for (let i = 0; i < 15; i++) {
      if (this.solved) {
        this.state[i] = 4;
        continue;
      }
      if (this.start === i || this.middle === i) {
        this.state[i] = 1;
      } else if (this.target !== undefined && this.target === i) {
        if (this.targetIsValid(this.target)) {
          this.state[i] = 2; // valid
        } else {
          this.state[i] = 3; // invalid
        }
      } else {
        this.state[i] = 0;
      }
    }
  }

  isSelected(id: number) {
    return this.start === id || this.middle === id || this.target === id;
  }

  startIsValid(id: number) {
    return this.values[id] >= 0;
  }

  targetIsValid(id: number) {
    const sumValid = this.fibbSeq.indexOf(this.values[this.start] + this.values[this.middle]) > -1;
    let validZeroJumping = true;

    if (this.values[this.start] === 0 && this.values[this.middle] > 1) {
      validZeroJumping = false;
    } else if (this.values[this.middle] === 0 && this.values[this.start] > 1) {
      validZeroJumping = false;
    }

    return sumValid && validZeroJumping && this.values[id] === -1;
  }

  getMiddle(targetId: number): number {
    if (this.values[targetId] >= 0) {
      return undefined;
    }
    for (let i = 0; i < 3; i++) {
      const direction = this.directions[i];
      for (let index = 0; index < direction.length; index++) {
        if (direction[index] === this.start) {
          if (index + 2 < direction.length && direction[index + 2] === targetId) {
            return direction[index + 1];
          } else if (index - 2 >= 0 && direction[index - 2] === targetId) {
            return direction[index - 1];
          }
        }
      }
    }
    return undefined;
  }

  undo() {
    if (this.numMoves <= 0) return;
    this.values = Object.assign([], this.moveStack[this.numMoves - 1]);
    this.moveStack[this.numMoves - 1] = undefined;
    this.numMoves--;
    this.start = undefined;
    this.middle = undefined;
    this.target = undefined;
    this.solved = false;
    this.updateState();
  }

  checkSolved() {
    for (let i = 0; i < 15; i++) {
      if (this.values[i] >= 0 && this.values[i] !== this.boardTarget) {
        return false;
      }
    }
    return true;
  }

  newGame(difficulty: string) {
    const game: any = FibboQueue.getGame(difficulty);
    this.router.navigate(['play', GameEncoder.generateCodeString(game.seed, game.target)]);
  }

  loadGame(game: Game): void {
    for (let i = 0; i < 15; i++) {
      this.state[i] = 0;
    }

    this.values = Object.assign([], game.board);
    this.difficulty = game.difficulty;
    this.boardTarget = game.target;
    this.numMoves = 0;
    this.moveStack = [];
    this.start = undefined;
    this.middle = undefined;
    this.target = undefined;
    this.solved = false;
    this.targetState = 0;

    MoveFinder.clearCache();
  }

  openNewGameDialog(): void {
    const dialogRef = this.dialog.open(PlayOptionsDialog, {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe(difficulty => {
      if (difficulty) {
        this.newGame(difficulty);
      }
      this.optionsButton['_elementRef'].nativeElement.blur();
    });
  }

  onNewGameClicked(): void {
    if (this.numMoves !== 0 && !this.solved) {

      const dialogRef = this.dialog.open(PlayWarningDialog, {
        width: '450px'
      });

      dialogRef.afterClosed().subscribe(response => {
        if (response) {
          this.newGame(this.difficulty);
        }
        this.newGameButton['_elementRef'].nativeElement.blur();
      })
    } else {
      this.newGame(this.difficulty);
    }
  }

  onSpacebarUp() {
    if (this.start !== undefined && this.middle !== undefined && this.target !== undefined) {
      this.performMove();
    }
  }

  onArrowKey(selector: string): void {
    if (!selector) return;

    const moves = MoveFinder.getMoves(this.values, selector);

    if (selector === this.lastArrowKey) {
      this.lastArrowKeyIndex++;
      if (this.lastArrowKeyIndex >= moves.length) {
        this.lastArrowKeyIndex = 0;
      }
    } else {
      this.lastArrowKeyIndex = 0;
    }

    const move = moves[this.lastArrowKeyIndex];

    if (move !== undefined) {
      this.start = move.start;
      this.middle = move.middle;
      this.target = move.target;
      this.updateState();
    }

    this.lastArrowKey = selector;
  }

}
