import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { UserService } from '../user.service';
import { User } from '@app/core/models/user.model';
import { LoadingService } from '@app/core/services/loading.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { UserFormComponent } from '../user-form/user-form.component';
import { MatDialog } from '@angular/material/dialog';
import { PopupConfirmComponent } from '@app/core/components/popup-confirm/popup-confirm.component';
import { ToastrService } from 'ngx-toastr';
import { UserDetailsComponent } from '../user-details/user-details.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  totalUsers = 0;
  searchValue = '';
  sort: Sort = { active: '', direction: '' };
  filters: { [key: string]: string } = {};
  displayedColumns: string[] = [
    'avatar',
    'fname',
    'lname',
    'username',
    'actions',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) matSort!: MatSort;

  constructor(
    private userService: UserService,
    public loadingService: LoadingService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  openAddUserDialog() {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  loadUsers(pageIndex = 0, pageSize = 10) {
    const page = pageIndex + 1;
    this.userService
      .getUsers(page, pageSize, this.searchValue, this.sort, this.filters)
      .subscribe({
        next: (res: any) => {
          this.users = res?.data || [];
          this.totalUsers = res.total || 0;

          if (this.paginator) {
            this.paginator.length = this.totalUsers;
          }
        },
        error: (error) => {
          console.error('Error loading users:', error);
          this.users = [];
          this.totalUsers = 0;
        },
      });
  }

  onSearchChange(search: string) {
    this.searchValue = search;
    this.paginator.firstPage();
    this.loadUsers();
  }

  onSortChange(sort: Sort) {
    this.sort = sort;
    this.loadUsers(this.paginator.pageIndex, this.paginator.pageSize);
  }

  onFilterChange(key: string, value: string) {
    this.filters[key] = value;
    this.paginator.firstPage();
    this.loadUsers();
  }

  onPageChange(event: { pageIndex: number; pageSize: number }) {
    this.loadUsers(event.pageIndex, event.pageSize);
  }

  onView(user: User) {
    this.dialog.open(UserDetailsComponent, {
      width: '400px',
      data: user,
    });
  }

  ngAfterViewInit() {
    this.paginator.page.subscribe((event) => this.onPageChange(event));
    this.matSort.sortChange.subscribe((sort: Sort) => {
      this.sort = sort;
      this.paginator.pageIndex = 0; // reset to first page on sort change
      this.loadUsers(this.paginator.pageIndex, this.paginator.pageSize);
    });
  }

  onEdit(user: User) {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '600px',
      data: user, // pass user data to patch form
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadUsers();
      }
    });
  }
  onDelete(userId: number) {
    const dialogRef = this.dialog.open(PopupConfirmComponent, {
      width: '500px',
      data: {
        title: 'Delete User',
        message: 'Are you sure you want to delete this user?',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.userService.deleteUser(userId).subscribe({
          next: () => {
            this.toastr.success('User deleted successfully');
            this.loadUsers();
          },
          error: () => {
            this.toastr.error('Failed to delete user');
          },
        });
      }
    });
  }
}
