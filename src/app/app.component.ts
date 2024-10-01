import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Amplify } from 'aws-amplify';
import { AmplifyAuthenticatorModule, AuthenticatorService } from '@aws-amplify/ui-angular';
import outputs from '../../amplify_outputs.json';
import { deleteUser, getCurrentUser } from 'aws-amplify/auth';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, AmplifyAuthenticatorModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
})
export class AppComponent implements OnInit {

  authState: any;
  user: any;
  currentUser: any;
    
  constructor(public authenticator: AuthenticatorService) {
    Amplify.configure(outputs);
  }

  async ngOnInit(): Promise<void> {
    this.authState = this.authenticator.authStatus;
    this.user = this.authenticator.user;
    console.log('this.user',this.user);
    console.log('this.authenticator.username',this.authenticator.username)
    console.log('this.authState',this.authState);
    this.currentUser = await getCurrentUser();
    console.log('currentUser',this.currentUser);
  }
  
}
