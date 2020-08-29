import { PegData } from "./data/peg_solns";
import { PegBoard } from "./PegBoard";
import {LCRNG} from "./LCRNG";

export class PegGenerator {

  static readonly START_BOARD = 131070;

  static getPegSolution(): PegBoard[] {

    const solution: PegBoard[] = [];
    let currentBoard = PegGenerator.START_BOARD;
    let numChildren = PegData
      .DATA
      .get(PegGenerator.START_BOARD)
      .length;

    while (numChildren > 0) {
      currentBoard = PegData
        .DATA
        .get(currentBoard)[Math.floor(LCRNG.random() * numChildren)];
      solution.push(new PegBoard(currentBoard));

      numChildren = PegData
        .DATA
        .get(currentBoard)
        .length;
    }
    return solution;
  }
}
