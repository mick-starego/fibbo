import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { PlayComponent } from './play/play.component';
import { FormsModule } from '@angular/forms';
import { NodeComponent } from './node/node.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DisplayNodeComponent } from './display-node/display-node.component';
import { TestComponent } from './game-gen/test/test.component';
import {PlayOptionsDialog} from "./play/options-dialog/play-options-dialog.component";
import {MatDialogModule} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {PlayWarningDialog} from "./play/warning-dialog/play-warning-dialog.component";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PlayComponent,
    NodeComponent,
    DisplayNodeComponent,
    TestComponent,
    PlayOptionsDialog,
    PlayWarningDialog
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatButtonToggleModule
  ],
  providers: [],
  entryComponents: [
    PlayOptionsDialog,
    PlayWarningDialog
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
