import Settings from '../helpers/Settings.js';
import CreateBrowser from '../modules/CreateBrowser.js';
import CreatePage from '../modules/CreatePage.js';

export default async function CourseContent(url, options) {

  await Settings.read();

  const browser = await CreateBrowser();
  const page = await CreatePage(browser, options);
  await page.setViewport({ width: 1500, height: 1000 });

  await page.goto(Settings.urls.courses, { timeout: 60000, waitUntil: 'domcontentloaded' });

  await new Promise(resolve => setTimeout(resolve, 5000));

  const boxSelector = `a[href="${url}"]`;

  await page.evaluate((boxSelector) => {
    document.querySelector(boxSelector).click();
  }, boxSelector);

  await new Promise(resolve => setTimeout(resolve, 5000));

  const sections = await page.$$eval('.columns .slim-section', (sections) => {
    console.log(sections);
    return sections.map((section, index) => {
      return {
        name: section.querySelector('.section-header .heading').textContent.trim(),
        value: index
      }
    });
  });

  await page.close();
  await browser.close();

  return sections;
}
