import { TestBed } from '@angular/core/testing';
import { AttractionsService } from './attractions.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  Attraction,
  AttractionResponse,
} from '@app/core/models/attraction.model';
import { Sort } from '@angular/material/sort';

describe('AttractionsService', () => {
  let service: AttractionsService;
  let httpMock: HttpTestingController;

  const mockAttractions: Attraction[] = [
    {
      id: 1,
      name: 'Theme Park',
      detail: 'A fun theme park',
      coverimage: 'theme-park.jpg',
      latitude: 40.7128,
      longitude: -74.006,
    },
    {
      id: 2,
      name: 'Museum',
      detail: 'Historical artifacts',
      coverimage: 'museum.jpg',
      latitude: 40.7589,
      longitude: -73.9851,
    },
  ];

  const mockAttractionResponse: AttractionResponse = {
    attractions: mockAttractions,
    total: mockAttractions.length,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AttractionsService],
    });

    service = TestBed.inject(AttractionsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAttractions', () => {
    it('should return attractions data with pagination', () => {
      const page = 1;
      const pageSize = 10;
      const sort: Sort = { active: 'name', direction: 'asc' };

      service
        .getAttractions(page, pageSize, undefined, sort)
        .subscribe((data) => {
          expect(data).toEqual(mockAttractionResponse);
        });

      const req = httpMock.expectOne((req) => req.url.includes('/attractions'));
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('page')).toBe(page.toString());
      expect(req.request.params.get('per_page')).toBe(pageSize.toString());
      expect(req.request.params.get('sort_column')).toBe(sort.active);
      expect(req.request.params.get('sort_order')).toBe(sort.direction);
      req.flush(mockAttractionResponse);
    });

    it('should handle error when fetching attractions', () => {
      const errorMessage = 'Error fetching attractions';

      service.getAttractions(1, 10).subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe(errorMessage);
        },
      });

      const req = httpMock.expectOne((req) => req.url.includes('/attractions'));
      req.flush(errorMessage, {
        status: 500,
        statusText: errorMessage,
      });
    });
  });

  describe('getAttraction', () => {
    it('should return a single attraction', () => {
      const attractionId = 1;
      const mockAttraction = mockAttractions[0];

      service.getAttraction(attractionId).subscribe((data) => {
        expect(data).toEqual(mockAttraction);
      });

      const req = httpMock.expectOne(`/attractions/${attractionId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockAttraction);
    });

    it('should handle error when fetching single attraction', () => {
      const attractionId = 1;
      const errorMessage = 'Error fetching attraction';

      service.getAttraction(attractionId).subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe(errorMessage);
        },
      });

      const req = httpMock.expectOne(`/attractions/${attractionId}`);
      req.flush(errorMessage, {
        status: 500,
        statusText: errorMessage,
      });
    });
  });

  describe('createAttraction', () => {
    it('should create a new attraction', () => {
      const newAttraction: Attraction = {
        id: 3,
        name: 'Zoo',
        detail: 'Wildlife park',
        coverimage: 'zoo.jpg',
        latitude: 40.7829,
        longitude: -73.9654,
      };

      service.createAttraction(newAttraction).subscribe((data) => {
        expect(data).toEqual(newAttraction);
      });

      const req = httpMock.expectOne('/attractions/create');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newAttraction);
      req.flush(newAttraction);
    });
  });

  describe('updateAttraction', () => {
    it('should update an existing attraction', () => {
      const updatedAttraction: Attraction = {
        ...mockAttractions[0],
        name: 'Updated Theme Park',
      };

      service
        .updateAttraction(updatedAttraction.id, updatedAttraction)
        .subscribe((data) => {
          expect(data).toEqual(updatedAttraction);
        });

      const req = httpMock.expectOne('/attractions/update');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedAttraction);
      req.flush(updatedAttraction);
    });
  });

  describe('deleteAttraction', () => {
    it('should delete an attraction', () => {
      const attractionId = 1;

      service.deleteAttraction(attractionId).subscribe();

      const req = httpMock.expectOne('/attractions/delete');
      expect(req.request.method).toBe('DELETE');
      expect(req.request.body).toEqual({ id: attractionId });
      req.flush(null);
    });
  });
});
