import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-qualification-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './qualification-list.component.html',
  styleUrl: './qualification-list.component.css'
})
export class QualificationListComponent implements OnInit {
  qualifications$: Observable<any[]>;
  qualificationForm = this.fb.group({
    skill: ['', Validators.required]
  });

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.qualifications$ = of([]);
  }

  ngOnInit() {
    this.qualifications$ = this.http.get<any[]>(`http://localhost:8089/qualifications`);
  }

  onAdd(): void {
    this.http.post('http://localhost:8089/qualifications', this.qualificationForm.value).subscribe(
      response => {
        console.log('Qualification added successfully', response);
        this.qualifications$ = this.http.get<any[]>(`http://localhost:8089/qualifications`); // Refresh the list
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
}
