import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

export interface Column {
  key: string;
  header: string;
  type?: 'text' | 'image' | 'actions';
  sortable?: boolean;
  filterable?: boolean;
  imageConfig?: {
    width?: string;
    height?: string;
    borderRadius?: string;
  };
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
  ],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent implements OnInit {
  @Input() columns: Column[] = [];
  @Input() data: any[] = [];
  @Input() totalItems: number = 0;
  @Input() pageSize: number = 10;
  @Input() pageSizeOptions: number[] = [5, 10, 25, 100];

  @Output() onPageChange = new EventEmitter<PageEvent>();
  @Output() onSortChange = new EventEmitter<Sort>();
  @Output() onSearchChange = new EventEmitter<string>();
  @Output() onFilterChange = new EventEmitter<Record<string, string>>();
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();

  displayedColumns: string[] = [];
  searchTerm: string = '';
  columnFilters: Record<string, string> = {};
  filterableColumns: Column[] = [];

  ngOnInit() {
    this.displayedColumns = this.columns.map((col) => col.key);
    this.filterableColumns = this.columns.filter((col) => col.filterable);
  }

  onSearch(event: string) {
    this.onSearchChange.emit(event);
  }

  onFilter() {
    this.onFilterChange.emit(this.columnFilters);
  }

  onSort(event: Sort) {
    this.onSortChange.emit(event);
  }

  onPage(event: PageEvent) {
    this.onPageChange.emit(event);
  }
}
