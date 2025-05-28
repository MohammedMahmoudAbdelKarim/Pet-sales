import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

export interface FormField {
  key: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'select' | 'date' | 'textarea';
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: string;
  options?: { value: any; label: string }[];
  placeholder?: string;
}

@Component({
  selector: 'app-generic-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form-container">
      <ng-container *ngFor="let field of fields">
        <mat-form-field appearance="outline" class="form-field">
          <mat-label>{{ field.label }}</mat-label>

          <ng-container [ngSwitch]="field.type">
            <!-- Text Input -->
            <input
              *ngSwitchCase="'text'"
              matInput
              [formControlName]="field.key"
              [placeholder]="field.placeholder || ''"
            />

            <!-- Email Input -->
            <input
              *ngSwitchCase="'email'"
              matInput
              type="email"
              [formControlName]="field.key"
              [placeholder]="field.placeholder || ''"
            />

            <!-- Number Input -->
            <input
              *ngSwitchCase="'number'"
              matInput
              type="number"
              [formControlName]="field.key"
              [placeholder]="field.placeholder || ''"
            />

            <!-- Select Input -->
            <mat-select
              *ngSwitchCase="'select'"
              [formControlName]="field.key"
              [placeholder]="field.placeholder || ''"
            >
              <mat-option
                *ngFor="let option of field.options || []"
                [value]="option.value"
              >
                {{ option.label }}
              </mat-option>
            </mat-select>

            <!-- Date Input -->
            <input
              *ngSwitchCase="'date'"
              matInput
              [matDatepicker]="picker"
              [formControlName]="field.key"
              [placeholder]="field.placeholder || ''"
            />
            <mat-datepicker-toggle
              matSuffix
              [for]="picker"
            ></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>

            <!-- Textarea Input -->
            <textarea
              *ngSwitchCase="'textarea'"
              matInput
              [formControlName]="field.key"
              [placeholder]="field.placeholder || ''"
              rows="4"
            ></textarea>
          </ng-container>

          <!-- Error Messages -->
          <mat-error *ngIf="form.get(field.key)?.hasError('required')">
            {{ field.label }} is required
          </mat-error>
          <mat-error *ngIf="form.get(field.key)?.hasError('email')">
            Please enter a valid email address
          </mat-error>
          <mat-error *ngIf="form.get(field.key)?.hasError('min')">
            {{ field.label }} must be at least {{ field.min }}
          </mat-error>
          <mat-error *ngIf="form.get(field.key)?.hasError('max')">
            {{ field.label }} must be at most {{ field.max }}
          </mat-error>
          <mat-error *ngIf="form.get(field.key)?.hasError('pattern')">
            Please enter a valid {{ field.label.toLowerCase() }}
          </mat-error>
        </mat-form-field>
      </ng-container>

      <div class="form-actions">
        <button
          mat-raised-button
          color="primary"
          type="submit"
          [disabled]="!form.valid"
        >
          {{ submitLabel }}
        </button>
        <button mat-button type="button" (click)="onCancel()">Cancel</button>
      </div>
    </form>
  `,
  styles: [
    `
      .form-container {
        display: flex;
        flex-direction: column;
        padding: 20px;
      }
      .form-field {
        width: 100%;
        margin-bottom: 16px;
      }
      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        margin-top: 16px;
      }
    `,
  ],
})
export class GenericFormComponent {
  @Input() fields: FormField[] = [];
  @Input() initialData: any = {};
  @Input() submitLabel: string = 'Submit';

  @Output() submit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({});
  }

  ngOnInit() {
    const group: { [key: string]: any } = {};

    this.fields.forEach((field) => {
      const validators = [];

      if (field.required) {
        validators.push(Validators.required);
      }

      if (field.type === 'email') {
        validators.push(Validators.email);
      }

      if (field.min !== undefined) {
        validators.push(Validators.min(field.min));
      }

      if (field.max !== undefined) {
        validators.push(Validators.max(field.max));
      }

      if (field.pattern) {
        validators.push(Validators.pattern(field.pattern));
      }

      group[field.key] = [this.initialData[field.key] || '', validators];
    });

    this.form = this.fb.group(group);
  }

  onSubmit() {
    if (this.form.valid) {
      this.submit.emit(this.form.value);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
