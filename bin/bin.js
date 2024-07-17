#!/usr/bin/env node
import ConfigInstance from "../src/ConfigStorage.js"
import { GameStates, showAgainPage, showCreditsPage, showMenuPage, showPlayPage, showSettingsPage, showTitlePage, fetchQuestions } from "../src/index.js";


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
        const changes = await showSettingsPage(ConfigInstance.get('difficulty'), ConfigInstance.get('limit'))
        if (changes) {
          const updateResult = ConfigInstance.setBatch(changes)
          if (updateResult.result) {
            console.log('Settings updated.')
          }
          else {
            console.error('Settings update failed.')
          }
        }
        state = GameStates.MENU
        break
      case GameStates.PLAY:
        // Reset game score
        results.correct = 0
        results.wrong = 0
        const questions = await fetchQuestions(ConfigInstance.get('difficulty'), ConfigInstance.get('limit'))
        if (questions.length !== 0) {
          results = await showPlayPage(questions)
          state = GameStates.AGAIN
        } else {
          state = GameStates.MENU
        }
        break
      case GameStates.AGAIN:
        const userChoice = await showAgainPage(results)
        state = GameStates[userChoice]
        break
      case GameStates.CREDITS:
        await showCreditsPage()
        state = GameStates.MENU
        break
      default:
        // State is QUIT, but just in case
        break gameLoop
    }
  }

}

await main()
