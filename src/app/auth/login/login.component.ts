import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  // no selector due to only being accessed through router navigation
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  form!: FormGroup;
  private authStatusSub!: Subscription;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, {
        validators: [Validators.required],
      }),
      password: new FormControl(null, {
        validators: [Validators.required],
      }),
    });
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
        this.form.reset();
      });
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }

  onLogin() {
    if (this.form.invalid) return;
    this.isLoading = true;
    this.authService.login(this.form.value.email, this.form.value.password);
    return false;
  }
}
