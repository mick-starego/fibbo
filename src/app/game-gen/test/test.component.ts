import {Component, OnInit} from '@angular/core';
import {Queue} from "../Queue";
import {FibboQueue} from "../FibboQueue";
import {Constants} from "../../utils/Constants";
import {Game} from "../models/Game";
import {GameEncoder} from "../GameEncoder";

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

  ngOnInit(): void {
    this.initQueue();
  }

  initQueue() {
    FibboQueue.initialize();
  }

  encode() {
    const g: Game = FibboQueue.getGame(Constants.EASY_DIFFICULTY);
    console.log(g);
    const key = GameEncoder.generateCodeString(g.seed, g.target);
    console.log(GameEncoder.buildFromCodeString(key));
  }

}
