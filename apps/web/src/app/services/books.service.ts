import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API = 'http://localhost:3001/api';

@Injectable({ providedIn: 'root' })
export class BooksService {
  private http = inject(HttpClient);

  findAll(search?: string): Observable<any> {
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    return this.http.get(`${API}/books${params}`);
  }

  findOne(id: number): Observable<any> {
    return this.http.get(`${API}/books/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(`${API}/books`, data);
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put(`${API}/books/${id}`, data);
  }

  remove(id: number): Observable<any> {
    return this.http.delete(`${API}/books/${id}`);
  }
}
