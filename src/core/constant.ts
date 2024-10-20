import { CommonSettingsConfig, FiltersConfig, Settings } from '../types';

export const BASE_API = 'https://spelling.onrender.com';
export const AUDIO_SRC = 'https://dict.youdao.com/dictvoice?type=0&audio=';
export const WORDS_SIMPLE_SUGGESTIONS = '/suggest?num=1&ver=3.0&doctype=json&cache=false&le=en&q='; // 单词联想, 输入生词的时候使用
export const WORDS_COMPLEX_EXPLANATION = `${BASE_API}/explanations`; // 获取单词的释义， 音标, 和例句等
export const YOU_DAO_API = 'https://dict.youdao.com/jsonapi?jsonversion=2&client=mobile&q='; // 有道词典的API
export const DEFAULT_FILTER_LESS_THAN = 9999; // 默认过滤拼写次数小于9999的单词
export const DEFAULT_RANDOM_PICK_COUNT = 30; // 默认随机抽取30个单词

export const getDefaultSettings = (allWordsLen: number): Settings => {
  const filters: FiltersConfig = {
    pronounceableType: 'ALL',
    pickRange: [0, allWordsLen],
    randomOrder: false,
    randomPick: false,
    randomPickCount: DEFAULT_RANDOM_PICK_COUNT,
    lessThanRate: 1,
    lessThanCount: DEFAULT_FILTER_LESS_THAN,
  };
  const commonSettings: CommonSettingsConfig = {
    mode: 'VIEW',
    showExamples: true,
    showPhonetic: true,
    showExplanation: true,
    showHorn: true,
  };
  return { filters, commonSettings };
};
