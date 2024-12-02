import { WordType } from '@shared/types';

export type ModeType = 'VIEW' | 'SPELLING' | 'STRICT' | 'QUIZ';
export type PronounceableType = 'PRONOUNCED' | 'UNPRONOUNCED' | 'ALL';
export type ApiType = 'YouDao' | 'Dic' | 'None';

export type CommonSettingsConfig = {
  mode: ModeType;
  showExamples: boolean;
  showPhonetic: boolean;
  showExplanation: boolean;
  showHorn: boolean;
  muteKeyBoard?: boolean;
  autoPlay?: boolean;
  apiType?: ApiType;
};

export type FiltersConfig = {
  startDate?: number;
  endDate?: number;
  pronounceableType?: PronounceableType;
  randomOrder?: boolean;
  randomPick?: boolean;
  randomPickCount?: number;
  wordType?: WordType;
  notSpelledDays?: number; // pick out these words which have not been spelled for `notSpelledDays` days.
  pickRange?: number[]; // pick out these words whose right count is in the `pickRange`.
  lessThanRate?: number; // pick out these words whose right count is less than the `lessThanRate`.
  lessThanCount?: number; // pick out these words whose right count is less than the `lessThanCount`.
};

export type Settings = {
  id?: number;
  commonSettings: CommonSettingsConfig;
  filters: FiltersConfig;
};
