import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AttractionListComponent } from './attraction-list.component';
import { AttractionService } from '../attraction.service';
import { LoadingService } from '@app/core/services/loading.service';
import { of, throwError } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule, Sort, SortDirection } from '@angular/material/sort';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Attraction } from '@app/core/models/attraction.model';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

describe('AttractionListComponent', () => {
  let component: AttractionListComponent;
  let fixture: ComponentFixture<AttractionListComponent>;
  let attractionServiceSpy: jasmine.SpyObj<AttractionService>;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;

  const mockAttractions: Attraction[] = [
    {
      id: 1,
      name: 'Test Attraction 1',
      detail: 'Test Description 1',
      latitude: 13.7563,
      longitude: 100.5018,
      coverimage: 'test-image1.jpg',
    },
    {
      id: 2,
      name: 'Test Attraction 2',
      detail: 'Test Description 2',
      latitude: 13.7564,
      longitude: 100.5019,
      coverimage: 'test-image2.jpg',
    },
  ];

  const mockAttractionResponse = {
    data: mockAttractions,
    total: mockAttractions.length,
  };

  beforeEach(async () => {
    const attractionSpy = jasmine.createSpyObj('AttractionService', [
      'getAttractions',
      'deleteAttraction',
    ]);
    const loadingSpy = jasmine.createSpyObj('LoadingService', ['setLoading']);
    const dialogSpyObj = jasmine.createSpyObj('MatDialog', ['open']);
    const toastrSpyObj = jasmine.createSpyObj('ToastrService', [
      'success',
      'error',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        AttractionListComponent,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: AttractionService, useValue: attractionSpy },
        { provide: LoadingService, useValue: loadingSpy },
        { provide: MatDialog, useValue: dialogSpyObj },
        { provide: ToastrService, useValue: toastrSpyObj },
      ],
    }).compileComponents();

    attractionServiceSpy = TestBed.inject(
      AttractionService
    ) as jasmine.SpyObj<AttractionService>;
    loadingServiceSpy = TestBed.inject(
      LoadingService
    ) as jasmine.SpyObj<LoadingService>;
    dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    toastrSpy = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttractionListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load attractions data', () => {
      attractionServiceSpy.getAttractions.and.returnValue(
        of(mockAttractionResponse)
      );

      component.ngOnInit();

      expect(attractionServiceSpy.getAttractions).toHaveBeenCalled();
      expect(component.attractions).toEqual(mockAttractions);
      expect(component.totalAttraction).toBe(mockAttractions.length);
    });
  });

  describe('loadAttractions', () => {
    it('should load attractions data successfully', () => {
      attractionServiceSpy.getAttractions.and.returnValue(
        of(mockAttractionResponse)
      );

      component.loadAttractions();

      expect(component.attractions).toEqual(mockAttractions);
      expect(component.totalAttraction).toBe(mockAttractions.length);
    });

    it('should handle error when loading attractions', () => {
      const error = 'Error loading attractions';
      attractionServiceSpy.getAttractions.and.returnValue(
        throwError(() => error)
      );
      spyOn(console, 'error');

      component.loadAttractions();

      expect(console.error).toHaveBeenCalledWith(
        'Error loading attractions:',
        error
      );
      expect(component.attractions).toEqual([]);
      expect(component.totalAttraction).toBe(0);
    });
  });

  describe('onSearchChange', () => {
    it('should update search value and reload attractions', () => {
      spyOn(component, 'loadAttractions');
      const searchValue = 'Test';

      component.onSearchChange(searchValue);

      expect(component.searchValue).toBe(searchValue);
      expect(component.loadAttractions).toHaveBeenCalled();
    });
  });

  describe('onSortChange', () => {
    it('should update sort and reload attractions', () => {
      spyOn(component, 'loadAttractions');
      const sort: Sort = { active: 'name', direction: 'asc' as SortDirection };

      component.onSortChange(sort);

      expect(component.sort).toEqual(sort);
      expect(component.loadAttractions).toHaveBeenCalled();
    });
  });

  describe('onPageChange', () => {
    it('should reload attractions with new page parameters', () => {
      spyOn(component, 'loadAttractions');
      const event = { pageIndex: 1, pageSize: 25 };

      component.onPageChange(event);

      expect(component.loadAttractions).toHaveBeenCalledWith(
        event.pageIndex,
        event.pageSize
      );
    });
  });

  describe('onDelete', () => {
    it('should open confirmation dialog and delete attraction if confirmed', () => {
      const attractionId = 1;
      const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', [
        'afterClosed',
      ]);
      dialogRefSpy.afterClosed.and.returnValue(of(true));
      dialogSpy.open.and.returnValue(dialogRefSpy);
      attractionServiceSpy.deleteAttraction.and.returnValue(of(void 0));

      component.onDelete(attractionId);

      expect(dialogSpy.open).toHaveBeenCalled();
      expect(attractionServiceSpy.deleteAttraction).toHaveBeenCalledWith(
        attractionId
      );
      expect(toastrSpy.success).toHaveBeenCalledWith(
        'Attraction deleted successfully'
      );
    });

    it('should show error toast if delete fails', () => {
      const attractionId = 1;
      const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', [
        'afterClosed',
      ]);
      dialogRefSpy.afterClosed.and.returnValue(of(true));
      dialogSpy.open.and.returnValue(dialogRefSpy);
      attractionServiceSpy.deleteAttraction.and.returnValue(
        throwError(() => new Error('Delete failed'))
      );

      component.onDelete(attractionId);

      expect(dialogSpy.open).toHaveBeenCalled();
      expect(attractionServiceSpy.deleteAttraction).toHaveBeenCalledWith(
        attractionId
      );
      expect(toastrSpy.error).toHaveBeenCalledWith(
        'Failed to delete attraction'
      );
    });
  });

  describe('onEdit', () => {
    it('should open edit dialog', () => {
      const attraction = mockAttractions[0];
      component.onEdit(attraction);
      expect(dialogSpy.open).toHaveBeenCalled();
    });
  });

  describe('onView', () => {
    it('should open view dialog', () => {
      const attraction = mockAttractions[0];
      component.onView(attraction);
      expect(dialogSpy.open).toHaveBeenCalled();
    });
  });

  describe('openAddAttractionDialog', () => {
    it('should open add dialog', () => {
      component.openAddAttractionDialog();
      expect(dialogSpy.open).toHaveBeenCalled();
    });
  });
});
