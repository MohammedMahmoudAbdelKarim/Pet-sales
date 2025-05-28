import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../user.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '@app/core/models/user.model';

@Component({
  selector: 'app-user-form',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserFormComponent {
  userForm: FormGroup;
  selectedFileName: string | null = null;
  isEditMode = false;
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserFormComponent>,
    private userService: UserService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) {
    this.userForm = this.fb.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      avatar: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.isEditMode = true;
      this.userService.getUser(this.data.id).subscribe({
        next: (user: any) => {
          this.userForm.patchValue(user.user);
          this.userForm.get('password')?.clearValidators();
          this.userForm.get('password')?.updateValueAndValidity();
        },
        error: () => {
          this.toastr.error('Failed to load user data');
        },
      });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.selectedFileName = file.name;

      const reader = new FileReader();
      reader.onload = () => {
        this.userForm.get('avatar')?.setValue(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  submit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    const formValue = this.userForm.value;
    if (this.isEditMode && this.data?.id) {
      const updatePayload = { id: this.data.id, ...formValue };

      this.userService.updateUser(this.data.id, updatePayload).subscribe({
        next: () => {
          this.toastr.success('User updated successfully');
          this.dialogRef.close(true);
        },
        error: () => {
          this.toastr.error('Failed to update user');
        },
      });
    } else {
      // Call create API
      this.userService.createUser(formValue).subscribe({
        next: () => {
          this.toastr.success('User created successfully');
          this.dialogRef.close(true);
        },
        error: () => {
          this.toastr.error('Failed to create user');
        },
      });
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
