import { CommonSettingsConfig, FiltersConfig, Settings } from '../types';

export const BASE_API = 'https://ngx-speller-server.onrender.com';
export const AUDIO_SRC = 'https://dict.youdao.com/dictvoice?type=0&audio=';
export const WORDS_SIMPLE_SUGGESTIONS = '/suggest?num=1&ver=3.0&doctype=json&cache=false&le=en&q='; // Word association, used when entering new words
export const WORDS_COMPLEX_EXPLANATION = `${BASE_API}/explanations`; // Get the word's definition, phonetic symbols, and examples
export const FREE_DICTIONARY_API = 'https://api.dictionaryapi.dev/api/v2/entries/en'; //  Free dictionary API, supports cross-domain access, but does not return Chinese definitions, //https://dictionaryapi.dev/
export const YOU_DAO_API = 'https://dict.youdao.com/jsonapi?jsonversion=2&client=mobile&q='; // Youdao Dictionary API
export const DEFAULT_FILTER_LESS_THAN = 9999; // By default, words spelled less than 9999 times are filtered
export const DEFAULT_RANDOM_PICK_COUNT = 30; // By default, 30 words are randomly selected
export const DEFAULT_VOICE_NAME =
  'Microsoft Server Speech Text to Speech Voice (en-US, JennyNeural)';

export const AUTH0_CONFIG = {
  domain: import.meta.env['NG_APP_AUTH_DOMAIN'],
  clientId: import.meta.env['NG_APP_AUTH_CLIENT_ID'],
  authorizationParams: {
    redirect_uri: window.location.origin,
  },
} as const;

export const getDefaultSettings = (allWordsLen: number): Settings => {
  const filters: FiltersConfig = {
    pronounceableType: 'ALL',
    pickRange: [0, allWordsLen],
    randomOrder: false,
    randomPick: false,
    randomPickCount: DEFAULT_RANDOM_PICK_COUNT,
    lessThanRate: 1,
    lessThanCount: DEFAULT_FILTER_LESS_THAN,
    notSpelledDays: 0,
    wordType: 'ALL',
  };
  const commonSettings: CommonSettingsConfig = {
    mode: 'VIEW',
    showExamples: true,
    showPhonetic: true,
    showExplanation: true,
    showHorn: true,
    voiceName: DEFAULT_VOICE_NAME,
  };
  return { filters, commonSettings };
};
