export interface Move {
  start: number;
  middle: number;
  target: number;
  dir: 0 | 1 | 2;
  mobility: number;
}
