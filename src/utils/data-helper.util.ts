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
  const wordType = filterConfig.wordType;
  const [pickStart, pickEnd] = filterConfig.pickRange ?? [0, 999];
  let filterList =
    filterConfig.wordType === 'ALL' ? [..._list] : _list.filter((item) => item.type === wordType);
  filterList =
    filterConfig.pronounceableType === 'ALL'
      ? [..._list]
      : _list.filter((item) => item.mispronounce === !pronounceable);

  filterList = filterList.filter((item) => {
    const right_rate =
      item.total_count === 0 ? 0 : parseFloat((item.right_count / item.total_count).toFixed(2));
    return right_rate <= filterConfig.lessThanRate;
  });

  filterList = filterList.filter((item) => {
    return item.total_count <= filterConfig.lessThanCount;
  });

  if (pickStart >= 0 && pickEnd <= filterList.length) {
    filterList = filterList.slice(pickStart, pickEnd);
  }

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
  const keyWordsUpper = keyWords.toLowerCase();
  const searchResult = wordList.filter((w) => w.word.toLowerCase().includes(keyWordsUpper));
  // filter the searchResult by wordType, and if any single word's type is not exist, treat it as 'Word' type.
  return wordType ? searchResult.filter((w) => w.type === wordType) : searchResult;
};
