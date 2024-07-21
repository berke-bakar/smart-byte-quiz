export const API_URL = 'https://the-trivia-api.com/v2/questions'
export const MAX_API_QUESTION_LIMIT = 50

export const GameStates = Object.freeze({
  TITLE: 'TITLE',
  MENU: 'MENU',
  SETTINGS: 'SETTINGS',
  PLAY: 'PLAY',
  RESULT: 'RESULT',
  CREDITS: 'CREDITS',
  HOWTO: 'HOWTO',
  QUIT: 'QUIT',
})

export const GameTexts = Object.freeze({
  APP_NAME: 'Wait Trivia',
  APP_SUBTEXT: 'Why not have fun while waiting',
  MENU_TEXT: 'Ready to challenge yourself?',
  SETTINGS_DIFFICULTY: 'Select question difficulties:',
  SETTINGS_LIMIT: `Number of questions per game? (1-${MAX_API_QUESTION_LIMIT})`,
  PLAY_AGAIN: 'Play again?',
})

export const MENU_OPTIONS = Object.freeze([
  {
    key: '1',
    name: 'Play Game',
    value: GameStates.PLAY,
  },
  {
    key: '2',
    name: 'How to Play?',
    value: GameStates.HOWTO
  },
  {
    key: '3',
    name: 'Settings',
    value: GameStates.SETTINGS,
  },
  {
    key: '4',
    name: 'Credits',
    value: GameStates.CREDITS,
  },
  {
    key: '5',
    name: 'Quit Game',
    value: GameStates.QUIT,
  },
])

export const OPTION_SYMBOLS = Object.freeze([
  'a',
  'b',
  'c',
  'd'
])

export const GRADIENTS = Object.freeze([
  'teen',
  'mind',
  'morning',
  'vice',
  'passion',
  'fruit',
  'instagram',
  'atlas',
  'retro',
  'summer',
  'pastel',
  'rainbow',
])