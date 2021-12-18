import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { CourseService } from '../course.service';
import { CreateService } from '../editing/create/create.service';
import { Topic } from '../course.model';
import { Router } from '@angular/router';

@Component({
  selector: 'topic-menu[courseTitle]',
  templateUrl: './topic-menu.component.html',
  styleUrls: ['./topic-menu.component.css'],
})
export class TopicMenuComponent implements OnInit, OnDestroy {
  @Input()
  public courseTitle: string = '';
  @Input()
  public inEditMode: boolean = false;

  public mode = '/course';
  public topics: Array<Topic> = [];
  public user!: User;

  private topicsListener!: Subscription;
  private userListener!: Subscription;

  constructor(
    private router: Router,
    private createService: CreateService,
    private courseService: CourseService,
    private authService: AuthService
  ) {}

  newTopic() {
    this.createService.openTopicCreation(
      this.courseTitle,
      this.user.email,
      this.user.username,
      {
        title: 'Topic Creation',
        message: 'Please enter a name for the new topic',
        yes: 'Create Topic',
        no: 'Cancel',
        error: 'Please enter a valid topic name',
        placeholder: 'Topic Name',
      }
    );
  }

  ngOnInit() {
    this.topicsListener = this.courseService
      .getTopicUpdateListener()
      .subscribe((topicData) => {
        if (topicData) {
          this.topics = topicData.topics;
        }
      });
    this.userListener = this.authService.getUserListener().subscribe((user) => {
      this.user = user;
    });
    this.user = this.authService.getUser();
    this.courseService.getTopics({ courseTitle: this.courseTitle });
    this.mode = this.inEditMode ? '/edit' : '/course';
  }

  ngOnDestroy() {
    this.topicsListener.unsubscribe();
    this.userListener.unsubscribe();
  }
}
