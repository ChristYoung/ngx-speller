import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Amplify } from 'aws-amplify';
import { AmplifyAuthenticatorModule, AuthenticatorService } from '@aws-amplify/ui-angular';
import outputs from '../../amplify_outputs.json';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, AmplifyAuthenticatorModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
})
export class AppComponent {

  authState: any;
    
  constructor(public authenticator: AuthenticatorService) {
    Amplify.configure(outputs);
    this.authState = this.authenticator.authStatus;
    console.log('this.authState',this.authState)
  }
}
