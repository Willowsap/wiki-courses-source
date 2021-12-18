import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { Course, Topic } from '../course.model';
import { CourseService } from '../course.service';
//import { CourseService } from '../course.service.stub';

@Component({
  selector: 'course-display',
  templateUrl: './course-display.component.html',
  styleUrls: ['./course-display.component.css'],
})
export class CourseDisplayComponent implements OnInit, OnDestroy {
  public isLoading = false;
  public topicIndex = 0;
  public course: Course | null = null;
  public topics: Array<Topic> | null = null;
  public user: User | null = null;

  private userUpdated!: Subscription;
  private topicsUpdated!: Subscription;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public authService: AuthService,
    public courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.user = this.authService.getUser();
    this.userUpdated = this.authService.getUserListener().subscribe((user) => {
      this.user = user;
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (!paramMap.has('courseTitle')) {
        console.log('course page accessed with no course title');
        this.router.navigate(['/']);
      }
      if (paramMap.has('topicIndex')) {
        this.topicIndex = parseInt(paramMap.get('topicIndex') as string);
      }
      this.courseService
        .getCourse({ courseTitle: paramMap.get('courseTitle') as string })
        .subscribe((course) => {
          this.course = course;
          this.topicsUpdated = this.courseService
            .getTopicUpdateListener()
            .subscribe((topics) => {
              if (topics) {
                this.topics = topics.topics;
                this.isLoading = false;
              }
            });
          this.courseService.getTopics({ courseTitle: this.course.title });
        });
    });
  }

  ngOnDestroy() {
    this.userUpdated.unsubscribe();
    this.topicsUpdated.unsubscribe();
  }
}
