import Settings from '../helpers/Settings.js';
import CreateBrowser from '../modules/CreateBrowser.js';
import CreatePage from '../modules/CreatePage.js';

export default async function VerifyUser(options) {
  await Settings.read();
  
  const browser = await CreateBrowser();
  const page = await CreatePage(browser, options)

  await page.goto(Settings.urls.profile, { waitUntil: 'networkidle2' });

  const name = await page.$eval('#edit-user-name', element => element.textContent.trim());
  const email = await page.$eval('#edit-user-email', element => element.textContent.trim());

  await page.close();
  await browser.close();

  return { name, email };
}
