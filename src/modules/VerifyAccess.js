import Settings from '../helpers/Settings.js';
import CreateBrowser from '../modules/CreateBrowser.js';
import CreatePage from '../modules/CreatePage.js';

export default async function VerifyAccess(options) {
  await Settings.read();
  
  const browser = await CreateBrowser();
  const page = await CreatePage(browser, options)

  await page.goto(Settings.urls.home, { waitUntil: 'networkidle2' });

  const courses = await page.$$eval('.course-listing', (listings) => {
    return listings.length;
  });

  await page.close();
  await browser.close();

  return courses;
}
