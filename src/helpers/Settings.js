import { promises as fs } from 'fs';
import { join } from 'path';

class Settings {

  constructor(settings = {}) {
    this._settings = settings;

    return new Proxy(this, {
      get: (target, property) => {
        if (property in target) {
          return target[property];
        }

        if (property in target._settings) {
          return target._settings[property];
        }

        return undefined;
      },
    });
  }

  async read() {
    try {
      const filePath = join(process.cwd(), 'settings.json');
      const contents = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(contents);
      this._settings = data;
    } catch (error) {
      console.error('Error reading settings file:', error);
    }
  }

  setSetting(key, value) {
    this._settings[key] = value;
  }

  getAllSettings() {
    return this._settings;
  }
}

export default new Settings();
