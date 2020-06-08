import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodeComponent implements OnInit, OnChanges {
  @Input() value: number;
  @Input() selected: number;
  style: string = "";

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    if (this.value < 0) {
      this.value = undefined;
    }
  }
  getBkg() {
    if (this.selected === 1) {
      return 'DDC49A';
    } else if (this.selected === 2) {
      return '#a4eba2';
    } else if (this.selected === 3) {
      return '#f7a08b';
    } else if (this.selected === 4) {
      return 'white';
    } else {
      return 'FFFAF2';
    }
  }

  getStroke() {
    if (this.selected === 1) {
      return '#663100';
    } else if (this.selected === 2) {
      return '#145413';
    } else if (this.selected === 3) {
      return '#852913';
    }  else if (this.selected === 4) {
      return '#54b04d';
    } else {
      return '#FFE1B0';
    }
  }

  getTextColor() {
    if (this.selected !== 4) {
      return '#663100';
    } else {
      return '#54b04d';
    }
  }

}
