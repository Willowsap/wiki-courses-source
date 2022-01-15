import { DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { RouterLinkWithHref } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { routes } from "../app-routing.module";
import { FooterComponent } from "./footer.component";

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>
  let element: DebugElement;

  beforeEach(async() => {
    TestBed.configureTestingModule({
      declarations: [FooterComponent],
      imports: [RouterTestingModule.withRoutes(routes)]
    });
    fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    element = fixture.debugElement;
  });

  it('should create the footer component', () => {
    expect(component).toBeTruthy();
  });

  it('should link to the feedback page', () => {
    const linkDebugEl = element.query(By.css('a'));
    const routerLinkInstance = linkDebugEl.injector.get(RouterLinkWithHref);
    expect(routerLinkInstance['commands']).toEqual(['/feedback']);
    expect(routerLinkInstance['href']).toEqual('/feedback');
  });

  it('should display the contact email', () => {
    expect(element.nativeElement.textContent).toContain("wikisapphirecourses@gmail.com");
  })
});