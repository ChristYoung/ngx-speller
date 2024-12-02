import { Settings } from './settings.type';
import { WordsItem } from '@shared/types';

export type WholeIndexDBConfig = {
  settings: Settings;
  words: WordsItem[];
};
