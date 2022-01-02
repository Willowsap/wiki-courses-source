import { DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FooterComponent } from "./footer.component";

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>
  let element: DebugElement;

  beforeEach(async() => {
    TestBed.configureTestingModule({
      declarations: [
        FooterComponent
      ],
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(FooterComponent);
      fixture.detectChanges();
      component = fixture.componentInstance;
      element = fixture.debugElement;
    });
  });

  it('should create the footer component', () => {
    expect(component).toBeTruthy();
  });
});