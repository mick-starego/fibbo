import {LCRNG} from "./LCRNG";

export class Target {
  prob89: number;
  prob55: number;
  prob34: number;

  constructor() {
    this.prob89 = .33;
    this.prob55 = .34;
    this.prob34 = .33;
  }

  configure(prob89: number, prob55: number, prob34: number) {
    const total = prob89 + prob55 + prob34;
    if (total < 0.999 || total > 1) {
      console.error("Invalid target configuration: " + prob89 + ', ' + prob55 + ', ' + prob34);
      return;
    }
    this.prob89 = prob89;
    this.prob55 = prob55;
    this.prob34 = prob34;
  }

  get() {
    const upperBound89 = this.prob89;
    const upperBound55 = this.prob89 + this.prob55;
    const rand = LCRNG.random();

    if (rand >= 0 && rand < upperBound89) {
      return 89;
    } else if (rand > upperBound89 && rand < upperBound55) {
      return 55;
    } else {
      return 34;
    }
  }
}
