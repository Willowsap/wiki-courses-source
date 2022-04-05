import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from "@angular/core";
import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { By } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { convertToParamMap, RouterLinkWithHref } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { of } from "rxjs";
import { routes } from "src/app/app-routing.module";
import { CourseEditComponent } from "./course-edit.component";

describe('CourseEditComponent', () => {
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
  let component: CourseEditComponent;
  let fixture: ComponentFixture<CourseEditComponent>
  let element: DebugElement;

  let courseSpy: any;
  let createSpy: any;
  let authSpy: any;
  let routerSpy: any;
  let confirmationSpy: any;

  beforeEach(async () => {
    courseSpy = jasmine.createSpyObj("CourseService", [
      "getTopics",
      "getCourse",
      "getTopicUpdateListener",
      "updateCourseDescription",
      "updateCourseTitle",
      "updateTopicTitle",
      "updateTopicContents",
      "deleteTopic"
    ]);
    authSpy = jasmine.createSpyObj("AuthService", [
      "getUser",
      "getUserListener"
    ]);
    authSpy.getUserListener.and.returnValue(of(testUser));
    createSpy = jasmine.createSpyObj("CreateService", ["openRequest"]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    confirmationSpy = jasmine.createSpyObj('ConfirmationService', ["openConfirmation"]);
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [CourseEditComponent],
      providers: [
        { provide: "CourseService", useValue: courseSpy },
        { provide: "AuthService", useValue: authSpy },
        { provide: "CreateService", useValue: createSpy },
        { provide: "Router", useValue: routerSpy},
        { provide: "ConfirmationService", useValue: confirmationSpy },
        { provide: "ActivatedRoute", useValue: {
          paramMap: of(convertToParamMap({
            courseTitle: testCourse.title,
            topicIndex: "0"
          }))
        }}
      ],
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        BrowserAnimationsModule,
        FormsModule,
        RouterTestingModule.withRoutes(routes)
      ]
    });
    fixture = TestBed.createComponent(CourseEditComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    element = fixture.debugElement;
  });

  it('should create the course display component', () => {
    expect(component).toBeTruthy();
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

  /* TITLE TESTS */
  it('should display the course title when on topic 0', () => {
    setup(false, 0);
    const titleElem = element.query(By.css('.titleDisplay'));
    expect(titleElem.nativeElement.textContent).toEqual(testCourse.title);
  });

  it('should display an editor for the title when editing', () => {
    setup(false, 0, true);
    const titleEditor = element.query(By.css('.titleEdit'));
    expect(titleEditor).toBeTruthy();
  });

  it('should call saveTitle when save button is clicked', fakeAsync(() => {
    setup(false, 0, true);
    const fnc = spyOn(component, "saveTitle")
    const saveTitleButton = element.query(By.css('button.saveTitle'));
    saveTitleButton.nativeElement.click();
    fixture.detectChanges();
    expect(fnc).toHaveBeenCalled();
  }));

  /* Topic Tests */

  it('should display the course title when on topic 0', () => {
    setup(false, 1);
    const titleElem = element.query(By.css('.titleDisplay'));
    expect(titleElem.nativeElement.textContent).toEqual(testTopics[1].title);
  });

  it('should display an editor for the topic title when editing a topic', fakeAsync(() => {
    setup(false, 1, true);
    const titleEditor = element.query(By.css('.titleEdit'));
    titleEditor.nativeElement.value = testTopics[1].title;
    fixture.detectChanges();
    expect(titleEditor.nativeElement.value).toEqual(testTopics[1].title);
  }));

  it('should open a request window when saving the topic title', fakeAsync(() => {
    setup(false, 1, true);
    const fnc = spyOn(component, "saveTitle")
    const saveTitleButton = element.query(By.css('button.saveTitle'));
    saveTitleButton.nativeElement.click();
    tick();
    expect(fnc).toHaveBeenCalledTimes(1);
  }));

  /* other tests */

  it('should save the topic when save is clicked and it is not on topic 0', fakeAsync(() => {
    setup(false, 1);
    const fnc = spyOn(component, "saveContents")
    const saveButton = element.query(By.css('button.saveTopicButton'));
    saveButton.nativeElement.click();
    fixture.detectChanges();
    tick();
    expect(fnc).toHaveBeenCalledTimes(1);
  }));

  it('should save the course when save is clicked and it is on topic 0', fakeAsync(() => {
    setup(false, 1);
    const fnc = spyOn(component, "saveContents")
    const saveButton = element.query(By.css('button.saveTopicButton'));
    saveButton.nativeElement.click();
    fixture.detectChanges();
    tick();
    expect(fnc).toHaveBeenCalledTimes(1);
  }));

  it('should have a link to advanced', () => {
    setup(false, 0);
    const linkDebugEl = element.query(By.css('a.advancedLink'));
    const routerLinkInstance = linkDebugEl.injector.get(RouterLinkWithHref);
    expect(routerLinkInstance['commands']).toEqual(['/advanced', testCourse.title]);
    expect(routerLinkInstance['href']).toEqual(`/advanced/${testCourse.title}`);
  });


  /* HELPER METHODS */

  const setup = (isLoading: boolean, topicIndex?: number, editingTitle?: boolean) => {
    component.course = testCourse;
    component.topics = testTopics;
    component.topicIndex = topicIndex ? topicIndex : 0;
    component.user = testUser;
    component.editingTitle = editingTitle ? editingTitle : false;
    component.isLoading = isLoading;
    fixture.detectChanges();
  };
});
