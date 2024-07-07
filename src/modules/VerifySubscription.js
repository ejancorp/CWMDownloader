import Settings from '../helpers/Settings.js';
import CreateBrowser from '../modules/CreateBrowser.js';
import CreatePage from '../modules/CreatePage.js';

export default async function VerifySubscription(options) {
  await Settings.read();

  const browser = await CreateBrowser();
  const page = await CreatePage(browser, options)

  await page.goto(Settings.urls.subscription, { waitUntil: 'networkidle2' });

  const name = await page.$eval('table.subscriptions-table tbody tr td:nth-child(1)', element => element.textContent.trim());
  const price = await page.$eval('table.subscriptions-table tbody tr td:nth-child(2)', element => element.textContent.trim());
  const remaining = await page.$eval('table.subscriptions-table tbody tr td:nth-child(4)', element => element.textContent.trim());
  const daysRemaining = parseInt(remaining.match(/\d+/)[0]);
  
  await page.close();
  await browser.close();

  return { name, price, daysRemaining };
}
