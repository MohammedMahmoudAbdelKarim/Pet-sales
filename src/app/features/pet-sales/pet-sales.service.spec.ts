import { TestBed } from '@angular/core/testing';
import { PetSalesService } from './pet-sales.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { DailySales, WeeklySales } from '@app/core/models/pet-sales.model';

describe('PetSalesService', () => {
  let service: PetSalesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PetSalesService],
    });

    service = TestBed.inject(PetSalesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getDailySales', () => {
    const mockDailySales: DailySales[] = [
      { date: '2025-05-28', animal: 'Dog', price: 460.72 },
      { date: '2025-05-29', animal: 'Cat', price: 62.74 },
    ];

    it('should return daily sales data', () => {
      service.getDailySales().subscribe((data) => {
        expect(data).toEqual(mockDailySales);
      });

      const req = httpMock.expectOne('api/pet-sales/daily');
      expect(req.request.method).toBe('GET');
      req.flush(mockDailySales);
    });

    it('should handle error when fetching daily sales', () => {
      const errorMessage = 'Error fetching daily sales';

      service.getDailySales().subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe(errorMessage);
        },
      });

      const req = httpMock.expectOne('api/pet-sales/daily');
      req.flush(errorMessage, {
        status: 500,
        statusText: errorMessage,
      });
    });
  });

  describe('getWeeklySales', () => {
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

    it('should return weekly sales data', () => {
      service.getWeeklySales().subscribe((data) => {
        expect(data).toEqual(mockWeeklySales);
      });

      const req = httpMock.expectOne('api/pet-sales/weekly');
      expect(req.request.method).toBe('GET');
      req.flush(mockWeeklySales);
    });

    it('should handle error when fetching weekly sales', () => {
      const errorMessage = 'Error fetching weekly sales';

      service.getWeeklySales().subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe(errorMessage);
        },
      });

      const req = httpMock.expectOne('api/pet-sales/weekly');
      req.flush(errorMessage, {
        status: 500,
        statusText: errorMessage,
      });
    });
  });
});
