import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AttractionFormComponent } from './attraction-form.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Attraction } from '@app/core/models/attraction.model';

describe('AttractionFormComponent', () => {
  let component: AttractionFormComponent;
  let fixture: ComponentFixture<AttractionFormComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<AttractionFormComponent>>;

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
      imports: [
        AttractionFormComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogSpy },
        { provide: MAT_DIALOG_DATA, useValue: null },
      ],
    }).compileComponents();

    dialogRefSpy = TestBed.inject(MatDialogRef) as jasmine.SpyObj<
      MatDialogRef<AttractionFormComponent>
    >;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttractionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values for new attraction', () => {
    expect(component.attractionForm.get('name')?.value).toBe('');
    expect(component.attractionForm.get('detail')?.value).toBe('');
    expect(component.attractionForm.get('latitude')?.value).toBe('');
    expect(component.attractionForm.get('longitude')?.value).toBe('');
    expect(component.attractionForm.get('coverimage')?.value).toBe('');
  });

  it('should initialize form with attraction values when editing', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [
        AttractionFormComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockAttraction },
      ],
    });

    const editFixture = TestBed.createComponent(AttractionFormComponent);
    const editComponent = editFixture.componentInstance;
    editFixture.detectChanges();

    expect(editComponent.attractionForm.get('name')?.value).toBe(
      mockAttraction.name
    );
    expect(editComponent.attractionForm.get('detail')?.value).toBe(
      mockAttraction.detail
    );
    expect(editComponent.attractionForm.get('latitude')?.value).toBe(
      mockAttraction.latitude
    );
    expect(editComponent.attractionForm.get('longitude')?.value).toBe(
      mockAttraction.longitude
    );
    expect(editComponent.attractionForm.get('coverimage')?.value).toBe(
      mockAttraction.coverimage
    );
  });

  it('should validate required fields', () => {
    const form = component.attractionForm;
    expect(form.valid).toBeFalsy();

    expect(form.get('name')?.errors?.['required']).toBeTruthy();
    expect(form.get('detail')?.errors?.['required']).toBeTruthy();
    expect(form.get('latitude')?.errors?.['required']).toBeTruthy();
    expect(form.get('longitude')?.errors?.['required']).toBeTruthy();
    expect(form.get('coverimage')?.errors?.['required']).toBeTruthy();
  });

  it('should validate latitude and longitude as numbers', () => {
    const form = component.attractionForm;

    form.get('latitude')?.setValue('invalid');
    expect(form.get('latitude')?.errors?.['number']).toBeTruthy();

    form.get('longitude')?.setValue('invalid');
    expect(form.get('longitude')?.errors?.['number']).toBeTruthy();

    form.get('latitude')?.setValue(13.7563);
    form.get('longitude')?.setValue(100.5018);
    expect(form.get('latitude')?.errors?.['number']).toBeFalsy();
    expect(form.get('longitude')?.errors?.['number']).toBeFalsy();
  });

  it('should handle file selection', () => {
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
    const event = { target: { files: [file] } };

    component.onFileSelected(event as any);
    expect(component.selectedFileName).toBe('test.jpg');
  });

  it('should close dialog when cancel is clicked', () => {
    const cancelButton = fixture.nativeElement.querySelector(
      'button[type="button"]'
    );
    cancelButton.click();

    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

  it('should submit form when valid', () => {
    spyOn(component, 'submit');
    const form = component.attractionForm;

    form.patchValue({
      name: 'Test Attraction',
      detail: 'Test Description',
      latitude: 13.7563,
      longitude: 100.5018,
      coverimage: 'test-image.jpg',
    });

    const submitButton = fixture.nativeElement.querySelector(
      'button[type="submit"]'
    );
    submitButton.click();

    expect(component.submit).toHaveBeenCalled();
  });

  it('should disable submit button when form is invalid', () => {
    const submitButton = fixture.nativeElement.querySelector(
      'button[type="submit"]'
    );
    expect(submitButton.disabled).toBeTruthy();
  });
});
