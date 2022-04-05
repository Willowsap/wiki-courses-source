import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { environment } from "src/environments/environment";
import { AuthService } from "./auth.service";

fdescribe('AuthService', () => {
  const BACKEND_URL = environment.apiUrl + '/user/';

  let httpController: HttpTestingController;
  let authService: AuthService;

  let testUserData = {
    email: "e",
    password: "p",
    username: "u"
  }

  beforeEach(async() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        AuthService
      ]
    })
    authService = TestBed.inject(AuthService);
    httpController = TestBed.inject(HttpTestingController);
  })

  it('should be created', () => {
    expect(AuthService).toBeTruthy();
  });

  it('should create a user', () => {
    authService.createUser(testUserData.email, testUserData.password);
    const req = httpController.expectOne(BACKEND_URL + "signup");
    expect(req.request.method).toEqual("POST");
  });

  it('should sent user data with the create user request', () => {
    authService.createUser(testUserData.email, testUserData.password);
    const req = httpController.expectOne(BACKEND_URL + "signup");
    expect(req.request.body).toEqual({email: testUserData.email, password: testUserData.password})
  });

  it('should send a login request to the login endpoint', () => {
    authService.login(testUserData.email, testUserData.password);
    const req = httpController.expectOne(BACKEND_URL + "login");
    expect(req.request.method).toEqual("POST");
  });

  it('should sent user data with the login request', () => {
    authService.login(testUserData.email, testUserData.password);
    const req = httpController.expectOne(BACKEND_URL + "login");
    expect(req.request.body).toEqual({email: testUserData.email, password: testUserData.password})
  });

  it('logout should clear the timer', () => {
    const fnc = spyOn(window, "clearTimeout");
    authService.logout();
    expect(fnc).toHaveBeenCalledTimes(1);
  });

  it('should set a timer', () => {
    const fnc = spyOn(window, "setTimeout");
    authService.setAuthTimer(1);
    expect(fnc).toHaveBeenCalledTimes(1);
  });

  it('should get a user from the server', () => {
    authService.getUserFromServer("id");
    const req = httpController.expectOne(BACKEND_URL + 'single/id');
    expect(req.request.method).toEqual("GET");
  });
});
