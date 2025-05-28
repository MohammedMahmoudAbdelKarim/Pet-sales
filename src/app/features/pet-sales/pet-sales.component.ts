import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { PetSalesService } from './pet-sales.service';
import { DailySales, WeeklySales } from '@app/core/models/pet-sales.model';
import { LoadingService } from '@app/core/services/loading.service';

@Component({
  selector: 'app-pet-sales',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    FormsModule,
    RouterModule,
    NgxChartsModule,
  ],
  templateUrl: './pet-sales.component.html',
  styleUrls: ['./pet-sales.component.scss'],
})
export class PetSalesComponent implements OnInit {
  dailySales: DailySales[] = [];
  weeklySales: WeeklySales | null = null;
  totalSales = 0;
  pageSize = 10;
  selectedDate: Date = new Date();
  colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };

  constructor(
    private petSalesService: PetSalesService,
    public loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.loadSales();
    this.loadWeeklySales();
  }

  loadSales() {
    this.loadingService.setLoading(true);
    this.petSalesService.getDailySales(this.selectedDate).subscribe({
      next: (response: DailySales) => {
        this.dailySales = [response];
        this.totalSales = 1;
        this.loadingService.setLoading(false);
      },
      error: (error) => {
        console.error('Error loading sales:', error);
        this.dailySales = [];
        this.totalSales = 0;
        this.loadingService.setLoading(false);
      },
    });
  }

  onSearch(search: string) {
    // Implement search functionality if needed
  }

  onPageChange(event: { pageIndex: number; pageSize: number }) {
    this.pageSize = event.pageSize;
    // Implement pagination if needed
  }

  onDateChange() {
    this.loadSales();
    this.loadWeeklySales();
  }

  loadWeeklySales() {
    this.loadingService.setLoading(true);
    this.petSalesService.getWeeklySales(this.selectedDate).subscribe({
      next: (response: WeeklySales) => {
        this.weeklySales = response;
        this.loadingService.setLoading(false);
      },
      error: (error) => {
        console.error('Error loading weekly sales:', error);
        this.weeklySales = null;
        this.loadingService.setLoading(false);
      },
    });
  }

  formatXAxis(index: number): string {
    if (!this.weeklySales?.categories) return '';
    return this.weeklySales.categories[index] || '';
  }

  calculateTotalSales(): number {
    if (!this.weeklySales?.series) return 0;

    return this.weeklySales.series.reduce((total, series) => {
      return total + series.data.reduce((sum, value) => sum + value, 0);
    }, 0);
  }
}
