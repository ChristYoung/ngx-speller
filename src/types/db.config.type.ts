import { Settings } from './settings.type';
import { WordsItem } from './words.type';

export type WholeIndexDBConfig = {
  settings: Settings;
  words: WordsItem[];
};
