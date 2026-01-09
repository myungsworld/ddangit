// 타이핑 속도 게임 설정

export const GAME_CONFIG = {
  id: 'typing-speed',
  name: 'Typing',
  color: '#F59E0B',
};

// 타이핑할 문장들 (짧고 간단하게)
export const SENTENCES = [
  'the quick brown fox jumps over the lazy dog',
  'pack my box with five dozen liquor jugs',
  'how vexingly quick daft zebras jump',
  'the five boxing wizards jump quickly',
  'sphinx of black quartz judge my vow',
  'two driven jocks help fax my big quiz',
  'the jay pig fox dwarf quiz blew vext clam',
  'quick zephyrs blow vexing daft jim',
  'waltz bad nymph for quick jigs vex',
  'glib jocks quiz nymph to vex dwarf',
];

// 랜덤 문장 선택
export function getRandomSentence(): string {
  return SENTENCES[Math.floor(Math.random() * SENTENCES.length)];
}
