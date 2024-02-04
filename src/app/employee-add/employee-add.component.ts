import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-employee-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-add.component.html',
  styleUrl: './employee-add.component.css'
})
export class AddEmployeeComponent implements OnInit {
  employeeForm = this.fb.group({
    lastName: ['', Validators.required],
    firstName: ['', Validators.required],
    street: ['', Validators.required],
    postcode: ['', Validators.required],
    city: ['', Validators.required],
    phone: ['', Validators.required],
    skillSet: [[], Validators.required]
  });

  qualifications$: Observable<any[]>;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.qualifications$ = of([]);
  }

  ngOnInit() {
    //const id = 'your-employee-id'; // Replace with your employee id
    this.qualifications$ = this.http.get<any[]>(`http://localhost:8089/qualifications`);
  }

  onSubmit(): void {
    this.http.post('http://localhost:8089/employees', this.employeeForm.value).subscribe(
      response => {
        console.log('Employee added successfully', response);
        this.router.navigate(['/employee-list']);
      },
      error => console.error('There was an error while adding the employee', error)
    );
  }
}
