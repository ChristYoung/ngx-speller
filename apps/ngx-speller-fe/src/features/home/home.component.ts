import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { PreventButtonDefaultDirective } from '../../directives/prevent-button-default.directive';
import { SidePanelFilterComponent } from '../../widgets/side-panel-filter/side-panel-filter.component';
import { SidePanelSettingsComponent } from '../../widgets/side-panel-settings/side-panel-settings.component';
import { VerticalMenuComponent } from '../../widgets/vertical-menu/vertical-menu.component';
import { ZorroModule } from '../../zorro/zorro.module';
import { VersionComponent } from '../../widgets/version/version.component';

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
          type="button"
          nz-button
          nzShape="circle"
          nzSize="large"
          class="layout_fab"
          appPreventButtonDefault
          nz-tooltip
          [nzTooltipTitle]="'Settings'"
          (click)="openSettingDrawer()"
        >
          <span nz-icon nzType="setting"></span>
        </button>

        <!-- Open Filter Drawer -->
        <button
          type="button"
          nz-button
          nzShape="circle"
          nzSize="large"
          class="layout_fab2"
          appPreventButtonDefault
          (click)="openFilterDrawer()"
        >
          <span nz-icon [nzType]="'sp:filter'" nzTheme="outline"></span>
        </button>
      </div>
      <app-version></app-version>
    </main>
  `,
  styleUrl: './home.component.less',
  imports: [
    CommonModule,
    RouterOutlet,
    ZorroModule,
    VerticalMenuComponent,
    PreventButtonDefaultDirective,
    VersionComponent,
  ],
})
export class HomeComponent {
  constructor(private drawerService: NzDrawerService) {}

  openSettingDrawer(): void {
    this.drawerService.create({
      nzTitle: 'Setting Config',
      nzContent: SidePanelSettingsComponent,
      nzWidth: '520px',
    });
  }

  openFilterDrawer(): void {
    this.drawerService.create({
      nzTitle: 'Filter Words',
      nzContent: SidePanelFilterComponent,
      nzWidth: '520px',
    });
  }
}
