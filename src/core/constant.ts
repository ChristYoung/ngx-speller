export const BASE_API = 'https://spelling.onrender.com';
export const AUDIO_SRC = 'https://dict.youdao.com/dictvoice?type=0&audio=';
export const WORDS_SIMPLE_SUGGESTIONS =
  '/suggest?num=1&ver=3.0&doctype=json&cache=false&le=en&q='; // 单词联想, 输入生词的时候使用
export const WORDS_COMPLEX_EXPLANATION = `${BASE_API}/explanations`; // 获取单词的释义， 音标, 和例句等
export const YOU_DAO_API =
  'https://dict.youdao.com/jsonapi?jsonversion=2&client=mobile&q='; // 有道词典的API
