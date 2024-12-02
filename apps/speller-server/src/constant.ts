export const BASE_WORD_API = 'https://dict.youdao.com';
export const AUDIO_SRC = `${BASE_WORD_API}/dictvoice?type=0&audio=`;
export const WORDS_SIMPLE_SUGGESTIONS =
  '/suggest?num=1&ver=3.0&doctype=json&cache=false&le=en&q='; // 单词联想, 输入生词的时候使用
export const WORDS_COMPLEX_EXPLANATION =
  '/jsonapi?jsonversion=2&client=mobile&q='; // 获取单词的释义， 音标, 和例句等
