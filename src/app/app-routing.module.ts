import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { AuthGuard } from './auth/auth.guard';
import { PendingChangesGuard } from './courses/editing/panding-changes.guard';
import { CourseEditComponent } from './courses/editing/course-edit/course-edit.component';
import { CourseListComponent } from './courses/course-list/course-list.component';
import { CourseDisplayComponent } from './courses/course-display/course-display.component';
import { VerifiedComponent } from './auth/verified/verified.component';
import { AccountComponent } from './auth/account/account.component';
import { AdvancedComponent } from './courses/editing/advanced/advanced.component';
import { FeedbackComponent } from './feedback/feedback.component';

const routes: Routes = [
  { path: '', component: CourseListComponent },
  { path: 'about', component: AboutComponent },
  { path: 'feedback', component: FeedbackComponent },
  { path: 'verified', component: VerifiedComponent },
  { path: 'account', component: AccountComponent },
  {
    path: 'edit/:courseTitle/:topicIndex',
    component: CourseEditComponent,
    canActivate: [AuthGuard],
    canDeactivate: [PendingChangesGuard],
  },
  {
    path: 'edit/:courseTitle',
    component: CourseEditComponent,
    canActivate: [AuthGuard],
    canDeactivate: [PendingChangesGuard],
  },
  {
    path: 'course/:courseTitle/:topicIndex',
    component: CourseDisplayComponent,
  },
  { path: 'course/:courseTitle', component: CourseDisplayComponent },
  { path: 'advanced/:courseTitle', component: AdvancedComponent },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, PendingChangesGuard],
})
export class AppRoutingModule {}
