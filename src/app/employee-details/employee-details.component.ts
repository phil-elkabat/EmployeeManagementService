import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router, RouterOutlet} from "@angular/router";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './employee-details.component.html',
  styleUrl: './employee-details.component.css'
})
export class EmployeeDetailsComponent implements OnInit {
  id: string;
  public employee: any = {};
  qualifications: any[];

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {
    this.id = '';
    this.qualifications = [];
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.id = id;
      this.http.get(`http://localhost:8089/employees/${this.id}`).subscribe(data => {
        this.employee = data;
      });
      this.http.get<any[]>(`http://localhost:8089/employees/${this.id}/qualifications`).subscribe(data => {
        this.qualifications = data;
      });
    } else {
      // Handle the case when id is null
    }
  }

  onEdit() {
    this.router.navigate(['/employee-edit', this.employee.id]);
  }

}
