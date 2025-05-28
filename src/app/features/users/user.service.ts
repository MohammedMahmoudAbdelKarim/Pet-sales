import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '@app/core/models/user.model';
import { environment } from '../../../environments/environment';
import { Sort } from '@angular/material/sort';

interface UserResponse {
  data: User[];
  total: number;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getUsers(
    page: number,
    pageSize: number,
    search?: string,
    sort?: Sort,
    filters?: { [key: string]: string }
  ): Observable<UserResponse> {
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

    return this.http.get<UserResponse>(this.apiUrl, { params });
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/create`, user);
  }

  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/update`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete`, {
      body: { id },
    });
  }
}
