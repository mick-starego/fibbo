import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'dialog-play-warning-dialog',
  templateUrl: './play-warning-dialog.component.html',
  styleUrls: ['./play-warning-dialog.component.scss']
})
export class PlayWarningDialog {

  constructor(
    public dialogRef: MatDialogRef<PlayWarningDialog>
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
