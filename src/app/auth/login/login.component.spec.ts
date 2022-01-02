import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { AuthService } from "../auth.service";
import { LoginComponent } from "./login.component";

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>
  let element: DebugElement;

  let authSpy: any;

  beforeEach(async() => {
    authSpy = jasmine.createSpyObj("AuthService", [
      "getAuthStatusListener"
    ]);
    authSpy.getAuthStatusListener.and.returnValue(of('something'));
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ LoginComponent ],
      providers: [
        { provide: AuthService, useValue: authSpy }
      ]
    })
    fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    element = fixture.debugElement;
  });

  it('should create the login  component', () => {
    expect(component).toBeTruthy();
  });
});