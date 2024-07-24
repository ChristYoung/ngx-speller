import { Component } from '@angular/core';
import { ZorroModule } from '../../zorro/zorro.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToFixedPipe } from '../../pipes/to-fixed.pipe';

@Component({
  selector: 'app-side-panel-filter',
  standalone: true,
  imports: [ZorroModule, FormsModule, CommonModule, ToFixedPipe],
  template: `
    <div class="side_panel_settings_container">
      <div class="content">
        <div class="filters_setting">
          <div class="form_control_container">
            <p>Filter the words:</p>
            <div class="form_control_container pd_l">
              <span class="label_span">random order</span>
              <nz-switch
                nzSize="small"
                formControlName="randomOrder"
              ></nz-switch>
            </div>
            <nz-radio-group formControlName="familiarType">
              <label nz-radio nzValue="ALL">All</label>
              <label nz-radio nzValue="FAMILIAR">Familiar</label>
              <label nz-radio nzValue="UNFAMILIAR">Unfamiliar</label>
            </nz-radio-group>
          </div>
          <div class="form_control_container pd_l slider_padding_0">
            <p>
              pick the words whose right rate was less than:
              <!-- {{ filtersForm.value.lessThanRate * 100 | toFixed : 2 }}% -->
            </p>
            <nz-slider
              formControlName="lessThanRate"
              [nzMax]="1"
              [nzMin]="0"
              [nzStep]="0.01"
            ></nz-slider>
          </div>
          <!-- TODO: nz-slider init value has no effect in reactive form -->
          <!-- <div
              class="form_control_container pd_l slider_padding_0 slider_padding_t20"
            >
              <p>
                pick the words from {{ filtersForm.value.pickRange[0] }} to
                {{ filtersForm.value.pickRange[1] }}
              </p>
              <nz-slider
                nzRange
                formControlName="pickRange"
                [nzMin]="0"
                [nzMax]="allWordsCount$ | async"
                [nzStep]="1"
              ></nz-slider>
            </div> -->
        </div>
      </div>
    </div>
  `,
  styleUrl: './side-panel-filter.component.less',
})
export class SidePanelFilterComponent {}
