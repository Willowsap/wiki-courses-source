import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  ActivatedRoute,
  ParamMap,
  Router,
} from '@angular/router';

import { CourseService } from '../../course.service';
import { Course } from '../../course.model';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { Topic } from '../../course.model';
import { CreateService } from '../create/create.service';
import { ConfirmationService } from '../confirmation/confirmation.service';
import { NgForm } from '@angular/forms';
import { ComponentCanDeactivate } from '../panding-changes.guard';

@Component({
  // no selector
  templateUrl: './course-edit.component.html',
  styleUrls: ['./course-edit.component.css'],
})
export class CourseEditComponent implements OnInit, OnDestroy, ComponentCanDeactivate {
  @ViewChild('titleForm')
  titleForm!: NgForm;
  @ViewChild('contentsForm')
  contentsForm!: NgForm;

  public isLoading = true;
  public isLoadingUser = true;
  public isLoadingContent = true;
  public editingTitle = false;

  public course!: Course;
  public user!: User;
  public topics!: Array<Topic>;
  public topicIndex = 0;

  public title: string = '';
  public contents: string = '';

  private userUpdated!: Subscription;
  private topicsUpdated!: Subscription;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public courseService: CourseService,
    public createService: CreateService,
    public authService: AuthService,
    public confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (!paramMap.has('courseTitle')) {
        this.router.navigate(['/']);
      }
      if (paramMap.has('topicIndex')) {
        this.topicIndex = parseInt(paramMap.get('topicIndex') as string);
      }
      // get user
      this.userUpdated = this.authService
        .getUserListener()
        .subscribe((user) => {
          this.user = user;
          this.isLoadingUser = false;
          this.checkLoaded();
        });
      this.user = this.authService.getUser();
      // get course
      this.courseService
        .getCourse({ courseTitle: paramMap.get('courseTitle') as string })
        .subscribe((course) => {
          this.course = course;
          this.topicsUpdated = this.courseService
            .getTopicUpdateListener()
            .subscribe((topics) => {
              this.topics = topics.topics;
              this.isLoadingContent = false;
              this.syncForm();
              this.checkLoaded();
            });
          this.courseService.getTopics({ courseTitle: course.title });
        });
    });
  }

  ngOnDestroy() {
    if (this.userUpdated) {
      this.userUpdated.unsubscribe();
    }
    if (this.topicsUpdated) {
      this.topicsUpdated.unsubscribe();
    }
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean  {
    if (
      (this.topicIndex === 0 && this.title !== this.course.title) ||
      (this.topicIndex !== 0 &&
        this.title != this.topics[this.topicIndex].title) ||
      this.contents !== this.topics[this.topicIndex].contents
    ) {
      return false
    }
    return true;
  }

  editTitle() {
    this.editingTitle = true;
  }

  saveTitle = (titleForm: NgForm) => {
    if (titleForm.invalid) {
      return;
    }
    const isCourseTitle = this.topicIndex === 0;
    this.askForMessage().subscribe((result) => {
      if (result) {
        if (isCourseTitle) {
          this.courseService.updateCourseTitle({
            oldCourseTitle: this.course.title,
            newCourseTitle: titleForm.value.title,
            email: this.user.email,
            username: this.user.username,
            message: result,
          }).subscribe(result => {
            if (result.message === "success") {
              this.successfulSave();
            } else {
              this.failedToSave()
            }
          });
        } else {
          this.courseService.updateTopicTitle({
            courseTitle: this.course.title,
            oldTopicTitle: this.topics[this.topicIndex].title,
            newTopicTitle: titleForm.value.title,
            email: this.user.email,
            username: this.user.username,
            message: result,
          }).subscribe(result => {
            if (result.message === "success") {
              this.successfulSave();
            } else {
              this.failedToSave()
            }
          });
        }
      }
    });
  };

  saveContents = (contentsForm: NgForm) => {
    if (contentsForm.invalid) {
      console.log("invalid")
      return;
    }
    const isCourseDescription = this.topicIndex === 0;
    this.askForMessage().subscribe((result) => {
      if (result) {
        if (isCourseDescription) {
          this.courseService.updateCourseDescription({
            courseTitle: this.course.title,
            description: this.contents,
            email: this.user.email,
            username: this.user.username,
            message: result,
          }).subscribe(result => {
            if (result.message === "success") {
              this.successfulSave();
            } else {
              this.failedToSave()
            }
          });
        } else {
          this.courseService.updateTopicContents({
            courseTitle: this.course.title,
            topicTitle: this.topics[this.topicIndex].title,
            contents: this.contents,
            email: this.user.email,
            username: this.user.username,
            message: result,
          }).subscribe(result => {
            if (result.message === "success") {
              this.successfulSave();
            } else {
              this.failedToSave()
            }
          });
        }
      }
    });
  };

  deleteTopic() {
    this.confirmDeletion().subscribe((res) => {
      this.courseService.deleteTopic({
        courseTitle: this.course.title,
        topicTitle: this.topics[this.topicIndex].title,
        email: this.user.email,
        username: this.user.username,
        message: res,
      }).subscribe(result => {
        if(result.message === "success") {
          this.router.navigate(["edit", this.course.title, 0])
        }
      });
    });
  }
  checkLoaded() {
    if (this.user) {
      this.isLoadingUser = false;
    }
    this.isLoading = this.isLoadingContent || this.isLoadingUser;
  }

  private syncForm() {
    this.contents = this.topics[this.topicIndex].contents;
    if (this.topicIndex === 0) {
      this.title = this.course.title;
    } else {
      this.title = this.topics[this.topicIndex].title;
    }
  }

  private successfulSave() {
    if (this.topicIndex === 0) {
      this.course.title = this.title;
    } else {
      this.topics[this.topicIndex].title = this.title;
    }
    this.courseService.getTopics({ courseTitle: this.course.title });
    this.contents = this.topics[this.topicIndex].contents;
    return this.confirmationService.openConfirmation({
      title: 'Success',
      message: 'Course Saved',
      yes: 'Close',
      oneButton: true,
    });
  }

  private failedToSave() {
    return this.confirmationService.openConfirmation({
      title: 'Course Failed to Save',
      message: 'If this problem persists please contact support at wikisapphirecourses@gmail.com',
      yes: 'Close',
      oneButton: true,
    });
  }

  private askForMessage() {
    return this.createService.openRequest({
      title: 'Add Message',
      message: 'Please describe the changes you are making',
      yes: 'Submit',
      no: 'Cancel',
      error: 'Please enter a message',
      placeholder: 'message',
    });
  }

  private confirmDeletion() {
    return this.createService.openRequest({
      title: 'Are you sure?',
      message: 'Please describe why you are deleting this topic',
      yes: 'Delete',
      no: 'Cancel',
      error: 'Please enter a message',
      placeholder: 'reason for deletion',
    });
  }
}
