import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AttractionDetailsComponent } from './attraction-details.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Attraction } from '@app/core/models/attraction.model';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('AttractionDetailsComponent', () => {
  let component: AttractionDetailsComponent;
  let fixture: ComponentFixture<AttractionDetailsComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<AttractionDetailsComponent>>;

  const mockAttraction: Attraction = {
    id: 1,
    name: 'Test Attraction',
    detail: 'Test Description',
    latitude: 13.7563,
    longitude: 100.5018,
    coverimage: 'test-image.jpg',
  };

  beforeEach(async () => {
    const dialogSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [AttractionDetailsComponent, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockAttraction },
      ],
    }).compileComponents();

    dialogRefSpy = TestBed.inject(MatDialogRef) as jasmine.SpyObj<
      MatDialogRef<AttractionDetailsComponent>
    >;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttractionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display attraction details correctly', () => {
    const compiled = fixture.nativeElement;

    expect(compiled.querySelector('h2').textContent).toContain(
      'Attraction Details'
    );
    expect(compiled.textContent).toContain(mockAttraction.name);
    expect(compiled.textContent).toContain(mockAttraction.detail);
    expect(compiled.textContent).toContain(mockAttraction.latitude.toString());
    expect(compiled.textContent).toContain(mockAttraction.longitude.toString());

    const coverImage = compiled.querySelector('img');
    expect(coverImage).toBeTruthy();
    expect(coverImage.src).toContain(mockAttraction.coverimage);
  });

  it('should close dialog when close button is clicked', () => {
    const closeButton = fixture.nativeElement.querySelector('button');
    closeButton.click();

    expect(dialogRefSpy.close).toHaveBeenCalled();
  });
});
