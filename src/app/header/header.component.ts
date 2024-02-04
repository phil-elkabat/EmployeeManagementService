import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterLink} from "@angular/router";
import {KeycloakService} from "keycloak-angular";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private keycloakService: KeycloakService, private router: Router) {}

  login() {
    this.keycloakService.login();
  }

  logout() {
    this.keycloakService.logout().then(() => {
      this.router.navigate(['/employee-list']);
    });
  }
}
