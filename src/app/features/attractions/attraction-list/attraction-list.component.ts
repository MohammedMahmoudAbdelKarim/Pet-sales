import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { AttractionService } from '../attraction.service';
import { Attraction } from '@app/core/models/attraction.model';
import { LoadingService } from '@app/core/services/loading.service';
import { MatDialog } from '@angular/material/dialog';
import { PopupConfirmComponent } from '@app/core/components/popup-confirm/popup-confirm.component';
import { ToastrService } from 'ngx-toastr';
import { AttractionFormComponent } from '../attraction-form/attraction-form.component';
import { AttractionDetailsComponent } from '../attraction-details/attraction-details.component';
import { AttractionResponse } from '../attraction.service';

@Component({
  selector: 'app-attraction-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    RouterModule,
    MatTooltipModule,
  ],
  templateUrl: './attraction-list.component.html',
  styleUrl: './attraction-list.component.scss',
})
export class AttractionListComponent implements OnInit {
  attractions: Attraction[] = [];
  totalAttraction = 0;
  searchValue = '';
  sort: Sort = { active: '', direction: '' };
  filters: { [key: string]: string } = {};
  displayedColumns: string[] = [
    'coverimage',
    'name',
    'detail',
    'latitude',
    'longitude',
    'actions',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) matSort!: MatSort;

  constructor(
    private attractionService: AttractionService,
    public loadingService: LoadingService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadAttractions();
  }

  openAddAttractionDialog() {
    const dialogRef = this.dialog.open(AttractionFormComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadAttractions();
      }
    });
  }

  loadAttractions(pageIndex = 0, pageSize = 10) {
    const page = pageIndex + 1;
    this.attractionService
      .getAttractions(page, pageSize, this.searchValue, this.sort, this.filters)
      .subscribe({
        next: (res: AttractionResponse) => {
          this.attractions = res.data;
          this.totalAttraction = res.total;

          if (this.paginator) {
            this.paginator.length = this.totalAttraction;
          }
        },
        error: (error: Error) => {
          console.error('Error loading attractions:', error);
          this.attractions = [];
          this.totalAttraction = 0;
        },
      });
  }

  onSearchChange(search: string) {
    this.searchValue = search;
    this.paginator.firstPage();
    this.loadAttractions();
  }

  onSortChange(sort: Sort) {
    this.sort = sort;
    this.loadAttractions(this.paginator.pageIndex, this.paginator.pageSize);
  }

  onFilterChange(key: string, value: string) {
    this.filters[key] = value;
    this.paginator.firstPage();
    this.loadAttractions();
  }

  onPageChange(event: { pageIndex: number; pageSize: number }) {
    this.loadAttractions(event.pageIndex, event.pageSize);
  }

  onView(attraction: Attraction) {
    this.dialog.open(AttractionDetailsComponent, {
      width: '400px',
      data: attraction,
    });
  }

  ngAfterViewInit() {
    this.paginator.page.subscribe((event) => this.onPageChange(event));
    this.matSort.sortChange.subscribe((sort: Sort) => {
      this.sort = sort;
      this.paginator.pageIndex = 0; // reset to first page on sort change
      this.loadAttractions(this.paginator.pageIndex, this.paginator.pageSize);
    });
  }

  onEdit(attraction: Attraction) {
    const dialogRef = this.dialog.open(AttractionFormComponent, {
      width: '600px',
      data: attraction, // pass attraction data to patch form
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadAttractions();
      }
    });
  }
  onDelete(attractionId: number) {
    const dialogRef = this.dialog.open(PopupConfirmComponent, {
      width: '500px',
      data: {
        title: 'Delete attraction',
        message: 'Are you sure you want to delete this attraction?',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.attractionService.deleteAttraction(attractionId).subscribe({
          next: () => {
            this.toastr.success('Attraction deleted successfully');
            this.loadAttractions();
          },
          error: () => {
            this.toastr.error('Failed to delete attraction');
          },
        });
      }
    });
  }
}
