import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { Course } from '../course.model';
import { CourseService } from '../course.service';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css'],
})
export class CourseListComponent implements OnInit, OnDestroy {
  public courses: Array<Course> = [];
  public isLoading = false;
  public query = '';
  public totalCourses = 0;
  public coursesPerPage = 5;
  public currentPage = 1;
  public pageSizeOptions = [1, 5, 10, 25, 50];

  private coursesSub!: Subscription;

  constructor(public courseService: CourseService) {}

  ngOnInit() {
    this.isLoading = true;
    this.coursesSub = this.courseService
      .getCourseUpdateListener()
      .subscribe(
        (
          courseData: { courses: Array<Course>; courseCount: number } | null
        ) => {
          if (courseData) {
            this.courses = courseData.courses;
            this.totalCourses = courseData.courseCount;
            this.isLoading = false;
          }
        }
      );
    this.courseService.getCourses({
      coursesPerPage: this.coursesPerPage,
      currentPage: this.currentPage,
      query: this.query,
    });
  }

  ngOnDestroy() {
    if(this.coursesSub) {
      this.coursesSub.unsubscribe();
    }
  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.coursesPerPage = pageData.pageSize;
    this.courseService.getCourses({
      coursesPerPage: this.coursesPerPage,
      currentPage: this.currentPage,
      query: this.query,
    });
  }

  updateSearch(search: HTMLInputElement) {
    this.query = search.value;
    this.courseService.getCourses({
      coursesPerPage: this.coursesPerPage,
      currentPage: this.currentPage,
      query: this.query,
    });
  }
}
