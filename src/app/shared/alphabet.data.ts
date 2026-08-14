export type AlphabetItem = { letter: string; word: string; emoji: string };

const entries = [
  ['A','Ant','\u{1F41C}'],['B','Bear','\u{1F43B}'],['C','Cat','\u{1F431}'],['D','Dog','\u{1F436}'],
  ['E','Elephant','\u{1F418}'],['F','Fish','\u{1F420}'],['G','Giraffe','\u{1F992}'],['H','Horse','\u{1F434}'],
  ['I','Ice cream','\u{1F366}'],['J','Jet','\u2708\uFE0F'],['K','Kangaroo','\u{1F998}'],['L','Lion','\u{1F981}'],
  ['M','Monkey','\u{1F435}'],['N','Nose','\u{1F443}'],['O','Octopus','\u{1F419}'],['P','Panda','\u{1F43C}'],
  ['Q','Queen','\u{1F451}'],['R','Rabbit','\u{1F430}'],['S','Star','\u2B50'],['T','Tiger','\u{1F42F}'],
  ['U','Umbrella','\u2602\uFE0F'],['V','Volcano','\u{1F30B}'],['W','Whale','\u{1F433}'],['X','Xylophone','\u{1F3BC}'],
  ['Y','Yarn','\u{1F9F6}'],['Z','Zebra','\u{1F993}']
];

export const ALPHABET: AlphabetItem[] = entries.map(([letter, word, emoji]) => ({ letter, word, emoji }));
