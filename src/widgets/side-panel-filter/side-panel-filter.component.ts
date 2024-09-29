import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { combineLatestWith, map, take } from 'rxjs/operators';
import { DEFAULT_FILTER_LESS_THAN } from '../../core/constant';
import { ToFixedPipe } from '../../pipes/to-fixed.pipe';
import { DbService } from '../../services/DataBase/db.service';
import { setFiltersConfig } from '../../store/settings/settings.actions';
import { updateCurrentIndex } from '../../store/words/words.actions';
import { ZorroModule } from '../../zorro/zorro.module';
import { FiltersConfig, PronounceableType } from './../../types/settings.type';

@Component({
  selector: 'app-side-panel-filter',
  standalone: true,
  imports: [ZorroModule, FormsModule, CommonModule, ToFixedPipe, NgxSliderModule],
  template: `
    <div class="side_panel_settings_container">
      <div class="content">
        <div class="filters_setting">
          <div class="form_control_container">
            <div class="form_control_container pd_l">
              <span class="label_span">random order:</span>
              <nz-switch nzSize="small" [(ngModel)]="randomOrder"></nz-switch>
            </div>
            <nz-radio-group [(ngModel)]="pronounceableType">
              <label nz-radio nzValue="ALL">All</label>
              <label nz-radio nzValue="PRONOUNCED">Pronounced</label>
              <label nz-radio nzValue="UNPRONOUNCED">Unpronounced</label>
            </nz-radio-group>
          </div>
          <div class="form_control_container pd_l slider_padding_0">
            <p>
              pick the words whose spell count were less than:
              {{ lessThanCount }}
            </p>
            <nz-input-number [(ngModel)]="lessThanCount" [nzMin]="0" [nzMax]="maxLessThanCount"></nz-input-number>
          </div>
          <div class="form_control_container pd_l slider_padding_0 custom-slider">
            <p>
              pick the words whose right rate were less than:
              {{ lessThanRate * 100 | toFixed : 2 }}%
            </p>
            <ngx-slider [(value)]="lessThanRate" [options]="{
              floor: 0,
              ceil: 1,
              step: 0.01,
              animate: false,
            }"></ngx-slider>
          </div>
          <div
            class="form_control_container pd_l slider_padding_0 slider_padding_t20 custom-slider"
          >
            <p>
              pick the words from {{ minRange }} to
              {{
                maxRange <= (allWordsCount$ | async)
                  ? maxRange
                  : (allWordsCount$ | async)
              }}:
            </p>
            <ngx-slider [(value)]="minRange" [(highValue)]="maxRange" [options]="{
              floor: 0,
              ceil: (allWordsCount$ | async) ?? 9999,
              step: 1,
              animate: false,
            }"></ngx-slider>
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
  minRange: number = 0;
  maxRange: number = 9999;
  lessThanRate: number = 1; // pick out these words whose right count is less than the `lessThanRate`.
  lessThanCount: number = 1; // pick out these words whose right count is less than the `lessThanCount`.
  maxLessThanCount: number = DEFAULT_FILTER_LESS_THAN;
  pronounceableType?: PronounceableType = 'ALL';

  db = inject(DbService);
  store = inject(Store);
  settings$ = this.store.select('settings');
  allWordsCount$ = this.db.getAllWordsCountFromIndexDB();
  private nzDrawerRef = inject(NzDrawerRef<void>);

  ngOnInit(): void {
    this.settings$
      .pipe(
        combineLatestWith(this.allWordsCount$),
        map(([settings, allWordsCount]) => ({ settings, allWordsCount })),
        take(1)
      )
      .subscribe(({ settings, allWordsCount }) => {
        const { filters } = settings;
        if (filters) {
          this.randomOrder = filters.randomOrder;
          this.minRange = filters.pickRange[0];
          this.maxRange = filters.pickRange[1];
          this.lessThanRate = filters.lessThanRate;
          this.lessThanCount =
            filters.lessThanCount || DEFAULT_FILTER_LESS_THAN;
          this.pronounceableType = filters.pronounceableType;
        } else {
          this.minRange = 1;
          this.maxRange = allWordsCount;
        }
      });
  }

  onApplyClicked(): FiltersConfig {
    const {
      randomOrder,
      lessThanRate,
      pronounceableType,
      lessThanCount,
      minRange,
      maxRange,
    } = this;
    this.store.dispatch(
      setFiltersConfig({
        filters: {
          randomOrder,
          pickRange: [minRange, maxRange] as [number, number],
          lessThanRate,
          pronounceableType,
          lessThanCount,
        } as FiltersConfig,
      })
    );
    this.store.dispatch(updateCurrentIndex({ index: 0 }));
    this.nzDrawerRef.close();
    return {
      randomOrder,
      pickRange: [minRange, maxRange],
      lessThanRate,
      pronounceableType,
      lessThanCount,
    } as FiltersConfig;
  }

  onResetClicked(): void {}

  onSaveDataBaseClicked(): void {
    const filterConfigs = this.onApplyClicked();
    this.db.updateFiltersConfigsToIndexDB(filterConfigs).subscribe(() => {});
  }
}
