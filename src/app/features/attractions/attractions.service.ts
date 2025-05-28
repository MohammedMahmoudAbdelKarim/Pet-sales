import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  Attraction,
  AttractionResponse,
} from '@app/core/models/attraction.model';
import { Sort } from '@angular/material/sort';

@Injectable({
  providedIn: 'root',
})
export class AttractionsService {
  private apiUrl = `${environment.apiUrl}/attractions`;

  constructor(private http: HttpClient) {}

  getAttractions(
    page: number,
    pageSize: number,
    search?: string,
    sort?: Sort,
    filters?: { [key: string]: string }
  ): Observable<AttractionResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', pageSize.toString()); // changed from pageSize

    if (search) {
      params = params.set('search', search);
    }

    if (sort) {
      params = params
        .set('sort_column', sort.active)
        .set('sort_order', sort.direction);
    }

    return this.http.get<AttractionResponse>(this.apiUrl, { params });
  }

  getAttraction(id: number): Observable<Attraction> {
    return this.http.get<Attraction>(`${this.apiUrl}/${id}`);
  }

  createAttraction(attraction: Attraction): Observable<Attraction> {
    return this.http.post<Attraction>(`${this.apiUrl}/create`, attraction);
  }

  updateAttraction(id: number, attraction: Attraction): Observable<Attraction> {
    return this.http.put<Attraction>(`${this.apiUrl}/update`, attraction);
  }

  deleteAttraction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete`, {
      body: { id },
    });
  }
}
