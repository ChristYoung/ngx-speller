import { createAction, props } from '@ngrx/store';

import { FiltersConfig, CommonSettingsConfig } from '../../types';

export const setCommonSettingsConfig = createAction(
  '[Setting] Setting Config',
  props<{ commonSettings: CommonSettingsConfig }>(),
);

export const setFiltersConfig = createAction(
  '[Setting] Filter Config',
  props<{ filters: FiltersConfig }>(),
);
