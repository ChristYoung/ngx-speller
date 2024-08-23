export interface WordsItem {
  word: string;
  familiar: boolean;
  type?: 'WORD' | 'PHRASE';
  created_timestamp?: number;
  explanations?: string[];
  eng_explanation?: string;
  similar_words?: string[];
  examples?: ExampleItem[];
  id?: number;
  phonetic?: string;
  checked?: boolean;
  right_count?: number;
  total_count?: number;
  right_rate?: string;
}

export interface ExampleItem {
  zh: string;
  en: string;
}

export type EmitParams = {
  word?: WordsItem;
  lastWord: boolean;
};

export interface WordsCollections {
  firstLetter: string;
  words: WordsItem[];
}
