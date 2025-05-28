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

describe('PetSalesComponent', () => {
  let component: PetSalesComponent;
  let fixture: ComponentFixture<PetSalesComponent>;
  let petSalesServiceSpy: jasmine.SpyObj<PetSalesService>;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;

  const mockDailySales: DailySales[] = [
    { date: '2025-05-28', animal: 'Dog', price: 460.72 },
    { date: '2025-05-29', animal: 'Cat', price: 62.74 },
  ];

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
    const loadingSpy = jasmine.createSpyObj('LoadingService', ['show', 'hide']);

    await TestBed.configureTestingModule({
      imports: [
        PetSalesComponent,
        MatDatepickerModule,
        MatNativeDateModule,
        FormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: PetSalesService, useValue: petSalesSpy },
        { provide: LoadingService, useValue: loadingSpy },
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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load sales and weekly sales data', () => {
      petSalesServiceSpy.getDailySales.and.returnValue(
        of(mockDailySales as any)
      );
      petSalesServiceSpy.getWeeklySales.and.returnValue(of(mockWeeklySales));

      component.ngOnInit();

      expect(petSalesServiceSpy.getDailySales).toHaveBeenCalled();
      expect(petSalesServiceSpy.getWeeklySales).toHaveBeenCalled();
    });
  });

  describe('loadSales', () => {
    it('should load daily sales data successfully', () => {
      petSalesServiceSpy.getDailySales.and.returnValue(
        of(mockDailySales as any)
      );

      component.loadSales();

      expect(component.dailySales).toEqual(mockDailySales);
      expect(component.totalSales).toBe(mockDailySales.length);
    });

    it('should handle error when loading daily sales', () => {
      const error = 'Error loading sales';
      petSalesServiceSpy.getDailySales.and.returnValue(throwError(() => error));
      spyOn(console, 'error');

      component.loadSales();

      expect(console.error).toHaveBeenCalledWith('Error loading sales:', error);
    });
  });

  describe('loadWeeklySales', () => {
    it('should transform and load weekly sales data successfully', () => {
      petSalesServiceSpy.getWeeklySales.and.returnValue(of(mockWeeklySales));

      component.loadWeeklySales();

      expect(component.weeklySales).toBeTruthy();
      expect(component.weeklySales.series.length).toBe(2);
      expect(component.weeklySales.series[0].name).toBe('Dogs');
      expect(component.weeklySales.series[1].name).toBe('Cats');
    });

    it('should handle error when loading weekly sales', () => {
      const error = 'Error loading weekly sales';
      petSalesServiceSpy.getWeeklySales.and.returnValue(
        throwError(() => error)
      );
      spyOn(console, 'error');

      component.loadWeeklySales();

      expect(console.error).toHaveBeenCalledWith(
        'Error loading weekly sales:',
        error
      );
    });
  });

  describe('calculateTotalSales', () => {
    it('should return 0 when no weekly sales data', () => {
      component.weeklySales = null;
      expect(component.calculateTotalSales()).toBe(0);
    });

    it('should calculate total sales correctly', () => {
      component.weeklySales = {
        series: [
          {
            name: 'Dogs',
            series: [{ value: 100 }, { value: 200 }],
          },
          {
            name: 'Cats',
            series: [{ value: 150 }, { value: 250 }],
          },
        ],
      };

      expect(component.calculateTotalSales()).toBe(700);
    });
  });

  describe('formatXAxis', () => {
    it('should return empty string when no weekly sales data', () => {
      component.weeklySales = null;
      expect(component.formatXAxis(0)).toBe('');
    });

    it('should format x-axis label correctly', () => {
      component.weeklySales = {
        series: [
          {
            name: 'Dogs',
            series: [{ name: '2025-05-28', value: 100 }],
          },
        ],
      };

      expect(component.formatXAxis(0)).toBe('2025-05-28');
    });
  });

  describe('onPageChange', () => {
    it('should update page size', () => {
      const event = { pageIndex: 1, pageSize: 25 };
      component.onPageChange(event);
      expect(component.pageSize).toBe(25);
    });
  });

  describe('onDateChange', () => {
    it('should reload sales data', () => {
      spyOn(component, 'loadSales');
      spyOn(component, 'loadWeeklySales');

      component.onDateChange();

      expect(component.loadSales).toHaveBeenCalled();
      expect(component.loadWeeklySales).toHaveBeenCalled();
    });
  });
});
