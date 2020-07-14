import {FibboBoard} from "./FibboBoard";
import {PegGenerator} from "./PegGenerator";
import {PegBoard} from "./PegBoard";
import {PegDiff} from "./PegDiff";
import {Game} from "./Game";

export class FibboGenerator {

  static EASY_TARGET = 89;
  static readonly SEQUENCE = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];

  static genEasy(): Game {

    const fibboBoard = new FibboBoard();
    const pegSolution = PegGenerator.getPegSolution();

    let diff: PegDiff;
    let splitResult: number[];

    for (let i = 13; i > 0; i--) {

      diff = PegBoard.getBoardDifference(pegSolution[i - 1], pegSolution[i]);

      if (i === 13) {
        fibboBoard.set(diff.added, FibboGenerator.EASY_TARGET);
      }

      splitResult = FibboGenerator.split(fibboBoard.get(diff.added));

      // Half the time, swap these values
      if (Math.random() < 0.5) {
        const temp = splitResult[1];
        splitResult[1] = splitResult[0];
        splitResult[0] = temp;
      }

      fibboBoard.set(diff.added, -1);
      fibboBoard.set(diff.firstRemoved, splitResult[0]);
      fibboBoard.set(diff.secondRemoved, splitResult[1]);
    }
    return {
      board: fibboBoard.board,
      difficulty: 'e',
      target: this.EASY_TARGET
    };
  }

  private static split(value: number): number[] {
    const index = FibboGenerator.SEQUENCE.indexOf(value);
    if (index >= 0) {
      if (value === 0) {
        return [0, 0];
      } else if (value === 1) {
        return [0, 1];
      } else {
        return [FibboGenerator.SEQUENCE[index - 1], this.SEQUENCE[index - 2]];
      }
    } else {
      return null;
    }
  }
}
