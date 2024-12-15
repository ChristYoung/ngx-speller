import { FiltersConfig } from '../types';
import { WordType, WordsItem } from '@shared/types';

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
  const listLength = _list?.length ?? 0;
  const filterWords = _list
    .filter((item, _index) => {
      const wordTypeMatch = filterConfig.wordType === 'ALL' || filterConfig.wordType === item.type;
      const mispronounceMatch =
        filterConfig.pronounceableType === 'ALL' ||
        (filterConfig.pronounceableType === 'PRONOUNCED' && !item.mispronounce) ||
        (filterConfig.pronounceableType === 'UNPRONOUNCED' && item.mispronounce);
      const [pickStart, pickEnd] = filterConfig.pickRange ?? [0, 3999];
      const reversePickStart = listLength - pickEnd - 1;
      const reversePickEnd = listLength - pickStart - 1;
      const rangeMatch = _index >= reversePickStart && _index <= reversePickEnd;
      const rightRate =
        item.total_count === 0 ? 0 : parseFloat((item.right_count / item.total_count).toFixed(2));
      const rateMatch = rightRate <= filterConfig.lessThanRate;
      const countMatch = item.total_count <= filterConfig.lessThanCount;
      // const notSpelledDaysMatch =
      //   !filterConfig.notSpelledDays ||
      //   DiffDays(item.spelled_timestamp) >= filterConfig.notSpelledDays;
      if (logicType === 'AND') {
        return wordTypeMatch && mispronounceMatch && rangeMatch && rateMatch && countMatch;
      } else {
        return wordTypeMatch || rangeMatch || rateMatch || countMatch;
      }
    })
    .reverse();
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
