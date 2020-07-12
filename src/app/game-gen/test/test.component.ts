import { Component, OnInit } from '@angular/core';
import {PegGenerator} from "../PegGenerator";
import {PegBoard} from "../PegBoard";
import {FibboGenerator} from "../FibboGenerator";

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  constructor() { }

  ngOnInit(): void { }

  switchBoard() {
    console.log(FibboGenerator.genEasy());
  }

}
