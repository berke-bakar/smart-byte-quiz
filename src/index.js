import figlet from "figlet"
import expand from '@inquirer/expand';

export const GameStates = Object.freeze({
  TITLE: 0,
  MENU: 1,
  SETTINGS: 2,
  PLAY: 3,
  AGAIN: 4,
  CREDITS: 5,
  QUIT: 99,
})

const optionSymbols = ['a', 'b', 'c', 'd']

export function showTitlePage() {
  console.log(
    figlet.textSync("Wait Trivia", {
      font: "colossal",
      horizontalLayout: "default",
      verticalLayout: "default",
      width: 120,
    }),
    '\n',
    "Why not have fun while waiting"
  );
}

export async function showMenuPage() {
  const answer = await expand({
    message: "Ready to challenge yourself?",
    default: '1',
    choices: [
      {
        key: '1',
        name: 'Play Game',
        value: 'PLAY',
      },
      {
        key: '2',
        name: 'Settings',
        value: 'SETTINGS',
      },
      {
        key: '3',
        name: 'Credits',
        value: 'CREDITS',
      },
      {
        key: '4',
        name: 'Quit Game',
        value: 'QUIT',
      },
    ],
    expanded: true
  });

  return answer
}

export async function showSettingsPage() {

}

export async function showPlayPage(questions) {
  if (!Array.isArray(questions) || questions.length == 0) {
    throw new Error('Questions must be a non-empty array.')
  }

  const results = {
    corrects: 0,
    incorrects: 0
  }

  for (const [index, question] of questions.entries()) {
    const questionBanner = generateQuestionFiglet(index + 1)

    const choices = shuffle([question.correctAnswer, ...question.incorrectAnswers]).map((child, ind) => {
      return { key: optionSymbols[ind], name: child, value: child }
    })
    // Clear console output
    console.log('\x1Bc')
    console.log(questionBanner)
    const answer = await expand({
      message: question.question.text,
      default: question.correctAnswer,
      choices: choices,
      expanded: true
    });

    if (answer === question.correctAnswer) {
      results.corrects++
    }
    else {
      results.incorrects++
    }

  }

  return results
}

export async function showAgainPage() {
  console.log('\x1Bc')
  console.log(figlet.textSync('Wanna play again?', {
    horizontalLayout: 'full'
  }))

}

export async function showCreditsPage() {

}

export async function fetchQuestions(difficulty = [], limit = 10) {
  if (difficulty.length === 0) {
    difficulty = ['easy', 'medium', 'hard']
  }
  const params = new URLSearchParams({
    difficulties: difficulty,
    limit: limit,
  })

  try {
    let questions = await fetch(`https://the-trivia-api.com/v2/questions?${params.toString()}`, {
      method: 'get',
    })
    questions = await questions.json()
    return questions
  } catch (err) {
    console.error('An error happened while getting questions from The Trivia API.')
    // console.error(err)
    return []
  }
}

function generateQuestionFiglet(id) {
  return figlet.textSync(`Question ${id}`, {
    font: "Standard",
    horizontalLayout: "default",
    verticalLayout: "default",
    width: 120,
  })
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }

  return arr
}