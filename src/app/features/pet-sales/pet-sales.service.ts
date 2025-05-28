import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DailySales, WeeklySales } from '@app/core/models/pet-sales.model';

@Injectable({
  providedIn: 'root',
})
export class PetSalesService {
  private apiUrl = `${environment.apiUrl}/pets`;

  constructor(private http: HttpClient) {}

  getDailySales(date: string | Date): Observable<DailySales> {
    return this.http.get<DailySales>(`${this.apiUrl}/${date}`);
  }

  getWeeklySales(date: string | Date): Observable<WeeklySales> {
    return this.http.get<WeeklySales>(`${this.apiUrl}/7days/${date}`);
  }
}
