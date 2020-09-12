import {FibboDifficulty} from "../game-gen/FibboDifficulty";
import {Move} from "./models/Move";
import {Constants} from "../utils/Constants";

export class MoveFinder {

  private static cachedMoves: Map<string, Move[]> = new Map<string, Move[]>();

  public static clearCache(): void {
    this.cachedMoves.clear();
  }

  public static  getMoves(board: number[], selector: string): Move[] {

    const hash = this.hash(board);
    let moves: Move[];

    if (this.isCached(hash)) {
      moves = this.getMovesFromCache(hash);
    } else {
      moves = this.getMovesByBacktrack(board);
      this.addMovesToCache(moves, hash);
    }

    return this.filterAndSortMoves(moves, selector);
  }

  private static isCached(hash: string): boolean {
    return this.cachedMoves.has(hash);
  }

  private static getMovesFromCache(hash: string): Move[] {
    return this.cachedMoves.get(hash);
  }

  private static addMovesToCache(moves: Move[], hash: string): void {
    this.cachedMoves.set(hash, moves);
  }

  private static hash(board: number[]): string {
    let s = '';
    board.forEach((num) => {
      s += num.toString(10);
    });
    return s;
  }

  private static filterAndSortMoves(moves: Move[], selector: string): Move[] {

    return moves.filter((move) => {
      switch (selector) {
        case Constants.ARROW_LEFT:
          return move.dir === 0 && move.start > move.target;
        case Constants.ARROW_RIGHT:
          return move.dir === 0 && move.start < move.target;
        case Constants.ARROW_DOWN:
          return move.dir !== 0 && move.start < move.target;
        case Constants.ARROW_UP:
          return move.dir !== 0 && move.start > move.target;
      }
    }).sort((a, b) => a.mobility > b.mobility ? -1 : 1);
  }

  private static getMovesByBacktrack(board: number[]) {
    const moveSet = FibboDifficulty.moveFinderBacktrackWrapper(board);
    const moves: Move[] = [];
    moveSet.forEach((move) => moves.push(move));

    // Calculate mobilities
    if (moves.length > 1) {
      moves.forEach((move) => {
        const _board: number[] = Object.assign([], board);
        _board[move.target] = _board[move.start] + _board[move.middle];
        _board[move.start] = -1;
        _board[move.target] = -1;

        move.mobility = FibboDifficulty.moveFinderBacktrackWrapper(_board).size;
      });
    }

    return moves;
  }
}
