import {Game} from "./Game";
import {FibboGenerator} from "./FibboGenerator";
import {Constants} from "../utils/Constants";

export class FibboDifficulty {

  static DIRECTIONS = [
    [undefined, 3, 4, 5, undefined, 6, 7, 8, 9, undefined, 10, 11, 12, 13, 14],
    [undefined, 3, 7, 12, undefined, 1, 4, 8, 13, undefined, 0, 2, 5, 9, 14],
    [undefined, 5, 8, 12, undefined, 2, 4, 7, 11, undefined, 0, 1, 3, 6, 10]
  ];

  static NOVICE_LOWER_BOUND = 8;
  static NOVICE_UPPER_BOUND = 25;

  static ADVANCED_LOWER_BOUND = 25;
  static ADVANCED_UPPER_BOUND = 60;

  static getDifficulty(game: Game): string {
    let difficulty = this.calcDifficulty(game);

    if (
      difficulty < this.NOVICE_LOWER_BOUND
    ) {
      return Constants.BEGINNER_DIFFICULTY;

    } else if (
      difficulty >= this.NOVICE_LOWER_BOUND &&
      difficulty < this.NOVICE_UPPER_BOUND
    ) {
      return Constants.NOVICE_DIFFICULTY;

    } else if (
      difficulty >= this.ADVANCED_LOWER_BOUND &&
      difficulty < this.ADVANCED_UPPER_BOUND
    ) {
      return Constants.ADVANCED_DIFFICULTY;

    } else {
      return Constants.EXPERT_DIFFICULTY;
    }
  }

  private static calcDifficulty(game: Game): number {

    const deadEndSet = new Set<number>();
    this.backtrack(
      Object.assign(game.board, []),
      deadEndSet
    );

    return deadEndSet.size;
  }

  private static backtrack(board: number[], deadEndSet: Set<number>): void {

    let dir: number[];
    let deadEnd = true;
    for (let dirSelector = 0; dirSelector < 3; dirSelector++) {
      dir = FibboDifficulty.DIRECTIONS[dirSelector];

      for (let i = 0; i < dir.length - 2; i++) {
        if (dir[i] === undefined ||
          dir[i + 1] === undefined ||
          dir[i + 2] === undefined
        ) {
          continue;
        }

        if (
          board[dir[i]] !== -1 &&
          board[dir[i + 1]] !== -1 &&
          board[dir[i + 2]] === -1 &&
          FibboGenerator.SEQUENCE.includes(
            board[dir[i]] + board[dir[i + 1]]
          ) &&
          !(board[dir[i]] === 0 && board[dir[i + 1]] > 1) &&
          !(board[dir[i + 1]] === 0 && board[dir[i]] > 1)
        ) {

          deadEnd = false;

          const holdOne = board[dir[i]];
          const holdTwo = board[dir[i + 1]];

          board[dir[i + 2]] = board[dir[i]] + board[dir[i + 1]];
          board[dir[i]] = -1;
          board[dir[i + 1]] = -1;

          this.backtrack(board, deadEndSet);

          board[dir[i]] = holdOne;
          board[dir[i + 1]] = holdTwo;
          board[dir[i + 2]] = -1;

        } else if (
          board[dir[i]] === -1 &&
          board[dir[i + 1]] !== -1 &&
          board[dir[i + 2]] !== -1 &&
          FibboGenerator.SEQUENCE.includes(
            board[dir[i + 1]] + board[dir[i + 2]]
          ) &&
          !(board[dir[i + 1]] === 0 && board[dir[i + 2]] > 1) &&
          !(board[dir[i + 2]] === 0 && board[dir[i + 1]] > 1)
        ) {

          deadEnd = false;

          const holdOne = board[dir[i + 1]];
          const holdTwo = board[dir[i + 2]];

          board[dir[i]] = board[dir[i + 1]] + board[dir[i + 2]];
          board[dir[i + 1]] = -1;
          board[dir[i + 2]] = -1;

          this.backtrack(board, deadEndSet);

          board[dir[i + 1]] = holdOne;
          board[dir[i + 2]] = holdTwo;
          board[dir[i]] = -1;
        }
      }
    }

    if (deadEnd) {

      let count = 0;
      let hash = 0;
      for (let i = 0; i < board.length; i++) {
        hash += ((i + 1) * board[i]) * 7;

        if (board[i] !== -1) {
          count++;
        }
      }

      if (count !== 1) {
        deadEndSet.add(hash);
      }
    }
  }
}
