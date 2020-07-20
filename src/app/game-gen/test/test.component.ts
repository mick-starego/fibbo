import { Component, OnInit } from '@angular/core';
import {Queue} from "../Queue";
import {FibboQueue} from "../FibboQueue";
import {Constants} from "../../utils/Constants";
import {FibboBoard} from "../FibboBoard";

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  data: number[];
  queue: Queue<number>;

  constructor() {
    this.data = [];
    this.queue = new Queue<number>();
  }

  ngOnInit(): void { }

  initQueue() {
    FibboQueue.initialize();
    FibboQueue.log();
  }

  getBeginner() {
    const game = FibboQueue.getGame(Constants.BEGINNER_DIFFICULTY);
    console.log(FibboBoard.buildFromGame(game).toString());
    FibboQueue.log();
  }

  getNovice() {
    const game = FibboQueue.getGame(Constants.NOVICE_DIFFICULTY);
    console.log(FibboBoard.buildFromGame(game).toString());
    FibboQueue.log();
  }

  getAdvanced() {
    const game = FibboQueue.getGame(Constants.ADVANCED_DIFFICULTY);
    console.log(FibboBoard.buildFromGame(game).toString());
    FibboQueue.log();
  }

  getExpert() {
    const game = FibboQueue.getGame(Constants.EXPERT_DIFFICULTY);
    console.log(FibboBoard.buildFromGame(game).toString());
    FibboQueue.log();
  }

}
