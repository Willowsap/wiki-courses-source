import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { User } from '../user.model';

@Component({
  // no selector due to only being rendered via routing
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit, OnDestroy {
  public authData: {
    id: string;
    token: string;
    expirationDate: Date;
  } | null = null;
  public user: User | null = null;
  private userListener!: Subscription;
  private authStatusListener!: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authStatusListener = this.authService
      .getAuthStatusListener()
      .subscribe((status) => {
        if (!status) {
          this.router.navigate(['/']);
        }
      });
    this.authData = this.authService.getAuthData();
    if (!this.authData) {
      this.router.navigate(['/']);
    }
    this.user = this.authService.getUser();
    this.userListener = this.authService.getUserListener().subscribe((user) => {
      this.user = user;
    });
  }

  verify() {
    if (this.user) {
      this.authService.verify(this.user.email).subscribe((response) => {
        alert(response.message);
      });
    }
  }

  ngOnDestroy() {
    this.userListener.unsubscribe();
    this.authStatusListener.unsubscribe();
  }
}
