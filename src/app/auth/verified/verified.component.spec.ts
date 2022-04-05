import { DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { RouterLinkWithHref } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { routes } from "src/app/app-routing.module";
import { VerifiedComponent } from "./verified.component";

describe('VerifiedComponent', () => {
  let component: VerifiedComponent;
  let fixture: ComponentFixture<VerifiedComponent>
  let element: DebugElement;

  beforeEach(async() => {
    TestBed.configureTestingModule({
      declarations: [ VerifiedComponent ],
      imports: [
        RouterTestingModule.withRoutes(routes)
      ]
    })
    fixture = TestBed.createComponent(VerifiedComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    element = fixture.debugElement;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  })

  it('should display congratulations', () => {
    expect(element.query(By.css('main')).nativeElement.textContent).toContain("Congratulations! You're verified!");
  });

  it('should contain a link to redirect the user', () => {
    const link = element.query(By.css('a'));
    expect(link.nativeElement.textContent).toContain("Click here to continue to the site");
  });

  it('should contain a link that links to the main page', () => {
    const linkDebugEl = element.query(By.css('a'));
    const routerLinkInstance = linkDebugEl.injector.get(RouterLinkWithHref);
    expect(routerLinkInstance['commands']).toEqual(['/']);
    expect(routerLinkInstance['href']).toEqual('/');
  });

});
