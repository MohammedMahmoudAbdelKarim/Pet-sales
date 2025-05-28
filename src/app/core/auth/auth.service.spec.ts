import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthService, LoginResponse } from './auth.service';
import { User } from '../models/user.model';
import { APP_CONFIG } from '../config/app.config';
import { firstValueFrom } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockUser: User = {
    id: 1,
    fname: 'Test',
    lname: 'User',
    username: 'testuser',
    email: 'test@example.com',
    avatar: 'test-avatar.jpg',
  };

  const mockLoginResponse: LoginResponse = {
    accessToken: 'test-token',
    user: mockUser,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear(); // Clear localStorage before each test
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login successfully', async () => {
    const loginPromise = firstValueFrom(service.login('test', 'password'));

    const req = httpMock.expectOne(`${APP_CONFIG.apiUrl}/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockLoginResponse);

    const response = await loginPromise;
    expect(response).toEqual(mockLoginResponse);
    expect(service.getToken()).toBe('test-token');
    expect(service.getUser()).toEqual(mockUser);
  });

  it('should logout and clear session', async () => {
    // First login
    const loginPromise = firstValueFrom(service.login('test', 'password'));
    const loginReq = httpMock.expectOne(`${APP_CONFIG.apiUrl}/login`);
    loginReq.flush(mockLoginResponse);
    await loginPromise;

    // Then logout
    service.logout();
    expect(service.getToken()).toBeNull();
    expect(service.getUser()).toBeNull();
  });

  it('should check authentication status', async () => {
    // Initially not authenticated
    const initialAuth = await firstValueFrom(service.isAuthenticated());
    expect(initialAuth).toBeFalse();

    // After login
    const loginPromise = firstValueFrom(service.login('test', 'password'));
    const req = httpMock.expectOne(`${APP_CONFIG.apiUrl}/login`);
    req.flush(mockLoginResponse);
    await loginPromise;

    const afterLoginAuth = await firstValueFrom(service.isAuthenticated());
    expect(afterLoginAuth).toBeTrue();
  });

  it('should handle login error', async () => {
    const errorMessage = 'Invalid credentials';
    let errorCaught = false;

    const loginPromise = firstValueFrom(
      service.login('test', 'wrong-password')
    ).catch((error) => {
      errorCaught = true;
      expect(error.status).toBe(401);
      expect(service.getToken()).toBeNull();
      expect(service.getUser()).toBeNull();
    });

    const req = httpMock.expectOne(`${APP_CONFIG.apiUrl}/login`);
    req.flush(errorMessage, { status: 401, statusText: 'Unauthorized' });

    await loginPromise;
    expect(errorCaught).toBeTrue();
  });

  it('should maintain user state after page reload', async () => {
    // First login
    const loginPromise = firstValueFrom(service.login('test', 'password'));
    const loginReq = httpMock.expectOne(`${APP_CONFIG.apiUrl}/login`);
    loginReq.flush(mockLoginResponse);
    await loginPromise;

    // Simulate page reload by creating a new instance
    const newService = TestBed.inject(AuthService);

    expect(newService.getToken()).toBe('test-token');
    expect(newService.getUser()).toEqual(mockUser);

    const isAuthenticated = await firstValueFrom(newService.isAuthenticated());
    expect(isAuthenticated).toBeTrue();
  });
});
