import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { RoutePathEnum } from '../../app/app.routes';
import { ZorroModule } from '../../zorro/zorro.module';
import { AuthService } from '@auth0/auth0-angular';

export type MenuItem = {
  tooltip: string;
  icon: string;
  link: string;
  active?: boolean;
};

@Component({
  selector: 'app-vertical-menu',
  standalone: true,
  imports: [CommonModule, ZorroModule],
  template: `
    <div class="vertical_container">
      @for (item of menuList; track $index) {
        <div
          class="menu_item"
          [class.active]="item.active"
          (click)="clickToRoute(item.link)"
          nz-tooltip
          [nzTooltipTitle]="item.tooltip"
        >
          <span nz-icon [nzType]="item.icon" nzTheme="outline"></span>
        </div>
      }
      <nz-divider></nz-divider>
      <ng-container *ngIf="auth0Service.user$ | async as user">
        <div nz-dropdown [nzDropdownMenu]="menu">
          <nz-avatar nzIcon="sp:user" nzSrc="{{ user?.picture ? user.picture : '' }}"></nz-avatar>
        </div>
        <nz-dropdown-menu #menu="nzDropdownMenu">
          <ul nz-menu>
            <li nz-menu-item>{{ user.name }}</li>
            <li nz-menu-item>{{ user.email }}</li>
            <li nz-menu-divider></li>
            <li nz-menu-item (click)="clickToSignOut()">Sign out</li>
          </ul>
        </nz-dropdown-menu>
      </ng-container>
    </div>
  `,
  styles: [
    `
      .vertical_container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 10px 3px;
      }

      .menu_item {
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        cursor: pointer;
        transition: background-color 0.3s;
        border-radius: 8px;
        &:hover {
          background-color: #1890ff;
          color: #fff;
        }
      }
      .menu_item.active {
        background-color: #1890ff;
        color: #fff;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerticalMenuComponent implements OnInit {
  private router = inject(Router);
  public auth0Service = inject(AuthService);

  menuList: MenuItem[] = [
    {
      tooltip: 'Input new words',
      link: `/home/${RoutePathEnum.Input}`,
      active: false,
      icon: 'import',
    },
    {
      tooltip: 'Spell words',
      link: `/home/${RoutePathEnum.Spelling}`,
      active: false,
      icon: 'fire',
    },
    {
      tooltip: 'Governance',
      link: `/home/${RoutePathEnum.Governance}`,
      active: false,
      icon: 'appstore-add',
    },
    {
      tooltip: 'Eggs',
      link: `/home/${RoutePathEnum.Egg}`,
      active: false,
      icon: 'sp:easter',
    },
  ];

  clickToRoute(link: string): void {
    this.router.navigate([link]);
  }

  clickToSignOut(): void {
    this.auth0Service.logout();
  }

  ngOnInit(): void {
    this.setMenuActiveByUrl(this.router.url);
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.setMenuActiveByUrl(e.urlAfterRedirects);
      }
    });
  }

  private setMenuActiveByUrl(url: string): void {
    this.menuList.forEach((item) => {
      item.active = url.includes(item.link);
    });
  }
}
