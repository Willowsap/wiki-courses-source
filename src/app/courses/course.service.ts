import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Course } from './course.model';
import { CourseStub } from './course.model';
import { Topic } from './course.model';

import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Commit } from './editing/advanced/commit.model';

const BACKEND_URL = environment.apiUrl + '/courses/';

/**
 * COURSE SERVICE METHODS
 *
 * getCourses: Void (updates coursesUpdated)
 * getCourseList: Array<CourseStub>
 * getCourse: Observable<Course>
 * getTopics: Void (updated topicsUpdated)
 * getTopicList: Array<Topic>
 * getTopic: Observable<Topic>
 *
 * createCourse: Observable<Course>
 * createTopic: Observable<Topic>
 *
 * updateCourseTitle: Observable<{message: string}>
 * updateCourseDescription: Observable<{message: string}>
 * updateTopicTitle: Observable<{message: string}>
 * updateTopicContent: Observable<{message: string}>
 *
 * deleteCourse: Observable<{message: string}>
 * deleteTopic: Observable<{message: string}>
 */
@Injectable({ providedIn: 'root' })
export class CourseService {
  private courses: Array<CourseStub> = [];
  private coursesUpdated = new Subject<{
    courses: Array<CourseStub>;
    courseCount: number;
  }>();

  private topics: Array<Topic> = [];
  private topicsUpdated = new Subject<{
    topics: Array<Topic>;
  }>();

  constructor(private http: HttpClient, private router: Router) {}

  /****************************************************************************
   ***************************  GETTING FUNCTIONS  ****************************
   ****************************************************************************/

  /**
   * getCourses
   * @param coursesPerPage number of courses per page
   * @param currentPage current page of courses
   * @param query course search query
   *
   * @returns Nothing, but pushes course list to coursesUpdated listener
   */
  getCourses({
    coursesPerPage,
    currentPage,
    query,
  }: {
    coursesPerPage: number;
    currentPage: number;
    query: string;
  }): void {
    const queryParams = `?pageSize=${coursesPerPage}&page=${currentPage}&query=${query}`;
    this.http
      .get<{
        message: string;
        maxCourses: number;
        courses: Array<CourseStub>;
      }>(BACKEND_URL + queryParams)
      .subscribe((response) => {
        this.courses = response.courses;
        this.coursesUpdated.next({
          courses: [...this.courses],
          courseCount: response.maxCourses,
        });
      });
  }

  /**
   * getCourseList
   * @returns The current list of courses
   *          This list will be the same as whatever was
   *          most recently pushed to coursesUpdated
   */
  getCourseList(): Array<CourseStub> {
    return this.courses;
  }

  /**
   * getCourseUpdateListener
   * @returns a subscription to the course list
   */
  getCourseUpdateListener(): Observable<{
    courses: Array<CourseStub>;
    courseCount: number;
  }> {
    return this.coursesUpdated.asObservable();
  }

  /**
   * getCourse
   * @param courseTitle The title of the course to get
   * @returns An observable which will return the course requested or an error message
   */
  getCourse({ courseTitle }: { courseTitle: string }): Observable<Course> {
    return this.http.get<Course>(BACKEND_URL + courseTitle);
  }

  /**
   * getTopics
   * @param corseTitle The title of the course of which to get the topics
   *
   * @returns Nothing, but pushes topic list to topicsUpdated listener
   */
  getTopics({ courseTitle }: { courseTitle: string }): void {
    this.http
      .get<Array<Topic>>(BACKEND_URL + courseTitle + '/topics')
      .subscribe((result) => {
        this.topics = result;
        this.topicsUpdated.next({
          topics: [...this.topics],
        });
      });
  }

  /**
   * getTopicList
   * @returns The current list of topics
   *          This list will be the same as whatever was
   *          most recently pushed to topicsUpdated
   */
  getTopicList(): Array<Topic> {
    return this.topics;
  }

  /**
   * getTopicUpdateListener
   * @returns a subscription to the topics list
   */
  getTopicUpdateListener(): Observable<{ topics: Array<Topic> }> {
    return this.topicsUpdated.asObservable();
  }

  /**
   * getTopic
   * @param courseTitle The title of the course containing the topic to get
   * @param topicTitle The title of the topic to get
   * @returns An observable which will return the course requested or an error message
   */
  getTopic({
    courseTitle,
    topicTitle,
  }: {
    courseTitle: string;
    topicTitle: string;
  }): Observable<Topic> {
    return this.http.get<Topic>(
      BACKEND_URL + courseTitle + '/topics/' + topicTitle
    );
  }

  /****************************************************************************
   ***************************  CREATION FUNCTIONS  ***************************
   ****************************************************************************/

  /**
   * createCourse
   * @param courseTitle The title for the new course
   * @param email The email of the user creating the course
   * @param username The username of the user creating the course
   * @returns an observable which will return the new course
   */
  createCourse({
    courseTitle,
    email,
    username,
  }: {
    courseTitle: string;
    email: string;
    username: string,
  }): void {
    this.http.post<Course>(BACKEND_URL, {
      courseTitle,
      email,
      username
    }).subscribe((course) => {
      this.router.navigate(['/edit', course.title, '0']);
    });;
  }

  /**
   * createTopic
   * @param courseTitle The title of the course which will contain the new topic
   * @param topicTitle The title for the new topic
   * @param email The email of the user creating the topic
   * @param username The username of the user creating the course
   * @returns an observable which will return the new topic
   */
  createTopic({
    courseTitle,
    topicTitle,
    email,
    username,
  }: {
    courseTitle: string;
    topicTitle: string;
    email: string;
    username: string;
  }): void {
    this.http.post<Topic>(BACKEND_URL + courseTitle + '/topics', {
      topicTitle,
      email,
      username,
    }).subscribe(topic => {
      this.topics.push(topic);
      this.topicsUpdated.next({topics: [...this.topics]});
    });
  }

  /****************************************************************************
   ***************************  EDITING FUNCTIONS  ****************************
   ****************************************************************************/

  /**
   * updateCourseTitle
   * @param newCourseTitle new title for the course
   * @param oldCourseTitle previous title for the course
   * @param email email of the user updating the title
   * @param username The username of the user creating the course
   * @param message user's reason for changing the title
   * @returns an observable which will return an object containing a message property
   */
  updateCourseTitle({
    newCourseTitle,
    oldCourseTitle,
    email,
    username,
    message,
  }: {
    newCourseTitle: string;
    oldCourseTitle: string;
    email: string;
    username: string;
    message: string;
  }): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      BACKEND_URL + oldCourseTitle + '/title',
      {
        newCourseTitle,
        email,
        username,
        message,
      }
    );
  }

  /**
   * updateCourseDescription
   * @param courseTitle title of the course
   * @param description new description for the course
   * @param email email of the user updating the description
   * @param username The username of the user creating the course
   * @param message user's message describing the change
   * @returns an observable which will return an object containing a message property
   */
  updateCourseDescription({
    courseTitle,
    description,
    email,
    username,
    message,
  }: {
    courseTitle: string;
    description: string;
    email: string;
    username: string;
    message: string;
  }): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      BACKEND_URL + courseTitle + '/description',
      {
        description,
        email,
        username,
        message,
      }
    );
  }

  /**
   * updateTopicTitle
   * @param courseTitle title of the course containing the topic
   * @param newTopicTitle new title for the topic
   * @param oldTopicTitle previous title of the topic
   * @param email email of the user updating the topic's title
   * @param username The username of the user creating the course
   * @param message user's reason for changing the title
   * @returns an observable which will return an object containing a message property
   */
  updateTopicTitle({
    courseTitle,
    newTopicTitle,
    oldTopicTitle,
    email,
    username,
    message,
  }: {
    courseTitle: string;
    newTopicTitle: string;
    oldTopicTitle: string;
    email: string;
    username: string;
    message: string;
  }): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      BACKEND_URL + courseTitle + '/topics/' + oldTopicTitle + '/title',
      {
        newTopicTitle,
        email,
        username,
        message,
      }
    );
  }

  /**
   * updateTopicContent
   * @param courseTitle title of the course containing the topic
   * @param topicTitle new title for the topic
   * @param contents previous title of the topic
   * @param email email of the user updating the topic's title
   * @param username The username of the user creating the course
   * @param message user's reason for changing the title
   * @returns an observable which will return an object containing a message property
   */
  updateTopicContents({
    courseTitle,
    topicTitle,
    contents,
    email,
    username,
    message,
  }: {
    courseTitle: string;
    topicTitle: string;
    contents: string;
    email: string;
    username: string;
    message: string;
  }): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      BACKEND_URL + courseTitle + '/topics/' + topicTitle + '/contents',
      {
        contents,
        email,
        username,
        message,
      }
    );
  }

  /****************************************************************************
   ***************************  DELETION FUNCTIONS  ***************************
   ****************************************************************************/

  /**
   * deleteCourse
   * @param courseTitle the title of the course to delete
   * @returns an observable which will return an object containing a message property
   */
  deleteCourse({
    courseTitle,
    email,
    username,
    message
  }: {
    courseTitle: string;
    email: string,
    username: string,
    message: string
  }): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(BACKEND_URL + courseTitle, {
      body: {
        email,
        username,
        message
      }
    });
  }

  /**
   * deleteCourse
   * @param courseTitle the title of the course containing the topic to delete
   * @param topicTitle the title of the topic to delete
   * @returns an observable which will return an object containing a message property
   */
  deleteTopic({
    courseTitle,
    topicTitle,
    email,
    username,
    message
  }: {
    courseTitle: string;
    topicTitle: string;
    email: string,
    username: string,
    message: string
  }): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      BACKEND_URL + courseTitle + '/topics/' + topicTitle, {
        body: {
          email,
          username,
          message
        }
      }
    );
  }

  getCourseVersions({
    courseTitle,
  }: {
    courseTitle: string,
  }) {
    return this.http.get<Array<Commit>>(BACKEND_URL + 'versions/' + courseTitle)
  }

  revertCourse({
    courseTitle,
    oid
  }: {
    courseTitle: string,
    oid: string
  }) {
    return this.http.put(BACKEND_URL + "versions/" + courseTitle, {oid});
  }
}
