import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { Subject, take, takeUntil } from 'rxjs';
import { ToFixedPipe } from '../../pipes/to-fixed.pipe';
import { DbService } from '../../services/DataBase/db.service';
import { setCommonSettingsConfig } from '../../store/settings/settings.actions';
import { CommonSettingsConfig, Settings } from '../../types';
import { ZorroModule } from '../../zorro/zorro.module';
import { updateCurrentIndex } from '../../store/words/words.actions';

@Component({
  selector: 'app-side-panel-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ToFixedPipe, ZorroModule],
  template: `
    <div class="side_panel_settings_container">
      <div class="content">
        <div class="common_setting">
          <form [formGroup]="commonSettingsForm">
            <div class="form_control_container">
              <p>Select the practice mode:</p>
              <nz-radio-group formControlName="mode">
                <label nz-radio nzValue="VIEW">View</label>
                <label nz-radio nzValue="SPELLING">Spelling</label>
                <label nz-radio nzValue="QUIZ">Strict</label>
              </nz-radio-group>
            </div>
            <div class="form_control_container pd_l">
              <span class="label_span">show phonetic</span>
              <nz-switch nzSize="small" formControlName="showPhonetic">show phonetic</nz-switch>
            </div>
            <div class="form_control_container pd_l">
              <span class="label_span">show example</span>
              <nz-switch nzSize="small" formControlName="showExamples">show example</nz-switch>
            </div>
            <div class="form_control_container pd_l">
              <span class="label_span">show horn</span>
              <nz-switch nzSize="small" formControlName="showHorn">show horn</nz-switch>
            </div>
            <div class="form_control_container pd_l">
              <span class="label_span">show explanation</span>
              <nz-switch nzSize="small" formControlName="showExplanation"
                >show explanation</nz-switch
              >
            </div>
            <div class="form_control_container pd_l">
              <span class="label_span">auto play media for every single word</span>
              <nz-switch nzSize="small" formControlName="autoPlay">show explanation</nz-switch>
            </div>
            <div class="form_control_container pd_l">
              <span class="label_span">disable youdao API</span>
              <nz-switch nzSize="small" formControlName="disabledYoudao"></nz-switch>
            </div>
          </form>
        </div>
      </div>
      <div class="operator_area">
        <nz-space>
          <button *nzSpaceItem nz-button nzType="primary" (click)="onApplyClicked()">Apply</button>
          <button *nzSpaceItem nz-button (click)="onSaveDataBaseClicked()">Save in DataBase</button>
        </nz-space>
      </div>
    </div>
  `,
  styleUrl: './side-panel-settings.component.less',
})
export class SidePanelSettingsComponent implements OnInit, OnDestroy {
  fb = inject(FormBuilder);
  db = inject(DbService);
  store = inject(Store);
  settings$ = this.store.select('settings');
  allWordsCount$ = this.db.getAllWordsCountFromIndexDB();
  destroy$: Subject<void> = new Subject<void>();
  private nzDrawerRef = inject(NzDrawerRef<void>);

  constructor() {}

  commonSettingsForm = this.fb.group<CommonSettingsConfig>({
    mode: 'VIEW',
    showExamples: true,
    showPhonetic: true,
    showExplanation: true,
    showHorn: true,
    autoPlay: false,
    apiType: 'Dic',
  });

  ngOnInit(): void {
    this.settings$.pipe(take(1)).subscribe((settings: Settings) => {
      this.commonSettingsForm.patchValue(settings.commonSettings, {
        emitEvent: false,
      });
    });
    this.commonSettingsForm
      .get('mode')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => this.autoSettingWhenQuiz(value !== 'QUIZ'));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onApplyClicked(): void {
    const commonSettingValue = this.commonSettingsForm.value;
    this.store.dispatch(
      setCommonSettingsConfig({
        commonSettings: commonSettingValue as CommonSettingsConfig,
      }),
    );
    this.store.dispatch(updateCurrentIndex({ index: 0 }));
    this.nzDrawerRef.close();
  }

  onSaveDataBaseClicked(): void {
    const commonSettings = this.commonSettingsForm.value as CommonSettingsConfig;
    this.onApplyClicked();
    this.db.updateCommonSettingConfigsToIndexDB(commonSettings).subscribe(() => {});
  }

  private autoSettingWhenQuiz(enable: boolean): void {
    this.commonSettingsForm.get('showExamples').setValue(enable, { emitEvent: false });
    this.commonSettingsForm.get('showHorn').setValue(enable, { emitEvent: false });
    this.commonSettingsForm.get('showPhonetic').setValue(enable, { emitEvent: false });
  }
}
