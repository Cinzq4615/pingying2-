
export interface WordItem {
  word: string;
  pinyin: string;
}

export interface ProcessingResult {
  title: string;
  words: WordItem[];
}
