import { FiltersConfig, WordsItem, WordType } from '../types';

export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const DiffDays = (timeStamp: number): number => {
  return Math.floor((Date.now() - timeStamp) / (1000 * 60 * 60 * 24));
};

export const BiggestFilter = (
  _list: WordsItem[],
  filterConfig: FiltersConfig,
  logicType: 'AND' | 'OR' = 'AND',
): WordsItem[] => {
  const filterWords = _list.filter((item, _index) => {
    const pronounceableMatch =
      filterConfig.pronounceableType === 'ALL' || filterConfig.pronounceableType === 'PRONOUNCED';
    const notSpelledDaysMatch =
      filterConfig.notSpelledDays === 0 ||
      DiffDays(item.spelled_timestamp) >= filterConfig.notSpelledDays;
    const wordTypeMatch = filterConfig.wordType === 'ALL' || filterConfig.wordType === item.type;
    const [pickStart, pickEnd] = filterConfig.pickRange ?? [0, 3999];
    const rangeMatch = _index >= pickStart && _index <= pickEnd;
    const rightRate =
      item.total_count === 0 ? 0 : parseFloat((item.right_count / item.total_count).toFixed(2));
    const rateMatch = rightRate <= filterConfig.lessThanRate;
    const countMatch = item.total_count <= filterConfig.lessThanCount;
    if (logicType === 'AND') {
      return (
        wordTypeMatch &&
        notSpelledDaysMatch &&
        pronounceableMatch &&
        rangeMatch &&
        rateMatch &&
        countMatch
      );
    } else {
      return (
        wordTypeMatch ||
        notSpelledDaysMatch ||
        pronounceableMatch ||
        rangeMatch ||
        rateMatch ||
        countMatch
      );
    }
  });
  return filterConfig.randomOrder ? shuffleArray<WordsItem>(filterWords) : filterWords;
};

export const randomPicker = (list: WordsItem[], count: number): WordsItem[] => {
  return shuffleArray<WordsItem>(list).slice(0, count);
};

export const frontEndSearchWordsByKeyword = (
  keyWords: string,
  wordList: WordsItem[],
  wordType?: WordType,
): WordsItem[] => {
  if (!keyWords) return wordList;
  const keyWordsUpper = keyWords.toLowerCase();
  const searchResult = wordList.filter((w) => w.word.toLowerCase().includes(keyWordsUpper));
  // filter the searchResult by wordType, and if any single word's type is not exist, treat it as 'Word' type.
  return wordType && wordType !== 'ALL'
    ? searchResult.filter((w) => w.type === wordType)
    : searchResult;
};
