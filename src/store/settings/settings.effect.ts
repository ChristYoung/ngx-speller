import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, switchMap, withLatestFrom } from 'rxjs';
import { DbService } from '../../services/DataBase/db.service';
import { BiggestFilter } from '../../utils';
import { setWordsList } from '../words/words.actions';
import { setFiltersConfig } from './settings.actions';

@Injectable()
export class SettingsEffects {
  private actions$ = inject(Actions);
  private db = inject(DbService);

  setFiltersConfigEffect$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(setFiltersConfig),
      withLatestFrom(this.db.getAllWordsFromIndexDB()),
      switchMap(([action, wordList]) => {
        const { filters } = action;
        return of(setWordsList({ words: BiggestFilter(wordList, filters) }));
      })
    );
  });
}
