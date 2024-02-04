import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Observable, of} from "rxjs";
import {HttpClient, HttpClientModule, HttpHeaders} from "@angular/common/http";
import {Employee} from "../Employee";
import {Router, RouterLink, RouterOutlet} from "@angular/router";
import {EmployeeDetailsComponent} from "../employee-details/employee-details.component";

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterLink, EmployeeDetailsComponent, RouterOutlet],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent {
  employees$: Observable<Employee[]>;

  constructor(private http: HttpClient, private router: Router) {
    this.employees$ = of([]);
    this.fetchData();
  }

  fetchData() {
    this.employees$ = this.http.get<Employee[]>('/backend', {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
    });
  }

  navigateToDetails(id: number) {
    this.router.navigate(['/employee-details', id]);
  }
}
