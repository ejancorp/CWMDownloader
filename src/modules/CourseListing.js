import Settings from '../helpers/Settings.js';
import CreateBrowser from '../modules/CreateBrowser.js';
import CreatePage from '../modules/CreatePage.js';

export default async function CourseListing(options) {

  await Settings.read();

  const browser = await CreateBrowser();
  const page = await CreatePage(browser, options)

  await page.goto(Settings.urls.courses, { waitUntil: 'networkidle2' });

  const courses = await page.$$eval('.course-listing', (listings) => {
    return listings.map(listing => {
      return {
        name: listing.querySelector('.course-listing-title').textContent.trim(),
        value: listing.querySelector('a').getAttribute('href'),
      }
    });
  });

  await page.close();
  await browser.close();

  return courses;
}
