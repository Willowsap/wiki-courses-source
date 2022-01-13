import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { RouterLinkWithHref } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { start } from "repl";
import { of } from "rxjs";
import { NoSanitizePipe } from "src/app/util/nosanitize.pipe";
import { CourseListComponent } from "./course-list.component";

describe('CourseListComponent', () => {
  const testCourses = [{
      title: "testCourse1",
      description: "course1 description"
    },{
      title: "testCourse2",
      description: "course2 description"
    },{
      title: "testCourse3",
      description: "course3 description"
    },
  ]
  let component: CourseListComponent;
  let fixture: ComponentFixture<CourseListComponent>
  let element: DebugElement;

  let courseSpy: any;
  let routerSpy: any;
  let httpController: HttpTestingController;

  beforeEach(async() => {
    courseSpy = jasmine.createSpyObj("CourseService", [
      "getCourses",
      "getCourseUpdateListener"
    ]);
    courseSpy.getCourseUpdateListener.and.returnValue(of({courses: testCourses, courseCount: testCourses.length}))
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [CourseListComponent, NoSanitizePipe],
      providers: [{ provide: "CourseService", useValue: courseSpy}, { provide: "HttpClient", useValue: httpController}],
      imports: [RouterTestingModule, HttpClientTestingModule]
    });
    fixture = TestBed.createComponent(CourseListComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    element = fixture.debugElement;
  });

  it('should create the course display component', () => {
    expect(component).toBeTruthy();
  });

  it('should display a spinner if loading', () => {
    setup(true);
    const spinner = element.query(By.css('mat-spinner'));
    expect(spinner).toBeTruthy();
  });

  it('should not display a spinner if finished loading', () => {
    setup(false);
    const spinner = element.query(By.css('mat-spinner'));
    expect(spinner).toBeFalsy();
  });

  it('should not display the list if loading', () => {
    setup(true);
    const spinner = element.query(By.css('mat-paginator'));
    expect(spinner).toBeFalsy();
  });

  it('should display the course titles provided', () => {
    setup(false);
    const coursePanels = element.queryAll(By.css('mat-expansion-panel'));
    expect(coursePanels.length).toEqual(testCourses.length);
  });

  /* HELPER METHODS */

  const setup = (isLoading: boolean) => {
    component.currentPage = 1;
    component.coursesPerPage = 5;
    component.courses = testCourses;
    component.isLoading = isLoading;
    fixture.detectChanges();
  }
});
