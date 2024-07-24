#!/usr/bin/env node
import ConfigInstance from "../src/ConfigStorage.js"
import { GameStates } from "../src/Constants.js";
import { showResultsPage, showCreditsPage, showMenuPage, showPlayPage, showSettingsPage, showTitlePage, fetchQuestions } from "../src/index.js";

async function main() {
  let state = GameStates.TITLE;
  let results = {
    correct: 0,
    wrong: 0
  }

  gameLoop: while (state !== GameStates.QUIT) {
    switch (state) {
      case GameStates.TITLE:
        showTitlePage()
        state = GameStates.MENU
        break
      case GameStates.MENU:
        const selection = await showMenuPage()
        state = GameStates[selection]
        break
      case GameStates.SETTINGS:
        const currentDifficulties = ConfigInstance.get('difficulties')
        const currentLimit = ConfigInstance.get('limit')
        const currentCategories = ConfigInstance.get('categories')

        const changes = await showSettingsPage(currentDifficulties, currentLimit, currentCategories)
        if (changes) {
          const updateResult = ConfigInstance.setBatch(changes)
          if (updateResult.result) {
            console.log('Settings updated.')
          }
          else {
            console.error('Settings update failed.')
          }
        }
        state = GameStates.TITLE
        break
      case GameStates.PLAY:
        // Reset game score
        results.correct = 0
        results.wrong = 0

        const difficulties = ConfigInstance.get('difficulties')
        const limit = ConfigInstance.get('limit')
        const categories = ConfigInstance.get('categories')

        const questions = await fetchQuestions(difficulties, limit, categories)
        if (questions.length !== 0) {
          results = await showPlayPage(questions)
          state = GameStates.RESULT
        } else {
          state = GameStates.TITLE
        }
        break
      case GameStates.RESULT:
        const userChoice = await showResultsPage(results)
        state = GameStates[userChoice]
        break
      case GameStates.CREDITS:
        await showCreditsPage()
        state = GameStates.TITLE
        break
      default:
        // State is QUIT, but just in case
        break gameLoop
    }
  }

}

await main()
