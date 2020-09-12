import {PegDiff} from "./models/PegDiff";

export class PegBoard {
  board: boolean[];

  constructor(enc: number) {
    this.board = [];

    enc = Math.floor(enc / 2);
    for (let i = 14; i >= 0; i--) {
      this.board[i] = enc % 2 === 1;
      enc = Math.floor(enc / 2);
    }
  }

  static getBoardDifference(parent: PegBoard, child: PegBoard): PegDiff {
    const diff: PegDiff = {
      added: null,
      firstRemoved: null,
      secondRemoved: null
    };
    let numAdded = 0;
    let numRemoved = 0;

    for (let i = 0; i < 15; i++) {

      if (parent.get(i) === false && child.get(i) === true) {
        diff.added = i;
        numAdded++;
      } else if (parent.get(i) === true && child.get(i) === false) {
        if (diff.firstRemoved === null) {
          diff.firstRemoved = i;
        } else {
          diff.secondRemoved = i;
        }
        numRemoved++;
      }
    }

    if (numAdded === 1 && numRemoved === 2) {
      return diff;
    } else {
      return null;
    }
  }

  get(index: number) {
    return this.board[index];
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
        if (this.board[currentIndex]) {
          boardString += 'X';
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
