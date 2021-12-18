import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  public form!: FormGroup;
  public isLoading = false;

  constructor(
    private dialogRef: MatDialogRef<CreateComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      message: string;
      yes: string;
      no: string;
      error: string;
      placeholder: string;
    }
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required],
      }),
    });
    this.isLoading = false;
  }

  save() {
    if (this.form.invalid) {
      return;
    } else {
      this.dialogRef.close(this.form.get('title')!.value);
    }
  }

  close() {
    this.dialogRef.close();
  }
}
