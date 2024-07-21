import figlet from "figlet";
import expand from '@inquirer/expand';
import checkbox from '@inquirer/checkbox';
import input from '@inquirer/input'
import confirm from '@inquirer/confirm'
import chalk from 'chalk'
import gradient from "gradient-string";
import { GameStates, GameTexts, API_URL, GRADIENTS, MAX_API_QUESTION_LIMIT, MENU_OPTIONS, RESULTS } from "./Constants.js";

export function showTitlePage() {
  // Print title and subtext
  console.log(generateGradientOptionFiglet(GameTexts.APP_NAME))
  console.log(GameTexts.APP_SUBTEXT, '\n')
}

export async function showMenuPage() {
  // Print menu options and wait for input
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

          // Check if it is a valid number or not
          return (
            numberForm == item &&                // See if parsed input is same as entered text
            Number.isSafeInteger(numberForm) &&  // Check if entered value is an integer
            numberForm > 0 &&                    // Lower range validation
            numberForm <= MAX_API_QUESTION_LIMIT // Upper range validation
          )
        }
        catch (e) {
          // Can't parse input properly
          return false
        }
      },
    }),
  }

  return changes
}

export async function showPlayPage(questions) {
  // Input validation
  if (!Array.isArray(questions) || questions.length == 0) {
    throw new Error('Questions must be a non-empty array.')
  }

  // Initialize results
  const results = {
    corrects: 0,
    incorrects: 0
  }

  // Ask questions, record results
  for (const [index, question] of questions.entries()) {
    // Generate question banner
    const questionBanner = generateGradientOptionFiglet(`Question ${index + 1}`)

    // Shuffle the questions
    const choices = shuffle([question.correctAnswer, ...question.incorrectAnswers]).map((child, ind) => {
      return { key: String(ind + 1), name: child, value: child }
    })

    // Ask the question to user
    console.log(questionBanner)
    const answer = await expand({
      message: question.question.text,
      choices: choices,
      expanded: true,
    });

    // Update results depending on user input
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
  // Calculate final result and index of text to show
  const finalResult = (results.corrects / (results.incorrects + results.corrects)) * 100
  let textIndex = finalResult !== 0 ? Math.ceil(finalResult / (100 / RESULTS.length) - 1) : 0

  // Print result title
  console.log(generateGradientOptionFiglet(RESULTS[textIndex]))

  // Print results to console with style
  console.log(`${chalk.blueBright("Results")}`)
  console.log(`${chalk.blueBright("===============")}`)
  console.log(`${chalk.green("Correct:")} ${results.corrects}`)
  console.log(`${chalk.red("Incorrect:")} ${results.incorrects}`)
  console.log(`${chalk.blueBright("===============")}`)
  console.log(`You got ${finalResult.toFixed(2)}% of questions right.`)

  // Ask for a rematch
  const answer = await confirm({ message: GameTexts.PLAY_AGAIN });

  // Return to menu or title
  return answer ? GameStates.PLAY : GameStates.TITLE
}

export async function showCreditsPage() {
  // Print title, API attribution and thanks
  console.log(generateGradientOptionFiglet('Credits'))
  console.log(GameTexts.CREDITS)
  console.log(GameTexts.CREDITS_THANKS)

  // Wait for input
  await input({
    message: '',
    theme: {
      prefix: '',
    }
  })
}

export async function fetchQuestions(difficulty = [], limit = 10) {
  // Empty difficulty array means all difficulties are allowed
  if (difficulty.length === 0) {
    difficulty = ['easy', 'medium', 'hard']
  }

  // Build search params out of config
  const params = new URLSearchParams({
    difficulties: difficulty,
    limit: limit,
  })

  try {
    // Fetch questions
    let questions = await fetch(`${API_URL}?${params.toString()}`,
      {
        method: 'get',
      }
    )

    // Convert results to JSON
    questions = await questions.json()

    return questions

  } catch (err) {
    // Print error message to user
    console.error('An error happened while getting questions from The Trivia API.')

    return []
  }
}

function generateGradientOptionFiglet(text) {
  // Pick a random gradient
  const randomGradient = GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)]

  // Generate figlet from given text
  const figletText = figlet.textSync(text, {
    font: "Standard",
    horizontalLayout: "default",
    verticalLayout: "default",
    width: 120,
  })

  // Clear console and question banner
  return `
    \x1Bc
    \n${gradient[randomGradient].multiline(figletText)}
  `
}

// Fisher-Yates shuffle algorithm
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    // Select a random index
    let j = Math.floor(Math.random() * (i + 1));

    // Swap current index with selected index
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }

  return arr
}