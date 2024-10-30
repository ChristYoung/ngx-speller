import { WordType } from './words.type';

export type ModeType = 'VIEW' | 'SPELLING' | 'STRICT';
export type PronounceableType = 'PRONOUNCED' | 'UNPRONOUNCED' | 'ALL';
export type ApiType = 'YouDao' | 'Dic';

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
  recentDays?: number;
  pronounceableType?: PronounceableType;
  randomOrder?: boolean;
  randomPick?: boolean;
  randomPickCount?: number;
  wordType?: WordType;
  pickRange?: number[]; // pick out these words whose right count is in the `pickRange`.
  lessThanRate?: number; // pick out these words whose right count is less than the `lessThanRate`.
  lessThanCount?: number; // pick out these words whose right count is less than the `lessThanCount`.
};

export type Settings = {
  id?: number;
  commonSettings: CommonSettingsConfig;
  filters: FiltersConfig;
};
