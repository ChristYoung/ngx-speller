import { FiltersConfig } from './../../types/settings.type';
import { Component, inject, OnInit } from '@angular/core';
import { ZorroModule } from '../../zorro/zorro.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToFixedPipe } from '../../pipes/to-fixed.pipe';
import { FamiliarType, Settings } from '../../types';
import { Store } from '@ngrx/store';
import { DbService } from '../../services/DataBase/db.service';
import { map, switchMap, take, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { updateCurrentIndex } from '../../store/words/words.actions';
import { setFiltersConfig } from '../../store/settings/settings.actions';

@Component({
  selector: 'app-side-panel-filter',
  standalone: true,
  imports: [ZorroModule, FormsModule, CommonModule, ToFixedPipe],
  template: `
    <div class="side_panel_settings_container">
      <div class="content">
        <div class="filters_setting">
          <div class="form_control_container">
            <div class="form_control_container pd_l">
              <span class="label_span">random order:</span>
              <nz-switch nzSize="small" [(ngModel)]="randomOrder"></nz-switch>
            </div>
            <nz-radio-group [(ngModel)]="familiarType">
              <label nz-radio nzValue="ALL">All</label>
              <label nz-radio nzValue="FAMILIAR">Familiar</label>
              <label nz-radio nzValue="UNFAMILIAR">Unfamiliar</label>
            </nz-radio-group>
          </div>
          <div class="form_control_container pd_l slider_padding_0">
            <p>
              pick the words whose right rate was less than:
              {{ lessThanRate * 100 | toFixed : 2 }}%
            </p>
            <nz-slider
              [nzMax]="1"
              [nzMin]="0"
              [nzStep]="0.01"
              [(ngModel)]="lessThanRate"
            ></nz-slider>
          </div>
          <div
            class="form_control_container pd_l slider_padding_0 slider_padding_t20"
          >
            <p>
              pick the words from {{ pickRange[0] }} to
              {{
                pickRange[1] <= (allWordsCount$ | async)
                  ? pickRange[1]
                  : (allWordsCount$ | async)
              }}:
            </p>
            <nz-slider
              nzRange
              [nzMin]="0"
              [nzMax]="allWordsCount$ | async"
              [nzStep]="1"
              [(ngModel)]="pickRange"
            ></nz-slider>
          </div>
        </div>
      </div>
      <div class="operator_area">
        <nz-space>
          <button
            *nzSpaceItem
            nz-button
            nzType="primary"
            (click)="onApplyClicked()"
          >
            Apply
          </button>
          <button *nzSpaceItem nz-button (click)="onResetClicked()">
            Reset
          </button>
          <button *nzSpaceItem nz-button (click)="onSaveDataBaseClicked()">
            Save in DataBase
          </button>
        </nz-space>
      </div>
    </div>
  `,
  styleUrl: './side-panel-filter.component.less',
})
export class SidePanelFilterComponent implements OnInit {
  randomOrder: boolean = false;
  pickRange: number[] = [0, 9999]; // pick out these words whose right count is in the `pickRange`.
  lessThanRate: number = 1; // pick out these words whose right count is less than the `lessThanRate`.
  familiarType?: FamiliarType = 'ALL';

  db = inject(DbService);
  store = inject(Store);
  settings$ = this.store.select('settings');
  allWordsCount$ = this.db.getAllWordsCountFromIndexDB();
  private nzDrawerRef = inject(NzDrawerRef<void>);

  ngOnInit(): void {
    this.settings$
      .pipe(
        withLatestFrom(this.allWordsCount$),
        map(([settings, allWordsCount]) => ({ settings, allWordsCount })),
        take(1)
      )
      .subscribe(({ settings, allWordsCount }) => {
        const { filters } = settings;
        if (filters) {
          this.randomOrder = filters.randomOrder;
          this.pickRange = filters.pickRange;
          this.lessThanRate = filters.lessThanRate;
          this.familiarType = filters.familiarType;
        } else {
          this.pickRange = [1, allWordsCount];
        }
      });
  }

  onApplyClicked(): FiltersConfig {
    const { randomOrder, pickRange, lessThanRate, familiarType } = this;
    this.store.dispatch(
      setFiltersConfig({
        filters: {
          randomOrder,
          pickRange,
          lessThanRate,
          familiarType,
        } as FiltersConfig,
      })
    );
    this.store.dispatch(updateCurrentIndex({ index: 0 }));
    this.nzDrawerRef.close();
    return {
      randomOrder,
      pickRange,
      lessThanRate,
      familiarType,
    } as FiltersConfig;
  }

  onResetClicked(): void {}

  onSaveDataBaseClicked(): void {
    const filterConfigs = this.onApplyClicked();
    this.db.updateFiltersConfigsToIndexDB(filterConfigs).subscribe(() => {});
  }
}
