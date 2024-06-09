import { isDevMode } from '@angular/core';
import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';
import { wordsReducer } from './words/words.reducer';
import { settingsReducer } from './settings/settings.reducer';

export interface State {}

function logger(reducer: any): ActionReducer<any> {
  return (state, action) => {
    console.log('action', action);
    return reducer(state, action);
  };
}

export const reducers: ActionReducerMap<State> = {
  words: wordsReducer,
  settings: settingsReducer,
};

export const metaReducers: MetaReducer<State>[] = isDevMode() ? [logger] : [];
