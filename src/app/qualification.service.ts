// qualification.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Qualification } from './qualification'; // Make sure this path is correct

@Injectable({
  providedIn: 'root'
})
export class QualificationService {
  private apiUrl = 'http://localhost:8089/qualifications';

  constructor(private http: HttpClient) { }

  getQualifications(): Observable<Qualification[]> {
    return this.http.get<Qualification[]>(this.apiUrl);
  }

  getQualification(id: number): Observable<Qualification> {
    return this.http.get<Qualification>(`${this.apiUrl}/${id}`);
  }

  createQualification(qualification: Qualification): Observable<Qualification> {
    return this.http.post<Qualification>(this.apiUrl, qualification);
  }

  updateQualification(qualification: Qualification): Observable<Qualification> {
    return this.http.put<Qualification>(`${this.apiUrl}/${qualification.id}`, qualification);
  }

  deleteQualification(id: number): Observable<void> { // Make sure you're passing id when you call this method
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
