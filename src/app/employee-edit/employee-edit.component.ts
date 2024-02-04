import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-employee-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-edit.component.html',
  styleUrl: './employee-edit.component.css'
})
export class EmployeeEditComponent implements OnInit {
  employeeForm: FormGroup & { [key: string]: AbstractControl } = this.fb.group({
    lastName: ['', Validators.required],
    firstName: ['', Validators.required],
    street: ['', Validators.required],
    postcode: ['', Validators.required],
    city: ['', Validators.required],
    phone: ['', Validators.required],
    skillSet: [[]],
    newQualification: ['', Validators.required]
  }) as FormGroup & { [key: string]: AbstractControl };

  qualifications$: Observable<any[]>; // Correct type declaration
  employeeQualifications$!: Observable<any[]>;
  id: string;
  employee: any; // Declare the employee
  newQualificationId: any; // Declare the newQualificationId

  constructor(private fb: FormBuilder, private http: HttpClient, private route: ActivatedRoute, private router: Router) {
    this.qualifications$ = of([]);
    this.id = '';
  }

ngOnInit() {
  this.id = this.route.snapshot.paramMap.get('id') || '';
  this.http.get<any>(`http://localhost:8089/employees/${this.id}`).subscribe(employee => {
    this.employeeForm.patchValue(employee);
    this.employee = employee; // Initialize the employee
  });
  this.qualifications$ = this.http.get<any[]>(`http://localhost:8089/qualifications`);
  this.qualifications$.subscribe(qualifications => {
    qualifications.forEach(qualification => {
      this.employeeForm.addControl(qualification.id.toString(), this.fb.control(false));
    });
    this.http.get<any[]>(`http://localhost:8089/employees/${this.id}/qualifications`).subscribe(data => {
      if (Array.isArray(data)) {
        this.employeeQualifications$ = of(data);
        data.forEach(qualification => {
          if (this.employeeForm.controls[qualification.id.toString()]) {
            this.employeeForm.controls[qualification.id.toString()].setValue(true);
          }
        });
      } else {
        console.error('Expected an array but received', data);
      }
    });
  });
}

fetchQualifications(): void {
  this.qualifications$ = this.http.get<any[]>(`http://localhost:8089/qualifications`);
}

addQualification(qualificationId: string, event: any): void {
  if (event.target.checked) {
    this.http.post(`http://localhost:8089/employees/${this.id}/qualifications`, { id: qualificationId })
      .subscribe(
        response => {
          console.log('Qualification added to employee', response);
          this.fetchQualifications();
        },
        error => console.error('There was an error while adding the qualification', error)
      );
  } else {
    this.http.delete(`http://localhost:8089/employees/${this.id}/qualifications/${qualificationId}`)
      .subscribe(
        response => {
          console.log('Qualification removed from employee', response);
          this.fetchQualifications();
        },
        error => console.error('There was an error while removing the qualification', error)
      );
  }
}

removeQualification(qualificationId: string, qualificationSkill: string) {
  this.http.delete(`http://localhost:8089/employees/${this.id}/qualifications/${qualificationId}`, { body: { skill: qualificationSkill } })
    .subscribe(() => {
      console.log('Qualification removed from employee');
      // Refresh the qualifications list after removal
      this.fetchQualifications();
    }, error => {
      console.error('Error removing qualification from employee', error);
    });
}

  onSubmit(): void {
    this.http.put(`http://localhost:8089/employees/${this.id}`, this.employeeForm.value).subscribe(
      response => {
        console.log('Employee updated successfully', response);
        this.router.navigate(['/employee-list']);
      },
      error => console.error('There was an error while updating the employee', error)
    );
  }

  onDelete() {
    this.http.delete(`http://localhost:8089/employees/${this.id}`).subscribe(
      response => {
        console.log('Employee deleted successfully', response);
        this.router.navigate(['/employee-list']);
      },
      error => console.error('There was an error while deleting the employee', error)
    );
  }

  displayFn(qualification: any): string {
    return qualification && qualification.skill ? qualification.skill : '';
  }
}
