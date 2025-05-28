import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersComponent } from './users.component';
import { UserService } from './user.service';
import { LoadingService } from '@app/core/services/loading.service';
import { of, throwError } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;

  const mockUsers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
      status: 'active',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'user',
      status: 'active',
    },
  ];

  beforeEach(async () => {
    const userSpy = jasmine.createSpyObj('UserService', ['getUsers']);
    const loadingSpy = jasmine.createSpyObj('LoadingService', ['show', 'hide']);

    await TestBed.configureTestingModule({
      imports: [
        UsersComponent,
        MatTableModule,
        MatPaginatorModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: UserService, useValue: userSpy },
        { provide: LoadingService, useValue: loadingSpy },
      ],
    }).compileComponents();

    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    loadingServiceSpy = TestBed.inject(
      LoadingService
    ) as jasmine.SpyObj<LoadingService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load users data', () => {
      userServiceSpy.getUsers.and.returnValue(of(mockUsers));

      component.ngOnInit();

      expect(userServiceSpy.getUsers).toHaveBeenCalled();
      expect(component.users).toEqual(mockUsers);
    });
  });

  describe('loadUsers', () => {
    it('should load users data successfully', () => {
      userServiceSpy.getUsers.and.returnValue(of(mockUsers));

      component.loadUsers();

      expect(component.users).toEqual(mockUsers);
      expect(loadingServiceSpy.show).toHaveBeenCalled();
      expect(loadingServiceSpy.hide).toHaveBeenCalled();
    });

    it('should handle error when loading users', () => {
      const error = 'Error loading users';
      userServiceSpy.getUsers.and.returnValue(throwError(() => error));
      spyOn(console, 'error');

      component.loadUsers();

      expect(console.error).toHaveBeenCalledWith('Error loading users:', error);
      expect(loadingServiceSpy.show).toHaveBeenCalled();
      expect(loadingServiceSpy.hide).toHaveBeenCalled();
    });
  });

  describe('onPageChange', () => {
    it('should update page size and reload users', () => {
      spyOn(component, 'loadUsers');
      const event = { pageIndex: 1, pageSize: 25 };

      component.onPageChange(event);

      expect(component.pageSize).toBe(25);
      expect(component.loadUsers).toHaveBeenCalled();
    });
  });

  describe('applyFilter', () => {
    it('should filter users based on search term', () => {
      component.users = mockUsers;
      const event = { target: { value: 'John' } } as unknown as Event;

      component.applyFilter(event);

      expect(component.dataSource.filter).toBe('John');
    });
  });
});
