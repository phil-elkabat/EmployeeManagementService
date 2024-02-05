import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private qualificationDeletedSource = new Subject<void>();

  qualificationDeleted$ = this.qualificationDeletedSource.asObservable();

  qualificationDeleted() {
    this.qualificationDeletedSource.next();
  }
}
