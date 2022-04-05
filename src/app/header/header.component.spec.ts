import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterLinkWithHref } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { of } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { CreateService } from "../courses/editing/create/create.service";
import { HeaderComponent } from "./header.component";
import { routes } from "../app-routing.module";
import { By } from "@angular/platform-browser";

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
      ],
      imports: [
        RouterTestingModule.withRoutes(routes)
      ]
    });
    fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    element = fixture.debugElement;
  });

  it('should create the header component', () => {
    expect(component).toBeTruthy();
  });

  it('should get the authentication status', () => {
    expect(authSpy.getIsAuth).toHaveBeenCalledTimes(1);
  });

  it('should listen for authentication status', () => {
    expect(authSpy.getAuthStatusListener).toHaveBeenCalledTimes(1);
  });

  it('should get the user', () => {
    expect(authSpy.getUser).toHaveBeenCalledTimes(1);
  });

  it('should listen for user updates', () => {
    expect(authSpy.getUserListener).toHaveBeenCalledTimes(1);
  });

  it('should link to the about page', () => {
    const linkDebugEl = element.query(By.css('a.about'));
    const routerLinkInstance = linkDebugEl.injector.get(RouterLinkWithHref);
    expect(routerLinkInstance['commands']).toEqual(['/about']);
    expect(routerLinkInstance['href']).toEqual('/about');
  });

  it('should link to the signup page if not logged in', () => {
    component.userIsAuthenticated = false;
    fixture.detectChanges();
    const linkDebugEl = element.query(By.css('a.signup'));
    const routerLinkInstance = linkDebugEl.injector.get(RouterLinkWithHref);
    expect(routerLinkInstance['commands']).toEqual(['/auth/signup']);
    expect(routerLinkInstance['href']).toEqual('/auth/signup');
  });

  it('should link to the login page if not logged in', () => {
    component.userIsAuthenticated = false;
    fixture.detectChanges();
    const linkDebugEl = element.query(By.css('a.login'));
    const routerLinkInstance = linkDebugEl.injector.get(RouterLinkWithHref);
    expect(routerLinkInstance['commands']).toEqual(['/auth/login']);
    expect(routerLinkInstance['href']).toEqual('/auth/login');
  });

  it('should link to the account page if logged in', () => {
    component.userIsAuthenticated = true;
    fixture.detectChanges();
    const linkDebugEl = element.query(By.css('a.account'));
    const routerLinkInstance = linkDebugEl.injector.get(RouterLinkWithHref);
    expect(routerLinkInstance['commands']).toEqual(['/account']);
    expect(routerLinkInstance['href']).toEqual('/account');
  });

  it('should not link to the signup page if logged in', () => {
    component.userIsAuthenticated = true;
    fixture.detectChanges();
    const linkDebugEl = element.query(By.css('a.signup'));
    expect(linkDebugEl).toBeNull();
  });

  it('should not link to the login page if logged in', () => {
    component.userIsAuthenticated = true;
    fixture.detectChanges();
    const linkDebugEl = element.query(By.css('a.login'));
    expect(linkDebugEl).toBeNull();
  });
})
