import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-qualification-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './qualification-list.component.html',
  styleUrl: './qualification-list.component.css'
})
export class QualificationListComponent implements OnInit {
  qualifications$: Observable<any[]>;
  employees: any[] = [];
  id: string;
  qualificationForm = this.fb.group({
    skill: ['', Validators.required]
  });

  constructor(private fb: FormBuilder, private http: HttpClient, private cdr: ChangeDetectorRef) {
    this.qualifications$ = of([]);
    this.id = '';
  }

  ngOnInit() {
    this.http.get<any[]>(`http://localhost:8089/qualifications`).subscribe(qualifications => {
      this.qualifications$ = of(Array.isArray(qualifications) ? qualifications : Object.values(qualifications));
    });
  }

fetchEmployeesWithQualification(qualification: any) {
  console.log('fetchEmployeesWithQualification called with qualification:', qualification);
  this.http.get<any>(`http://localhost:8089/qualifications/${qualification.id}/employees`).subscribe(response => {
    console.log('Received response:', response);
    if (response && Array.isArray(response.employees)) {
      this.employees = response.employees;
    } else {
      console.log('Employees data is not an array:', response);
      this.employees = [];
    }
    console.log('Updated employees array:', this.employees);
  });
}

  onAdd(): void {
    this.http.post('http://localhost:8089/qualifications', this.qualificationForm.value).subscribe(
      response => {
        console.log('Qualification added successfully', response);
        this.qualifications$ = this.http.get<any[]>(`http://localhost:8089/qualifications`); // Refresh the list
        this.qualificationForm.reset(); // Reset the form
      },
      error => console.error('There was an error while adding the qualification', error)
    );
  }

  onEdit(qualification: any): void {
    const updatedQualification = {...qualification, skill: prompt('Enter new skill', qualification.skill)};
    this.http.put(`http://localhost:8089/qualifications/${qualification.id}`, updatedQualification).subscribe(
      response => {
        console.log('Qualification updated successfully', response);
        this.qualifications$ = this.http.get<any[]>(`http://localhost:8089/qualifications`); // Refresh the list
      },
      error => console.error('There was an error while updating the qualification', error)
    );
  }

  onDelete(id: string): void {
    this.http.delete(`http://localhost:8089/qualifications/${id}`).subscribe(
      response => {
        console.log('Qualification deleted successfully', response);
        this.qualifications$ = this.http.get<any[]>(`http://localhost:8089/qualifications`); // Refresh the list
      },
      error => console.error('There was an error while deleting the qualification', error)
    );
  }

  onQualificationSelect(qualificationId: string): void {
    this.http.get<any[]>(`http://localhost:8089/qualifications/${qualificationId}/employees`).subscribe(employees => {
      this.employees = Array.isArray(employees) ? employees : Object.values(employees);
      this.cdr.detectChanges();
    });
  }

  protected readonly console = console;
}
