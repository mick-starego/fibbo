import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-display-node',
  templateUrl: './display-node.component.html',
  styleUrls: ['./display-node.component.scss']
})
export class DisplayNodeComponent implements OnInit {
  @Input() value;

  constructor() { }

  ngOnInit(): void {
  }

}
