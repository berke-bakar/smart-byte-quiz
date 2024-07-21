import figlet from "figlet";
import expand from '@inquirer/expand';
import checkbox from '@inquirer/checkbox';
import input from '@inquirer/input'
import confirm from '@inquirer/confirm'
import chalk from 'chalk'
import gradient from "gradient-string";
import { GameStates, GameTexts, GRADIENTS, MAX_API_QUESTION_LIMIT, MENU_OPTIONS, OPTION_SYMBOLS } from "./Constants.js";

export function showTitlePage() {
  console.log(generateGradientOptionFiglet(GameTexts.APP_NAME))
  console.log(GameTexts.APP_SUBTEXT)
}

export async function showMenuPage() {
  const answer = await expand({
    message: GameTexts.MENU_TEXT,
    default: '1',
    choices: MENU_OPTIONS,
    expanded: true
  });

  return answer
}

export async function showSettingsPage(currentDifficulties = [], currentLimit) {
  // Print title
  console.log(generateGradientOptionFiglet('Settings'))

  // Fill the difficulties array if it is empty
  // Empty means all difficulties are allowed
  if (currentDifficulties.length === 0) {
    currentDifficulties.push('easy', 'medium', 'hard')
  }

  // Save user selections in an object
  let changes = {
    difficulty: await checkbox({
      message: GameTexts.SETTINGS_DIFFICULTY,
      choices: [
        { name: 'easy', value: 'easy', checked: currentDifficulties.includes('easy') },
        { name: 'medium', value: 'medium', checked: currentDifficulties.includes('medium') },
        { name: 'hard', value: 'hard', checked: currentDifficulties.includes('hard') },
      ],
      required: false,
      loop: true
    }),
    limit: await input({
      message: GameTexts.SETTINGS_LIMIT,
      required: false,
      default: currentLimit, // Default value is the currently saved value
      validate: (item) => {
        try {
          // Try to parse the input as a number
          const numberForm = Number.parseInt(item)

          // Check if it is a valid number
          return (
            numberForm == item &&
            Number.isSafeInteger(numberForm) &&
            numberForm > 0 &&
            numberForm <= MAX_API_QUESTION_LIMIT
          )
        }
        catch (e) {
          return false
        }
      },
    }),
  }
  return changes
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
    const questionBanner = generateGradientOptionFiglet(`Question ${index + 1}`)

    const choices = shuffle([question.correctAnswer, ...question.incorrectAnswers]).map((child, ind) => {
      return { key: OPTION_SYMBOLS[ind], name: child, value: child }
    })
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

export async function showResultsPage(results) {
  // Print title
  console.log(generateGradientOptionFiglet('Congrats!'))

  // Print results to console
  console.log(`${chalk.blueBright("Results")}`)
  console.log(`${chalk.blueBright("===============")}`)
  console.log(`${chalk.green("Correct:")} ${results.corrects}`)
  console.log(`${chalk.red("Incorrect:")} ${results.incorrects}`)
  console.log(`${chalk.blueBright("===============")}`)
  console.log(`You got ${(results.corrects / (results.incorrects + results.corrects) * 100).toFixed(2)}% of questions right.`)
  const answer = await confirm({ message: GameTexts.PLAY_AGAIN });

  return answer ? GameStates.PLAY : GameStates.TITLE
}

export async function showCreditsPage() {
  // Print title
  console.log(generateGradientOptionFiglet('Credits'))

  // Wait for input
  await input({
    message: '',
    theme: {
      prefix: '',
    }
  })
}

export async function showHowToPage() {

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
    return []
  }
}

function generateGradientOptionFiglet(text) {
  const randomGradient = GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)]
  const figletText = figlet.textSync(text, {
    font: "Standard",
    horizontalLayout: "default",
    verticalLayout: "default",
    width: 120,
  })
  return `\x1Bc\n${gradient[randomGradient].multiline(figletText)}`
}

// Fisher-Yates shuffle
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }

  return arr
}