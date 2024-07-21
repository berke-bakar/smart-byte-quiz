import terminalLink from "terminal-link"

export const API_URL = 'https://the-trivia-api.com/v2/questions'
export const MAX_API_QUESTION_LIMIT = 50

export const GameStates = Object.freeze({
  TITLE: 'TITLE',
  MENU: 'MENU',
  SETTINGS: 'SETTINGS',
  PLAY: 'PLAY',
  RESULT: 'RESULT',
  CREDITS: 'CREDITS',
  QUIT: 'QUIT',
})

export const GameTexts = Object.freeze({
  APP_NAME: 'Smart Byte Quiz',
  APP_SUBTEXT: '  Fun While You Compile',
  MENU_TEXT: 'Ready to challenge yourself?',
  SETTINGS_DIFFICULTY: 'Select question difficulties:',
  SETTINGS_LIMIT: `Number of questions per game? (1-${MAX_API_QUESTION_LIMIT})`,
  PLAY_AGAIN: 'Play again?',
  CREDITS: `Questions come from ${terminalLink('The Trivia API', 'https://the-trivia-api.com/')},\nwhich I'm not affiliated with.`,
  CREDITS_THANKS: '\nThank you for playing...\n',
})

export const MENU_OPTIONS = Object.freeze([
  {
    key: '1',
    name: 'Play Game',
    value: GameStates.PLAY,
  },
  {
    key: '2',
    name: 'Settings',
    value: GameStates.SETTINGS,
  },
  {
    key: '3',
    name: 'Credits',
    value: GameStates.CREDITS,
  },
  {
    key: '4',
    name: 'Quit Game',
    value: GameStates.QUIT,
  },
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

export const RESULTS = Object.freeze([
  'Needs Practice',
  'Better Luck',
  'Almost There',
  'Congrats!',
  'Perfect!',
])