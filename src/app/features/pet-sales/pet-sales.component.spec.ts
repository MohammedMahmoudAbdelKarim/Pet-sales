import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PetSalesComponent } from './pet-sales.component';
import { PetSalesService } from './pet-sales.service';
import { LoadingService } from '@app/core/services/loading.service';
import { of, throwError } from 'rxjs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DailySales, WeeklySales } from '@app/core/models/pet-sales.model';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DatePipe } from '@angular/common';

describe('PetSalesComponent', () => {
  let component: PetSalesComponent;
  let fixture: ComponentFixture<PetSalesComponent>;
  let petSalesServiceSpy: jasmine.SpyObj<PetSalesService>;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;

  const mockDailySales: DailySales = {
    date: '2025-05-28',
    animal: 'Dog',
    price: 460.72,
  };

  const mockWeeklySales: WeeklySales = {
    series: [
      {
        name: 'Dogs',
        data: [460.72, 0, 0, 719.97, 0, 146.04, 0],
      },
      {
        name: 'Cats',
        data: [7.16, 62.74, 0, 791.56, 738.71, 37.31, 246.48],
      },
    ],
    categories: [
      '2025-05-28',
      '2025-05-29',
      '2025-05-30',
      '2025-05-31',
      '2025-06-01',
      '2025-06-02',
      '2025-06-03',
    ],
  };

  beforeEach(async () => {
    const petSalesSpy = jasmine.createSpyObj('PetSalesService', [
      'getDailySales',
      'getWeeklySales',
    ]);
    const loadingSpy = jasmine.createSpyObj('LoadingService', ['setLoading']);

    await TestBed.configureTestingModule({
      imports: [
        PetSalesComponent,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatTableModule,
        MatPaginatorModule,
        FormsModule,
        NgxChartsModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: PetSalesService, useValue: petSalesSpy },
        { provide: LoadingService, useValue: loadingSpy },
        DatePipe,
      ],
    }).compileComponents();

    petSalesServiceSpy = TestBed.inject(
      PetSalesService
    ) as jasmine.SpyObj<PetSalesService>;
    loadingServiceSpy = TestBed.inject(
      LoadingService
    ) as jasmine.SpyObj<LoadingService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PetSalesComponent);
    component = fixture.componentInstance;
    petSalesServiceSpy.getDailySales.and.returnValue(of(mockDailySales));
    petSalesServiceSpy.getWeeklySales.and.returnValue(of(mockWeeklySales));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.selectedDate).toBeDefined();
    expect(component.colorScheme).toBeDefined();
    expect(component.pageSize).toBe(10);
  });

  it('should calculate total sales correctly', () => {
    component.weeklySales = mockWeeklySales;
    const total = component.calculateTotalSales();
    const expectedTotal = mockWeeklySales.series.reduce(
      (sum, series) => sum + series.data.reduce((a, b) => a + b, 0),
      0
    );
    expect(total).toBe(expectedTotal);
  });

  it('should handle date change', () => {
    spyOn(component, 'loadSales');
    spyOn(component, 'loadWeeklySales');
    component.onDateChange();
    expect(component.loadSales).toHaveBeenCalled();
    expect(component.loadWeeklySales).toHaveBeenCalled();
  });

  it('should display weekly sales chart when data is available', () => {
    component.weeklySales = mockWeeklySales;
    fixture.detectChanges();
    const chart = fixture.nativeElement.querySelector('ngx-charts-line-chart');
    expect(chart).toBeTruthy();
  });

  it('should display daily sales table with correct columns', () => {
    component.dailySales = [mockDailySales];
    fixture.detectChanges();
    const table = fixture.nativeElement.querySelector('table');
    expect(table).toBeTruthy();

    const headers = fixture.nativeElement.querySelectorAll('th');
    expect(headers.length).toBe(3);
    expect(headers[0].textContent).toContain('Date');
    expect(headers[1].textContent).toContain('Animal');
    expect(headers[2].textContent).toContain('Price');
  });

  it('should display correct number of rows in the table', () => {
    component.dailySales = [mockDailySales];
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('tr.mat-row');
    expect(rows.length).toBe(1);
  });

  it('should display "No sales found" when dailySales is empty', () => {
    component.dailySales = [];
    fixture.detectChanges();
    const noDataMessage = fixture.nativeElement.querySelector('.mat-cell');
    expect(noDataMessage.textContent.trim()).toBe('No sales found.');
  });

  it('should handle pagination', () => {
    const event = { pageIndex: 1, pageSize: 25 };
    component.onPageChange(event);
    expect(component.pageSize).toBe(25);
  });

  it('should format x-axis labels correctly', () => {
    component.weeklySales = mockWeeklySales;
    expect(component.formatXAxis(0)).toBe('2025-05-28');
    expect(component.formatXAxis(6)).toBe('2025-06-03');
  });

  describe('loadSales', () => {
    it('should load daily sales data successfully', () => {
      component.loadSales();
      expect(petSalesServiceSpy.getDailySales).toHaveBeenCalled();
      expect(component.dailySales).toEqual([mockDailySales]);
      expect(component.totalSales).toBe(1);
    });

    it('should handle error when loading daily sales', () => {
      petSalesServiceSpy.getDailySales.and.returnValue(
        throwError(() => new Error('Failed to load sales'))
      );
      component.loadSales();
      expect(component.dailySales).toEqual([]);
      expect(component.totalSales).toBe(0);
    });
  });

  describe('loadWeeklySales', () => {
    it('should load weekly sales data successfully', () => {
      component.loadWeeklySales();
      expect(petSalesServiceSpy.getWeeklySales).toHaveBeenCalled();
      expect(component.weeklySales).toEqual(mockWeeklySales);
    });

    it('should handle error when loading weekly sales', () => {
      petSalesServiceSpy.getWeeklySales.and.returnValue(
        throwError(() => new Error('Failed to load weekly sales'))
      );
      component.loadWeeklySales();
      expect(component.weeklySales).toBeNull();
    });
  });
});
