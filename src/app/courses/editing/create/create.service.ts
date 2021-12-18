import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CourseService } from '../../course.service';
// import { CourseService } from '../../course.service.stub';
import { CreateComponent } from './create.component';

@Injectable({ providedIn: 'root' })
export class CreateService {
  constructor(
    public dialog: MatDialog,
    public courseService: CourseService,
    public router: Router
  ) {}

  openTopicCreation(
    courseTitle: string,
    email: string,
    username: string,
    inputData: {
      title: string;
      message: string;
      yes: string;
      no: string;
      error: string;
      placeholder: string;
    }
  ) {
    let dialogRef = this.dialog.open(CreateComponent, {
      width: '400px',
      data: inputData,
    });
    dialogRef.afterClosed().subscribe((result: string) => {
      if (result) {
        this.courseService.createTopic({
          courseTitle: courseTitle,
          topicTitle: result,
          email,
          username
        });
      }
    });
  }

  openCourseCreation(
    email: string,
    username: string,
    inputData: {
      title: string;
      message: string;
      yes: string;
      no: string;
      error: string;
      placeholder: string;
    }
  ) {
    let dialogRef = this.dialog.open(CreateComponent, {
      width: '250px',
      data: inputData,
    });
    dialogRef.afterClosed().subscribe((result: string) => {
      if (result) {
        this.courseService.createCourse({
          courseTitle: result,
          email,
          username
        });
      }
    });
  }

  openRequest(
    inputData: {
      title: string;
      message: string;
      yes: string;
      no: string;
      error: string;
      placeholder: string;
    }
  ) {
    let dialogRef = this.dialog.open(CreateComponent, {
      width: '250px',
      data: inputData,
    });
    return dialogRef.afterClosed();
  }
}
