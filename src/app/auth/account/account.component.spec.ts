import { DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { of } from "rxjs";
import { AuthService } from "../auth.service";
import { AccountComponent } from "./account.component";

describe('AccountComponent', () => {
  let component: AccountComponent;
  let fixture: ComponentFixture<AccountComponent>
  let element: DebugElement;
  let authSpy: any;
  let routerSpy: any;

  beforeEach(async() => {
    authSpy = jasmine.createSpyObj("AuthService", [
      "verify",
      "getAuthStatusListener",
      "getUser",
      "getUserListener",
      "getAuthData"
    ]);
    authSpy.getAuthStatusListener.and.returnValue(of('something'));
    authSpy.getUserListener.and.returnValue(of('something'));
    authSpy.verify.and.returnValue(of('something'));
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      declarations: [
        AccountComponent
      ],
      providers: [
        {provide: AuthService, useValue: authSpy},
        {provide: Router, useValue: routerSpy}
      ]
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(AccountComponent);
      fixture.detectChanges();
      component = fixture.componentInstance;
      element = fixture.debugElement;
    });
  });

  it('should create the account component', () => {
    expect(component).toBeTruthy();
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

  it('should get the auth data', () => {
    expect(authSpy.getAuthData).toHaveBeenCalledTimes(1);
  });
});