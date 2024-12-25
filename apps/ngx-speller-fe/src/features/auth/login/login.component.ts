import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  template: `
    <div>
      <button type="button" (click)="onLoginClick()">Login</button>
    </div>
  `,
  styleUrl: './login.component.less',
})
export class LoginComponent {
  constructor(private auth: AuthService) {}

  onLoginClick() {
    this.auth.loginWithRedirect();
  }
}
