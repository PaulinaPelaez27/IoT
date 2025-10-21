import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // Ejemplo de método GET
  getData(endpoint: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${endpoint}`);
  }
  // Ejemplo de método POST
  postData(endpoint: string, data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${endpoint}`, data);
  }

  // Ejemplo de método PUT
  putData(endpoint: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${endpoint}`, data);
  }

  // Ejemplo de método DELETE
  deleteData(endpoint: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${endpoint}`);
  }
}
