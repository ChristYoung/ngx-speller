import { DBConfig } from 'ngx-indexed-db';

export const dbConfig: DBConfig = {
  name: 'spellingWordsDB',
  version: 2,
  objectStoresMeta: [
    {
      store: 'words',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'word', keypath: 'word', options: { unique: true } },
        {
          name: 'created_timestamp', // 单词创建的时间
          keypath: 'created_timestamp',
          options: { unique: false },
        },
        {
          name: 'mispronounce', // 单词是否会读
          keypath: 'mispronounce',
          options: { unique: false },
        },
        {
          name: 'explanation', // 单词释义
          keypath: 'explanation',
          options: { unique: false },
        },
        {
          name: 'examples', // 单词例句
          keypath: 'examples',
          options: { unique: false },
        },
        {
          name: 'phonetic', // 单词音标
          keypath: 'phonetic',
          options: { unique: false },
        },
        {
          name: 'right_count',
          keypath: 'right_count',
          options: { unique: false },
        },
        {
          name: 'total_count',
          keypath: 'total_count',
          options: { unique: false },
        },
      ],
    },
    {
      store: 'settings',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        {
          name: 'commonSettings',
          keypath: 'commonSettings',
          options: { unique: false },
        },
        {
          name: 'filters',
          keypath: 'filters',
          options: { unique: false },
        },
      ],
    },
  ],
};
