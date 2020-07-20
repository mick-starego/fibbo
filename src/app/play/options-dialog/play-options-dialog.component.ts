import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {Constants} from "../../utils/Constants";

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './play-options-dialog.component.html',
  styleUrls: ['./play-options-dialog.component.scss']
})
export class PlayOptionsDialog {

  readonly BEGINNER = Constants.BEGINNER_DIFFICULTY;
  readonly NOVICE = Constants.NOVICE_DIFFICULTY;
  readonly ADVANCED = Constants.ADVANCED_DIFFICULTY;
  readonly EXPERT = Constants.EXPERT_DIFFICULTY;

  selection: string;

  constructor(
    public dialogRef: MatDialogRef<PlayOptionsDialog>
  ) {

    this.selection = null;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
