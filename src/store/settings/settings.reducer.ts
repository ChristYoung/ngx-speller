import { createReducer, on } from '@ngrx/store';
import { Settings } from '../../types';
import { setCommonSettingsConfig, setFiltersConfig } from './settings.actions';

export const initialState: Settings = null;

export const settingsReducer = createReducer(
  initialState,
  on(setCommonSettingsConfig, (_state, { commonSettings }) => ({
    ..._state,
    commonSettings,
  })),
  on(setFiltersConfig, (_state, { filters }) => ({
    ..._state,
    filters,
  }))
);
