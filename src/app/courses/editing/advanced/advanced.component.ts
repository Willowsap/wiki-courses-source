import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { commit, CommitObject } from 'isomorphic-git';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { Course } from '../../course.model';
import { CourseService } from '../../course.service';
import { CreateService } from '../create/create.service';
import { Commit } from './commit.model';
import { OldVersion } from './oldVersion.model';

@Component({
  // no selector
  templateUrl: './advanced.component.html',
  styleUrls: ['./advanced.component.css'],
})
export class AdvancedComponent implements OnInit {
  public user!: User;
  public userUpdated!: Subscription;
  public isLoading = false;
  public courseTitle: string = '';
  public versions: Array<any> = [];
  public transformedVersions: Array<OldVersion> = [];
  public numVersions: string = '5';

  constructor(
    private createService: CreateService,
    private courseService: CourseService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.userUpdated = this.authService.getUserListener().subscribe((user) => {
      this.user = user;
    });
    this.user = this.authService.getUser();
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (!paramMap.has('courseTitle')) {
        this.router.navigate(['/']);
      }
      this.courseTitle = paramMap.get('courseTitle') as string;
      this.courseService
        .getCourseVersions({ courseTitle: this.courseTitle })
        .subscribe((result) => {
          this.transformedVersions = this.transformMessages(result);
          this.isLoading = false;
        });
    });
  }

  transformMessages(commitMessages: Array<Commit>) {
    const newMessages: Array<OldVersion> = [];
    for (const commit of commitMessages) {
      newMessages.push({
        message: commit.commit.message,
        author: commit.commit.committer.name,
        date: this.getFormattedDate(
          new Date(commit.commit.committer.timestamp * 1000)
        ),
        oid: commit.oid,
      });
    }
    return newMessages;
  }

  revert(commitIndex: number) {
    this.confirmRevert().subscribe((result) => {
      if (result) {
        this.courseService.revertCourse({
          courseTitle: this.courseTitle,
          oid: this.transformedVersions[commitIndex].oid,
        }).subscribe(result => {
          this.router.navigate(["edit", this.courseTitle, "0"])
        });
      }
    });
  }

  getFormattedDate(date: Date) {
    return (
      date.getMonth() +
      1 +
      '/' +
      date.getDay() +
      '/' +
      date.getFullYear() +
      ', ' +
      (date.getHours() < 10 ? '0' : '') +
      date.getHours() +
      ':' +
      (date.getMinutes() < 10 ? '0' : '') +
      date.getMinutes() +
      ':' +
      (date.getSeconds() < 10 ? '0' : '') +
      date.getSeconds()
    );
  }

  deleteCourse() {
    this.confirmDeletion().subscribe((result) => {
      if (result)
        [
          this.courseService
            .deleteCourse({
              courseTitle: this.courseTitle,
              email: this.user.email,
              username: this.user.username,
              message: result,
            })
            .subscribe((result) => {
              this.router.navigate(['/']);
            }),
        ];
    });
  }

  private confirmDeletion() {
    return this.createService.openRequest({
      title: 'Are you sure?',
      message: 'Please describe why you are deleting this course',
      yes: 'Delete',
      no: 'Cancel',
      error: 'Please enter a message',
      placeholder: 'reason for deletion',
    });
  }

  private confirmRevert() {
    return this.createService.openRequest({
      title: 'Are you sure?',
      message: 'Please describe why you are reverting to this version',
      yes: 'Revert',
      no: 'Cancel',
      error: 'Please enter a message',
      placeholder: 'reason for reverting',
    });
  }
}
