import { Component, Inject } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '@app/core/models/user.model';
import { UserFormComponent } from '@app/features/users/user-form/user-form.component';
import { UserService } from '@app/features/users/user.service';
import { ToastrService } from 'ngx-toastr';
import { AttractionService } from '../attraction.service';
import { Attraction } from '@app/core/models/attraction.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-attraction-form',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './attraction-form.component.html',
  styleUrl: './attraction-form.component.scss',
})
export class AttractionFormComponent {
  attractionForm: FormGroup;
  selectedFileName: string | null = null;
  isEditMode = false;
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserFormComponent>,
    private attractionService: AttractionService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: Attraction
  ) {
    this.attractionForm = this.fb.group({
      id: [this.data?.id || null],
      name: [this.data?.name || '', Validators.required],
      detail: [this.data?.detail || '', Validators.required],
      coverimage: [this.data?.coverimage || '', Validators.required],
      latitude: [
        this.data?.latitude || null,
        [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)],
      ],
      longitude: [
        this.data?.longitude || null,
        [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)],
      ],
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.isEditMode = true;
      this.attractionService.getAttraction(this.data.id).subscribe({
        next: (user: any) => {
          this.attractionForm.patchValue(user.user);
          this.attractionForm.get('password')?.clearValidators();
          this.attractionForm.get('password')?.updateValueAndValidity();
        },
        error: () => {
          this.toastr.error('Failed to load attraction data');
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
        this.attractionForm.get('coverimage')?.setValue(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  submit() {
    if (this.attractionForm.invalid) {
      this.attractionForm.markAllAsTouched();
      return;
    }
    const formValue = this.attractionForm.value;
    if (this.isEditMode && this.data?.id) {
      const updatePayload = { id: this.data.id, ...formValue };

      this.attractionService
        .updateAttraction(this.data.id, updatePayload)
        .subscribe({
          next: () => {
            this.toastr.success('Attraction updated successfully');
            this.dialogRef.close(true);
          },
          error: () => {
            this.toastr.error('Failed to update attraction');
          },
        });
    } else {
      // Call create API
      this.attractionService.createAttraction(formValue).subscribe({
        next: () => {
          this.toastr.success('Attraction created successfully');
          this.dialogRef.close(true);
        },
        error: () => {
          this.toastr.error('Failed to create attraction');
        },
      });
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
