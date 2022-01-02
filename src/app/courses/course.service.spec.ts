import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { environment } from "src/environments/environment";
import { COMMIT_TEST_DATA, COURSE_DATA, COURSE_STUB_TEST_DATA } from "./course-test.data";
import { CourseService } from "./course.service";

describe('CourseService', () => {
  const BACKEND_URL = environment.apiUrl + '/courses/';

  let httpController: HttpTestingController;
  let courseService: CourseService;

  beforeEach(async() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        CourseService
      ]
    })
    .compileComponents()
    .then(() => {
      courseService = TestBed.inject(CourseService);
      httpController = TestBed.inject(HttpTestingController);
    })
  })

  it('should be created', () => {
    expect(courseService).toBeTruthy();
  });

  it('should push courses to listener', () => {
    courseService.getCourseUpdateListener().subscribe((newCourseData) => {
      expect(newCourseData).toBeTruthy();
      expect(newCourseData.courseCount).toEqual(5);
    });
    courseService.getCourses({coursesPerPage: 5, currentPage: 1, query: ""});
    const req = httpController.expectOne(`${BACKEND_URL}?pageSize=5&page=1&query=`);
    expect(req.request.method).toEqual("GET");
    req.flush({
      message: "success",
      maxCourses: COURSE_STUB_TEST_DATA.length,
      courses: COURSE_STUB_TEST_DATA,
    });
  });

  it('should get course by title', () => {
    courseService.getCourse({courseTitle: "thirdCourse"}).subscribe((course) => {
      expect(course).toBeTruthy();
      expect(course.title).toEqual("thirdCourse");
    });
    const req = httpController.expectOne(`${BACKEND_URL}thirdCourse`);
    expect(req.request.method).toEqual("GET");
    const c = COURSE_STUB_TEST_DATA.find((c) => {return c.title === "thirdCourse"});
    req.flush(c!);
  });

  it('should get the saved course list', () => {
    courseService.getCourseUpdateListener().subscribe((newCourseData) => {
      expect(newCourseData.courses).toEqual(courseService.getCourseList());
    });
    courseService.getCourses({coursesPerPage: 5, currentPage: 1, query: ""});
    const req = httpController.expectOne(`${BACKEND_URL}?pageSize=5&page=1&query=`);
    req.flush({
      message: "success",
      maxCourses: COURSE_STUB_TEST_DATA.length,
      courses: COURSE_STUB_TEST_DATA,
    });
  });

  it('should get topics for a course', () => {
    const x = COURSE_DATA[2];
    courseService.getTopicUpdateListener().subscribe((topics) => {
      expect(topics).toEqual({topics: x.topics});
    });
    courseService.getTopics({courseTitle: x.courseTitle});
    const req = httpController.expectOne(`${BACKEND_URL}${x.courseTitle}/topics`);
    req.flush(x.topics);
  });
  
  it('should get the saved topic list', () => {
    const x = COURSE_DATA[2];
    courseService.getTopicUpdateListener().subscribe((topics) => {
      expect(topics).toEqual({topics: courseService.getTopicList()});
    });
    courseService.getTopics({courseTitle: x.courseTitle});
    const req = httpController.expectOne(`${BACKEND_URL}${x.courseTitle}/topics`);
    req.flush(x.topics);
  });
  
  it('should get a topic with a specific title for a specific course', () => {
    const c = COURSE_DATA[2].courseTitle;
    const t = COURSE_DATA[2].topics[2];
    courseService.getTopic({courseTitle: c, topicTitle: t.title}).subscribe(topic => {
      expect(topic).toEqual(t);
    });
    const req = httpController.expectOne(`${BACKEND_URL}${c}/topics/${t.title}`);
    req.flush(t);
  });

  it('should send a create course request', () => {
    courseService.createCourse({courseTitle: "t", email: "e", username: "u"});
    const req = httpController.expectOne(`${BACKEND_URL}`);
    expect(req.request.method).toEqual("POST");
    expect(req.request.body).toEqual({
      courseTitle: "t",
      email: "e",
      username: "u",
    });
  });

  it('should send a create topic request', () => {
    courseService.createTopic({courseTitle: "t", topicTitle: "t2", email: "e", username: "u"});
    const req = httpController.expectOne(`${BACKEND_URL}t/topics`);
    expect(req.request.method).toEqual("POST");
    expect(req.request.body).toEqual({
      topicTitle: "t2",
      email: "e",
      username: "u",
    });
  });

  it('should update the course title', () => {
    const c = COURSE_DATA[2].courseTitle;
    courseService.updateCourseTitle({newCourseTitle: "newTitle", oldCourseTitle: c, email: "e", username: "u", message: "m"}).subscribe(response => {
      expect(response.message).toEqual("success")
    });
    const req = httpController.expectOne(`${BACKEND_URL}${c}/title`);
    req.flush({message: "success"});
    expect(req.request.method).toEqual("PUT");
    expect(req.request.body).toEqual({
      newCourseTitle: "newTitle",
      email: "e",
      username: "u",
      message: "m",
    });
  });

  it('should update the course description', () => {
    const c = COURSE_DATA[2].courseTitle;
    courseService.updateCourseDescription({courseTitle: c, description: "newDescription", email: "e", username: "u", message: "m"}).subscribe(response => {
      expect(response.message).toEqual("success");
    });
    const req = httpController.expectOne(`${BACKEND_URL}${c}/description`);
    req.flush({message: "success"});
    expect(req.request.method).toEqual("PUT");
    expect(req.request.body).toEqual({
      description: "newDescription",
      email: "e",
      username: "u",
      message: "m",
    });
  });

  it('should update the topic title', () => {
    const c = COURSE_DATA[2].courseTitle;
    const t = COURSE_DATA[2].topics[2];
    courseService.updateTopicTitle({courseTitle: c, newTopicTitle: "newTopicTitle", oldTopicTitle: t.title, email: "e", username: "u", message: "m"}).subscribe(response => {
      expect(response.message).toEqual("success");
    });
    const req = httpController.expectOne(`${BACKEND_URL}${c}/topics/${t.title}/title`);
    req.flush({message: "success"});
    expect(req.request.method).toEqual("PUT");
    expect(req.request.body).toEqual({
      newTopicTitle: "newTopicTitle",
      email: "e",
      username: "u",
      message: "m",
    });
  });

  it('should update the topic contents', () => {
    const c = COURSE_DATA[2].courseTitle;
    const t = COURSE_DATA[2].topics[2];
    courseService.updateTopicContents({courseTitle: c, topicTitle: t.title, contents: "newContents", email: "e", username: "u", message: "m"}).subscribe(response => {
      expect(response.message).toEqual("success");
    });
    const req = httpController.expectOne(`${BACKEND_URL}${c}/topics/${t.title}/contents`);
    req.flush({message: "success"});
    expect(req.request.method).toEqual("PUT");
    expect(req.request.body).toEqual({
      contents: "newContents",
      email: "e",
      username: "u",
      message: "m",
    });
  });

  it('should delete the course', () => {
    const c = COURSE_DATA[2].courseTitle;
    courseService.deleteCourse({courseTitle: c, email: "e", username: "u", message: "m"}).subscribe(response => {
      expect(response.message).toEqual("success");
    });
    const req = httpController.expectOne(`${BACKEND_URL}${c}`);
    req.flush({message: "success"});
    expect(req.request.method).toEqual("DELETE");
  });

  it('should delete the topic', () => {
    const c = COURSE_DATA[2].courseTitle;
    const t = COURSE_DATA[2].topics[2];
    courseService.deleteTopic({courseTitle: c, topicTitle: t.title, email: "e", username: "u", message: "m"}).subscribe(response => {
      expect(response.message).toEqual("success");
    });
    const req = httpController.expectOne(`${BACKEND_URL}${c}/topics/${t.title}`);
    req.flush({message: "success"});
    expect(req.request.method).toEqual("DELETE");
  });

  it('should get the course versions', () => {
    const c = COURSE_DATA[2].courseTitle;
    courseService.getCourseVersions({courseTitle: c}).subscribe(response => {
      expect(response).toEqual(COMMIT_TEST_DATA);
    });
    const req = httpController.expectOne(`${BACKEND_URL}versions/${c}`);
    req.flush(COMMIT_TEST_DATA);
    expect(req.request.method).toEqual("GET");
  });

  it('should revert to oid 2', () => {
    const c = COURSE_DATA[2].courseTitle;
    const oid = COMMIT_TEST_DATA[1].oid;
    courseService.revertCourse({courseTitle: c, oid}).subscribe(response => {
      expect(response).toEqual({message: "success"});
    });
    const req = httpController.expectOne(`${BACKEND_URL}versions/${c}`);
    req.flush({message: "success"});
    expect(req.request.method).toEqual("PUT");
    expect(req.request.body).toEqual({oid});
  });
})
