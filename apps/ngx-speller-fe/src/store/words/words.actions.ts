import { createAction, props } from '@ngrx/store';

import { WordsItem } from '../../types';

export const setWordsList = createAction(
  '[Words Component] Set Words List',
  props<{ words: WordsItem[] }>(),
);

export const changeCurrentWordByStep = createAction(
  '[Words Component] Change Current Word By Step',
  props<{ step: 'next' | 'prev' }>(),
);

export const updateCurrentWordItem = createAction(
  '[Words Component] Update Current Word Item',
  props<{ word: WordsItem }>(),
);

export const updateCurrentIndex = createAction(
  '[Words Component] Update Current Index',
  props<{ index: number }>(),
);
