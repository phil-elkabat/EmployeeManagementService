import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {EmployeeListComponent} from "./employee-list/employee-list.component";
import {KeycloakService} from "keycloak-angular";
import {EmployeeDetailsComponent} from "./employee-details/employee-details.component";
import {HttpClientModule} from "@angular/common/http";
import {AddEmployeeComponent} from "./employee-add/employee-add.component";
import {AppRoutingModule} from "./app.routes";
import {HeaderComponent} from "./header/header.component";
import {FooterComponent} from "./footer/footer.component";
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, EmployeeListComponent, EmployeeDetailsComponent, RouterOutlet, HttpClientModule, AddEmployeeComponent, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Employee Management Service';

  constructor(private keycloakService: KeycloakService) {
  }

  ngOnInit() {
    if (!this.keycloakService.isLoggedIn()) {
      this.keycloakService.login();
    }
  }
}
