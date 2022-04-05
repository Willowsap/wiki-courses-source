import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { of } from "rxjs";
import { AuthService } from "../auth.service";
import { SignupComponent } from "./signup.component";

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>
  let element: DebugElement;

  let authSpy: any;

  beforeEach(async() => {
    authSpy = jasmine.createSpyObj("AuthService", [
      "getAuthStatusListener",
      "Signup"
    ]);
    authSpy.getAuthStatusListener.and.returnValue(of('something'));
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ SignupComponent ],
      providers: [
        { provide: AuthService, useValue: authSpy },
      ],
    })
    fixture = TestBed.createComponent(SignupComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    element = fixture.debugElement;
  });

  it('should create the Signup  component', () => {
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

  it('should not display the main block if loading', () => {
    setup(true);
    const spinner = element.query(By.css('form'));
    expect(spinner).toBeFalsy();
  });


  const setup = (isLoading: boolean) => {
    component.isLoading = isLoading;
    fixture.detectChanges();
  };
});
