import { CommonModule, ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { SidePanelSettingsComponent } from '../../widgets/side-panel-settings/side-panel-settings.component';
import { VerticalMenuComponent } from '../../widgets/vertical-menu/vertical-menu.component';
import { ZorroModule } from '../../zorro/zorro.module';
import { SidePanelFilterComponent } from '../../widgets/side-panel-filter/side-panel-filter.component';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <main class="main">
      <div class="vertical_menu_wrapper">
        <app-vertical-menu></app-vertical-menu>
      </div>
      <div class="layout">
        <router-outlet></router-outlet>
        <!-- Open Setting Drawer -->
        <button
          nz-button
          nzShape="circle"
          nzSize="large"
          class="layout_fab"
          (click)="openSettingDrawer()"
        >
          <span nz-icon nzType="setting"></span>
        </button>

        <!-- Open Filter Drawer -->
        <button
          nz-button
          nzShape="circle"
          nzSize="large"
          class="layout_fab2"
          (click)="openFilterDrawer()"
        >
          <span nz-icon nzType="filter" nzTheme="outline"></span>
        </button>
        <!-- <button
          nz-button
          nzShape="circle"
          nzSize="large"
          class="layout_fab3"
          (click)="scrollToPosition('TOP')"
        >
          <span nz-icon nzType="vertical-align-top" nzTheme="outline"></span>
        </button>
        <button
          nz-button
          nzShape="circle"
          nzSize="large"
          class="layout_fab4"
          (click)="scrollToPosition('BOTTOM')"
        >
          <span nz-icon nzType="vertical-align-bottom" nzTheme="outline"></span>
        </button> -->
      </div>
    </main>
  `,
  styleUrl: './home.component.less',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    SidePanelSettingsComponent,
    ZorroModule,
    VerticalMenuComponent,
  ],
})
export class HomeComponent {
  constructor(
    private drawerService: NzDrawerService,
  ) {}

  openSettingDrawer(): void {
    const _drawerRef = this.drawerService.create({
      nzTitle: 'Setting Config',
      nzContent: SidePanelSettingsComponent,
      nzWidth: '520px',
    });
  }

  openFilterDrawer(): void {
    const _drawerRef = this.drawerService.create({
      nzTitle: 'Filter Words',
      nzContent: SidePanelFilterComponent,
      nzWidth: '520px',
    });
  }

  // TODO: scroll to position doesn't work, need to do some research on it.
  scrollToPosition(direction: 'TOP' | 'BOTTOM'): void {
    const height = document.body.scrollHeight;
    console.log('height',height)
    if (direction === 'TOP') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth',
      });
    }
  }
}
