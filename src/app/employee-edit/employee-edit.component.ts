import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {filter, Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {Qualification} from "./qualification";
import {SharedService} from "../shared-service.service";
import {NgMultiSelectDropDownModule} from "ng-multiselect-dropdown";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatChipsModule} from "@angular/material/chips";


@Component({
  selector: 'app-employee-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgMultiSelectDropDownModule, FormsModule, MatAutocompleteModule, MatChipsModule],
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

  constructor(private fb: FormBuilder, private http: HttpClient, private route: ActivatedRoute, private router: Router, private sharedService: SharedService) {
    this.qualifications$ = of([]);
    this.id = '';
  }

  dropdownSettings = {};

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.http.get<any>(`http://localhost:8089/employees/${this.id}`).subscribe(employee => {
      this.employeeForm.patchValue(employee);
      this.employee = employee; // Initialize the employee
    });
    this.qualifications$ = this.http.get<any[]>(`http://localhost:8089/qualifications`);
    this.qualifications$ = this.fetchQualifications().pipe(filter(value => value !== null));
    this.qualifications$.subscribe(qualifications => {
      qualifications.forEach(qualification => {
        this.employeeForm.addControl(qualification.id.toString(), this.fb.control(false));
      });
      this.http.get<{
        skillSet: Qualification[]
      }>(`http://localhost:8089/employees/${this.id}/qualifications`).subscribe(data => {
        if (data && data.skillSet && Array.isArray(data.skillSet)) {
          this.employeeQualifications$ = of(data.skillSet);
          data.skillSet.forEach((qualification: Qualification) => {
            if (qualification.hasOwnProperty('id') && this.employeeForm.controls[qualification['id'].toString()]) {
              this.employeeForm.controls[qualification['id'].toString()].setValue(true);
            }
          });
        } else {
          console.error('Expected an object with a skillSet array but received', data);
        }
      });
    });
    this.sharedService.qualificationDeleted$.subscribe(() => {
      this.http.get<any[]>(`http://localhost:8089/qualifications`).subscribe(qualifications => {
        this.qualifications$ = of(qualifications);
      });
    });
  }

  fetchQualifications(): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8089/qualifications`);
  }

  /*addQualification(qualificationId: string, event: any): void {
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
  }*/

  /*removeQualification(qualificationId: string, qualificationSkill: string) {
    this.http.delete(`http://localhost:8089/employees/${this.id}/qualifications/${qualificationId}`, { body: { skill: qualificationSkill } })
      .subscribe(() => {
        console.log('Qualification removed from employee');
        // Refresh the qualifications list after removal
        this.fetchQualifications();
      }, error => {
        console.error('Error removing qualification from employee', error);
      });
  }*/

  addQualification(skill: string, event: any) {
    if (event.target.checked) {
      // Add the skill to the employee's skill set
      this.employee.skillSet.push({skill: skill});

      this.http.post(`http://localhost:8089/employees/${this.id}/qualifications`, {body: {skill: skill}}).subscribe(() => {
          console.log('Qualification added to employee');
          this.fetchQualifications();
        },
        error => console.error('There was an error while adding the qualification', error)
      );
    } else {
      // Remove the skill from the employee's skill set
      this.employee.skillSet = this.employee.skillSet.filter((s: { skill: string }) => s.skill !== skill);
    }
  }

  removeQualification(skill: string) {
    // Remove the skill from the employee's skill set
    this.employee.skillSet = this.employee.skillSet.filter((s: { skill: string }) => s.skill !== skill);

    this.http.delete(`http://localhost:8089/employees/${this.id}/qualifications`, {body: {skill: skill}}).subscribe(() => {
        console.log('Qualification removed from employee');
        // Refresh the qualifications list after removal
        this.fetchQualifications();
      },
      error => console.error('Error removing qualification from employee', error));
  }

  @Output() employeeEdited = new EventEmitter<void>();

  /*onSubmit(): void {
    const employeeData = {
      ...this.employeeForm.value,
      skillSet: this.employee.skillSet.map((skill: { id: number }) => skill.id)
    };

    this.http.put(`http://localhost:8089/employees/${this.id}`, employeeData).subscribe(() => {
        console.log('Employee updated successfully');
        this.employeeEdited.emit();
        this.router.navigate(['/employee-list']);
      },
      error => console.error('There was an error while updating the employee', error)
    );
  }*/

  onSubmit(): void {
    const employeeData = {
      ...this.employeeForm.value,
      skillSet: this.employeeForm.value.skillSet.map((skill: { id: number }) => skill.id)
    };

    this.http.put(`http://localhost:8089/employees/${this.id}`, this.employeeForm.value).subscribe(() => {
        console.log('Employee updated successfully');
        this.employeeEdited.emit();
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

  displayFn(qualification: Qualification): string {
    return qualification && qualification.skill ? qualification.skill : '';
  }
}
