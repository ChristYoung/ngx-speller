import { FiltersConfig, WordsCollections, WordsItem } from '../types';
export * from './24-tool.util';

export const SoundSourceMapping = {
  Typing: './assets/sounds/typing.mp3',
  Correct: './assets/sounds/correct.wav',
  Incorrect: './assets/sounds/incorrect.wav',
} as const;

export type SoundsType = keyof typeof SoundSourceMapping;

export const BANNED_KEYS = [
  'Enter',
  'Backspace',
  'Delete',
  'Tab',
  'CapsLock',
  'Shift',
  'Control',
  'Alt',
  'Meta',
  'Escape',
  'Fn',
  'FnLock',
  'Hyper',
  'Super',
  'OS',
  // Up, down, left and right keys
  'ArrowUp',
  'ArrowDown',
  // volume keys
  'AudioVolumeUp',
  'AudioVolumeDown',
  'AudioVolumeMute',
  // special keys
  'End',
  'PageDown',
  'PageUp',
  'Clear',
  'Home',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '0',
];

export const isChineseSymbol = (val: string): boolean =>
  /[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/.test(
    val
  );

export const playSound = (params: {
  soundsType?: SoundsType;
  src?: string;
}) => {
  const { soundsType, src } = params;
  const audio = new Audio();
  const audioUrl = src || SoundSourceMapping[soundsType];
  audio.src = audioUrl;
  audio.load();
  audio.play();
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const BiggestFilter = (
  _list: WordsItem[],
  filterConfig: FiltersConfig
): WordsItem[] => {
  const isFilterFamiliar = filterConfig.familiarType === 'FAMILIAR';
  const [pickStart, pickEnd] = filterConfig.pickRange ?? [0, 999];
  let filterList =
    filterConfig.familiarType === 'ALL'
      ? [..._list]
      : _list.filter((item) => item.familiar === isFilterFamiliar);

  filterList = filterList.filter((item) => {
    const right_rate =
      item.total_count === 0
        ? 0
        : parseFloat((item.right_count / item.total_count).toFixed(2));
    return right_rate <= filterConfig.lessThanRate;
  });

  filterList = filterList.filter((item) => {
    return item.total_count <= filterConfig.lessThanCount;
  });

  if (pickStart >= 0 && pickEnd <= filterList.length) {
    filterList = filterList.slice(pickStart, pickEnd);
  }

  return filterConfig.randomOrder
    ? shuffleArray<WordsItem>(filterList)
    : filterList;
};

export const organizeWordsByFirstLetter = (
  words: WordsItem[]
): WordsCollections[] => {
  const wordsCollections: WordsCollections[] = [];
  words.forEach((w) => {
    const firstLetter = w.word[0].toUpperCase();
    const index = wordsCollections.findIndex(
      (wc) => wc.firstLetter === firstLetter
    );
    if (index === -1) {
      wordsCollections.push({
        firstLetter,
        words: [w],
      });
    } else {
      wordsCollections[index].words.push(w);
    }
  });
  return wordsCollections;
};

export const frontEndSearchWordsByKeyword = (
  keyWords: string,
  wordList: WordsItem[]
): WordsItem[] => {
  const keyWordsUpper = keyWords.toLowerCase();
  return wordList.filter((w) => w.word.toLowerCase().includes(keyWordsUpper));
};
