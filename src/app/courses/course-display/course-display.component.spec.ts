import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { convertToParamMap, RouterLinkWithHref } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { of } from "rxjs";
import { CourseDisplayComponent } from "./course-display.component";

describe('CourseDisplayComponent', () => {
  const testCourse = {
    title: "testCourse",
    description: "course description"
  }
  const testTopics = [
    {title: "description", contents: "course description"},
    {title: "topic1", contents: "topic1 content"},
    {title: "topic2", contents: "topic2 content"},
    {title: "topic3", contents: "topic3 content"},
  ]
  const testUser = {
    _id: "1",
    email: "e",
    username: "u",
    verified: true,
    admin: false
  }

  let component: CourseDisplayComponent;
  let fixture: ComponentFixture<CourseDisplayComponent>
  let element: DebugElement;

  let courseSpy: any;
  let authSpy: any;
  let routerSpy: any;
  let httpController: HttpTestingController;

  beforeEach(async() => {
    authSpy = jasmine.createSpyObj("AuthService", [
      "getUser",
      "getUserListener"
    ]);
    authSpy.getUserListener.and.returnValue(of(testUser));
    courseSpy = jasmine.createSpyObj("CourseService", [
      "getCourse",
      "getTopicUpdateListener",
      "getTopics"
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        CourseDisplayComponent
      ],
      providers: [
        { provide: "AuthService", useValue: authSpy},
        { provide: "CourseService", useValue: courseSpy},
        { provide: "Router", useValue: routerSpy},
        { provide: "ActivatedRoute", useValue: { 
          paramMap: of(convertToParamMap({
            courseTitle: testCourse.title,
            topicIndex: "0"
          }))
        }}
      ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ]
    });
    httpController = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(CourseDisplayComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    element = fixture.debugElement;
  });

  it('should create the course display component', () => {
    expect(component).toBeTruthy();
  });

  it('should display an edit button if logged in', () => {
    setup(true);
    const linkDebugEl = element.query(By.css('a.edit'));
    const routerLinkInstance = linkDebugEl.injector.get(RouterLinkWithHref);
    expect(routerLinkInstance['commands']).toEqual(['/edit', testCourse.title, '0']);
    expect(routerLinkInstance['href']).toEqual(`/edit/${testCourse.title}/0`);
  });

  it('should not display an edit button if not logged in', () => {
    setup(false)
    const linkDebugEl = element.query(By.css('a.edit'));
    expect(linkDebugEl).toBeNull();
  });

  it('should contain a topic menu', () => {
    setup(true);
    const topicMenu = element.query(By.css('topic-menu'));
    expect(topicMenu).toBeTruthy();
  });

  it('should display a spinner if loading', () => {
    component.isLoading = true;
    fixture.detectChanges();
    const spinner = element.query(By.css('mat-spinner'));
    expect(spinner).toBeTruthy();
  });

  it('should display a spinner if loading', () => {
    component.isLoading = true;
    fixture.detectChanges();
    const spinner = element.query(By.css('mat-spinner'));
    expect(spinner).toBeTruthy();
  });

  it('should not display a spinner if finished loading', () => {
    component.isLoading = false;
    fixture.detectChanges();
    const spinner = element.query(By.css('mat-spinner'));
    expect(spinner).toBeFalsy();
  });

  it('should not display the main block if loading', () => {
    component.isLoading = true;
    fixture.detectChanges();
    const spinner = element.query(By.css('main'));
    expect(spinner).toBeFalsy();
  });

  it('should display the course title when on topic 0', () => {
    setup(false);
    const content = element.query(By.css('.courseContent'));
    expect(content.nativeElement.textContent).toContain(testCourse.title);
  });

  it('should display the course description when on topic 0', () => {
    setup(false);
    const content = element.query(By.css('.courseContent'));
    expect(content.nativeElement.textContent).toContain(testCourse.description);
  });

  it('should display the topic1 title and content when on topic 1', () => {
    setup(false);
    component.topicIndex = 1;
    fixture.detectChanges();
    const content = element.query(By.css('.courseContent'));
    expect(content.nativeElement.textContent).toContain(testTopics[1].title);
    expect(content.nativeElement.textContent).toContain(testTopics[1].contents);
  });

  /* HELPER METHODS */

  const setup = (isLoggedIn: boolean) => {
    component.course = testCourse;
    component.topics = testTopics;
    component.topicIndex = 0;
    component.isLoading = false;
    component.user = isLoggedIn ? testUser : null;
    fixture.detectChanges();
  }
});
