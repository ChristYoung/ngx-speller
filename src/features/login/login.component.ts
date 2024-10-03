import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { signIn } from 'aws-amplify/auth';
import { ZorroModule } from '../../zorro/zorro.module';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ZorroModule, FormsModule],
  template: `
    <nz-result nzStatus="404" nzTitle="Practicing the word you learned" nzSubTitle="Spelling & Reading">
      <div nz-result-extra>
        <button nz-button nzType="primary" (click)="isVisible = true">Login</button>
      </div>
    </nz-result>
    <nz-modal [(nzVisible)]="isVisible" nzTitle="Login Form" (nzOnCancel)="isVisible = false">
      <div class="formContainer" *nzModalContent>
        <input nz-input placeholder="email" [(ngModel)]="username" nzSize="large" />
        <nz-divider nzDashed></nz-divider>
        <input nz-input placeholder="password" [(ngModel)]="password" [type]="'password'" nzSize="large" />
      </div>
      <div *nzModalFooter>
        <button nz-button nzType="default" (click)="isVisible = false">Cancel</button>
        <button nz-button nzType="primary" [disabled]="!username || !password" (click)="submitLogin()" [nzLoading]="isConfirmLoading">Submit</button>
      </div>
    </nz-modal>
  `,
  styleUrl: './login.component.less'
})
export class LoginComponent {

  isVisible = false;
  isConfirmLoading = false;
  username = '';
  password = '';
  router = inject(Router);

  async submitLogin(): Promise<void> {
    this.isConfirmLoading = true;
    await signIn({
      username: this.username,
      password: this.password
    });
    this.isConfirmLoading = false;
    this.router.navigate(['/']);
  }
}
