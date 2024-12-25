import { Routes } from '@angular/router';

import { EasterEggsComponent } from '../features/esEggs/easter-eggs/easter-eggs.component';
import { GovernanceComponent } from '../features/governance/governance.component';
import { HomeComponent } from '../features/home/home.component';
import { InputComponent } from '../features/input/input.component';
import { SpellingComponent } from '../features/spelling/spelling.component';
import { AuthComponent } from '../features/auth/auth.component';
import { LoginComponent } from '../features/auth/login/login.component';

export const RoutePathEnum = {
  Input: 'input',
  View: 'view',
  Governance: 'governance',
  WalkThrough: 'walkThrough',
  Spelling: 'spelling',
  Home: 'home',
  Layout: 'layout',
  Auth: 'auth',
  Egg: 'egg',
};

export const routes: Routes = [
  { path: '', redirectTo: RoutePathEnum.Home, pathMatch: 'full' },
  {
    path: RoutePathEnum.Auth,
    component: AuthComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
    ],
  },
  {
    path: RoutePathEnum.Home,
    component: HomeComponent,
    children: [
      { path: '', redirectTo: RoutePathEnum.Governance, pathMatch: 'full' },
      {
        path: RoutePathEnum.Input,
        component: InputComponent,
      },
      {
        path: RoutePathEnum.Governance,
        component: GovernanceComponent,
      },
      {
        path: RoutePathEnum.Spelling,
        component: SpellingComponent,
      },
      {
        path: RoutePathEnum.Egg,
        component: EasterEggsComponent,
      },
    ],
  },
];
