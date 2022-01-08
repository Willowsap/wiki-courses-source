import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { CourseDisplayComponent } from "./course-display.component";

describe('CourseDisplayComponent', () => {
  let component: CourseDisplayComponent;
  let fixture: ComponentFixture<CourseDisplayComponent>
  let element: DebugElement;

  let courseSpy: any;
  let authSpy: any;

  beforeEach(async() => {
    authSpy = jasmine.createSpyObj("AuthService", [
      "getUser",
      "getUserListener"
    ]);
    authSpy.getUserListener.and.returnValue(of({
      _id: "userid",
      username: "username",
      email: "useremail",
      admin: false,
      verified: false
    }));
    courseSpy = jasmine.createSpyObj("CourseService", [
      "getCourse",
      "getTopicUpdateListener",
      "getTopics"
    ]);
    TestBed.configureTestingModule({

      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        CourseDisplayComponent
      ],
      providers: [
        { provide: "AuthService", useValue: authSpy},
        { provide: "CourseService", useValue: courseSpy},
      ]
    });
    fixture = TestBed.createComponent(CourseDisplayComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    element = fixture.debugElement;
  });

  it('should create the course display component', () => {
    expect(component).toBeTruthy();
  });
});