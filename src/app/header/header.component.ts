import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { CreateService } from '../courses/editing/create/create.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  user?: User;

  private authStatusListener!: Subscription;
  private userListener!: Subscription;

  constructor(
    private authService: AuthService,
    private createService: CreateService
  ) {}

  onLogout() {
    this.authService.logout();
  }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusListener = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
      });
    this.user = this.authService.getUser();
    this.userListener = this.authService.getUserListener().subscribe((user) => {
      this.user = user;
    });
  }

  ngOnDestroy() {
    if (this.authStatusListener) {
      this.authStatusListener.unsubscribe();
    }
    if (this.userListener) {
      this.userListener.unsubscribe();
    }
  }

  newCourse() {
    if (this.user) {
      this.createService.openCourseCreation(
        this.user.email,
        this.user.username,
        {
          title: 'Course Creation',
          message: 'Please enter a name for the new course',
          yes: 'Create Course',
          no: 'Cancel',
          error: 'Please enter a valid course name',
          placeholder: 'Course Name',
        }
      );
    }
  }
}
