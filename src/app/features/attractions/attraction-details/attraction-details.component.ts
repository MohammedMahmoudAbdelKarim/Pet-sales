import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Attraction } from '@app/core/models/attraction.model';

@Component({
  selector: 'app-attraction-details',
  imports: [CommonModule, MatButtonModule],
  templateUrl: './attraction-details.component.html',
  styleUrl: './attraction-details.component.scss',
})
export class AttractionDetailsComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Attraction,
    private dialogRef: MatDialogRef<AttractionDetailsComponent>
  ) {}

  close() {
    this.dialogRef.close();
  }
}
