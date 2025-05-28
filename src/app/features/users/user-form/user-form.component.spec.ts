import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserFormComponent } from './user-form.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { User } from '@app/core/models/user.model';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<UserFormComponent>>;

  const mockUser: User = {
    id: 1,
    fname: 'John',
    lname: 'Doe',
    username: 'johndoe',
    email: 'john@example.com',
    avatar: 'avatar1.jpg',
  };

  beforeEach(async () => {
    const dialogSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        UserFormComponent,
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
      MatDialogRef<UserFormComponent>
    >;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values for new user', () => {
    expect(component.userForm.get('fname')?.value).toBe('');
    expect(component.userForm.get('lname')?.value).toBe('');
    expect(component.userForm.get('email')?.value).toBe('');
    expect(component.userForm.get('username')?.value).toBe('');
    expect(component.userForm.get('password')?.value).toBe('');
    expect(component.userForm.get('avatar')?.value).toBe('');
  });

  it('should initialize form with user values when editing', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [
        UserFormComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockUser },
      ],
    });

    const editFixture = TestBed.createComponent(UserFormComponent);
    const editComponent = editFixture.componentInstance;
    editFixture.detectChanges();

    expect(editComponent.userForm.get('fname')?.value).toBe(mockUser.fname);
    expect(editComponent.userForm.get('lname')?.value).toBe(mockUser.lname);
    expect(editComponent.userForm.get('email')?.value).toBe(mockUser.email);
    expect(editComponent.userForm.get('username')?.value).toBe(
      mockUser.username
    );
    expect(editComponent.userForm.get('avatar')?.value).toBe(mockUser.avatar);
  });

  it('should validate required fields', () => {
    const form = component.userForm;
    expect(form.valid).toBeFalsy();

    expect(form.get('fname')?.errors?.['required']).toBeTruthy();
    expect(form.get('lname')?.errors?.['required']).toBeTruthy();
    expect(form.get('email')?.errors?.['required']).toBeTruthy();
    expect(form.get('username')?.errors?.['required']).toBeTruthy();
    expect(form.get('password')?.errors?.['required']).toBeTruthy();
    expect(form.get('avatar')?.errors?.['required']).toBeTruthy();
  });

  it('should validate email format', () => {
    const emailControl = component.userForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.errors?.['email']).toBeTruthy();

    emailControl?.setValue('valid@email.com');
    expect(emailControl?.errors?.['email']).toBeFalsy();
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
    const form = component.userForm;

    form.patchValue({
      fname: 'John',
      lname: 'Doe',
      email: 'john@example.com',
      username: 'johndoe',
      password: 'password123',
      avatar: 'avatar.jpg',
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
