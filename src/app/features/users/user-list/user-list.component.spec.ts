import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserListComponent } from './user-list.component';
import { UserService } from '../user.service';
import { LoadingService } from '@app/core/services/loading.service';
import { of, throwError } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, Sort, SortDirection } from '@angular/material/sort';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { User } from '@app/core/models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;

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

  beforeEach(async () => {
    const userSpy = jasmine.createSpyObj('UserService', [
      'getUsers',
      'deleteUser',
    ]);
    const loadingSpy = jasmine.createSpyObj('LoadingService', ['setLoading']);
    const dialogSpyObj = jasmine.createSpyObj('MatDialog', ['open']);
    const toastrSpyObj = jasmine.createSpyObj('ToastrService', [
      'success',
      'error',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        UserListComponent,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: UserService, useValue: userSpy },
        { provide: LoadingService, useValue: loadingSpy },
        { provide: MatDialog, useValue: dialogSpyObj },
        { provide: ToastrService, useValue: toastrSpyObj },
      ],
    }).compileComponents();

    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    loadingServiceSpy = TestBed.inject(
      LoadingService
    ) as jasmine.SpyObj<LoadingService>;
    dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    toastrSpy = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load users data', () => {
      userServiceSpy.getUsers.and.returnValue(of(mockUserResponse));

      component.ngOnInit();

      expect(userServiceSpy.getUsers).toHaveBeenCalled();
      expect(component.users).toEqual(mockUsers);
      expect(component.totalUsers).toBe(mockUsers.length);
    });
  });

  describe('loadUsers', () => {
    it('should load users data successfully', () => {
      userServiceSpy.getUsers.and.returnValue(of(mockUserResponse));

      component.loadUsers();

      expect(component.users).toEqual(mockUsers);
      expect(component.totalUsers).toBe(mockUsers.length);
    });

    it('should handle error when loading users', () => {
      const error = 'Error loading users';
      userServiceSpy.getUsers.and.returnValue(throwError(() => error));
      spyOn(console, 'error');

      component.loadUsers();

      expect(console.error).toHaveBeenCalledWith('Error loading users:', error);
      expect(component.users).toEqual([]);
      expect(component.totalUsers).toBe(0);
    });
  });

  describe('onSearchChange', () => {
    it('should update search value and reload users', () => {
      spyOn(component, 'loadUsers');
      const searchValue = 'John';

      component.onSearchChange(searchValue);

      expect(component.searchValue).toBe(searchValue);
      expect(component.loadUsers).toHaveBeenCalled();
    });
  });

  describe('onSortChange', () => {
    it('should update sort and reload users', () => {
      spyOn(component, 'loadUsers');
      const sort: Sort = { active: 'fname', direction: 'asc' as SortDirection };

      component.onSortChange(sort);

      expect(component.sort).toEqual(sort);
      expect(component.loadUsers).toHaveBeenCalled();
    });
  });

  describe('onFilterChange', () => {
    it('should update filters and reload users', () => {
      // Initialize paginator
      const paginator = new MatPaginator(null!, null!);
      component.paginator = paginator;
      spyOn(paginator, 'firstPage');
      spyOn(component, 'loadUsers');

      const key = 'role';
      const value = 'admin';

      component.onFilterChange(key, value);

      expect(component.filters[key]).toBe(value);
      expect(paginator.firstPage).toHaveBeenCalled();
      expect(component.loadUsers).toHaveBeenCalled();
    });
  });

  describe('onPageChange', () => {
    it('should reload users with new page parameters', () => {
      spyOn(component, 'loadUsers');
      const event = { pageIndex: 1, pageSize: 25 };

      component.onPageChange(event);

      expect(component.loadUsers).toHaveBeenCalledWith(
        event.pageIndex,
        event.pageSize
      );
    });
  });

  describe('onDelete', () => {
    it('should open confirmation dialog and delete user if confirmed', () => {
      const userId = 1;
      const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', [
        'afterClosed',
      ]);
      dialogRefSpy.afterClosed.and.returnValue(of(true));
      dialogSpy.open.and.returnValue(dialogRefSpy);
      userServiceSpy.deleteUser.and.returnValue(of(void 0));

      component.onDelete(userId);

      expect(dialogSpy.open).toHaveBeenCalled();
      expect(userServiceSpy.deleteUser).toHaveBeenCalledWith(userId);
      expect(toastrSpy.success).toHaveBeenCalledWith(
        'User deleted successfully'
      );
    });

    it('should show error toast if delete fails', () => {
      const userId = 1;
      const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', [
        'afterClosed',
      ]);
      dialogRefSpy.afterClosed.and.returnValue(of(true));
      dialogSpy.open.and.returnValue(dialogRefSpy);
      userServiceSpy.deleteUser.and.returnValue(throwError(() => 'Error'));

      component.onDelete(userId);

      expect(dialogSpy.open).toHaveBeenCalled();
      expect(userServiceSpy.deleteUser).toHaveBeenCalledWith(userId);
      expect(toastrSpy.error).toHaveBeenCalledWith('Failed to delete user');
    });
  });
});
