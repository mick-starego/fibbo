import {Game} from "./models/Game";

export class FibboBoard {
  board: number[];
  difficulty: string;
  target: number;

  constructor() {
    this.board = [];
    for (let i = 0; i < 15; i++) {
      this.board.push(-1);
    }
    this.difficulty = null;
    this.target = null;
  }

  static buildFromGame(game: Game): FibboBoard {
    const board = new FibboBoard();
    board.board = game.board;
    board.difficulty = game.difficulty;
    board.target = game.target;

    return board;
  }

  get(index: number): number {
    return this.board[index];
  }

  set(index: number, value: number): void {
    this.board[index] = value;
  }

  toString(): string {
    let currentIndex = 0;
    let leftPad: number;
    let boardString = '';

    for (let rowSize = 0; rowSize < 5; rowSize++) {
      leftPad = 13 - rowSize * 3;

      for (let i = 0; i < leftPad; i++) {
        boardString += ' ';
      }

      for (let i = 0; i < rowSize + 1; i++) {
        if (this.board[currentIndex] !== -1) {
          boardString += this.board[currentIndex];
        } else {
          boardString += '.';
        }
        currentIndex++;

        if (i != rowSize) {
          boardString += '     ';
        } else {
          boardString += '\n';
        }
      }
      boardString += '\n\n';
    }
    return boardString;
  }
}
