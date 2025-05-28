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
  weeklySales: any = null;
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
    this.petSalesService.getDailySales(this.selectedDate).subscribe({
      next: (response: DailySales | any) => {
        console.log(response);
        this.dailySales = response;
        this.totalSales = response.length;
      },
      error: (error) => {
        console.error('Error loading sales:', error);
      },
    });
  }

  onSearch(search: string) {
    // this.loadSales(0, 10, search);
  }

  onPageChange(event: { pageIndex: number; pageSize: number }) {
    this.pageSize = event.pageSize;
    // TODO: Implement pagination in the API call
    // this.loadSales(event.pageIndex, event.pageSize);
  }

  onDateChange() {
    this.loadSales();
    this.loadWeeklySales();
  }

  loadWeeklySales() {
    this.petSalesService.getWeeklySales(this.selectedDate).subscribe({
      next: (response: any) => {
        console.log('Raw API Response:', response);

        // Transform the data for ngx-charts
        const transformedData = {
          series: response.series.map(
            (series: { name: string; data: number[] }) => ({
              name: series.name,
              series: series.data.map((value: number, index: number) => ({
                name: response.categories[index],
                value: value,
              })),
            })
          ),
        };

        console.log('Transformed Data:', transformedData);
        this.weeklySales = transformedData;
      },
      error: (error) => {
        console.error('Error loading weekly sales:', error);
      },
    });
  }

  formatXAxis(index: number): string {
    if (!this.weeklySales?.series) return '';
    return this.weeklySales.series[index].name;
  }

  calculateTotalSales(): number {
    if (!this.weeklySales?.series) return 0;

    return this.weeklySales.series.reduce(
      (total: number, series: { series: { value: number }[] }) => {
        return (
          total +
          series.series.reduce(
            (sum: number, point: { value: number }) => sum + point.value,
            0
          )
        );
      },
      0
    );
  }
}
