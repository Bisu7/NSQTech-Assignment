import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Loader } from './loader';
import { finalize, retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Api {
  private baseUrl = 'https://nsqtech-assignment.onrender.com/api';

  constructor(private http: HttpClient, private loader: Loader) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Get records with loader and async delay simulation
  getRecords(): Observable<any> {
    this.loader.show();
    // Simulate a 1500ms delay as requested
    return this.http.get<any>(`${this.baseUrl}/records?delay=1500`, { headers: this.getHeaders() })
      .pipe(
        retry(2), // Automatically retry failed requests twice
        catchError(err => {
          console.error('API Error:', err);
          return throwError(() => err);
        }),
        finalize(() => this.loader.hide()) // Ensures loader hides on success or error
      );
  }
  // Admin: Create record
  createRecord(recordData: any): Observable<any> {
    this.loader.show();
    return this.http.post<any>(`${this.baseUrl}/records?delay=1000`, recordData, { headers: this.getHeaders() })
      .pipe(
        retry(2),
        catchError(err => {
          console.error('API Error:', err);
          return throwError(() => err);
        }),
        finalize(() => this.loader.hide())
      );
  }

  // Admin: Update record
  updateRecord(id: string, recordData: any): Observable<any> {
    this.loader.show();
    return this.http.put<any>(`${this.baseUrl}/records/${id}?delay=1000`, recordData, { headers: this.getHeaders() })
      .pipe(
        retry(2),
        catchError(err => {
          console.error('API Error:', err);
          return throwError(() => err);
        }),
        finalize(() => this.loader.hide())
      );
  }

  // Admin: Delete record
  deleteRecord(id: string): Observable<any> {
    this.loader.show();
    return this.http.delete<any>(`${this.baseUrl}/records/${id}?delay=1000`, { headers: this.getHeaders() })
      .pipe(
        retry(2),
        catchError(err => {
          console.error('API Error:', err);
          return throwError(() => err);
        }),
        finalize(() => this.loader.hide())
      );
  }

  // Admin: Get all users
  getUsers(): Observable<any> {
    this.loader.show();
    return this.http.get<any>(`${this.baseUrl}/admin/users?delay=1000`, { headers: this.getHeaders() })
      .pipe(
        retry(2),
        catchError(err => {
          console.error('API Error:', err);
          return throwError(() => err);
        }),
        finalize(() => this.loader.hide())
      );
  }

  // Admin: Create user
  createUser(userData: any): Observable<any> {
    this.loader.show();
    return this.http.post<any>(`${this.baseUrl}/admin/users?delay=1000`, userData, { headers: this.getHeaders() })
      .pipe(finalize(() => this.loader.hide()));
  }

  // Admin: Update user
  updateUser(id: string, userData: any): Observable<any> {
    this.loader.show();
    return this.http.put<any>(`${this.baseUrl}/admin/users/${id}?delay=1000`, userData, { headers: this.getHeaders() })
      .pipe(finalize(() => this.loader.hide()));
  }

  // Admin: Delete user
  deleteUser(id: string): Observable<any> {
    this.loader.show();
    return this.http.delete<any>(`${this.baseUrl}/admin/users/${id}?delay=1000`, { headers: this.getHeaders() })
      .pipe(finalize(() => this.loader.hide()));
  }
}
