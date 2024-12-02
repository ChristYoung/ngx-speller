import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, switchMap, withLatestFrom } from 'rxjs';
import { DbService } from '../../services/DataBase/db.service';
import { BiggestFilter, randomPicker } from '../../utils';
import { setWordsList } from '../words/words.actions';
import { setFiltersConfig } from './settings.actions';

@Injectable()
export class SettingsEffects {
  private actions$ = inject(Actions);
  private db = inject(DbService);

  // When the setFiltersConfig action is triggered, get all words from the database and set them to the state by Filters.
  setFiltersConfigEffect$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(setFiltersConfig),
      withLatestFrom(this.db.getAllWordsFromIndexDB()),
      switchMap(([action, wordList]) => {
        const { filters } = action;
        if (filters?.randomPick && filters?.randomPickCount > 0) {
          const wordOnlyList = wordList.filter((word) => word.type === 'WORD');
          return of(setWordsList({ words: randomPicker(wordOnlyList, filters.randomPickCount) }));
        }
        const returnWordsList = filters ? BiggestFilter(wordList, filters) : wordList;
        return of(setWordsList({ words: returnWordsList }));
      }),
    );
  });
}
