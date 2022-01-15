// import { fakeAsync, TestBed } from "@angular/core/testing"

// import { AboutComponent } from './about/about.component';
// import { AuthGuard } from './auth/auth.guard';
// import { PendingChangesGuard } from './courses/editing/panding-changes.guard';
// import { CourseEditComponent } from './courses/editing/course-edit/course-edit.component';
// import { CourseListComponent } from './courses/course-list/course-list.component';
// import { CourseDisplayComponent } from './courses/course-display/course-display.component';
// import { VerifiedComponent } from './auth/verified/verified.component';
// import { AccountComponent } from './auth/account/account.component';
// import { AdvancedComponent } from './courses/editing/advanced/advanced.component';
// import { FeedbackComponent } from './feedback/feedback.component';
// import { Router } from "@angular/router";
// import { AppComponent } from "./app.component";

// fdescribe('Router: App', () => {

//   let location: Location;
//   let router: Router;
//   let fixture;

//   beforeEach(async() => {
//     TestBed.configureTestingModule({
//       declarations: [
//         AboutComponent,
//         CourseEditComponent,
//         CourseDisplayComponent,
//         CourseListComponent,
//         AuthGuard,
//         PendingChangesGuard,
//         VerifiedComponent,
//         AccountComponent,
//         AdvancedComponent,
//         FeedbackComponent
//       ]
//     });

//     router = TestBed.inject(Router);
//     location = TestBed.inject(Location);
//     fixture = TestBed.createComponent(AppComponent);
//     router.initialNavigation();
//   });

//   it('navigate to "" redirects you to the course list component', fakeAsync(() => {
//     router.navigate(['']);
//     expect(location.pathname).toBe("/");
//   }));
// });
