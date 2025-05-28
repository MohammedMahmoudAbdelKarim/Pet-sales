import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-popup-confirm',
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './popup-confirm.component.html',
  styleUrl: './popup-confirm.component.scss',
})
export class PopupConfirmComponent {
  constructor(
    private dialogRef: MatDialogRef<PopupConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title?: string; message?: string }
  ) {}

  onConfirm() {
    this.dialogRef.close(true); // confirmed
  }

  onCancel() {
    this.dialogRef.close(false); // cancelled
  }
}
