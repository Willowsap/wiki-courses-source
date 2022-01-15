import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from "@angular/core";
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from "@angular/core/testing";
import { MatDialogModule } from "@angular/material/dialog";
import { By } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { convertToParamMap } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { of } from "rxjs";
import { AdvancedComponent } from "./advanced.component";

describe('AdvancedComponent', () => {
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
  let component: AdvancedComponent;
  let fixture: ComponentFixture<AdvancedComponent>
  let element: DebugElement;

  let courseSpy: any;
  let createSpy: any;
  let authSpy: any;
  let routerSpy: any;

  beforeEach(async () => {
    courseSpy = jasmine.createSpyObj("CourseService", [
      "getCourseVersions",
      "revertCourse",
      "deleteCourse"
    ]);
    authSpy = jasmine.createSpyObj("AuthService", [
      "getUser",
      "getUserListener"
    ]);
    authSpy.getUserListener.and.returnValue(of(testUser));
    createSpy = jasmine.createSpyObj("CreateService", ["openRequest"]);
    createSpy.openRequest.and.returnValue(of('result'));
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [AdvancedComponent],
      providers: [
        { provide: "CourseService", useValue: courseSpy }, 
        { provide: "AuthService", useValue: authSpy }, 
        { provide: "CreateService", useValue: createSpy },
        { provide: "Router", useValue: routerSpy},
        { provide: "ActivatedRoute", useValue: { 
          paramMap: of(convertToParamMap({
            courseTitle: testCourse.title
          }))
        }}
      ],
      imports: [HttpClientTestingModule, MatDialogModule, RouterTestingModule, BrowserAnimationsModule]
    });
    fixture = TestBed.createComponent(AdvancedComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    element = fixture.debugElement;
  });

  it('should create the course display component', () => {
    expect(component).toBeTruthy();
  });

  /* HELPER METHODS */

  const setup = (inEditMode: boolean) => {
    component.courseTitle = testCourse.title;
    component.user = testUser;
    fixture.detectChanges();
  }
});
