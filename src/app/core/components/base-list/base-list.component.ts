import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { DataTableComponent, Column } from '../data-table/data-table.component';
import { BaseService, PaginatedResponse } from '../../services/base.service';
import { LoadingService } from '../../services/loading.service';

@Component({
  template: '',
})
export abstract class BaseListComponent<T> implements OnInit {
  @ViewChild(DataTableComponent) dataTable!: DataTableComponent;

  data: T[] = [];
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  searchTerm: string = '';
  filters: Record<string, string> = {};

  protected abstract columns: Column[];
  protected abstract service: BaseService<T>;
  protected abstract dialog: MatDialog;
  protected abstract loadingService: LoadingService;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loadingService.setLoading(true);
    this.service
      .getAll(this.currentPage, this.pageSize, this.searchTerm, this.filters)
      .subscribe({
        next: (response: PaginatedResponse<T>) => {
          this.data = response.data;
          this.totalItems = response.total;
          this.loadingService.setLoading(false);
        },
        error: (error) => {
          console.error('Error loading data:', error);
          this.loadingService.setLoading(false);
        },
      });
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  onSortChange(event: Sort) {
    // Implement sorting logic in child components if needed
    this.loadData();
  }

  onSearchChange(term: string) {
    this.searchTerm = term;
    this.currentPage = 1;
    this.loadData();
  }

  onFilterChange(filters: Record<string, string>) {
    this.filters = filters;
    this.currentPage = 1;
    this.loadData();
  }

  onEdit(item: T) {
    // Implement edit logic in child components
  }

  onDelete(item: T) {
    // Implement delete logic in child components
  }
}
