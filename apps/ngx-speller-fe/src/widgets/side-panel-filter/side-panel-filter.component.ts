import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { DEFAULT_FILTER_LESS_THAN, getDefaultSettings } from '../../core/constant';
import { ToFixedPipe } from '../../pipes/to-fixed.pipe';
import { DbService } from '../../services/DataBase/db.service';
import { setFiltersConfig } from '../../store/settings/settings.actions';
import { updateCurrentIndex } from '../../store/words/words.actions';
import { WordType } from '@shared/types';
import { ZorroModule } from '../../zorro/zorro.module';
import { FiltersConfig, PronounceableType, Settings } from '../../types/settings.type';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-side-panel-filter',
  standalone: true,
  imports: [ZorroModule, FormsModule, CommonModule, ToFixedPipe, NgxSliderModule],
  template: `
    <div class="side_panel_settings_container">
      <div class="content">
        <div class="filters_setting">
          <div nz-row>
            <div nz-col nzSpan="14" class="form_control_container">
              <span class="label_span">Random pick:</span>
              <nz-switch
                [style]="{ marginRight: '10px' }"
                nzSize="small"
                [(ngModel)]="randomPick"
              ></nz-switch>
              @if (randomPick) {
                <nz-input-number
                  [(ngModel)]="randomPickCount"
                  [nzMin]="1"
                  [nzMax]="allWordsCount$_sig()"
                ></nz-input-number>
              }
            </div>
            <div nz-col nzSpan="10" class="form_control_container pd_l">
              <span class="label_span">Random order:</span>
              <nz-switch nzSize="small" [(ngModel)]="randomOrder"></nz-switch>
            </div>
          </div>
          <div class="form_control_container">
            <span>Not memorized for days: </span>
            <nz-input-number
              [(ngModel)]="notSpelledDays"
              [disabled]="randomPick"
              [nzMin]="0"
            ></nz-input-number>
          </div>
          <div class="form_control_container">
            <p>WordType:</p>
            <nz-radio-group [(ngModel)]="wordType" [disabled]="randomPick">
              <label nz-radio nzValue="ALL">All</label>
              <label nz-radio nzValue="WORD">Word</label>
              <label nz-radio nzValue="PHRASE">Phrase</label>
            </nz-radio-group>
          </div>
          <div class="form_control_container">
            <p>Pronounceable:</p>
            <nz-radio-group [(ngModel)]="pronounceableType" [disabled]="randomPick">
              <label nz-radio nzValue="ALL">All</label>
              <label nz-radio nzValue="PRONOUNCED">Pronounced</label>
              <label nz-radio nzValue="UNPRONOUNCED">Unpronounced</label>
            </nz-radio-group>
          </div>
          <div class="form_control_container pd_l">
            <p>
              Pick the words whose spell count were less than:
              {{ lessThanCount }}
            </p>
            <nz-input-number
              [(ngModel)]="lessThanCount"
              [nzMin]="0"
              [nzMax]="maxLessThanCount"
              [disabled]="randomPick"
            ></nz-input-number>
          </div>
          <div class="form_control_container pd_l slider_padding_0 custom-slider">
            <p>
              Pick the words whose right rate were less than:
              {{ lessThanRate * 100 | toFixed: 2 }}%
            </p>
            <ngx-slider
              [(value)]="lessThanRate"
              [options]="{
                floor: 0,
                ceil: 1,
                step: 0.01,
                animate: false,
                disabled: randomPick,
              }"
            ></ngx-slider>
          </div>
          <div
            class="form_control_container pd_l slider_padding_0 slider_padding_t20 custom-slider"
          >
            <p>
              Pick the words from {{ minRange }} to
              {{ maxRange <= allWordsCount$_sig() ? maxRange : allWordsCount$_sig() }}:
            </p>
            <ngx-slider
              [(value)]="minRange"
              [(highValue)]="maxRange"
              [options]="{
                floor: 0,
                ceil: allWordsCount$_sig() ?? 9999,
                step: 1,
                animate: false,
                disabled: randomPick,
              }"
            ></ngx-slider>
          </div>
        </div>
      </div>
      <div class="operator_area">
        <nz-space>
          <button *nzSpaceItem nz-button nzType="primary" (click)="onApplyClicked()">Apply</button>
          <button *nzSpaceItem nz-button (click)="onResetClicked()">Reset</button>
          <button *nzSpaceItem nz-button (click)="onSaveDataBaseClicked()">Save in DataBase</button>
        </nz-space>
      </div>
    </div>
  `,
  styleUrl: './side-panel-filter.component.less',
})
export class SidePanelFilterComponent implements OnInit {
  randomOrder: boolean = false;
  randomPick: boolean = false;
  randomPickCount: number = 1;
  minRange: number = 0;
  maxRange: number = 9999;
  notSpelledDays: number = 0;
  lessThanRate: number = 1; // pick out these words whose right count is less than the `lessThanRate`.
  lessThanCount: number = 1; // pick out these words whose right count is less than the `lessThanCount`.
  maxLessThanCount: number = DEFAULT_FILTER_LESS_THAN;
  pronounceableType?: PronounceableType = 'ALL';
  wordType: WordType = 'ALL';

  db = inject(DbService);
  store = inject(Store);
  _cd = inject(ChangeDetectorRef);
  settings$_sig = toSignal(this.store.select('settings')) as Signal<Settings>;
  allWordsCount$_sig = toSignal(this.db.getAllWordsCountFromIndexDB());
  private nzDrawerRef = inject(NzDrawerRef<void>);

  ngOnInit(): void {
    const settings = this.settings$_sig();
    const allWordsCount = this.allWordsCount$_sig();
    const { filters } = settings as Settings;
    if (filters) {
      this.randomOrder = filters.randomOrder;
      this.minRange = filters.pickRange[0];
      this.maxRange = filters.pickRange[1];
      this.lessThanRate = filters.lessThanRate;
      this.lessThanCount = filters.lessThanCount || DEFAULT_FILTER_LESS_THAN;
      this.pronounceableType = filters.pronounceableType;
      this.randomPick = filters.randomPick;
      this.randomPickCount = filters.randomPickCount;
      this.wordType = filters.wordType;
      this.notSpelledDays = filters.notSpelledDays;
    } else {
      this.minRange = 1;
      this.maxRange = allWordsCount;
    }
  }

  onApplyClicked(): FiltersConfig {
    const {
      randomOrder,
      randomPick,
      randomPickCount,
      lessThanRate,
      pronounceableType,
      lessThanCount,
      minRange,
      maxRange,
      wordType,
      notSpelledDays,
    } = this;
    this.store.dispatch(
      setFiltersConfig({
        filters: {
          randomOrder,
          randomPick,
          randomPickCount,
          pickRange: [minRange, maxRange] as number[],
          lessThanRate,
          pronounceableType,
          lessThanCount,
          wordType,
          notSpelledDays,
        } as FiltersConfig,
      }),
    );
    this.store.dispatch(updateCurrentIndex({ index: 0 }));
    this.nzDrawerRef.close();
    return {
      randomOrder,
      pickRange: [minRange, maxRange],
      lessThanRate,
      pronounceableType,
      randomPick,
      randomPickCount,
      lessThanCount,
      wordType,
      notSpelledDays,
    } as FiltersConfig;
  }

  onResetClicked(): void {
    const allWordsCount = this.allWordsCount$_sig();
    const { filters } = getDefaultSettings(allWordsCount);
    const {
      randomOrder,
      randomPick,
      randomPickCount,
      pickRange,
      lessThanRate,
      pronounceableType,
      lessThanCount,
    } = filters;
    this.randomOrder = randomOrder;
    this.randomPick = randomPick;
    this.randomPickCount = randomPickCount;
    this.minRange = pickRange[0];
    this.maxRange = pickRange[1];
    this.lessThanRate = lessThanRate;
    this.lessThanCount = lessThanCount;
    this.pronounceableType = pronounceableType;
    this.wordType = filters.wordType;
    this.notSpelledDays = 0;
    this._cd.markForCheck();
  }

  onSaveDataBaseClicked(): void {
    const filterConfigs = this.onApplyClicked();
    this.db.updateFiltersConfigsToIndexDB(filterConfigs).subscribe(() => {});
  }
}
