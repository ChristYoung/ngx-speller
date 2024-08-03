import { Routes } from '@angular/router';
import { GovernanceComponent } from '../features/governance/governance.component';
import { HomeComponent } from '../features/home/home.component';
import { InputComponent } from '../features/input/input.component';
import { SpellingComponent } from '../features/spelling/spelling.component';
import { EasterEggsComponent } from '../features/esEggs/easter-eggs/easter-eggs.component';

export const RoutePathEnum = {
  Input: 'input',
  View: 'view',
  Governance: 'governance',
  WalkThrough: 'walkThrough',
  Spelling: 'spelling',
  Home: 'home',
  Layout: 'layout',
  Egg: 'egg',
};

export const routes: Routes = [
  { path: '', redirectTo: RoutePathEnum.Home, pathMatch: 'full' },
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
