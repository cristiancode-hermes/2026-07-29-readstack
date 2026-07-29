import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReadingStatus, ReadingLog, ReadingGoal, DashboardStats } from '../interfaces';

const API = 'http://localhost:3001/api';

@Injectable({ providedIn: 'root' })
export class ReadingService {
  private http = inject(HttpClient);

  // Reading Status
  getStatuses(): Observable<any> {
    return this.http.get(`${API}/reading-status`);
  }

  getStatus(bookId: number): Observable<any> {
    return this.http.get(`${API}/reading-status/${bookId}`);
  }

  createStatus(data: any): Observable<any> {
    return this.http.post(`${API}/reading-status`, data);
  }

  updateStatus(bookId: number, data: any): Observable<any> {
    return this.http.put(`${API}/reading-status/${bookId}`, data);
  }

  deleteStatus(bookId: number): Observable<any> {
    return this.http.delete(`${API}/reading-status/${bookId}`);
  }

  // Reading Log
  getLogs(bookId: number): Observable<any> {
    return this.http.get(`${API}/reading-log/${bookId}`);
  }

  createLog(data: any): Observable<any> {
    return this.http.post(`${API}/reading-log`, data);
  }

  getMonthlyStats(year: number, month: number): Observable<any> {
    return this.http.get(`${API}/reading-log/stats/monthly?year=${year}&month=${month}`);
  }

  // Reading Goal
  getGoal(year: number): Observable<any> {
    return this.http.get(`${API}/reading-goals/${year}`);
  }

  upsertGoal(data: any): Observable<any> {
    return this.http.post(`${API}/reading-goals`, data);
  }

  // Dashboard
  getDashboard(): Observable<any> {
    return this.http.get(`${API}/dashboard`);
  }
}
