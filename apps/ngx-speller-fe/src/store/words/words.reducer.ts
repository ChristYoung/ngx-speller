import { createReducer, on } from '@ngrx/store';

import { WordsItem } from '@shared/types';

import {
  changeCurrentWordByStep,
  setWordsList,
  updateCurrentIndex,
  updateCurrentWordItem,
} from './words.actions';

export const initialState: {
  words: WordsItem[];
  currentWordItem: WordsItem;
  currentWordIndex: number;
} = {
  words: [],
  currentWordItem: null,
  currentWordIndex: -1,
};

export const wordsReducer = createReducer(
  initialState,
  on(setWordsList, (_state, { words }) => ({
    currentWordItem: words[0],
    currentWordIndex: 0,
    words,
  })),
  on(changeCurrentWordByStep, (_state, { step }) => {
    const currentWordIndex =
      (_state.currentWordIndex + (step === 'next' ? 1 : -1) + _state.words.length) %
      _state.words.length;
    return {
      ..._state,
      currentWordIndex,
      currentWordItem: { ..._state.words[currentWordIndex] },
    };
  }),
  on(updateCurrentWordItem, (_state, { word }) => ({
    ..._state,
    words: _state.words.map((w) => (w.id === word.id ? { ...word } : w)),
    currentWordItem: word.id === _state.currentWordItem.id ? { ...word } : _state.currentWordItem,
  })),
  on(updateCurrentIndex, (_state, { index }) => ({
    ..._state,
    currentWordIndex: index,
    currentWordItem: { ..._state.words[index] },
  })),
);
