import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {Constants} from "../../utils/Constants";

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './play-options-dialog.component.html',
  styleUrls: ['./play-options-dialog.component.scss']
})
export class PlayOptionsDialog {

  readonly EASY = Constants.EASY_DIFFICULTY;
  readonly MEDIUM = Constants.MEDIUM_DIFFICULTY;
  readonly HARD = Constants.HARD_DIFFICULTY;
  readonly EVIL = Constants.EVIL_DIFFICULTY;

  selection: string;
  mediumText: string;

  constructor(
    public dialogRef: MatDialogRef<PlayOptionsDialog>
  ) {

    this.selection = null;
    if (screen.width <= 414) {
      this.mediumText = 'med';
    } else {
      this.mediumText = 'medium';
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
