import puppeteer from 'puppeteer';
import Settings from '../helpers/Settings.js';

export default async function CreateBrowser() {
  await Settings.read();

  const browser = await puppeteer.launch({
    headless: Settings.pupeteer.headless,
    args: [
      `--user-agent=${Settings.pupeteer.user_agent}`
    ]
  });

  return browser;
}
