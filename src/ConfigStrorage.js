import fs from 'fs';
import path from 'path';
import os from 'os';

/**
 * ConfigStorage class handles default and user selected 
 * configurations by writing to a JSON file. It exports a singleton
 * instance called ConfigInstance and can be used as a client-store.
 */
class ConfigStorage {
  /**
   * constructor
   * 
   * @param {string} configFileName name of the configuration JSON file.
   * @param {object} defaultConfig fallback configuration to use if configFileName does not exists.
   * @returns ConfigStorage instance
   */
  constructor(configFileName, defaultConfig = {}) {
    // Check if an instance exists already
    if (!ConfigStorage.instance) {
      this.configFileName = configFileName;
      this.configFilePath = this.getDefaultConfigFilePath(configFileName);
      this.data = {};

      // Load existing config if config file exists
      if (fs.existsSync(this.configFilePath)) {
        try {
          const configFileContent = fs.readFileSync(this.configFilePath, 'utf8');
          this.data = JSON.parse(configFileContent);
        } catch (err) {
          console.error(`Error reading configurations at: ${this.configFilePath}:`, err);
        }
      } else {
        // Use defaultConfig param if config file does not exists
        this.data = defaultConfig;

        // Save default config to file
        this.#saveConfig();
      }

      // Initialize singleton instance
      ConfigStorage.instance = this;
    }

    return ConfigStorage.instance;
  }


  /**
   * Method to get default config file path based on user OS
   * 
   * @param {string} configFileName file name to append at the end of default os path
   * @returns a default path to save config file, based on user's OS.
   */
  getDefaultConfigFilePath(configFileName) {
    const platform = os.platform();
    let configDir;

    switch (platform) {
      case 'darwin':
      case 'linux':
        configDir = path.join(os.homedir(), '.config');
        break;
      case 'win32':
        configDir = process.env.APPDATA;
        break;
      default:
        configDir = path.join(os.homedir(), '.config');
    }

    // Create the directory if it doesn't exist
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    return path.join(configDir, configFileName);
  }

  /**
   * Get a specific config value
   * 
   * @param {string} key key of the value you want to read
   * @returns value of given key from in memory, not config file
   */
  get(key) {
    return this.data[key];
  }

  /**
   * Set or update a config value
   * 
   * @param {string} key key of the value you want to set
   * @param {any} value value you want to write
   * @returns update result. Check 'result' property for result. `reason` property for failure re
   */
  set(key, value) {
    // Save old value in case of file write fail
    const oldValue = this.data[key]

    // Update value in memory
    this.data[key] = value;

    // Update file contents
    const updateResult = this.#saveConfig()

    // Revert if fail, for keeping both sides consistent
    if (!updateResult.result) {
      // Revert to oldValue
      this.data[key] = oldValue;
    }

    // return same result as file update, let the user handle what to do
    return updateResult
  }

  /**
   * Save current config to file
   * 
   * @returns update results
   */
  #saveConfig() {
    try {
      // Try to write to file
      fs.writeFileSync(this.configFilePath, JSON.stringify(this.data, null, 2), 'utf8');

      // Return success
      return { result: true }
    } catch (err) {
      // Return failure
      return { result: false, reason: err }
    }
  }
}


const configFileName = 'wait-trivia_config.json';
const defaultConfig = {
  // TODO: Fill default config
};

// Singleton instance
const ConfigInstance = new ConfigStorage(configFileName, defaultConfig);

export default ConfigInstance;
