import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AboutComponent } from "./about.component";
import { ABOUT_DATA } from "./about.data";

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>
  let element: DebugElement;

  beforeEach(async() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        AboutComponent
      ],
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(AboutComponent);
      fixture.detectChanges();
      component = fixture.componentInstance;
      element = fixture.debugElement;
    });
  });

  it('should create the about component', () => {
    expect(component).toBeTruthy();
  });

  it('should display everything in the about data', () => {
    let failure = true;
    Object.values(ABOUT_DATA).every(item => {
      failure = !contains(element.nativeElement.textContent, item);
    })
    expect(failure).toBeFalsy();
  });

  /* HELPER METHODS */

  const contains = (a: string, b: Array<string> | string): boolean => {
    if (typeof b === 'string') return a.includes(b);
    else {
      for (const s in b) if (!contains(a, s)) return false;
      return true;
    }
  }
})