import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FibboDifficulty} from "../game-gen/FibboDifficulty";
import {Constants} from "../utils/Constants";
import {Game} from "../game-gen/Game";
import {FibboQueue} from "../game-gen/FibboQueue";
import {MatDialog} from "@angular/material/dialog";
import {PlayOptionsDialog} from "./options-dialog/play-options-dialog.component";
import {PlayWarningDialog} from "./warning-dialog/play-warning-dialog.component";

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {

  readonly BEGINNER = Constants.BEGINNER_DIFFICULTY;
  readonly NOVICE = Constants.NOVICE_DIFFICULTY;
  readonly ADVANCED = Constants.ADVANCED_DIFFICULTY;
  readonly EXPERT = Constants.EXPERT_DIFFICULTY;

  @ViewChild('optionsButton') optionsButton: ElementRef;
  @ViewChild('newGameButton') newGameButton: ElementRef;

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

  constructor(
    public dialog: MatDialog,
    public changeDetectorRef: ChangeDetectorRef
  ) {
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
  }

  ngOnInit(): void {
    FibboQueue.initialize();
    console.log('Queue Initialized');
    FibboQueue.log();
    let game: Game;
    game = FibboQueue.getGame(Constants.BEGINNER_DIFFICULTY);
    this.values = Object.assign([], game.board);
    this.boardTarget = game.target;
    this.difficulty = game.difficulty;
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
        this.moveStack[this.numMoves] = Object.assign([], this.values);
        this.numMoves++;
        this.values[this.target] = this.values[this.start] + this.values[this.middle];
        this.values[this.start] = -1;
        this.values[this.middle] = -1;
        this.start = undefined;
        this.middle = undefined;
        this.target = undefined;
        this.solved = this.checkSolved();
      } else {
        this.start = undefined;
        this.middle = undefined;
        this.target = undefined;
      }
    }
    this.passClickAway = true;
    this.updateState();
  }

  clickAway() {
    if (!this.passClickAway) {
      this.start = undefined;
      this.middle = undefined;
      this.target = undefined;
    }
    this.passClickAway = false;
    this.updateState();
  }

  onHover(id: number) {
    if (this.start !== undefined && this.middle === undefined && this.target === undefined) {
      let middle = this.getMiddle(id);
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
      let direction = this.directions[i];
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
    for (let i = 0; i < 15; i++) {
      this.state[i] = 0;
    }
    let g: any = FibboQueue.getGame(difficulty);
    this.values = Object.assign([], g.board);
    this.difficulty = g.difficulty;
    this.boardTarget = g.target;
    this.numMoves = 0;
    this.moveStack = [];
    this.start = undefined;
    this.middle = undefined;
    this.target = undefined;
    this.solved = false;
    this.targetState = 0;
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

  onShuffleClicked(): void {
    if (this.numMoves !== 0) {

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

}
