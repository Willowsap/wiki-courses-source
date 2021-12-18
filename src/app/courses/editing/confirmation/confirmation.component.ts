import { Component, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl: './confirmation.component.html',
})
export class ConfirmationComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      message: string;
      yes: string;
      no: string;
      oneButton: boolean;
    },
    public dialogRef: MatDialogRef<ConfirmationComponent>
  ) {}
}
