import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { RoutePathEnum } from '../../app/app.routes';
import { ZorroModule } from '../../zorro/zorro.module';

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
