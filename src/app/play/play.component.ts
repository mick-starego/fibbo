import { Component, OnInit } from '@angular/core';
import {FibboGenerator} from "../game-gen/FibboGenerator";

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {

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

  constructor() {
    this.directions = [[undefined, 3, 4, 5, undefined, 6, 7, 8, 9, undefined, 10, 11, 12, 13, 14],
                       [undefined, 3, 7, 12, undefined, 1, 4, 8, 13, undefined, 0, 2, 5, 9, 14],
                       [undefined, 5, 8, 12, undefined, 2, 4, 7, 11, undefined, 0, 1, 3, 6, 10]];
    this.fibbSeq = [0,1,2,3,5,8,13,21,34,55,89];

    this.start = undefined;
    this.middle = undefined;
    this.target = undefined;
    this.boardTarget = undefined;
    this.difficulty = undefined;
    this.solved = false;
    for (let i = 0; i < 15; i++) {
      this.state[i] = 0;
    }
  }

  ngOnInit(): void {
    let game: any;
    game = FibboGenerator.genEasy();
    console.log(game);
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
    return this.fibbSeq.indexOf(this.values[this.start] + this.values[this.middle]) > -1;
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

  reset(game: number) {

  }

  checkSolved() {
    for (let i = 0; i < 15; i++) {
      if (this.values[i] >= 0 && this.values[i] !== this.boardTarget) {
        return false;
      }
    }
    return true;
  }

  nextGame() {
    for (let i = 0; i < 15; i++) {
      this.state[i] = 0;
    }
    let g: any = FibboGenerator.genEasy();
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

  onTargetClick() {
    let nextTarget: number;
    if (FibboGenerator.EASY_TARGET === 89) {
      nextTarget = 55;
    } else if (FibboGenerator.EASY_TARGET === 55) {
      nextTarget = 34;
    } else {
      nextTarget = 89;
    }

    FibboGenerator.EASY_TARGET = nextTarget;
    this.boardTarget = nextTarget;
    this.targetState = 1;
  }

}
