import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { User } from '@app/core/models/user.model';
import { Sort } from '@angular/material/sort';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const mockUsers: User[] = [
    {
      id: 1,
      fname: 'John',
      lname: 'Doe',
      username: 'johndoe',
      avatar: 'avatar1.jpg',
      email: 'john@example.com',
    },
    {
      id: 2,
      fname: 'Jane',
      lname: 'Smith',
      username: 'janesmith',
      avatar: 'avatar2.jpg',
      email: 'jane@example.com',
    },
  ];

  const mockUserResponse = {
    data: mockUsers,
    total: mockUsers.length,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUsers', () => {
    it('should return users with pagination and sorting', () => {
      const page = 1;
      const pageSize = 10;
      const sort: Sort = { active: 'fname', direction: 'asc' };

      service.getUsers(page, pageSize, undefined, sort).subscribe((data) => {
        expect(data).toEqual(mockUserResponse);
      });

      const req = httpMock.expectOne((req) => req.url.includes('/users'));
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('page')).toBe(page.toString());
      expect(req.request.params.get('per_page')).toBe(pageSize.toString());
      expect(req.request.params.get('sort_column')).toBe(sort.active);
      expect(req.request.params.get('sort_order')).toBe(sort.direction);
      req.flush(mockUserResponse);
    });

    it('should include search parameter when provided', () => {
      const search = 'John';
      service.getUsers(1, 10, search).subscribe();

      const req = httpMock.expectOne((req) => req.url.includes('/users'));
      expect(req.request.params.get('search')).toBe(search);
      req.flush(mockUserResponse);
    });

    it('should handle error when fetching users', () => {
      const errorMessage = 'Error fetching users';

      service.getUsers(1, 10).subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe(errorMessage);
        },
      });

      const req = httpMock.expectOne((req) => req.url.includes('/users'));
      req.flush(errorMessage, {
        status: 500,
        statusText: errorMessage,
      });
    });
  });

  describe('getUser', () => {
    it('should return a single user', () => {
      const userId = 1;
      const mockUser = mockUsers[0];

      service.getUser(userId).subscribe((data) => {
        expect(data).toEqual(mockUser);
      });

      const req = httpMock.expectOne(`/users/${userId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });

    it('should handle error when fetching single user', () => {
      const userId = 1;
      const errorMessage = 'Error fetching user';

      service.getUser(userId).subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe(errorMessage);
        },
      });

      const req = httpMock.expectOne(`/users/${userId}`);
      req.flush(errorMessage, {
        status: 500,
        statusText: errorMessage,
      });
    });
  });

  describe('createUser', () => {
    it('should create a new user', () => {
      const newUser: User = {
        id: 3,
        fname: 'Bob',
        lname: 'Wilson',
        username: 'bobwilson',
        avatar: 'avatar3.jpg',
        email: 'bob@example.com',
      };

      service.createUser(newUser).subscribe((data) => {
        expect(data).toEqual(newUser);
      });

      const req = httpMock.expectOne('/users/create');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newUser);
      req.flush(newUser);
    });
  });

  describe('updateUser', () => {
    it('should update an existing user', () => {
      const updatedUser: User = {
        ...mockUsers[0],
        fname: 'Johnny',
      };

      service.updateUser(updatedUser.id, updatedUser).subscribe((data) => {
        expect(data).toEqual(updatedUser);
      });

      const req = httpMock.expectOne('/users/update');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedUser);
      req.flush(updatedUser);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', () => {
      const userId = 1;

      service.deleteUser(userId).subscribe();

      const req = httpMock.expectOne('/users/delete');
      expect(req.request.method).toBe('DELETE');
      expect(req.request.body).toEqual({ id: userId });
      req.flush(null);
    });
  });
});
