import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AppComponent } from "./app.component"
import { AuthService } from "./auth/auth.service";

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>
  let element: DebugElement;
  let authSpy: any;

  beforeEach(async() => {
    authSpy = jasmine.createSpyObj("AuthService", ["autoAuthUser"]);
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        AppComponent
      ],
      imports: [

      ],
      providers: [
        {provide: AuthService, useValue: authSpy}
      ]
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      component = fixture.componentInstance;
      element = fixture.debugElement;
    });
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should attempt to auto-authenticate the user once', async() => {
    fixture.whenStable().then(() => {
      expect(authSpy.autoAuthUser).toHaveBeenCalledTimes(1);
    });
  });
})