import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Attraction } from '@app/core/models/attraction.model';
import { environment } from '../../../environments/environment';
import { Sort } from '@angular/material/sort';

export interface AttractionResponse {
  data: Attraction[];
  total: number;
}

@Injectable({
  providedIn: 'root',
})
export class AttractionService {
  private apiUrl = `${environment.apiUrl}/attractions`;
  private JWTapiUrl = `${environment.apiUrl}/auth/attractions`;

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
      .set('per_page', pageSize.toString());

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
    return this.http.post<Attraction>(`${this.JWTapiUrl}/create`, attraction);
  }

  updateAttraction(id: number, attraction: Attraction): Observable<Attraction> {
    return this.http.put<Attraction>(`${this.JWTapiUrl}/update`, attraction);
  }

  deleteAttraction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete`, {
      body: { id },
    });
  }
}
