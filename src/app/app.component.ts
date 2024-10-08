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

  constructor(public authenticator: AuthenticatorService) {
    Amplify.configure(outputs);
    // Amplify.configure({
    //   Auth: {
    //     Cognito: {
    //       userPoolId: "eu-north-1_ymMp0Epie",
    //       userPoolClientId: "22mbh4g7sigd1fkg76l96em3ti",
    //       identityPoolId: "eu-north-1:16b5fb3f-aa4e-473e-ae8e-b185c3844ac4",
    //       loginWith: {
    //         email: true,
    //       },
    //       signUpVerificationMethod: "code",
    //       userAttributes: {
    //         email: {
    //           required: true,
    //         },
    //       },
    //       allowGuestAccess: true,
    //       passwordFormat: {
    //         minLength: 8,
    //         requireLowercase: true,
    //         requireUppercase: true,
    //         requireNumbers: true,
    //         requireSpecialCharacters: true,
    //       },
    //     },
    //   },
    // });
  }
}
