import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from "@angular/core";
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from "@angular/core/testing";
import { MatDialogModule } from "@angular/material/dialog";
import { By } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterTestingModule } from "@angular/router/testing";
import { of } from "rxjs";
import { TopicMenuComponent } from "./topic-menu.component";

describe('TopicMenuComponent', () => {
  const testTopics = [{
    title: "testTopic1",
    contents: "topic1 content"
  }, {
    title: "testTopic2",
    contents: "topic2 content"
  }, {
    title: "testTopic3",
    contents: "topic3 content"
  },
  ];
  const testUser = {
    _id: "1",
    email: "e",
    username: "u",
    verified: true,
    admin: false
  }
  let component: TopicMenuComponent;
  let fixture: ComponentFixture<TopicMenuComponent>
  let element: DebugElement;

  let courseSpy: any;
  let createSpy: any;
  let authSpy: any;

  beforeEach(async () => {
    courseSpy = jasmine.createSpyObj("CourseService", [
      "getTopics",
      "getTopicUpdateListener"
    ]);
    courseSpy.getTopicUpdateListener.and.returnValue(of(testTopics));
    authSpy = jasmine.createSpyObj("AuthService", [
      "getUser",
      "getUserListener"
    ]);
    authSpy.getUserListener.and.returnValue(of(testUser));
    createSpy = jasmine.createSpyObj("CreateService", ["openTopicCreation"]);
    createSpy.openTopicCreation.and.returnValue(of('result'))
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [TopicMenuComponent],
      providers: [
        { provide: "CourseService", useValue: courseSpy }, 
        { provide: "AuthService", useValue: authSpy }, 
        { provide: "CreateService", useValue: createSpy }
      ],
      imports: [HttpClientTestingModule, MatDialogModule, RouterTestingModule, BrowserAnimationsModule]
    });
    fixture = TestBed.createComponent(TopicMenuComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    element = fixture.debugElement;
  });

  it('should create the course display component', () => {
    expect(component).toBeTruthy();
  });

  it('should display a button for every topic', () => {
    setup(false);
    const topicList = element.queryAll(By.css('a'));
    expect(topicList.length).toEqual(testTopics.length)
  });

  it('should display the new topic button in edit mode', () => {
    setup(true);
    const newTopicButton = element.query(By.css('button'));
    expect(newTopicButton).toBeTruthy();
  });

  it('should not display the new topic button in display mode', () => {
    setup(false);
    const newTopicButton = element.query(By.css('button'));
    expect(newTopicButton).toBeFalsy();
  });

  // it('should open topic creation when new topic is clicked', fakeAsync(() => {
  //   setup(true);
  //   const newTopicButton = element.query(By.css('button'));
  //   newTopicButton.triggerEventHandler('click', null);
  //   fixture.detectChanges();
  //   fixture.whenStable().then(() => {
  //     expect(createSpy.openTopicCreation).toHaveBeenCalledTimes(1);
  //   })
  // }));

  /* HELPER METHODS */

  const setup = (inEditMode: boolean) => {
    component.topics = testTopics;
    component.inEditMode = inEditMode;
    component.user = testUser;
    fixture.detectChanges();
  }
});
