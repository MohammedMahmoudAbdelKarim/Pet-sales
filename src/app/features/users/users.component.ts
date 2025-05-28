import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService, User } from './user.service';
import { LoadingService } from '../../core/services/loading.service';
import { BaseListComponent } from '../../core/components/base-list/base-list.component';
import {
  Column,
  DataTableComponent,
} from '../../core/components/data-table/data-table.component';
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [DataTableComponent],
  template: `
    <app-data-table
      [columns]="columns"
      [data]="data"
      [totalItems]="totalItems"
      [pageSize]="pageSize"
      (onPageChange)="onPageChange($event)"
      (onSortChange)="onSortChange($event)"
      (onSearchChange)="onSearchChange($event)"
      (onFilterChange)="onFilterChange($event)"
      (onEdit)="onEdit($event)"
      (onDelete)="onDelete($event)"
    ></app-data-table>
  `,
})
export class UsersComponent extends BaseListComponent<User> {
  protected columns: Column[] = [
    { key: 'name', header: 'Name', sortable: true, filterable: true },
    { key: 'email', header: 'Email', sortable: true, filterable: true },
    { key: 'role', header: 'Role', sortable: true, filterable: true },
    { key: 'actions', header: 'Actions', type: 'actions' },
  ];

  constructor(
    protected override service: UserService,
    protected override dialog: MatDialog,
    protected override loadingService: LoadingService
  ) {
    super();
  }

  override onEdit(user: User) {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: user,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadData();
      }
    });
  }

  override onDelete(user: User) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: user,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadData();
      }
    });
  }
}
