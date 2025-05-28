import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserDetailsComponent } from './user-details.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '@app/core/models/user.model';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('UserDetailsComponent', () => {
  let component: UserDetailsComponent;
  let fixture: ComponentFixture<UserDetailsComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<UserDetailsComponent>>;

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
      imports: [UserDetailsComponent, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockUser },
      ],
    }).compileComponents();

    dialogRefSpy = TestBed.inject(MatDialogRef) as jasmine.SpyObj<
      MatDialogRef<UserDetailsComponent>
    >;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display user details correctly', () => {
    const compiled = fixture.nativeElement;

    expect(compiled.querySelector('h2').textContent).toContain('User Details');
    expect(compiled.textContent).toContain(mockUser.fname);
    expect(compiled.textContent).toContain(mockUser.lname);
    expect(compiled.textContent).toContain(mockUser.email);
    expect(compiled.textContent).toContain(mockUser.username);

    const avatarImg = compiled.querySelector('img');
    expect(avatarImg).toBeTruthy();
    expect(avatarImg.src).toContain(mockUser.avatar);
  });

  it('should close dialog when close button is clicked', () => {
    const closeButton = fixture.nativeElement.querySelector('button');
    closeButton.click();

    expect(dialogRefSpy.close).toHaveBeenCalled();
  });
});
