import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { CreateService } from "../courses/editing/create/create.service";
import { HeaderComponent } from "./header.component";

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>
  let element: DebugElement;
  let authSpy: any;
  let createSpy: any;

  beforeEach(async() => {
    authSpy = jasmine.createSpyObj("AuthService", [
      "logout",
      "getIsAuth",
      "getAuthStatusListener",
      "getUser",
      "getUserListener"
    ]);
    authSpy.getAuthStatusListener.and.returnValue(of('something'));
    authSpy.getUserListener.and.returnValue(of('something'));
    createSpy = jasmine.createSpyObj("CreateService", ["openCourseCreation"]);
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        HeaderComponent
      ],
      providers: [
        {provide: AuthService, useValue: authSpy},
        {provide: CreateService, useValue: createSpy},
      ]
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(HeaderComponent);
      fixture.detectChanges();
      component = fixture.componentInstance;
      element = fixture.debugElement;
    });
  });

  it('should create the header component', () => {
    expect(component).toBeTruthy();
  });

  it('should get the authentication status', () => {
    expect(authSpy.getIsAuth).toHaveBeenCalledTimes(1);
  })

  it('should listen for authentication status', () => {
    expect(authSpy.getAuthStatusListener).toHaveBeenCalledTimes(1);
  });

  it('should get the user', () => {
    expect(authSpy.getUser).toHaveBeenCalledTimes(1);
  })

  it('should listen for user updates', () => {
    expect(authSpy.getUserListener).toHaveBeenCalledTimes(1);
  });
})