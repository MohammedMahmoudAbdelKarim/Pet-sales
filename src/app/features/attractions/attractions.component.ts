import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AttractionService } from './attraction.service';
import { LoadingService } from '../../core/services/loading.service';
import { BaseListComponent } from '../../core/components/base-list/base-list.component';
import {
  Column,
  DataTableComponent,
} from '../../core/components/data-table/data-table.component';
import { Attraction } from '@app/core/models/attraction.model';

@Component({
  selector: 'app-attractions',
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
export class AttractionsComponent extends BaseListComponent<Attraction> {
  protected columns: Column[] = [
    { key: 'name', header: 'Name', sortable: true, filterable: true },
    {
      key: 'description',
      header: 'Description',
      sortable: true,
      filterable: true,
    },
    { key: 'location', header: 'Location', sortable: true, filterable: true },
    {
      key: 'image',
      header: 'Image',
      type: 'image',
      imageConfig: {
        width: '50px',
        height: '50px',
        borderRadius: '4px',
      },
    },
    { key: 'actions', header: 'Actions', type: 'actions' },
  ];

  constructor(
    protected override service: AttractionService,
    protected override dialog: MatDialog,
    protected override loadingService: LoadingService
  ) {
    super();
  }

  override onEdit(attraction: Attraction) {
    // Implement attraction edit dialog
  }

  override onDelete(attraction: Attraction) {
    // Implement attraction delete confirmation
  }
}
