import { WordsItem } from '@shared/types';

export type EmitParams = {
  word?: WordsItem;
  lastWord: boolean;
};

export interface WordsCollections {
  firstLetter: string;
  words: WordsItem[];
}
