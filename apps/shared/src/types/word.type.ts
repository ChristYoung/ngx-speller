export interface WordsItem {
    word: string;
    mispronounce?: boolean;
    type?: WordType;
    created_timestamp?: number;
    spelled_timestamp?: number;
    explanation?: string;
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
  
  export type WordType = 'WORD' | 'PHRASE' | 'ALL';
  
  export interface ExampleItem {
    zh: string;
    en: string;
    quiz?: boolean;
  }
