import fs from 'fs';
import ora from "ora";
import chalk from "chalk";
import VerifyAccess from './modules/VerifyAccess.js';
import VerifyUser from './modules/VerifyUser.js';
import VerifySubscription from './modules/VerifySubscription.js';
import CurlHelper from './helpers/CurlHelper.js';
import Settings from './helpers/Settings.js';

export default async function auth(options) {

  await Settings.read();

  const file = fs.readFileSync(options.file, 'utf8');
  const { method, headers, body } = CurlHelper.parse(file);

  const homePageSpinner = ora(chalk.yellow(`Connecting to ${Settings.urls.home}...`)).start();
  const courses = await VerifyAccess({ method, headers, body });
  if (courses === 0) {
    homePageSpinner.fail(chalk.green(`Unable to connect to ${Settings.urls.home}`));
    process.exit(0);
  } else {
    homePageSpinner.succeed(chalk.green(`Connected to ${Settings.urls.home}`));
  }

  const profileSpinner = ora(chalk.yellow(`Verifying user profile...`)).start();
  const { name, email } = await VerifyUser({ method, headers, body });
  profileSpinner.succeed(chalk.green(`Verified user profile`));
  console.log(chalk.blue(`Name: ${name}`));
  console.log(chalk.blue(`Email: ${email}`));

  const subscriptionSpinner = ora(chalk.yellow(`Verifying user subscription...`)).start();
  const { name: planName, price, daysRemaining } = await VerifySubscription({ method, headers, body });
  if (daysRemaining === 0) {
    subscriptionSpinner.fail(chalk.green(`Subcsription is expired, please renew your subscription to be able to download a course.`));
    process.exit(0);
  }
  console.log(chalk.blue(`Plan Name: ${planName}`));
  console.log(chalk.blue(`Price: ${price}`));
  console.log(chalk.blue(`Remaining Days: ${daysRemaining}`));

  subscriptionSpinner.succeed(chalk.green(`You are set to download courses, please run the download command.`));
}
