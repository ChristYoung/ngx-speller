import { FiltersConfig, WordsItem, WordType } from '../types';

export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const BiggestFilter = (_list: WordsItem[], filterConfig: FiltersConfig): WordsItem[] => {
  const pronounceable = filterConfig.pronounceableType === 'PRONOUNCED';
  const [pickStart, pickEnd] = filterConfig.pickRange ?? [0, 999];
  let filterList = [..._list];

  filterList = filterList.filter((item) => {
    const right_rate =
      item.total_count === 0 ? 0 : parseFloat((item.right_count / item.total_count).toFixed(2));
    return right_rate < filterConfig.lessThanRate;
  });

  filterList = filterList.filter((item) => {
    return item.total_count <= filterConfig.lessThanCount;
  });

  if (pickStart >= 0 && pickEnd <= filterList.length) {
    filterList = filterList.slice(pickStart, pickEnd);
  }

  filterList =
    filterConfig.wordType === 'ALL'
      ? [...filterList]
      : filterList.filter((item) => item.type === filterConfig.wordType);
  filterList =
    filterConfig.pronounceableType === 'ALL'
      ? [...filterList]
      : filterList.filter((item) => item.mispronounce === !pronounceable);

  return filterConfig.randomOrder ? shuffleArray<WordsItem>(filterList) : filterList;
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
