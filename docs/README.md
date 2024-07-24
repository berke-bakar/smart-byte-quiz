# Smart Byte Quiz CLI Tool

Smart Byte Quiz is an `npm` CLI tool designed for developers to enjoy trivia quizzes conveniently, whether during compilation, CI/CD pipelines, or while running tests. It fetches trivia questions from '[The Trivia API](https://the-trivia-api.com/)', offering a customizable quiz experience tailored to your preferences.

## Features

* **Customizable Quizzes** : Configure settings such as difficulty levels, number of questions per quiz, and allowed categories.
* **Wide Range of Topics** : Enjoy quizzes from a variety of categories provided by 'The Trivia API'.
* **Persistent Configuration** : Settings are stored in a `smart-byte-quiz_config.json` file in your home directory, allowing easy customization.

## Usage

1. **Installation** :

```
npm install -g smart-byte-quiz
```

2. **Running the Tool** :

```
npx smart-byte-quiz
```

   This command initializes the tool and opens the settings menu where you can configure:

* **Difficulty Levels**: Choose from `easy`, `medium`, or `hard`. (Default: [])
* **Number of Questions**: Set the desired number of questions per quiz (1 to 50). (Default: 10)
* **Allowed Categories**: Select from available categories below. (Default: [])
  * `music`
  * `sport_and_leisure`
  * `film_and_tv`
  * `arts_and_literature`
  * `history`
  * `society_and_culture`
  * `science`
  * `geography`
  * `food_and_drink`
  * `general_knowledge`

**Note:** Empty array in the default value means every option is selected for that setting. (All 3 difficulty levels & 10 categories are allowed by default)

   Your configuration will be saved in `smart-byte-quiz_config.json` located in:

* **Windows** : `%APPDATA%`
* **Mac/Linux** : `~/.config`

  You can manually edit this file if needed.

## Roadmap

* [ ] Implement session management for multiplayer quizzes.
* [ ] Integrate features exclusively available to API subscribers.
* [ ] Enhance user interface for better interaction and feedback.

## Credits

This tool uses the trivia questions provided by [The Trivia API](https://the-trivia-api.com/). Their service   is appreciated for providing extensive trivia question sets.

---

Feel free to report issues, or suggest improvements on [GitHub](https://github.com/berke-bakar/smart-byte-quiz). Happy quizzing! 🎉
