import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-display-node',
  templateUrl: './display-node.component.html',
  styleUrls: ['./display-node.component.scss']
})
export class DisplayNodeComponent implements OnInit {
  @Input() value;
  @Input() state;

  constructor() { }

  ngOnInit(): void { }

  getStroke() {
    if (this.state === 1) {
      return '#f2c41d';
    } else {
      return '#FFE1B0';
    }
  }

  getFill() {
    if (this.state === 1) {
      return 'white';
    } else {
      return '#FFFAF2';
    }
  }

  getColor() {
    if (this.state === 1) {
      return '#d4a600';
    } else {
      return '#663100';
    }
  }

}
