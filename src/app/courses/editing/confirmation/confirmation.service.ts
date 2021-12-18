import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationComponent } from './confirmation.component';

@Injectable({ providedIn: 'root' })
export class ConfirmationService {
  defaultTitle = 'Confirm';
  defaultMessage = 'Are you sure?';
  defaultYes = 'Yes';
  defaultNo = 'No';
  defaultOneButton = false;

  constructor(public dialog: MatDialog) {}

  openConfirmation(options: {
    title?: string;
    message?: string;
    yes?: string;
    no?: string;
    oneButton?: boolean; // will use text from yes
  }) {
    const data = {
      title: options.title ? options.title : this.defaultTitle,
      message: options.message ? options.message : this.defaultMessage,
      yes: options.yes ? options.yes : this.defaultYes,
      no: options.no ? options.no : this.defaultNo,
      oneButton: options.oneButton ? options.oneButton : this.defaultOneButton,
    };
    let dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '250px',
      data,
    });
    return dialogRef.afterClosed();
  }
}
